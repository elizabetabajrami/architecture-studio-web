import { motion } from "framer-motion";
import { services } from "@/data/services";
import ServiceCard from "@/components/cards/ServiceCard";
import Reveal from "@/components/ui/Reveal";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="scroll-mt-24 px-6 py-11 md:px-8 md:py-14 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <motion.p
            className="text-sm uppercase tracking-[0.25em] text-white/58"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            Shërbimet
          </motion.p>
        </Reveal>

        <Reveal delay={0.08}>
          <motion.h2
            className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:mt-5 md:text-5xl"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.68, delay: 0.04, ease: easeOutExpo }}
          >
            Çfarë bëjmë ne
          </motion.h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5 lg:mt-9">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.1}>
              <ServiceCard
                title={service.title}
                description={service.description}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
