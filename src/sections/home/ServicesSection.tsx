import { services } from "@/data/services";
import ServiceCard from "@/components/cards/ServiceCard";
import Reveal from "@/components/ui/Reveal";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="scroll-mt-28 px-6 py-24 md:px-8 md:py-32 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-white/58">
            Shërbimet
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:mt-6 md:text-5xl">
            Çfarë bëjmë ne
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-7 md:grid-cols-2 md:gap-8 lg:mt-16">
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