import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const SECTION_LINKS = [
  { id: "about" as const, href: "#about", label: "Rreth nesh" },
  { id: "services" as const, href: "#services", label: "Shërbimet" },
  { id: "portfolio" as const, href: "#portfolio", label: "Portofolio" },
  { id: "contact" as const, href: "#contact", label: "Kontakti" },
];

const spring = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const updateActiveSection = useCallback(() => {
    if (router.pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const navOffset = 110;
    const probeY = window.scrollY + navOffset;

    if (window.scrollY < 80) {
      setActiveSection("about");
      return;
    }

    let current: string | null = null;
    for (const { id } of SECTION_LINKS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= probeY) current = id;
    }
    setActiveSection(current ?? SECTION_LINKS[0].id);
  }, [router.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      updateActiveSection();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateActiveSection]);

  useEffect(() => {
    updateActiveSection();
  }, [router.pathname, router.asPath, updateActiveSection]);

  useEffect(() => {
    const onDone = () => updateActiveSection();
    router.events.on("routeChangeComplete", onDone);
    return () => router.events.off("routeChangeComplete", onDone);
  }, [router.events, updateActiveSection]);

  const isLogin = router.pathname === "/login";
  const isRegister = router.pathname === "/register";

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out ${
        scrolled
          ? "border-white/10 bg-[#1a272f]/82 shadow-[0_12px_48px_-14px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          : "border-white/[0.06] bg-black/10 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8 md:py-6">
        {/* LOGO */}
        <motion.div whileHover={{ opacity: 0.92 }} whileTap={{ scale: 0.985 }}>
          <Link href="/" className="flex items-center gap-3 transition-opacity duration-300">
            <Image
              src="/logo.jpg"
              alt="Alkos Group Logo"
              width={50}
              height={50}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold tracking-[0.2em] text-white">ALKOS</p>
              <p className="text-xs uppercase tracking-[0.35em] text-white/80">Group</p>
            </div>
          </Link>
        </motion.div>

        <div className="hidden items-center gap-10 md:flex">
          {/* NAV LINKS */}
          <nav className="flex items-center gap-2 text-sm font-medium md:gap-3">
            {SECTION_LINKS.map(({ id, href, label }) => {
              const active = router.pathname === "/" && activeSection === id;

              return (
                <a
                  key={id}
                  href={href}
                  className="relative inline-flex items-center justify-center rounded-full px-4 py-2.5 outline-none transition-[color,transform] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/35 md:px-5"
                >
                  {active && (
                    <motion.span
                      layoutId="navbar-section-pill"
                      className="absolute inset-0 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl"
                      transition={spring}
                    />
                  )}

                  <motion.span
                    className={`relative z-10 tracking-tight ${
                      active ? "text-white" : "text-white/85"
                    }`}
                    whileHover={
                      active
                        ? { scale: 1.02 }
                        : { y: -1, color: "rgba(255,255,255,1)" }
                    }
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    {label}
                  </motion.span>
                </a>
              );
            })}
          </nav>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              scroll={false}
              className={`relative inline-flex rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "border-white/60 bg-white/10 text-white backdrop-blur-xl"
                  : "border-white/25 text-white/90 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              Login
            </Link>

            <Link
              href="/register"
              scroll={false}
              className={`relative inline-flex rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isRegister
                  ? "bg-white/90 text-[#112734]"
                  : "bg-white text-[#112734] hover:bg-white/90"
              }`}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}