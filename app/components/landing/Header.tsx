import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur-md">
      <div className="bg-[var(--deep)] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white sm:px-8 sm:text-xs">
        Save $120 on your first month + free local delivery
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
          <a
            href="tel:+18664423287"
            className="brand-control rounded-full border border-[var(--line)] bg-white px-3 py-1.5 hover:text-[var(--ink)]"
          >
            (866) 442-3287
          </a>
          <a
            href="mailto:info@sibshredkitchen.com"
            className="brand-control rounded-full border border-[var(--line)] bg-white px-3 py-1.5 hover:text-[var(--ink)]"
          >
            info@sibshredkitchen.com
          </a>
        </div>
        <div className="flex items-center justify-center gap-4 text-[10px] sm:text-[11px] lg:justify-end">
          <Link href="/about">About</Link>
          <a href="mailto:info@sibshredkitchen.com">Contact</a>
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center justify-center gap-3 lg:justify-start">
          <Image
            src="/brand-logo.png"
            alt="Sibshred Kitchen"
            width={46}
            height={46}
            priority
          />
          <div>
            <p className="brand-section-title text-2xl">SIB & SHRED</p>
            <p className="brand-kicker text-[var(--muted)]">
              Meal Prep
            </p>
          </div>
        </Link>

        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)] lg:mx-0 lg:w-auto lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0 lg:pb-0">
          <Link href="/menu" className="brand-nav-link shrink-0 rounded-full border border-transparent px-3 py-2 hover:border-[var(--line)] hover:bg-white hover:text-[var(--ink)]">
            Menu
          </Link>
          <Link href="/plans" className="brand-nav-link shrink-0 rounded-full border border-transparent px-3 py-2 hover:border-[var(--line)] hover:bg-white hover:text-[var(--ink)]">
            Plans
          </Link>
          <Link href="/#how" className="brand-nav-link shrink-0 rounded-full border border-transparent px-3 py-2 hover:border-[var(--line)] hover:bg-white hover:text-[var(--ink)]">
            How It Works
          </Link>
          <Link href="/#reviews" className="brand-nav-link shrink-0 rounded-full border border-transparent px-3 py-2 hover:border-[var(--line)] hover:bg-white hover:text-[var(--ink)]">
            Testimonials
          </Link>
          <Link href="/about" className="brand-nav-link shrink-0 rounded-full border border-transparent px-3 py-2 hover:border-[var(--line)] hover:bg-white hover:text-[var(--ink)]">
            About
          </Link>
          <a href="#blog" className="brand-nav-link shrink-0 rounded-full border border-transparent px-3 py-2 hover:border-[var(--line)] hover:bg-white hover:text-[var(--ink)]">
            Blog
          </a>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center lg:gap-3">
          <Link
            href="/menu"
            className="brand-control rounded-md border border-[var(--line)] bg-white px-4 py-2 text-center text-sm font-bold uppercase tracking-[0.08em] shadow-[0_6px_18px_rgba(16,27,23,0.05)]"
          >
            Explore Meals
          </Link>
          <Link
            href="/checkout"
            className="brand-control rounded-md bg-[var(--sun)] px-5 py-2.5 text-center text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:brightness-95"
          >
            Start Order
          </Link>
        </div>
      </nav>
    </header>
  );
}
