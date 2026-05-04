"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import {
  allPortfolioCategoriesLabel,
  portfolioCategories,
} from "@/data/portfolioCategories";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];
const API_URL = "http://localhost:5000/api";

type PortfolioItem = {
  _id: string;
  title: string;
  category: string;
  mainImage?: string;
  imageUrl?: string;
  description?: string;
};

type PortfolioPreviewProps = {
  initialItems?: PortfolioItem[];
};

export default function PortfolioPreview({ initialItems = [] }: PortfolioPreviewProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState(allPortfolioCategoriesLabel);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoritingId, setFavoritingId] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (initialItems.length > 0) setLoading(false);

      try {
        const response = await fetch(`${API_URL}/portfolio`, {
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
  }, [initialItems.length]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setFavoriteIds(
          Array.isArray(data.favorites)
            ? data.favorites.map((item: PortfolioItem) => item._id)
            : [],
        );
      } catch (error) {
        console.error("Failed to load favorite projects:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavorite = async (
    event: MouseEvent<HTMLButtonElement>,
    projectId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const isFavorite = favoriteIds.includes(projectId);
    setFavoritingId(projectId);

    try {
      const response = await fetch(
        `${API_URL}/users/me/favorites/${encodeURIComponent(projectId)}`,
        {
          method: isFavorite ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: isFavorite ? undefined : JSON.stringify({}),
        },
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) return;

      const data = await response.json();
      setFavoriteIds(
        Array.isArray(data.favorites)
          ? data.favorites.map((item: PortfolioItem) => item._id)
          : [],
      );
    } catch (error) {
      console.error("Failed to update favorite project:", error);
    } finally {
      setFavoritingId("");
    }
  };

  const filteredItems = useMemo(() => {
    if (activeCategory === allPortfolioCategoriesLabel) return items;

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
              <h2 className="max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
                Projektet e përzgjedhura
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/62">
                Eksploro projektet sipas kategorive kryesore të studios.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-7 flex flex-wrap gap-3">
          {[allPortfolioCategoriesLabel, ...portfolioCategories].map((category) => {
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
            {filteredItems.map((item, index) => {
              const isFavorite = favoriteIds.includes(item._id);

              return (
                <Reveal key={item._id} delay={index * 0.04}>
                  <motion.article
                    className="group relative h-[320px] overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.04] shadow-[0_24px_70px_-22px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/[0.04] transition-colors duration-500 ease-out hover:border-white/22 hover:shadow-[0_32px_80px_-18px_rgba(0,0,0,0.6)] sm:h-[360px]"
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
                    <Link
                      href={`/projects/${encodeURIComponent(item._id)}`}
                      className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/45"
                      aria-label={`Shiko detajet e projektit ${item.title}`}
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
                    </Link>
                    <button
                      type="button"
                      onClick={(event) => handleFavorite(event, item._id)}
                      disabled={favoritingId === item._id}
                      className={`absolute right-5 top-5 z-10 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-xl transition-all duration-300 ${
                        isFavorite
                          ? "border-white bg-white text-[#112734]"
                          : "border-white/20 bg-black/25 text-white/84 hover:border-white/40 hover:bg-white/12 hover:text-white"
                      } disabled:cursor-not-allowed disabled:opacity-65`}
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite
                          ? `Hiq ${item.title} nga projektet e preferuara`
                          : `Ruaj ${item.title} te projektet e preferuara`
                      }
                    >
                      {isFavorite ? "SAVED" : "SAVE"}
                    </button>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
