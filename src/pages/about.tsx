import Head from "next/head";
import Link from "next/link";
import { Syne } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";

const heading = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type PortfolioItem = {
  mainImage?: string;
  imageUrl?: string;
  images?: string[];
};

const fallbackImages = ["/bedroom.png"];

const aboutParagraphs = [
  "Alkos Group është një studio ku arkitektura dhe interieri nuk trajtohen thjesht si forma, por si përvoja që ndërtojnë mënyrën se si jetojmë dhe përdorim hapësirën çdo ditë.",
  "Ne besojmë se një hapësirë e mirë nuk është vetëm e bukur për t’u parë, por e qartë në funksion, e balancuar në detaje dhe e ndërtuar për të zgjatur në kohë. Me këtë qasje, punojmë në projekte rezidenciale dhe komerciale duke zhvilluar zgjidhje që ndërthurin estetikën bashkëkohore me prakticitetin e jetës reale.",
  "Puna jonë përfshin projektim arkitektonik, dizajn interieri, renovime dhe vizualizime 3D, ku çdo fazë ndërtohet mbi një ide të qartë dhe një vizion të mirëdefinuar. Çdo projekt është një proces i menduar, nga koncepti fillestar deri në realizimin final, me fokus në dritën, materialin, ritmin dhe funksionin e hapësirës.",
  "Përtej dizajnit, Alkos Group operon edhe në fushën e real estate, duke ofruar banesa në shitje dhe duke ndihmuar klientët të gjejnë ose zhvillojnë hapësira që përputhen me stilin dhe investimin e tyre. Kjo na lejon të shohim projektin jo vetëm si dizajn, por si një vlerë të plotë në treg.",
  "Në thelb, ne krijojmë hapësira që ndihen po aq mirë sa duken — të menduara, të balancuara dhe të ndërtuara me kujdes në çdo detaj.",
];

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function AboutPage() {
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/portfolio", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        if (!Array.isArray(data)) return;

        const images = data
          .flatMap((item: PortfolioItem) => [
            item.mainImage,
            item.imageUrl,
            ...(item.images || []),
          ])
          .filter((image: unknown): image is string => Boolean(image))
          .filter((image: string, index: number, all: string[]) => all.indexOf(image) === index)
          .slice(0, 5);

        setProjectImages(images);
      } catch (error) {
        console.error("Failed to load about images:", error);
      }
    };

    fetchImages();
  }, []);

  const carouselImages = useMemo(
    () => (projectImages.length > 0 ? projectImages : fallbackImages),
    [projectImages],
  );
  const currentImageIndex = activeImage % carouselImages.length;

  useEffect(() => {
    if (carouselImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % carouselImages.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Head>
        <title>Rreth nesh | Alkos Group</title>
      </Head>

      <Navbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(255,255,255,0.09),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_24%,rgba(255,255,255,0.05),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_62%,rgba(255,255,255,0.055),transparent_38%)]" />

        <section className="relative z-10 px-6 pb-14 pt-28 md:px-8 md:pb-20 md:pt-32">
          <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,1.02fr)] lg:items-center">
            <Reveal>
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.28em] text-white/58">
                  RRETH NESH
                </p>
                <h1
                  className={`${heading.className} mt-4 text-4xl font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl`}
                >
                  Kush jemi ne?
                </h1>
                <div className="mt-5 space-y-4 text-sm leading-7 text-white/68 md:text-base md:leading-8">
                  {aboutParagraphs.slice(0, 2).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.45, ease: easeOutExpo }}
                      >
                        {aboutParagraphs.slice(2).map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact#contact-form"
                    className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-[#112734] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                  >
                    Na kontaktoni
                  </Link>
                  <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    className="inline-flex rounded-full border border-white/18 bg-white/[0.05] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/34 hover:bg-white/[0.1]"
                  >
                    {expanded ? "Shfaq më pak" : "Lexo më shumë"}
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <motion.div
                className="relative overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.05] p-3 shadow-[0_24px_70px_-22px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.78, ease: easeOutExpo }}
              >
                <div className="relative h-[280px] overflow-hidden rounded-[24px] bg-white/[0.035] sm:h-[360px] lg:h-[440px]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={carouselImages[currentImageIndex]}
                      src={carouselImages[currentImageIndex]}
                      alt="Projekt i Alkos Group"
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.01 }}
                      transition={{ duration: 0.65, ease: easeOutExpo }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/14 to-transparent" />
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/70">
                      Alkos Group
                    </p>
                    <p className="mt-2 max-w-sm text-lg font-semibold leading-tight text-white sm:text-xl">
                      Dizajn i pastër, materiale të zgjedhura dhe planifikim i menduar.
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? "w-7 bg-white/85" : "w-1.5 bg-white/30"
                        }`}
                        aria-label={`Shfaq imazhin ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
