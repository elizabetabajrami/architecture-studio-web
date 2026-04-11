import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 px-6 pb-16 pt-4 md:px-8 md:pb-20 md:pt-5 lg:pb-24"
    >
      <Reveal>
        <motion.div
          className="group relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] px-7 py-8 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-colors duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.06] before:to-transparent before:opacity-70 hover:border-white/16 md:px-10 md:py-10"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.32 }}
          transition={{ duration: 0.82, ease: easeOutExpo }}
          whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.25em] text-white/62">
              Le të punojmë bashkë
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight md:mt-5 md:text-5xl">
              Gati për të formësuar hapësirën tuaj të ardhshme?
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/76 md:mt-6 md:text-xl md:leading-relaxed">
              Na kontaktoni për të diskutuar projektin tuaj rezidencial, të
              interierit apo arkitekturor.
            </p>

            <div className="mt-8 md:mt-9">
              <Button text="Na kontaktoni" />
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}
