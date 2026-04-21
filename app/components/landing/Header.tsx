"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type SiteLink = {
  label: string;
  href: string;
};

type SiteSettingsResponse = {
  settings?: {
    topRibbonText?: string;
    brandName?: string;
    brandSubtitle?: string;
    primaryNavLinks?: SiteLink[];
    headerCtaPrimary?: string;
    headerCtaSecondary?: string;
    supportPhone?: string;
    supportEmail?: string;
  } | null;
};

const FALLBACK_NAV_LINKS: SiteLink[] = [
  { href: "/menu", label: "Menu" },
  { href: "/plans", label: "Plans" },
  { href: "/journal", label: "Journal" },
  { href: "/#how", label: "How It Works" },
  { href: "/#reviews", label: "Testimonials" },
  { href: "/about", label: "About" },
  { href: "/#blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsResponse["settings"]>(null);
  const [cartCount, setCartCount] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    try {
      const raw = localStorage.getItem("sib-method-cart");
      if (!raw) {
        return 0;
      }

      const parsed = JSON.parse(raw) as Array<{ qty?: number }>;
      return Array.isArray(parsed)
        ? parsed.reduce((acc, item) => acc + (item.qty ?? 0), 0)
        : 0;
    } catch {
      return 0;
    }
  });

  const readCartCount = () => {
    try {
      const raw = localStorage.getItem("sib-method-cart");
      if (!raw) {
        setCartCount(0);
        return;
      }

      const parsed = JSON.parse(raw) as Array<{ qty?: number }>;
      const total = Array.isArray(parsed)
        ? parsed.reduce((acc, item) => acc + (item.qty ?? 0), 0)
        : 0;

      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSiteSettings = async () => {
      try {
        const response = await fetch("/api/site-settings", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as SiteSettingsResponse;
        if (isMounted) {
          setSiteSettings(payload.settings || null);
        }
      } catch {
        if (isMounted) {
          setSiteSettings(null);
        }
      }
    };

    loadSiteSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === "sib-method-cart") {
        readCartCount();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", readCartCount);
    window.addEventListener("sib-method-cart-updated", readCartCount);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", readCartCount);
      window.removeEventListener("sib-method-cart-updated", readCartCount);
    };
  }, []);

  const navLinks = useMemo(() => {
    const source = siteSettings?.primaryNavLinks;
    if (!Array.isArray(source) || source.length === 0) {
      return FALLBACK_NAV_LINKS;
    }

    const filtered = source.filter((item) => item?.label && item?.href);
    return filtered.length > 0 ? filtered : FALLBACK_NAV_LINKS;
  }, [siteSettings?.primaryNavLinks]);

  const tabletSectionTabs = useMemo(
    () => navLinks.slice(0, 4),
    [navLinks],
  );

  const topRibbonText =
    siteSettings?.topRibbonText || "Fresh weekly drop by Alysha + free local delivery";
  const brandName = siteSettings?.brandName || "SIB METHOD";
  const brandSubtitle = siteSettings?.brandSubtitle || "Meal Prep";
  const headerCtaPrimary = siteSettings?.headerCtaPrimary || "Explore Meals";
  const headerCtaSecondary = siteSettings?.headerCtaSecondary || "Start Order";
  const supportPhone = siteSettings?.supportPhone || "(866) 442-3287";
  const supportEmail = siteSettings?.supportEmail || "info@sibmethod.com";
  const supportPhoneHref = `tel:${supportPhone.replace(/[^+\d]/g, "")}`;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        menuButtonRef.current?.contains(target)
      ) {
        return;
      }
      setIsMenuOpen(false);
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    desktopQuery.addEventListener("change", onDesktopChange);

    return () => {
      desktopQuery.removeEventListener("change", onDesktopChange);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevTouchAction = body.style.touchAction;

    if (isMenuOpen) {
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.touchAction = prevTouchAction;
    };
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    // Don't highlight hash links (they're sections, not pages)
    if (href.startsWith("/#")) {
      return false;
    }

    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="tablet-landscape-header sticky top-0 z-50 border-b border-(--border-light) bg-white/90 backdrop-blur-md">
      <div className="tropical-ribbon px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white sm:px-8 sm:text-xs">
        {topRibbonText}
      </div>

      <nav className="tablet-main-nav mx-auto w-full max-w-7xl px-4 py-4 sm:px-8">
        <div className="flex w-full items-center justify-between xl:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Toggle navigation menu"
            aria-controls="primary-tablet-nav"
            data-expanded={isMenuOpen ? "true" : "false"}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="relative z-50 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-(--ink) transition-colors hover:bg-[#EAF6FB]"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform duration-200 motion-reduce:transition-none ${
                  isMenuOpen ? "translate-y-1.75 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.75 h-0.5 w-5 bg-current transition-opacity duration-200 motion-reduce:transition-none ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-3.5 h-0.5 w-5 bg-current transition-transform duration-200 motion-reduce:transition-none ${
                  isMenuOpen ? "-translate-y-1.75 -rotate-45" : ""
                }`}
              />
            </span>
          </button>

          <Link href="/" className="-ml-2 flex flex-col items-center text-center">
            <p className="tablet-brand-title brand-section-title text-[1.7rem] leading-none tracking-[0.035em]">
              {brandName}
            </p>
            <p className="brand-kicker text-[10px] text-(--muted)">{brandSubtitle}</p>
          </Link>

          <Link
            href="/checkout"
            aria-label="Open cart"
            className="relative z-50 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-(--ink) transition-colors hover:bg-black/5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
              <path d="M2 3h3l2.3 11.1a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H6" />
            </svg>
            {cartCount > 0 ? (
              <span className="absolute right-2 top-2.5 h-2.5 w-2.5 rounded-full bg-[#c41717]" />
            ) : null}
          </Link>
        </div>

        <div className="hidden w-full items-center justify-between gap-4 xl:flex xl:gap-6">
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <div className="hidden h-px w-7 bg-(--border-light) sm:block" />
            <div>
              <p className="tablet-brand-title brand-section-title text-[1.55rem] leading-none tracking-[0.04em]">
                {brandName}
              </p>
              <p className="brand-kicker text-[10px] text-(--muted)">{brandSubtitle}</p>
            </div>
            <div className="h-px w-4 bg-(--border-light) transition-colors group-hover:bg-(--ink)" />
          </Link>

          {/* Center Navigation Links */}
          <div className="min-w-0 flex-1 items-center justify-center gap-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--muted) xl:flex xl:gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex shrink-0 items-center whitespace-nowrap transition-colors ${
                  isActive(item.href)
                    ? "text-(--ink) font-bold"
                    : "hover:text-(--ink)"
                }`}
              >
                <span className="whitespace-nowrap">{item.label}</span>
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-(--ink)" />
                )}
              </Link>
            ))}
          </div>

          {/* Right CTA Buttons */}
          <div className="ml-2 flex shrink-0 items-center gap-2.5 sm:ml-4 xl:gap-3">
            <Link
              href="/menu"
              className="brand-control tropical-sheen rounded-full border border-(--border-light) bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] shadow-md shadow-black/5 transition hover:bg-[#EAF6FB]"
            >
              {headerCtaPrimary}
            </Link>
            <Link
              href="/checkout"
              className="brand-control tropical-sheen inline-flex items-center justify-center gap-2 rounded-full bg-[#5FA8C7] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:brightness-95"
            >
              {headerCtaSecondary}
              {cartCount > 0 ? (
                <span className="inline-flex min-w-[1.4rem] items-center justify-center rounded-full bg-(--ink) px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto hidden w-full max-w-7xl px-4 pb-2 sm:px-8 md:block xl:hidden">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {tabletSectionTabs.map((item) => (
            <Link
              key={`tablet-tab-${item.href}`}
              href={item.href}
              className={`brand-control inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition ${
                isActive(item.href)
                  ? "border-(--sun) bg-(--sun) text-white"
                  : "border-(--border-light) bg-white text-(--muted) hover:bg-[#EAF6FB] hover:text-(--ink)"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] transition-opacity duration-200 motion-reduce:transition-none xl:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="primary-tablet-nav"
        ref={menuRef}
        className="relative z-50 mx-auto w-full max-w-7xl px-4 pb-3 sm:px-8 xl:hidden"
      >
        <div
          className={`grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isMenuOpen
              ? "grid-rows-[1fr] opacity-100 translate-y-0"
              : "pointer-events-none grid-rows-[0fr] opacity-0 -translate-y-2"
          }`}
        >
          <div className="min-h-0">
            <div className="brand-shell overflow-hidden rounded-2xl bg-white/95 p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                {navLinks.map((item) => (
                  <Link
                    key={`tablet-${item.href}`}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`brand-control inline-flex min-h-11 items-center rounded-md border border-(--line) px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.06em] transition sm:min-h-12 ${
                      isActive(item.href)
                        ? "bg-(--sun) text-white border-(--sun)"
                        : "bg-white text-(--muted) hover:text-(--ink)"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
                <a
                  href={supportPhoneHref}
                  className="brand-control inline-flex min-h-11 items-center justify-center rounded-md border border-(--line) bg-white px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.06em] text-(--muted) sm:min-h-12"
                >
                  {supportPhone}
                </a>
                <a
                  href={`mailto:${supportEmail}`}
                  className="brand-control inline-flex min-h-11 items-center justify-center rounded-md border border-(--line) bg-white px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.06em] text-(--muted) sm:min-h-12"
                >
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 hidden border-t border-(--line) bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.09)] md:block xl:hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-3 gap-2">
          <Link
            href="/menu"
            className={`brand-control inline-flex min-h-12 items-center justify-center rounded-md border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] ${
              isActive("/menu")
                ? "border-(--sun) bg-(--sun) text-white"
                : "border-(--line) bg-white text-(--muted)"
            }`}
          >
            Menu
          </Link>
          <Link
            href="/plans"
            className={`brand-control inline-flex min-h-12 items-center justify-center rounded-md border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] ${
              isActive("/plans")
                ? "border-(--sun) bg-(--sun) text-white"
                : "border-(--line) bg-white text-(--muted)"
            }`}
          >
            Plans
          </Link>
          <Link
            href="/checkout"
            className="brand-control tropical-sheen inline-flex min-h-12 items-center justify-center rounded-xl bg-[#5FA8C7] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white"
          >
            {headerCtaSecondary}
          </Link>
        </div>
      </div>
    </header>
  );
}
