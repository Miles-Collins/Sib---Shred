"use client";

import { useState } from "react";

type TinyShareButtonProps = {
  title: string;
};

export function TinyShareButton({ title }: TinyShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Fall back to clipboard if native share is canceled or unsupported.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-light) bg-white text-sm font-bold text-(--ink) shadow-md shadow-black/5 hover:bg-[#EAF6FB]"
      aria-label="Copy or share meal link"
      title={copied ? "Copied" : "Copy or share"}
    >
      {copied ? "OK" : "↗"}
    </button>
  );
}
