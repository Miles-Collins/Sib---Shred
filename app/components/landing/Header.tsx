"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Header() {
  const pathname = usePathname();
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

  const navLinks = useMemo(
    () => [
      { href: "/menu", label: "Menu" },
      { href: "/plans", label: "Plans" },
      { href: "/journal", label: "Journal" },
      { href: "/#how", label: "How It Works" },
      { href: "/#reviews", label: "Testimonials" },
      { href: "/about", label: "About" },
      { href: "/#blog", label: "Blog" },
    ],
    [],
  );

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
    <header className="sticky top-0 z-50 border-b border-(--line) bg-white/90 backdrop-blur-md">
      <div className="tropical-ribbon px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white sm:px-8 sm:text-xs">
        Fresh weekly drop by Alysha + free local delivery
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-(--muted) sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
          <a
            href="tel:+18664423287"
            className="brand-control rounded-full border border-(--line) bg-white px-3 py-1.5 hover:text-(--ink)"
          >
            (866) 442-3287
          </a>
          <a
            href="mailto:info@sibmethod.com"
            className="brand-control rounded-full border border-(--line) bg-white px-3 py-1.5 hover:text-(--ink)"
          >
            info@sibmethod.com
          </a>
        </div>
        <div className="flex items-center justify-center gap-4 text-[10px] sm:text-[11px] lg:justify-end">
          <Link href="/about">About</Link>
          <a href="mailto:info@sibmethod.com">Contact</a>
          <a
            href="https://www.instagram.com/sibmethod/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-8">
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="hidden h-px w-7 bg-(--line) sm:block" />
          <div>
            <p className="brand-section-title text-[1.55rem] leading-none tracking-[0.04em]">
              SIB METHOD
            </p>
            <p className="brand-kicker text-[10px] text-(--muted)">Meal Prep</p>
          </div>
          <div className="h-px w-4 bg-(--line) transition-colors group-hover:bg-(--ink)" />
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-(--muted) lg:flex xl:gap-6">
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
        <div className="ml-4 flex shrink-0 items-center gap-2.5 xl:gap-3">
          <Link
            href="/menu"
            className="hidden brand-control tropical-sheen rounded-md border border-(--line) bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] shadow-[0_6px_18px_rgba(16,27,23,0.05)] transition sm:block"
          >
            Explore Meals
          </Link>
          <Link
            href="/checkout"
            className="brand-control tropical-sheen inline-flex items-center justify-center gap-2 rounded-md bg-(--sun) px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:brightness-95"
          >
            <span className="hidden sm:inline">Start</span> Order
            {cartCount > 0 ? (
              <span className="inline-flex min-w-[1.4rem] items-center justify-center rounded-full bg-(--ink) px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </nav>
    </header>
  );
}
