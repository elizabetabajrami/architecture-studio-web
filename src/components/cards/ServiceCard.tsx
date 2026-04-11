type ServiceCardProps = {
  title: string;
  description: string;
};

export default function ServiceCard({
  title,
  description,
}: ServiceCardProps) {
  return (
    <div className="group relative h-full overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.05] p-8 shadow-[0_20px_60px_-18px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:bg-gradient-to-br before:from-white/[0.07] before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.08] hover:shadow-[0_28px_70px_-14px_rgba(0,0,0,0.55)] hover:before:opacity-100 md:p-10">
      <div className="relative mb-7 h-12 w-12 rounded-full border border-white/10 bg-white/[0.12] shadow-inner transition-all duration-500 ease-out group-hover:scale-105 group-hover:border-white/15 group-hover:bg-white/[0.16]" />
      <h3 className="relative text-2xl font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="relative mt-4 leading-relaxed text-white/72">{description}</p>
      <div className="relative mt-9 text-sm uppercase tracking-[0.25em] text-white/65 transition-colors duration-300 group-hover:text-white/95">
        Më shumë →
      </div>
    </div>
  );
}