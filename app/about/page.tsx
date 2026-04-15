import { Caveat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Header } from "../components/landing/Header";

const signatureFont = Caveat({
  subsets: ["latin"],
  weight: ["500"],
});

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col bg-[var(--bg-cream)] text-[var(--ink)]">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
        <section className="overflow-hidden rounded-[1.2rem] border border-[#d4d9d0] bg-[#eceeeb] p-4 sm:p-8 lg:p-10">
          <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-[0.15rem] bg-white shadow-[0_18px_42px_rgba(16,27,23,0.12)]">
                <Image
                  src="/alysha-portrait.png"
                  alt="Portrait of Alysha"
                  width={940}
                  height={1040}
                  className="h-full max-h-[42rem] w-full object-cover"
                  priority
                />
              </div>

              <div className="absolute top-12 left-0 hidden -translate-x-1/2 items-center bg-[#b97d6f] px-3 py-5 md:flex">
                <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                  Meet Alysha
                </span>
              </div>
            </div>

            <article className="relative border-t-2 border-[#adb3aa] bg-[#f1f2ef] p-6 shadow-[0_20px_46px_rgba(16,27,23,0.1)] sm:p-8 lg:-ml-14 lg:max-w-[42rem] lg:p-10">
              <p className="text-[12px] font-bold tracking-[0.24em] text-[#4f5551] uppercase">
                It&apos;s nice to meet you.
                <span className={`${signatureFont.className} ml-2 text-[2.15rem] normal-case tracking-normal text-[#c59385]`}>
                  I&apos;m Alysha.
                </span>
              </p>

              <h1 className="mt-5 text-[2rem] leading-[1.2] font-semibold text-[#323734] sm:text-[2.35rem]">
                I help people <span className="font-black">eat with less stress</span> with blunt
                honesty, clear portions, and practical weekly prep.
              </h1>

              <p className="mt-5 text-[1rem] leading-[1.8] text-[#4f5551]">
                Sibshred Kitchen started as a way to make healthy eating feel realistic,
                even on packed weeks. Instead of another generic subscription experience,
                I built something personal: I cook, portion, and package each meal myself
                so the quality stays consistent from the first order to the final bite.
              </p>

              <p className="mt-4 text-[1rem] leading-[1.8] text-[#4f5551]">
                My goal is simple: make your week easier without sacrificing flavor or
                nutrition. Fewer last-minute food decisions, less prep fatigue, and meals
                you actually look forward to opening.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/menu"
                  className="brand-control rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white"
                >
                  Explore Menu
                </Link>
                <Link
                  href="/plans"
                  className="brand-control rounded-full border border-[var(--ink)] px-5 py-2 text-sm font-bold uppercase tracking-[0.08em]"
                >
                  View Plans
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section id="my-story" className="brand-shell p-6 sm:p-8">
          <p className="brand-kicker text-[var(--muted)]">About me</p>

          <h2 className="brand-section-title mt-3 text-3xl sm:text-4xl">Who I Am</h2>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            My name is Alysha. I am a passionate cook, advocate for wellness, and an official nutrition coach of the National Academy of Sports Medicine. Having spent the last fifteen years exploring how nutrition works for the body, starting from my years as an athlete practicing hockey, gymnastics, and living an extremely busy life. It all started out as something needed but later turned into something I loved doing, which is preparing meals that not only taste great but also nourish one&apos;s body.
          </p>

          <h2 className="brand-section-title mt-8 text-3xl sm:text-4xl">Why Did I Start?</h2>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            The business has been established based on my understanding of the difficulties associated with healthy nutrition. There are always too many conflicting pieces of advice, too complicated lives, and too big ambitions. The point is to make this journey easier. My intention is to get rid of the guessing when it comes to eating healthy by providing people with delicious food that is going to help them feel great.
          </p>

          <h2 className="brand-section-title mt-8 text-3xl sm:text-4xl">Who Is This For?</h2>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            The service will be perfect for everyone who cares about their health but does not have enough time or knowledge to take good care of themselves. If your purpose is to gain muscles, burn fat, remain consistent, or simply improve your eating habits without stressing yourself, this is for you.
          </p>
        </section>

        <section className="brand-panel p-6 sm:p-8">
          <p className="brand-kicker text-[var(--muted)]">How it works</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "Pick your meals from the weekly menu",
              "Alysha preps, portions, and packages everything fresh",
              "You heat, eat, and get your time back",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--line)] bg-white p-5"
              >
                <p className="brand-kicker text-[var(--berry)]">Step {index + 1}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink)]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="brand-shell grid gap-4 p-6 sm:p-8 md:grid-cols-3">
          {[
            {
              label: "Kitchen style",
              text: "Small-batch cooking with a focus on consistency and freshness.",
            },
            {
              label: "Voice",
              text: "Direct, personal, and built around a one-person relationship.",
            },
            {
              label: "Experience",
              text: "Simple ordering, clear labels, and meals that are ready when you need them.",
            },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-[var(--line)] bg-white p-5">
              <p className="brand-kicker text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-[var(--mint)]/45 p-7 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Get in touch
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Want to talk about an order or a custom plan?
              </h2>
            </div>
            <Link
              href="/checkout"
              className="brand-control rounded-full bg-[var(--ink)] px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.1em] text-white"
            >
              Start an order
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}