import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

type User = {
  name: string;
  email: string;
  role: "user" | "admin";
};

const SECTION_LINKS = [
  { id: "about" as const, href: "/#about", label: "Rreth nesh" },
  { id: "services" as const, href: "/#services", label: "Shërbimet" },
  { id: "portfolio" as const, href: "/#portfolio", label: "Portofolio" },
  { id: "contact" as const, href: "/#contact", label: "Kontakti" },
];

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

export default function Navbar() {
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const frame = window.requestAnimationFrame(() => setUser(parsedUser));

      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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
    const frame = window.requestAnimationFrame(updateActiveSection);

    return () => window.cancelAnimationFrame(frame);
  }, [router.pathname, router.asPath, updateActiveSection]);

  useEffect(() => {
    const onDone = () => {
      updateActiveSection();
      setMenuOpen(false);
    };

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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8 md:py-5">
        <motion.div whileHover={{ opacity: 0.92 }} whileTap={{ scale: 0.985 }}>
          <Link href="/" className="flex items-center gap-3 transition-opacity duration-300">
            <Image
              src="/logo.png"
              alt="Alkos Group Logo"
              width={50}
              height={50}
              className="h-11 w-11 rounded-full object-cover md:h-12 md:w-12"
            />

            <div>
              <p className="text-base font-semibold tracking-[0.2em] text-white md:text-lg">
                ALKOS
              </p>
              <p className="text-[0.68rem] uppercase tracking-[0.35em] text-white/80 md:text-xs">
                Group
              </p>
            </div>
          </Link>
        </motion.div>

        <div className="hidden items-center gap-8 lg:flex xl:gap-10">
          <nav className="flex items-center gap-2 text-sm font-medium md:gap-3">
            {SECTION_LINKS.map(({ id, href, label }) => {
              const active = router.pathname === "/" && activeSection === id;

              return (
                <Link
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
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                    }}
                  >
                    {label}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-[#112734] shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {user.role === "admin" ? (
                <Link
                  href="/admin/dashboard"
                  className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#112734]"
                >
                  Dashboard
                </Link>
              ) : null}

              <button
                onClick={handleLogout}
                className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#112734]"
              >
                Logout
              </button>
            </div>
          ) : (
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
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/[0.06] text-white transition-all duration-300 hover:border-white/32 hover:bg-white/[0.1] lg:hidden"
          aria-label="Menu"
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 rounded-full bg-white transition-transform duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 rounded-full bg-white transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 rounded-full bg-white transition-transform duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 px-6 pb-5 pt-3 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2 rounded-[24px] border border-white/12 bg-[#1a272f]/92 p-3 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
            {SECTION_LINKS.map(({ id, href, label }) => {
              const active = router.pathname === "/" && activeSection === id;

              return (
                <Link
                  key={id}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-white/12 text-white"
                      : "text-white/78 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <div className="mt-2 grid gap-2 border-t border-white/10 pt-3">
              {user ? (
                <>
                  {user.role === "admin" ? (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-2xl border border-white/16 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
                    >
                      Dashboard
                    </Link>
                  ) : null}
                  <button
                    onClick={handleLogout}
                    className="rounded-2xl border border-white/16 px-4 py-3 text-left text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.08]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    scroll={false}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isLogin
                        ? "border-white/36 bg-white/10 text-white"
                        : "border-white/16 text-white hover:border-white/30 hover:bg-white/[0.08]"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    scroll={false}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isRegister
                        ? "bg-white/90 text-[#112734]"
                        : "bg-white text-[#112734] hover:bg-white/90"
                    }`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
