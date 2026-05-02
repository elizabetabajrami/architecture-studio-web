import { useState } from "react";
import { Syne } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const heading = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const projectTypes = [
  "Banesë",
  "Shtëpi",
  "Lokal afarist",
  "Interier",
  "Renovim",
  "Tjetër",
] as const;

const contactMethods = ["Email", "Telefon", "WhatsApp"] as const;

type ProjectType = (typeof projectTypes)[number];
type ContactMethod = (typeof contactMethods)[number];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  projectType: ProjectType | "";
  otherProjectType: string;
  location: string;
  description: string;
  contactMethod: ContactMethod | "";
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  projectType: "",
  otherProjectType: "",
  location: "",
  description: "",
  contactMethod: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClassName =
  "w-full rounded-2xl border border-white/14 bg-white/[0.06] px-4 py-3.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition duration-300 placeholder:text-white/38 focus:border-white/32 focus:bg-white/[0.09] focus:ring-2 focus:ring-white/12";

const errorClassName =
  "border-rose-300/45 focus:border-rose-300/55 focus:ring-rose-300/10";

const labelClassName =
  "block text-xs font-medium uppercase tracking-[0.2em] text-white/65";

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const setFieldValue = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccessMessage("");

    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Ju lutem shkruani emrin dhe mbiemrin.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Emaili është i detyrueshëm.";
    } else if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = "Ju lutem shkruani një email të vlefshëm.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Numri i telefonit është i detyrueshëm.";
    }

    if (!form.projectType) {
      nextErrors.projectType = "Zgjidhni llojin e projektit.";
    }

    if (form.projectType === "Tjetër" && !form.otherProjectType.trim()) {
      nextErrors.otherProjectType =
        "Ju lutem përshkruani llojin e projektit.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Lokacioni i projektit është i detyrueshëm.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Përshkrimi i projektit është i detyrueshëm.";
    }

    if (!form.contactMethod) {
      nextErrors.contactMethod =
        "Zgjidhni mënyrën e preferuar të kontaktit.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProjectTypeChange = (value: string) => {
    const nextValue = value as ProjectType | "";
    setForm((current) => ({
      ...current,
      projectType: nextValue,
      otherProjectType: nextValue === "Tjetër" ? current.otherProjectType : "",
    }));
    setSuccessMessage("");
    setErrors((current) => {
      const next = { ...current };
      delete next.projectType;
      if (nextValue !== "Tjetër") {
        delete next.otherProjectType;
      }
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const projectType =
      form.projectType === "Tjetër" ? form.otherProjectType.trim() : form.projectType;

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          projectType,
          location: form.location.trim(),
          message: form.description.trim(),
          contactMethod: form.contactMethod,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Contact API error:", response.status, errorText);
        throw new Error(
          errorText || "Dërgimi i formularit nuk u realizua.",
        );
      }

      const data = await response.json();
      console.log("Contact API success:", data);
      setForm(initialFormState);
      setErrors({});
      setSubmitError("");
      setSuccessMessage("Kërkesa juaj u dërgua me sukses!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Diçka shkoi gabim.";
      setSuccessMessage("");
      setSubmitError(message);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(255,255,255,0.09),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.05),transparent_32%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_60%,rgba(255,255,255,0.06),transparent_38%)]" />

        <section
          id="contact-form"
          className="relative z-10 scroll-mt-24 px-6 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-white/58">
                Kërkesë projekti
              </p>
              <h1
                className={`${heading.className} mt-4 text-4xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl`}
              >
                Na tregoni çfarë dëshironi të realizoni.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
                Plotësoni formularin dhe ekipi ynë do t&apos;ju kontaktojë për të
                diskutuar idenë, nevojat dhe drejtimin e projektit tuaj.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
              <div className="group relative overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.05] px-6 py-7 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-colors duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.07] before:to-transparent before:opacity-70 hover:border-white/16 md:px-8 md:py-9">
                <div className="relative">
                  <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
                      Formulari i kontaktit
                    </h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-white/68 md:text-[0.95rem]">
                      Të gjitha fushat kryesore janë të detyrueshme që të mund
                      t&apos;ju përgjigjemi më saktë dhe më shpejt.
                    </p>
                  </div>

                  <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className={labelClassName}>
                          Emri dhe mbiemri
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          autoComplete="name"
                          value={form.fullName}
                          onChange={(event) =>
                            setFieldValue("fullName", event.target.value)
                          }
                          className={`${inputClassName} ${
                            errors.fullName ? errorClassName : ""
                          }`}
                          aria-invalid={Boolean(errors.fullName)}
                        />
                        {errors.fullName ? (
                          <p className="text-xs leading-relaxed text-rose-200/95">
                            {errors.fullName}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className={labelClassName}>
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="emri@shembull.com"
                          value={form.email}
                          onChange={(event) =>
                            setFieldValue("email", event.target.value)
                          }
                          className={`${inputClassName} ${
                            errors.email ? errorClassName : ""
                          }`}
                          aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email ? (
                          <p className="text-xs leading-relaxed text-rose-200/95">
                            {errors.email}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="phone" className={labelClassName}>
                          Numri i telefonit
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+383"
                          value={form.phone}
                          onChange={(event) =>
                            setFieldValue("phone", event.target.value)
                          }
                          className={`${inputClassName} ${
                            errors.phone ? errorClassName : ""
                          }`}
                          aria-invalid={Boolean(errors.phone)}
                        />
                        {errors.phone ? (
                          <p className="text-xs leading-relaxed text-rose-200/95">
                            {errors.phone}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="projectType" className={labelClassName}>
                          Lloji i projektit
                        </label>
                        <select
                          id="projectType"
                          value={form.projectType}
                          onChange={(event) =>
                            handleProjectTypeChange(event.target.value)
                          }
                          className={`${inputClassName} appearance-none ${
                            errors.projectType ? errorClassName : ""
                          }`}
                          aria-invalid={Boolean(errors.projectType)}
                        >
                          <option value="" className="bg-[#1a272f] text-white">
                            Zgjidhni një opsion
                          </option>
                          {projectTypes.map((projectType) => (
                            <option
                              key={projectType}
                              value={projectType}
                              className="bg-[#1a272f] text-white"
                            >
                              {projectType}
                            </option>
                          ))}
                        </select>
                        {errors.projectType ? (
                          <p className="text-xs leading-relaxed text-rose-200/95">
                            {errors.projectType}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {form.projectType === "Tjetër" ? (
                      <div className="space-y-2">
                        <label
                          htmlFor="otherProjectType"
                          className={labelClassName}
                        >
                          Shkruani llojin e projektit
                        </label>
                        <input
                          id="otherProjectType"
                          type="text"
                          value={form.otherProjectType}
                          onChange={(event) =>
                            setFieldValue("otherProjectType", event.target.value)
                          }
                          className={`${inputClassName} ${
                            errors.otherProjectType ? errorClassName : ""
                          }`}
                          aria-invalid={Boolean(errors.otherProjectType)}
                        />
                        {errors.otherProjectType ? (
                          <p className="text-xs leading-relaxed text-rose-200/95">
                            {errors.otherProjectType}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <label htmlFor="location" className={labelClassName}>
                        Lokacioni i projektit
                      </label>
                      <input
                        id="location"
                        type="text"
                        value={form.location}
                        onChange={(event) =>
                          setFieldValue("location", event.target.value)
                        }
                        className={`${inputClassName} ${
                          errors.location ? errorClassName : ""
                        }`}
                        aria-invalid={Boolean(errors.location)}
                      />
                      {errors.location ? (
                        <p className="text-xs leading-relaxed text-rose-200/95">
                          {errors.location}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className={labelClassName}>
                        Përshkrimi i projektit
                      </label>
                      <textarea
                        id="description"
                        rows={6}
                        placeholder="Na tregoni çfarë dëshironi të realizoni..."
                        value={form.description}
                        onChange={(event) =>
                          setFieldValue("description", event.target.value)
                        }
                        className={`${inputClassName} min-h-[164px] resize-y ${
                          errors.description ? errorClassName : ""
                        }`}
                        aria-invalid={Boolean(errors.description)}
                      />
                      {errors.description ? (
                        <p className="text-xs leading-relaxed text-rose-200/95">
                          {errors.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      <p className={labelClassName}>
                        Mënyra e preferuar e kontaktit
                      </p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {contactMethods.map((method) => {
                          const selected = form.contactMethod === method;

                          return (
                            <label
                              key={method}
                              className={`cursor-pointer rounded-2xl border px-4 py-4 text-sm transition-all duration-300 ${
                                selected
                                  ? "border-white/28 bg-white/[0.12] text-white shadow-[0_16px_42px_-20px_rgba(0,0,0,0.45)]"
                                  : "border-white/12 bg-white/[0.04] text-white/72 hover:border-white/22 hover:bg-white/[0.08] hover:text-white"
                              }`}
                            >
                              <input
                                type="radio"
                                name="contactMethod"
                                value={method}
                                checked={selected}
                                onChange={(event) =>
                                  setFieldValue(
                                    "contactMethod",
                                    event.target.value as ContactMethod,
                                  )
                                }
                                className="sr-only"
                              />
                              <span className="block font-medium">{method}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.contactMethod ? (
                        <p className="text-xs leading-relaxed text-rose-200/95">
                          {errors.contactMethod}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold tracking-wide text-[#112734] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                      >
                        Dërgo kërkesën
                      </button>

                      {successMessage ? (
                        <p className="text-sm font-medium text-emerald-200/95">
                          {successMessage}
                        </p>
                      ) : submitError ? (
                        <p className="text-sm font-medium text-rose-200/95">
                          {submitError}
                        </p>
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>

              <aside className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/[0.05] p-6 text-white shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-colors duration-500 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent before:opacity-60 hover:border-white/16 md:p-8">
                <div className="relative flex h-full flex-col">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/58">
                    Alkos Group
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-[2rem]">
                    Le të flasim për projektin tuaj
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/72 md:text-[0.95rem]">
                    Pasi të dërgoni kërkesën, ekipi ynë do t&apos;ju kontaktojë
                    për të kuptuar më mirë projektin dhe për të propozuar hapat
                    e radhës.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                        Email
                      </p>
                      <p className="mt-2 text-sm font-medium text-white/88">
                        info@alkosgroup.com
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                        Tel
                      </p>
                      <p className="mt-2 text-sm font-medium text-white/88">
                        +383 XX XXX XXX
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                        Lokacioni
                      </p>
                      <p className="mt-2 text-sm font-medium text-white/88">
                        Prishtinë, Kosovë
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[28px] border border-white/10 bg-black/10 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <p className="text-sm leading-relaxed text-white/66">
                      Për projekte rezidenciale, komerciale apo interieri, na
                      dërgoni sa më shumë informacion fillestar që të përgatisim
                      një përgjigje sa më të dobishme.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
