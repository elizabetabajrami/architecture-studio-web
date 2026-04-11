import { useState } from "react";
import Link from "next/link";
import { Syne } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthFormCard from "@/components/auth/AuthFormCard";
import AuthTextField from "@/components/auth/AuthTextField";

const heading = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const next: FieldErrors = {};

    if (!email.trim()) {
      next.email = "Emaili është i detyrueshëm.";
    } else if (!emailRegex.test(email.trim())) {
      next.email = "Ju lutem shkruani një adresë email të vlefshme.";
    }

    if (!password) {
      next.password = "Fjalëkalimi është i detyrueshëm.";
    } else if (password.length < 8) {
      next.password = "Fjalëkalimi duhet të ketë të paktën 8 karaktere.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    /* UI vetëm — integrimi me backend vjen më vonë */
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />
      <main className="relative flex min-h-[calc(100vh-1px)] flex-col">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(255,255,255,0.09),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.05),transparent_45%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-28 md:px-8 md:py-32">
          <AuthFormCard
            title={
              <span className={heading.className}>Mirë se erdhe përsëri</span>
            }
            subtitle="Kyçu për të vazhduar me projektet dhe hapësirat tuaja."
          >
            <form className="space-y-7" onSubmit={handleSubmit} noValidate>
              <AuthTextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="emri@shembull.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <AuthTextField
                label="Fjalëkalimi"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />

              <button
                type="submit"
                className="w-full rounded-full bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-[#112734] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              >
                Hyr
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/68">
              Nuk ke llogari?{" "}
              <Link
                href="/register"
                className="font-medium text-white/92 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
              >
                Regjistrohu
              </Link>
            </p>
          </AuthFormCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
