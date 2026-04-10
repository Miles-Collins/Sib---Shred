import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[var(--line)] bg-white/95">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)] sm:px-8">
        <div className="flex items-center gap-4">
          <a href="tel:+18664423287">(866) 442-3287</a>
          <a href="mailto:info@sibshredkitchen.com">info@sibshredkitchen.com</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="#">Login</a>
          <a href="#">Sign Up</a>
          <a href="#">0 Items</a>
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand-logo.svg"
            alt="Sibshred Kitchen"
            width={46}
            height={46}
            priority
          />
          <div>
            <p className="text-2xl font-black tracking-tight">SIBSHRED</p>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Meal Prep
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          <Link href="/menu" className="hover:text-[var(--ink)]">
            Menu
          </Link>
          <Link href="/plans" className="hover:text-[var(--ink)]">
            Plans
          </Link>
          <Link href="/#how" className="hover:text-[var(--ink)]">
            How It Works
          </Link>
          <Link href="/#reviews" className="hover:text-[var(--ink)]">
            Testimonials
          </Link>
          <a href="#blog" className="hover:text-[var(--ink)]">
            Blog
          </a>
        </div>

        <Link
          href="/checkout"
          className="rounded-md bg-[var(--sun)] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:brightness-95"
        >
          Order This Week
        </Link>
      </nav>
    </header>
  );
}
