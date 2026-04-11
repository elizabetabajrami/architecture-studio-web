import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="scroll-mt-28 px-6 pb-28 pt-10 md:px-8 md:pb-32 md:pt-14 lg:pb-36"
    >
      <Reveal>
        <div className="group relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] px-8 py-14 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.06] before:to-transparent before:opacity-70 hover:border-white/16 md:px-14 md:py-16">
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.25em] text-white/62">
              Le të punojmë bashkë
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight md:mt-6 md:text-5xl">
              Gati për të formësuar hapësirën tuaj të ardhshme?
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/76 md:mt-8 md:text-xl md:leading-relaxed">
              Na kontaktoni për të diskutuar projektin tuaj rezidencial, të
              interierit apo arkitekturor.
            </p>

            <div className="mt-11 md:mt-12">
              <Button text="Na kontaktoni" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}