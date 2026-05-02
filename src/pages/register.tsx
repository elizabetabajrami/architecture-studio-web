import { useState } from "react";
import Link from "next/link";
import { Syne } from "next/font/google";
import { useForm } from "react-hook-form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthFormCard from "@/components/auth/AuthFormCard";
import AuthTextField from "@/components/auth/AuthTextField";

const heading = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SubmitMessage = {
  type: "success" | "error";
  text: string;
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const password = watch("password");

  const clearSubmitMessage = () => setSubmitMessage(null);

  const onSubmit = async ({ fullName, email, password }: RegisterFormValues) => {
    clearSubmitMessage();

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitMessage({
          type: "error",
          text: data.message || "Regjistrimi dështoi.",
        });
        return;
      }

      setSubmitMessage({
        type: "success",
        text: data.message || "User registered successfully",
      });
      reset();

      window.location.assign("/login");
    } catch (error) {
      console.error(error);
      setSubmitMessage({
        type: "error",
        text: "Nuk mund të lidhet me backend.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />
      <main className="relative flex min-h-[calc(100vh-1px)] flex-col">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(255,255,255,0.09),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_55%,rgba(255,255,255,0.05),transparent_45%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-28 md:px-8 md:py-32">
          <AuthFormCard
            title={
              <span className={heading.className}>Krijo llogarinë tënde</span>
            }
            subtitle="Bashkohu me Alkos Group për një përvojë dizajni të qartë dhe të personalizuar."
          >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              {submitMessage ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                    submitMessage.type === "success"
                      ? "border-emerald-200/20 bg-emerald-300/10 text-emerald-100"
                      : "border-rose-200/20 bg-rose-300/10 text-rose-100"
                  }`}
                >
                  {submitMessage.text}
                </div>
              ) : null}

              <AuthTextField
                label="Emri i plotë"
                type="text"
                autoComplete="name"
                placeholder="Emri dhe mbiemri"
                error={errors.fullName?.message}
                {...register("fullName", {
                  required: "Emri i plotë është i detyrueshëm.",
                  minLength: {
                    value: 2,
                    message: "Ju lutem shkruani të paktën 2 karaktere.",
                  },
                  onChange: clearSubmitMessage,
                })}
              />

              <AuthTextField
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="emri@shembull.com"
                error={errors.email?.message}
                {...register("email", {
                  required: "Emaili është i detyrueshëm.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ju lutem shkruani një adresë email të vlefshme.",
                  },
                  onChange: clearSubmitMessage,
                })}
              />

              <AuthTextField
                label="Fjalëkalimi"
                type="password"
                autoComplete="new-password"
                placeholder="Të paktën 8 karaktere"
                error={errors.password?.message}
                {...register("password", {
                  required: "Fjalëkalimi është i detyrueshëm.",
                  minLength: {
                    value: 8,
                    message:
                      "Fjalëkalimi duhet të ketë të paktën 8 karaktere.",
                  },
                  onChange: clearSubmitMessage,
                })}
              />

              <AuthTextField
                label="Konfirmo fjalëkalimin"
                type="password"
                autoComplete="new-password"
                placeholder="Përsërit fjalëkalimin"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Konfirmoni fjalëkalimin.",
                  validate: (value) =>
                    value === password || "Fjalëkalimet nuk përputhen.",
                  onChange: clearSubmitMessage,
                })}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-full bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-[#112734] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
              >
                {isLoading ? "Duke u regjistruar..." : "Regjistrohu"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-white/68">
              Ke llogari?{" "}
              <Link
                href="/login"
                className="font-medium text-white/92 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/50"
              >
                Kyçu
              </Link>
            </p>
          </AuthFormCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
