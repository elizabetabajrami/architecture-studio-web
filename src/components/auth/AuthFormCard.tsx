import type { ReactNode } from "react";

type AuthFormCardProps = {
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
};

export default function AuthFormCard({
  title,
  subtitle,
  children,
}: AuthFormCardProps) {
  return (
    <div className="group relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] px-8 py-12 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.07] before:to-transparent before:opacity-70 hover:border-white/16 md:px-10 md:py-14">
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.28em] text-white/58">
          Alkos Group
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-[2rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/72 md:text-[0.95rem]">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
