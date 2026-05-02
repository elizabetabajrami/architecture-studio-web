import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Reveal from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

type PortfolioProject = {
  _id: string;
  title?: string;
  category?: string;
  description?: string;
  location?: string;
  year?: string;
  client?: string;
  area?: string;
  status?: string;
  mainImage?: string;
  imageUrl?: string;
  images?: string[];
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const formatDate = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const cardClassName =
  "rounded-[24px] border border-white/12 bg-white/[0.05] shadow-[0_22px_64px_-28px_rgba(0,0,0,0.56)] backdrop-blur-2xl";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (!router.isReady || typeof id !== "string") return;

    const fetchProject = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const response = await fetch(
          `http://localhost:5000/api/portfolio/${encodeURIComponent(id)}`,
          { cache: "no-store" },
        );

        if (response.status === 404) {
          setProject(null);
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load project");
        }

        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Failed to load project details:", error);
        setProject(null);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, router.isReady]);

  const heroImage = project?.mainImage || project?.imageUrl || "";

  const allImages = useMemo(() => {
    const images = [heroImage, ...(project?.images || [])].filter(Boolean);
    return Array.from(new Set(images));
  }, [heroImage, project?.images]);

  useEffect(() => {
    setActiveImage(allImages[0] || "");
  }, [allImages]);

  const metadataItems = [
    project?.category,
    project?.location,
    project?.year,
  ].filter((item): item is string => Boolean(item?.trim()));

  const detailItems = useMemo(
    () =>
      [
        { label: "Lokacioni", value: project?.location },
        { label: "Viti", value: project?.year },
        { label: "Klienti", value: project?.client },
        { label: "Siperfaqja", value: project?.area },
        { label: "Statusi", value: project?.status },
        { label: "Projekt i vecuar", value: project?.isFeatured ? "Po" : "" },
        { label: "Publikuar", value: formatDate(project?.createdAt) },
        { label: "Perditesuar", value: formatDate(project?.updatedAt) },
      ].filter((item) => item.value && String(item.value).trim()),
    [project],
  );

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Head>
        <title>
          {project?.title ? `${project.title} | Alkos Group` : "Projekti | Alkos Group"}
        </title>
      </Head>

      <Navbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(255,255,255,0.09),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.045),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_64%,rgba(255,255,255,0.055),transparent_34%)]" />

        <section className="relative z-10 px-6 pb-14 pt-28 md:px-8 md:pb-16 md:pt-30">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/#portfolio"
              className="inline-flex rounded-full border border-white/16 bg-white/[0.04] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.22em] text-white/72 transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
            >
              Kthehu te projektet
            </Link>

            {loading ? (
              <div className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.045] p-8 text-white/65 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]">
                Duke u ngarkuar detajet e projektit...
              </div>
            ) : notFound || !project ? (
              <div className="mt-8 rounded-[26px] border border-white/10 bg-white/[0.045] p-8 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]">
                <p className="text-lg font-semibold text-white">
                  Projekti nuk u gjet.
                </p>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Projekti mund te jete fshire ose adresa nuk eshte e sakte.
                </p>
              </div>
            ) : (
              <>
                <Reveal>
                  <div className="mt-6">
                    {project.category ? (
                      <p className="text-sm uppercase tracking-[0.28em] text-white/58">
                        {project.category}
                      </p>
                    ) : null}

                    <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-[1.04] tracking-tight text-white sm:text-4xl md:text-5xl">
                      {project.title}
                    </h1>

                    {metadataItems.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {metadataItems.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/12 bg-white/[0.045] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/62"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Reveal>

                <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_330px]">
                  <Reveal>
                    <motion.div
                      className={`${cardClassName} overflow-hidden p-3 ring-1 ring-inset ring-white/[0.04]`}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.78, ease: easeOutExpo }}
                    >
                      <div className="overflow-hidden rounded-[22px] bg-white/[0.035]">
                        {activeImage ? (
                          <img
                            src={activeImage}
                            alt={project.title || "Projekt"}
                          className="h-[220px] w-full object-cover sm:h-[300px] lg:h-[360px]"
                          />
                        ) : (
                          <div className="flex h-[220px] items-center justify-center text-sm uppercase tracking-[0.22em] text-white/45 sm:h-[300px] lg:h-[360px]">
                            Pa imazh
                          </div>
                        )}
                      </div>

                      {allImages.length > 1 ? (
                        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                          {allImages.map((image, index) => {
                            const isActive = activeImage === image;

                            return (
                              <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setActiveImage(image)}
                                className={`h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
                                  isActive
                                    ? "border-white/62 opacity-100 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.6)]"
                                    : "border-white/12 opacity-60 hover:border-white/28 hover:opacity-90"
                                }`}
                                aria-label={`Shfaq imazhin ${index + 1}`}
                              >
                                <img
                                  src={image}
                                  alt={`${project.title || "Projekt"} ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </motion.div>
                  </Reveal>

                  <Reveal delay={0.06}>
                    <aside className={`${cardClassName} p-5`}>
                      <div className="border-b border-white/10 pb-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                          Detajet
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                          Profili i projektit
                        </h2>
                      </div>

                      {detailItems.length > 0 ? (
                        <dl className="divide-y divide-white/10">
                          {detailItems.map((item) => (
                            <div
                              key={item.label}
                              className="grid gap-1.5 py-3 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-3"
                            >
                              <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-white/43">
                                {item.label}
                              </dt>
                              <dd className="text-sm font-medium leading-6 text-white/84">
                                {item.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="mt-5 text-sm leading-6 text-white/58">
                          Detajet e projektit nuk jane plotesuar ende.
                        </p>
                      )}

                      <Link
                        href="/contact#contact-form"
                        className="mt-4 inline-flex w-full justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold tracking-wide text-[#112734] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                      >
                        Na kontaktoni
                      </Link>
                    </aside>
                  </Reveal>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
                  <Reveal>
                    <article className={`${cardClassName} p-5 md:p-6`}>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                        Pershkrimi
                      </p>
                      {project.description ? (
                        <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-7 text-white/74 md:text-base md:leading-8">
                          {project.description}
                        </p>
                      ) : (
                        <p className="mt-4 text-base leading-8 text-white/58">
                          Detajet e pershkrimit nuk jane shtuar ende.
                        </p>
                      )}
                    </article>
                  </Reveal>

                  <Reveal delay={0.06}>
                    <div className={`${cardClassName} p-5 md:p-6`}>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                        Hapi tjeter
                      </p>
                      <h2 className="mt-3 text-xl font-semibold leading-tight tracking-tight text-white">
                        Le te flasim per projektin tuaj.
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-white/68">
                        Diskutoni nevojat, materialet dhe drejtimin e hapesires tuaj me ekipin tone.
                      </p>
                      <Link
                        href="/contact#contact-form"
                        className="mt-5 inline-flex rounded-full border border-white/20 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/36 hover:bg-white hover:text-[#112734]"
                      >
                        Na kontaktoni
                      </Link>
                    </div>
                  </Reveal>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
