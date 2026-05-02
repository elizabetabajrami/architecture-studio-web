import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

const STATS = [
  { target: 100, prefix: "+", suffix: "", label: "projekte" },
  { target: 10, prefix: "", suffix: "+", label: "vite pervoje" },
  { target: 100, prefix: "", suffix: "+", label: "kliente te kenaqur" },
] as const;

const REVIEWS = [
  {
    quote:
      "Projekti yne rezidencial u transformua plotesisht. Profesionalizem dhe kujdes deri ne detaj.",
    name: "Ana M.",
    place: "Prishtine",
  },
  {
    quote:
      "Ekipi i Alkos Group kuptoi vizionin tone dhe e beri realitet me elegance.",
    name: "Besnik K.",
    place: "Ferizaj",
  },
  {
    quote:
      "Komunikim i qarte, afate te respektuara dhe nje interier qe tejkaloi pritshmerite.",
    name: "Drita R.",
    place: "Peje",
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
          className="group relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] p-6 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-colors duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.06] before:to-transparent before:opacity-60 hover:border-white/16 md:p-8 lg:p-9"
          whileHover={{ borderColor: "rgba(255,255,255,0.14)" }}
        >
          <div className="relative grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <motion.div
              className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.72, ease: easeOutExpo }}
            >
              {STATS.map((s, index) => (
                <motion.div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors duration-300 ease-out hover:border-white/16 hover:bg-white/[0.075]"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.62,
                    delay: index * 0.07,
                    ease: easeOutExpo,
                  }}
                  whileHover={{ y: -2, transition: { duration: 0.25 } }}
                >
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-white md:text-[2rem]">
                    <CountUp
                      end={s.target}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      delay={index * 0.1}
                      duration={1.35}
                    />
                  </p>
                  <p className="mt-1.5 text-xs uppercase tracking-[0.22em] text-white/58">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md md:p-6 lg:p-7"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.72, delay: 0.08, ease: easeOutExpo }}
            >
              <div className="flex flex-col gap-3 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/58">
                    Besimi i klienteve
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl">
                    Projekte te realizuara me kujdes dhe qartesi.
                  </h2>
                </div>

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
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="relative min-h-[7rem] flex-1 overflow-hidden sm:min-h-[5.5rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.blockquote
                      key={reviewIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.45, ease: easeOutExpo }}
                      className="text-base leading-relaxed text-white/80 md:text-lg md:leading-relaxed"
                    >
                      <span className="text-3xl leading-none text-white/30">
                        &quot;
                      </span>
                      {REVIEWS[reviewIndex].quote}
                      <span className="text-3xl leading-none text-white/30">
                        &quot;
                      </span>
                    </motion.blockquote>
                  </AnimatePresence>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  <motion.button
                    type="button"
                    onClick={() => goTo(reviewIndex - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/75 transition-colors hover:border-white/22 hover:bg-white/[0.1] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30"
                    aria-label="Shqyrtimi i meparshem"
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
                    aria-label="Shqyrtimi tjeter"
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

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={reviewIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35, ease: easeOutExpo }}
                  className="mt-5 border-t border-white/[0.07] pt-5 text-sm text-white/62"
                >
                  <span className="font-medium text-white/88">
                    {REVIEWS[reviewIndex].name}
                  </span>
                  <span className="mx-2 text-white/30">/</span>
                  {REVIEWS[reviewIndex].place}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}
