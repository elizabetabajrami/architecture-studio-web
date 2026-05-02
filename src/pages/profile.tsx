import { FormEvent, useCallback, useEffect, useState } from "react";
import { Syne } from "next/font/google";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const heading = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
});

type User = {
  name: string;
  email: string;
  role: "user" | "admin";
};

type FavoriteProject = {
  _id: string;
  title: string;
  category: string;
  mainImage?: string;
  imageUrl?: string;
};

const API_URL = "http://localhost:5000/api";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [favorites, setFavorites] = useState<FavoriteProject[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState("");
  const [removingFavoriteId, setRemovingFavoriteId] = useState("");

  const fetchProfile = useCallback(async (token: string, showLoading = true) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (showLoading) setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setUser(data.user);
      setFormName(data.user.name || "");
      setFormEmail(data.user.email || "");
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error(err);
      setError("Nuk mund të ngarkohet profili.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async (token: string) => {
    if (!token) return;

    setFavoritesLoading(true);
    setFavoritesError("");

    try {
      const response = await fetch(`${API_URL}/users/me/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setFavorites([]);
        setFavoritesError("Projektet e preferuara nuk mund të ngarkohen.");
        return;
      }

      const data = await response.json();
      setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
    } catch (err) {
      console.error(err);
      setFavorites([]);
      setFavoritesError("Projektet e preferuara nuk mund të ngarkohen.");
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchProfile(token || "");
    fetchFavorites(token || "");
  }, [fetchFavorites, fetchProfile]);

  const handleEdit = () => {
    if (!user) return;

    setFormName(user.name);
    setFormEmail(user.email);
    setFormError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setFormName(user.name);
      setFormEmail(user.email);
    }

    setFormError("");
    setIsEditing(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formName.trim();
    const email = formEmail.trim();

    setFormError("");
    setSuccess("");

    if (!name || !email) {
      setFormError("Emri dhe emaili janë të detyrueshëm.");
      return;
    }

    if (!emailRegex.test(email)) {
      setFormError("Ju lutem shkruani një adresë email të vlefshme.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setFormError(data?.message || "Profili nuk mund të përditësohet.");
        return;
      }

      await fetchProfile(token, false);
      setIsEditing(false);
      setSuccess(data?.message || "Profili u përditësua me sukses.");
    } catch (err) {
      console.error(err);
      setFormError("Kërkesa dështoi. Ju lutem provoni përsëri.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleRemoveFavorite = async (projectId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setRemovingFavoriteId(projectId);

    try {
      const response = await fetch(
        `${API_URL}/users/me/favorites/${encodeURIComponent(projectId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        setFavoritesError("Projekti nuk mund të hiqet nga lista.");
        return;
      }

      const data = await response.json();
      setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
    } catch (err) {
      console.error(err);
      setFavoritesError("Projekti nuk mund të hiqet nga lista.");
    } finally {
      setRemovingFavoriteId("");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />

      <main className="relative flex min-h-[calc(100vh-120px)] flex-col">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(255,255,255,0.09),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_60%,rgba(255,255,255,0.05),transparent_42%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pb-8 pt-24 md:px-8 md:pb-10 md:pt-28">
          <section className="w-full max-w-lg overflow-hidden rounded-[24px] border border-white/12 bg-white/[0.05] p-5 text-white shadow-[0_20px_58px_-22px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-white/58">
              Profili
            </p>
            <h1
              className={`${heading.className} mt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl`}
            >
              Llogaria ime
            </h1>

            {loading ? (
              <p className="mt-5 text-sm leading-6 text-white/65">
                Duke u ngarkuar profili...
              </p>
            ) : error ? (
              <p className="mt-5 rounded-2xl border border-rose-200/20 bg-rose-300/10 px-4 py-3 text-sm leading-6 text-rose-100">
                {error}
              </p>
            ) : user ? (
              <>
                {success ? (
                  <p className="mt-4 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 px-4 py-2.5 text-sm text-emerald-100">
                    {success}
                  </p>
                ) : null}

                <div className="mt-5 flex items-center gap-3 border-b border-white/10 pb-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-[#112734] shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-white">
                      {user.name}
                    </p>
                    <p className="mt-1 text-sm text-white/58">{user.email}</p>
                  </div>
                </div>

                {isEditing ? (
                  <form className="mt-5 grid gap-3.5" onSubmit={handleSave} noValidate>
                    <ProfileField
                      label="Emri"
                      name="name"
                      value={formName}
                      onChange={setFormName}
                      autoComplete="name"
                    />
                    <ProfileField
                      label="Email"
                      name="email"
                      type="email"
                      value={formEmail}
                      onChange={setFormEmail}
                      autoComplete="email"
                    />
                    <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/48">
                        Roli
                      </p>
                      <p className="mt-1.5 text-sm font-medium capitalize text-white/88">
                        {user.role}
                      </p>
                    </div>

                    {formError ? (
                      <p className="rounded-2xl border border-rose-200/20 bg-rose-300/10 px-4 py-3 text-sm leading-6 text-rose-100">
                        {formError}
                      </p>
                    ) : null}

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold tracking-wide text-[#112734] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-lg disabled:cursor-not-allowed disabled:opacity-65"
                      >
                        {saving ? "Duke ruajtur..." : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="inline-flex justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-semibold tracking-wide text-white/82 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/10 hover:text-white active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5 grid gap-2.5">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/48">
                        Emri
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-white/88">
                        {user.name}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/48">
                        Email
                      </p>
                      <p className="mt-1.5 text-sm font-medium text-white/88">
                        {user.email}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3">
                      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/48">
                        Roli
                      </p>
                      <p className="mt-1.5 text-sm font-medium capitalize text-white/88">
                        {user.role}
                      </p>
                    </div>
                  </div>
                )}

                {!isEditing ? (
                  <>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="inline-flex justify-center rounded-full border border-white/18 px-6 py-3 text-sm font-semibold tracking-wide text-white/82 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/10 hover:text-white active:translate-y-0"
                      >
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold tracking-wide text-[#112734] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                      >
                        Logout
                      </button>
                    </div>

                    <section className="mt-6 border-t border-white/10 pt-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/48">
                            Projektet e preferuara
                          </p>
                          <p className="mt-1 text-sm text-white/58">
                            {favorites.length} projekte te ruajtura
                          </p>
                        </div>
                      </div>

                      {favoritesLoading ? (
                        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-white/62">
                          Duke u ngarkuar...
                        </p>
                      ) : favoritesError ? (
                        <p className="mt-4 rounded-2xl border border-rose-200/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                          {favoritesError}
                        </p>
                      ) : favorites.length === 0 ? (
                        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-white/62">
                          Nuk keni ruajtur ende projekte te preferuara.
                        </p>
                      ) : (
                        <div className="mt-4 grid max-h-64 gap-3 overflow-y-auto pr-1">
                          {favorites.map((project) => (
                            <article
                              key={project._id}
                              className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-2.5"
                            >
                              <div className="h-16 w-16 overflow-hidden rounded-xl bg-white/[0.06]">
                                {project.mainImage || project.imageUrl ? (
                                  <img
                                    src={project.mainImage || project.imageUrl}
                                    alt={project.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                  {project.title}
                                </p>
                                <p className="mt-1 truncate text-xs uppercase tracking-[0.16em] text-white/48">
                                  {project.category}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Link
                                    href={`/projects/${encodeURIComponent(project._id)}`}
                                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#112734] transition hover:bg-white/92"
                                  >
                                    Shiko
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFavorite(project._id)}
                                    disabled={removingFavoriteId === project._id}
                                    className="rounded-full border border-white/16 px-3 py-1.5 text-xs font-semibold text-white/74 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    Hiq
                                  </button>
                                </div>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  </>
                ) : null}
              </>
            ) : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProfileField({
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={name}
        className="text-[0.68rem] uppercase tracking-[0.2em] text-white/48"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-medium text-white/88 outline-none transition placeholder:text-white/35 focus:border-white/30 focus:bg-white/[0.075] focus:ring-2 focus:ring-white/10"
      />
    </div>
  );
}
