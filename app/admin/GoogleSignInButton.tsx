"use client";

import { signIn } from "next-auth/react";

type GoogleSignInButtonProps = {
  callbackUrl: string;
  className?: string;
};

export function GoogleSignInButton({ callbackUrl, className }: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        void signIn("google", { callbackUrl });
      }}
    >
      Sign in with Google
    </button>
  );
}
