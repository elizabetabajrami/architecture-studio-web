import { useId, type InputHTMLAttributes } from "react";

type AuthTextFieldProps = {
  label: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

export default function AuthTextField({
  label,
  error,
  id: idProp,
  ...inputProps
}: AuthTextFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-[0.2em] text-white/65"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-2xl border bg-white/[0.06] px-4 py-3.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition duration-300 placeholder:text-white/38 focus:bg-white/[0.09] focus:ring-2 focus:ring-white/12 ${
          error
            ? "border-rose-300/45 focus:border-rose-300/55"
            : "border-white/14 focus:border-white/32"
        }`}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="text-xs leading-relaxed text-rose-200/95">
          {error}
        </p>
      ) : null}
    </div>
  );
}
