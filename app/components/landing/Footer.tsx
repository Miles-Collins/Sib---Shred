import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-5 px-5 py-8 text-sm text-[var(--muted)] sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="text-lg font-black text-[var(--ink)]">SIB METHOD</p>
          <p className="mt-1">Healthy Meals Delivered by Alysha</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-[var(--ink)]">Company</p>
          <Link href="/about" className="block">
            About
          </Link>
          <a href="/about#my-story" className="block">
            FAQ
          </a>
          <a href="mailto:info@sibmethod.com" className="block">
            Contact Us
          </a>
          <a
            href="https://www.instagram.com/sibmethod/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            Instagram
          </a>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-[var(--ink)]">Menu</p>
          <Link href="/menu" className="block">
            Weekly Menu
          </Link>
          <Link href="/plans" className="block">
            Subscription Plans
          </Link>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-[var(--ink)]">Support</p>
          <p>(866) 442-3287</p>
          <p>info@sibmethod.com</p>
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-5 py-4 text-center text-xs text-[var(--muted)] sm:px-8">
        © 2026 Sib Method - All Rights Reserved.
      </div>
    </footer>
  );
}
