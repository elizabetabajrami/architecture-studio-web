import Reveal from "@/components/ui/Reveal";

export default function AboutPreview() {
  return (
    <section
      id="about"
      className="scroll-mt-28 px-6 py-24 md:px-8 md:py-32 lg:py-36"
    >
      <Reveal>
        <div className="group relative mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] p-10 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.06] before:to-transparent before:opacity-60 hover:border-white/16 md:grid-cols-2 md:gap-14 md:p-14 lg:gap-16">
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.25em] text-white/58">
              Rreth nesh
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:mt-6 md:text-5xl">
              Ne krijojmë hapësira me kuptim.
            </h2>
          </div>

          <div className="relative flex items-end">
            <p className="text-lg leading-relaxed text-white/76 md:text-xl md:leading-relaxed">
              Studio jonë fokusohet në arkitekturë, interier dhe përvoja
              hapësinore që ndërthurin inovacionin, minimalizmin dhe
              funksionalitetin.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}