import "server-only";

import { createClient, type RedisClientType } from "redis";

type LoginThrottleState = {
  blocked: boolean;
  retryAfterSeconds: number;
};

type FailedAttemptResult = {
  attemptCount: number;
  blocked: boolean;
  retryAfterSeconds: number;
  delayMs: number;
};

type MemoryRateLimitState = {
  count: number;
  windowStartMs: number;
  blockedUntilMs: number;
};

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 6;
const BLOCK_DURATION_MS = 15 * 60 * 1000;
const BASE_DELAY_MS = 300;
const MAX_DELAY_MS = 10_000;

const memoryRateLimitByIp = new Map<string, MemoryRateLimitState>();
const memoryRevokedSessionJti = new Map<string, number>();

let redisClientPromise: Promise<RedisClientType> | null = null;

function getRedisUrl() {
  return process.env.REDIS_URL?.trim() ?? "";
}

function canUseRedis() {
  return Boolean(getRedisUrl());
}

async function getRedisClient() {
  if (!canUseRedis()) {
    return null;
  }

  if (!redisClientPromise) {
    const client = createClient({ url: getRedisUrl() });
    redisClientPromise = client.connect().then(() => client);
  }

  try {
    return await redisClientPromise;
  } catch (error) {
    redisClientPromise = null;
    console.warn("[admin-auth] redis unavailable; using in-memory fallback", error);
    return null;
  }
}

function getDelayMsForAttemptCount(attemptCount: number) {
  const overLimit = Math.max(0, attemptCount - 1);
  const delay = BASE_DELAY_MS * 2 ** overLimit;
  return Math.min(MAX_DELAY_MS, delay);
}

function rateLimitBlockKey(ip: string) {
  return `admin:auth:block:${ip}`;
}

function rateLimitFailKey(ip: string) {
  return `admin:auth:fail:${ip}`;
}

function revokedSessionKey(jti: string) {
  return `admin:session:revoked:${jti}`;
}

function getMemoryRateLimitState(ip: string, nowMs: number) {
  const existing = memoryRateLimitByIp.get(ip);

  if (!existing || nowMs - existing.windowStartMs > LOGIN_WINDOW_MS) {
    const reset: MemoryRateLimitState = {
      count: 0,
      windowStartMs: nowMs,
      blockedUntilMs: 0,
    };
    memoryRateLimitByIp.set(ip, reset);
    return reset;
  }

  return existing;
}

function pruneMemoryStores(nowMs: number) {
  for (const [ip, state] of memoryRateLimitByIp.entries()) {
    const windowExpired = nowMs - state.windowStartMs > LOGIN_WINDOW_MS * 2;
    const notBlocked = state.blockedUntilMs <= nowMs;

    if (windowExpired && notBlocked) {
      memoryRateLimitByIp.delete(ip);
    }
  }

  for (const [jti, expiresAtMs] of memoryRevokedSessionJti.entries()) {
    if (expiresAtMs <= nowMs) {
      memoryRevokedSessionJti.delete(jti);
    }
  }
}

export function isDistributedAdminSecurityConfigured() {
  return canUseRedis();
}

export async function getAdminLoginThrottleState(ip: string): Promise<LoginThrottleState> {
  const nowMs = Date.now();
  const client = await getRedisClient();

  if (client) {
    const blockedUntilRaw = await client.get(rateLimitBlockKey(ip));
    const blockedUntilMs = Number.parseInt(blockedUntilRaw ?? "", 10);

    if (Number.isFinite(blockedUntilMs) && blockedUntilMs > nowMs) {
      return {
        blocked: true,
        retryAfterSeconds: Math.ceil((blockedUntilMs - nowMs) / 1000),
      };
    }

    return {
      blocked: false,
      retryAfterSeconds: 0,
    };
  }

  pruneMemoryStores(nowMs);
  const state = getMemoryRateLimitState(ip, nowMs);
  if (state.blockedUntilMs > nowMs) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((state.blockedUntilMs - nowMs) / 1000),
    };
  }

  return {
    blocked: false,
    retryAfterSeconds: 0,
  };
}

