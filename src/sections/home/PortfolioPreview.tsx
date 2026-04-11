import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PortfolioPreview() {
  return (
    <section
      id="portfolio"
      className="scroll-mt-24 px-6 py-11 md:px-8 md:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-white/58">
            Portofolio
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:mt-5 md:text-5xl">
            Projektet e përzgjedhura
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5 lg:mt-9">
          <Reveal>
            <motion.div
              className="group relative h-[400px] overflow-hidden rounded-[28px] border border-white/12 shadow-[0_24px_70px_-22px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/[0.04] transition-colors duration-500 ease-out hover:border-white/20 hover:shadow-[0_32px_80px_-18px_rgba(0,0,0,0.6)] md:h-[420px]"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.75, ease: easeOutExpo }}
              whileHover={{ y: -5, transition: { duration: 0.32, ease: easeOutExpo } }}
            >
              <img
                src="/bedroom.png"
                alt="Project 1"
                className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/75" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <p className="text-sm uppercase tracking-[0.25em] text-white/72 transition-colors duration-300 group-hover:text-white/85">
                  Interior
                </p>
                <h3 className="mt-2.5 text-3xl font-semibold tracking-tight text-white">
                  Premium Bedroom Concept
                </h3>
              </div>
            </motion.div>
          </Reveal>

          <Reveal delay={0.12}>
            <motion.div
              className="group relative h-[400px] overflow-hidden rounded-[28px] border border-white/12 shadow-[0_24px_70px_-22px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/[0.04] transition-colors duration-500 ease-out hover:border-white/20 hover:shadow-[0_32px_80px_-18px_rgba(0,0,0,0.6)] md:h-[420px]"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: 0.75, delay: 0.06, ease: easeOutExpo }}
              whileHover={{ y: -5, transition: { duration: 0.32, ease: easeOutExpo } }}
            >
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                alt="Project 2"
                className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/75" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <p className="text-sm uppercase tracking-[0.25em] text-white/72 transition-colors duration-300 group-hover:text-white/85">
                  Architecture
                </p>
                <h3 className="mt-2.5 text-3xl font-semibold tracking-tight text-white">
                  Modern Living Space
                </h3>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
