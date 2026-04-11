type ButtonProps = {
  text: string;
};

export default function Button({ text }: ButtonProps) {
  return (
    <button
      type="button"
      className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-[#112734] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
    >
      {text}
    </button>
  );
}