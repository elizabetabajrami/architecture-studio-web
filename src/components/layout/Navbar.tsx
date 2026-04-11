import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-90"
        >
          <Image
            src="/logo.jpg"
            alt="Alkos Group Logo"
            width={50}
            height={50}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold tracking-[0.2em] text-white">
              ALKOS
            </p>
            <p className="text-xs uppercase tracking-[0.35em] text-white/80">
              Group
            </p>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="hidden items-center gap-10 md:flex">
          {/* NAV LINKS */}
          <nav className="flex items-center gap-8 text-sm font-medium">
            <a
              href="#about"
              className="text-white/92 transition-colors duration-300 ease-out hover:text-white"
            >
              Rreth nesh
            </a>
            <a
              href="#services"
              className="text-white/92 transition-colors duration-300 ease-out hover:text-white"
            >
              Shërbimet
            </a>
            <a
              href="#portfolio"
              className="rounded-full bg-white px-5 py-2.5 text-[#112734] shadow-[0_8px_28px_-6px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:bg-white/95 hover:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.4)]"
            >
              Portofolio
            </a>
            <a
              href="#contact"
              className="text-white/92 transition-colors duration-300 ease-out hover:text-white"
            >
              Kontakti
            </a>
          </nav>

          {/* LOGIN / REGISTER */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-medium text-white/95 transition-all duration-300 ease-out hover:border-white/35 hover:bg-white/[0.08]"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#112734] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out hover:bg-white/95 hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.4)]"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
