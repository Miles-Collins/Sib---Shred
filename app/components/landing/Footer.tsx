import Link from "next/link";

import { getSiteSettingsFromSanity } from "@/sanity/lib/queries";

type FooterLink = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

const fallbackCompanyLinks: FooterLink[] = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/about#my-story" },
  { label: "Contact Us", href: "mailto:info@sibmethod.com" },
  { label: "Instagram", href: "https://www.instagram.com/sibmethod/", openInNewTab: true },
];

const fallbackMenuLinks: FooterLink[] = [
  { label: "Weekly Menu", href: "/menu" },
  { label: "Subscription Plans", href: "/plans" },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const isInternal = link.href.startsWith("/");

  if (isInternal) {
    return (
      <Link href={link.href} className="block">
        {link.label}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      className="block"
      target={link.openInNewTab ? "_blank" : undefined}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
    >
      {link.label}
    </a>
  );
}

export default async function Footer() {
  const settings = await getSiteSettingsFromSanity();
  const companyLinks =
    settings?.footerCompanyLinks && settings.footerCompanyLinks.length > 0
      ? settings.footerCompanyLinks
      : fallbackCompanyLinks;
  const menuLinks =
    settings?.footerMenuLinks && settings.footerMenuLinks.length > 0
      ? settings.footerMenuLinks
      : fallbackMenuLinks;

  return (
    <footer className="border-t border-(--line) bg-white/70">
      <div className="mx-auto grid w-full max-w-6xl gap-5 px-5 py-8 text-sm text-(--muted) sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <p className="text-lg font-black text-(--ink)">{settings?.brandName || "SIB METHOD"}</p>
          <p className="mt-1">{settings?.footerTagline || "Healthy Meals Delivered by Alysha"}</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-(--ink)">Company</p>
          {companyLinks.map((link) => (
            <FooterLinkItem key={`${link.label}-${link.href}`} link={link} />
          ))}
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-(--ink)">Menu</p>
          {menuLinks.map((link) => (
            <FooterLinkItem key={`${link.label}-${link.href}`} link={link} />
          ))}
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-(--ink)">Support</p>
          <p>{settings?.supportPhone || "(866) 442-3287"}</p>
          <p>{settings?.supportEmail || "info@sibmethod.com"}</p>
        </div>
      </div>
      <div className="border-t border-(--line) px-5 py-4 text-center text-xs text-(--muted) sm:px-8">
        {settings?.footerCopyright || "© 2026 Sib Method - All Rights Reserved."}
      </div>
    </footer>
  );
}
