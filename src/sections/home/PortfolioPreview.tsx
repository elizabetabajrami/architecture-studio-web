import Reveal from "@/components/ui/Reveal";

export default function PortfolioPreview() {
  return (
    <section
      id="portfolio"
      className="scroll-mt-28 px-6 py-24 md:px-8 md:py-32 lg:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-white/58">
            Portofolio
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:mt-6 md:text-5xl">
            Projektet e përzgjedhura
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-7 md:grid-cols-2 md:gap-8 lg:mt-16">
          <Reveal>
            <div className="group relative h-[400px] overflow-hidden rounded-[28px] border border-white/12 shadow-[0_24px_70px_-22px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/[0.04] transition-all duration-500 ease-out hover:border-white/20 hover:shadow-[0_32px_80px_-18px_rgba(0,0,0,0.6)] md:h-[420px]">
              <img
                src="/bedroom.png"
                alt="Project 1"
                className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/75" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-9">
                <p className="text-sm uppercase tracking-[0.25em] text-white/72 transition-colors duration-300 group-hover:text-white/85">
                  Interior
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Premium Bedroom Concept
                </h3>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="group relative h-[400px] overflow-hidden rounded-[28px] border border-white/12 shadow-[0_24px_70px_-22px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/[0.04] transition-all duration-500 ease-out hover:border-white/20 hover:shadow-[0_32px_80px_-18px_rgba(0,0,0,0.6)] md:h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                alt="Project 2"
                className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10 transition-opacity duration-500 group-hover:from-black/75" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-9">
                <p className="text-sm uppercase tracking-[0.25em] text-white/72 transition-colors duration-300 group-hover:text-white/85">
                  Architecture
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  Modern Living Space
                </h3>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}