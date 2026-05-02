"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { useEffect, useMemo, useState } from "react";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

type PortfolioItem = {
  _id: string;
  title: string;
  category: string;
  mainImage?: string;
  imageUrl?: string;
  description?: string;
};

const categories = [
  "Të gjitha",
  "Interier",
  "Arkitekturë",
  "Lokale",
  "Rendera 3D",
  "Renovim",
];

export default function PortfolioPreview() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Të gjitha");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/portfolio", {
          cache: "no-store",
        });

        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "Të gjitha") return items;

    return items.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [activeCategory, items]);

  return (
    <section
      id="portfolio"
      className="scroll-mt-24 px-6 py-12 md:px-8 md:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.25em] text-white/58">
            Portofolio
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl">
                Projektet e përzgjedhura
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/62">
                Eksploro projektet sipas kategorive kryesore të studios.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-7 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "border-white bg-white text-[#112734]"
                    : "border-white/15 bg-white/[0.04] text-white/72 hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="mt-10 rounded-[24px] border border-white/10 bg-white/[0.04] p-8 text-white/65">
            Duke u ngarkuar projektet...
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.045] p-10 text-center shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]">
            <p className="text-lg font-semibold text-white">
              Ende nuk ka projekte në këtë kategori.
            </p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Kur admini shton projekte nga dashboard-i, ato do të shfaqen
              automatikisht këtu.
            </p>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item, index) => (
              <Reveal key={item._id} delay={index * 0.04}>
                <motion.article
                  className="group relative h-[360px] overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.04] shadow-[0_24px_70px_-22px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/[0.04] transition-colors duration-500 ease-out hover:border-white/22 hover:shadow-[0_32px_80px_-18px_rgba(0,0,0,0.6)]"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.28 }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.06,
                    ease: easeOutExpo,
                  }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.32, ease: easeOutExpo },
                  }}
                >
                  <img
                    src={item.mainImage || item.imageUrl || ""}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/30 to-black/10 transition-opacity duration-500 group-hover:from-black/82" />

                  <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl">
                    {item.category}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-2xl font-semibold tracking-tight text-white">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/68">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-5 text-xs uppercase tracking-[0.25em] text-white/70 transition-colors duration-300 group-hover:text-white">
                      Shiko detajet
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
