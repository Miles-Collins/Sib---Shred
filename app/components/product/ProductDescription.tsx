"use client";

import { useState } from "react";

type ProductDescriptionProps = {
  text: string;
};

export function ProductDescription({ text }: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const preview =
    text.length > 210
      ? `${text.slice(0, 210)}...`
      : `${text} Complete your meal with your favorite sides and repeat-worthy flavor.`;

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white p-6 text-[var(--muted)] shadow-[0_2px_6px_rgba(0,0,0,0.04)] sm:p-8">
      <p className="max-w-4xl text-[1.02rem] leading-[1.75] sm:text-[1.08rem]">{expanded ? text : preview}</p>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="brand-control mt-4 rounded-full border border-[var(--line)] bg-[var(--bg-cream)] px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--ink)]"
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </section>
  );
}