export async function recordFailedAdminLoginAttempt(ip: string): Promise<FailedAttemptResult> {
  const nowMs = Date.now();
  const client = await getRedisClient();

  if (client) {
    const blockKey = rateLimitBlockKey(ip);
    const failKey = rateLimitFailKey(ip);

    const blockedUntilRaw = await client.get(blockKey);
    const blockedUntilMs = Number.parseInt(blockedUntilRaw ?? "", 10);

    if (Number.isFinite(blockedUntilMs) && blockedUntilMs > nowMs) {
      return {
        attemptCount: MAX_FAILED_ATTEMPTS,
        blocked: true,
        retryAfterSeconds: Math.ceil((blockedUntilMs - nowMs) / 1000),
        delayMs: 0,
      };
    }

    const attemptCount = await client.incr(failKey);
    if (attemptCount === 1) {
      await client.expire(failKey, Math.ceil((LOGIN_WINDOW_MS * 2) / 1000));
    }

    if (attemptCount >= MAX_FAILED_ATTEMPTS) {
      const blockedUntil = nowMs + BLOCK_DURATION_MS;
      await client.set(blockKey, String(blockedUntil), {
        EX: Math.ceil(BLOCK_DURATION_MS / 1000),
      });

      return {
        attemptCount,
        blocked: true,
        retryAfterSeconds: Math.ceil(BLOCK_DURATION_MS / 1000),
        delayMs: 0,
      };
    }

    return {
      attemptCount,
      blocked: false,
      retryAfterSeconds: 0,
      delayMs: getDelayMsForAttemptCount(attemptCount),
    };
  }

  pruneMemoryStores(nowMs);
  const state = getMemoryRateLimitState(ip, nowMs);

  if (state.blockedUntilMs > nowMs) {
    return {
      attemptCount: MAX_FAILED_ATTEMPTS,
      blocked: true,
      retryAfterSeconds: Math.ceil((state.blockedUntilMs - nowMs) / 1000),
      delayMs: 0,
    };
  }

  state.count += 1;
  if (state.count >= MAX_FAILED_ATTEMPTS) {
    state.blockedUntilMs = nowMs + BLOCK_DURATION_MS;

    return {
      attemptCount: state.count,
      blocked: true,
      retryAfterSeconds: Math.ceil(BLOCK_DURATION_MS / 1000),
      delayMs: 0,
    };
  }

  return {
    attemptCount: state.count,
    blocked: false,
    retryAfterSeconds: 0,
    delayMs: getDelayMsForAttemptCount(state.count),
  };
}

export async function clearFailedAdminLoginAttempts(ip: string) {
  const client = await getRedisClient();

  if (client) {
    await client.del(rateLimitFailKey(ip), rateLimitBlockKey(ip));
    return;
  }

  memoryRateLimitByIp.delete(ip);
}

export async function revokeAdminSessionJti(jti: string, expiresAtUnixSeconds: number) {
  const nowMs = Date.now();
  const ttlSeconds = Math.max(1, Math.ceil(expiresAtUnixSeconds - nowMs / 1000));
  const client = await getRedisClient();

  if (client) {
    await client.set(revokedSessionKey(jti), "1", { EX: ttlSeconds });
    return;
  }

  memoryRevokedSessionJti.set(jti, nowMs + ttlSeconds * 1000);
}

export async function isAdminSessionJtiRevoked(jti: string) {
  const nowMs = Date.now();
  const client = await getRedisClient();

  if (client) {
    const value = await client.get(revokedSessionKey(jti));
    return value === "1";
  }

  pruneMemoryStores(nowMs);
  const expiresAtMs = memoryRevokedSessionJti.get(jti);
  return typeof expiresAtMs === "number" && expiresAtMs > nowMs;
}
