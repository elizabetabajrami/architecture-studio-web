import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Syne } from "next/font/google";

const heroTitle = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const leftContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: easeOutExpo },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/[0.58]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.08),transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-14 pt-28 md:px-8 md:pb-16 md:pt-32">
        <div className="grid w-full items-end gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <motion.div
            className="max-w-4xl"
            variants={leftContainer}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={fadeUp}
              className={`${heroTitle.className} text-6xl font-semibold leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] md:text-8xl lg:text-[8.5rem]`}
            >
              Alkos Group
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-white/82 md:mt-9 md:text-xl md:leading-relaxed"
            >
              Krijojmë hapësira moderne ku arkitektura, interieri dhe stili i
              jetës bashkohen në mënyrë harmonike.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 md:mt-10">
              <Button text="Shiko Portofolion" />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-end lg:items-end"
            initial={{ opacity: 0, x: 44 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.16, ease: easeOutExpo }}
          >
            <motion.div
              className="group/card w-full max-w-md overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.06] p-6 text-white shadow-[0_24px_70px_-20px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-colors duration-500 ease-out hover:border-white/18 hover:bg-white/[0.09] hover:shadow-[0_32px_80px_-18px_rgba(0,0,0,0.6)] md:p-7"
              whileHover={{ y: -4, transition: { duration: 0.35, ease: easeOutExpo } }}
            >
              <div className="mb-5 h-48 overflow-hidden rounded-[22px] ring-1 ring-white/10">
                <img
                  src="/bedroom.png"
                  alt="Interior Design"
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover/card:scale-[1.04]"
                />
              </div>

              <h3 className="text-3xl font-semibold tracking-tight">
                Shërbime Dizajni
              </h3>

              <p className="mt-4 text-base leading-relaxed text-white/78">
                Zgjidhje premium arkitekturore dhe të interierit, të dizajnuara
                me estetikë të pastër, funksion dhe identitet.
              </p>

              <motion.button
                type="button"
                className="mt-7 text-sm uppercase tracking-[0.3em] text-white/82 transition-colors duration-300 ease-out hover:text-white"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                Shiko më shumë →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.55 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.06, borderColor: "rgba(255,255,255,0.35)" }}
          className="flex h-12 w-12 cursor-default items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-sm text-white/90 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-colors duration-300 md:h-14 md:w-14"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
