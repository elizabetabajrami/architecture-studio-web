import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

const STATS = [
  { target: 100, prefix: "+", suffix: "", label: "projekte" },
  { target: 10, prefix: "", suffix: "+", label: "vite përvojë" },
  { target: 100, prefix: "", suffix: "+", label: "klientë të kënaqur" },
] as const;

const REVIEWS = [
  {
    quote:
      "Projekti ynë rezidencial u transformua plotësisht. Profesionalizëm dhe kujdes deri në detaj.",
    name: "Ana M.",
    place: "Prishtinë",
  },
  {
    quote:
      "Ekipi i Alkos Group kuptoi vizionin tonë dhe e bëri realitet me elegancë.",
    name: "Besnik K.",
    place: "Ferizaj",
  },
  {
    quote:
      "Komunikim i qartë, afate të respektuara dhe një interier që tejkaloi pritshmëritë.",
    name: "Drita R.",
    place: "Pejë",
  },
] as const;

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function AboutPreview() {
  const [reviewIndex, setReviewIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setReviewIndex((i + REVIEWS.length) % REVIEWS.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setReviewIndex((i) => (i + 1) % REVIEWS.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="about"
      className="scroll-mt-24 px-6 pt-6 pb-11 md:px-8 md:pt-8 md:pb-14 lg:pt-10 lg:pb-16"
    >
      <Reveal>
        <motion.div
          className="group relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] p-7 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-colors duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.06] before:to-transparent before:opacity-60 hover:border-white/16 md:p-10"
          whileHover={{ borderColor: "rgba(255,255,255,0.14)" }}
        >
          <div className="relative grid gap-7 md:grid-cols-2 md:gap-9 lg:gap-10">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, ease: easeOutExpo }}
            >
              <p className="text-sm uppercase tracking-[0.25em] text-white/58">
                Rreth nesh
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight md:mt-5 md:text-5xl">
                Ne krijojmë hapësira me kuptim.
              </h2>
            </motion.div>

            <motion.div
              className="relative flex items-end"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, delay: 0.06, ease: easeOutExpo }}
            >
              <p className="text-lg leading-relaxed text-white/76 md:text-xl md:leading-relaxed">
                Studio jonë fokusohet në arkitekturë, interier dhe përvoja
                hapësinore që ndërthurin inovacionin, minimalizmin dhe
                funksionalitetin.
              </p>
            </motion.div>
          </div>

          <div className="relative mt-8 border-t border-white/[0.08] pt-7 md:mt-9 md:pt-8">
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-3.5">
              {STATS.map((s, index) => (
                <motion.div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors duration-300 ease-out hover:border-white/16 hover:bg-white/[0.07] md:px-6 md:py-6"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.08,
                    ease: easeOutExpo,
                  }}
                  whileHover={{ y: -2, transition: { duration: 0.25 } }}
                >
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-white md:text-[2rem]">
                    <CountUp
                      end={s.target}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      delay={index * 0.12}
                      duration={1.45}
                    />
                  </p>
                  <p className="mt-1.5 text-xs uppercase tracking-[0.22em] text-white/58">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative mt-7 md:mt-8">
            <p className="text-xs uppercase tracking-[0.28em] text-white/52">
              Çfarë thonë klientët
            </p>
            <motion.div
              className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md md:p-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="relative min-h-[5.25rem] flex-1 overflow-hidden md:min-h-[4.5rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.blockquote
                      key={reviewIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.45, ease: easeOutExpo }}
                      className="text-base leading-relaxed text-white/80 md:text-lg md:leading-relaxed"
                    >
                      <span className="text-white/35">“</span>
                      {REVIEWS[reviewIndex].quote}
                      <span className="text-white/35">”</span>
                    </motion.blockquote>
                  </AnimatePresence>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <motion.button
                    type="button"
                    onClick={() => goTo(reviewIndex - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/75 transition-colors hover:border-white/22 hover:bg-white/[0.1] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                    aria-label="Shqyrtimi i mëparshëm"
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ scale: 1.04 }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 6 9 12l6 6" strokeLinecap="round" />
                    </svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => goTo(reviewIndex + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/75 transition-colors hover:border-white/22 hover:bg-white/[0.1] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                    aria-label="Shqyrtimi tjetër"
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ scale: 1.04 }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m9 6 6 6-6 6" strokeLinecap="round" />
                    </svg>
                  </motion.button>
                </div>
              </div>
              <footer className="mt-5 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={reviewIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.35, ease: easeOutExpo }}
                    className="text-sm text-white/62"
                  >
                    <span className="font-medium text-white/88">
                      {REVIEWS[reviewIndex].name}
                    </span>
                    <span className="mx-2 text-white/30">·</span>
                    {REVIEWS[reviewIndex].place}
                  </motion.p>
                </AnimatePresence>
                <div
                  className="flex gap-2"
                  role="tablist"
                  aria-label="Zgjidh shqyrtimin"
                >
                  {REVIEWS.map((_, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === reviewIndex}
                      onClick={() => setReviewIndex(i)}
                      className={`h-1.5 rounded-full ${
                        i === reviewIndex
                          ? "bg-white/85"
                          : "bg-white/25 hover:bg-white/40"
                      }`}
                      aria-label={`Shqyrtimi ${i + 1}`}
                      animate={{
                        width: i === reviewIndex ? 32 : 6,
                        opacity: i === reviewIndex ? 1 : 0.85,
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      whileHover={{ opacity: 1 }}
                      whileTap={{ scale: 0.92 }}
                    />
                  ))}
                </div>
              </footer>
            </motion.div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}
