import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Syne } from "next/font/google";
import { portfolioCategories } from "@/data/portfolioCategories";

const heading = Syne({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const API_URL = "http://localhost:5000/api";
const tabs = ["Overview", "Users", "Messages", "Projects"] as const;

type Tab = (typeof tabs)[number];

type AdminUser = {
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
};

type ContactMessage = {
  _id: string;
  fullName?: string;
  name?: string;
  email: string;
  phone?: string;
  projectType?: string;
  type?: string;
  location?: string;
  message: string;
  description?: string;
  preferredContact?: string;
  contactMethod?: string;
  createdAt?: string;
};

type Project = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  location: string;
  year: string;
  client: string;
  area: string;
  status: string;
  mainImage: string;
  imageUrl?: string;
  images: string[];
  isFeatured: boolean;
  createdAt?: string;
};

type ProjectFiles = {
  mainImageFile: File | null;
  galleryFiles: File[];
};

const emptyProject: Project = {
  title: "",
  category: portfolioCategories[0],
  description: "",
  location: "",
  year: "",
  client: "",
  area: "",
  status: "",
  mainImage: "",
  images: [],
  isFeatured: false,
};

const inputClass =
  "w-full rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/36 focus:border-white/32 focus:bg-white/[0.09] focus:ring-2 focus:ring-white/10";

const labelClass = "text-xs font-medium uppercase tracking-[0.18em] text-white/55";

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    [token],
  );

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!savedToken || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
      return;
    }

    setToken(savedToken);
    setAdmin(user);
  }, [router]);

  const loadDashboardData = useCallback(async (currentToken = token) => {
    if (!currentToken) return;
    setLoading(true);

    try {
      const headers = { Authorization: `Bearer ${currentToken}` };
      const [projectRes, userRes, messageRes] = await Promise.all([
        fetch(`${API_URL}/portfolio`, { cache: "no-store" }),
        fetch(`${API_URL}/users`, { headers, cache: "no-store" }),
        fetch(`${API_URL}/contact`, { headers, cache: "no-store" }),
      ]);

      const [projectData, userData, messageData] = await Promise.all([
        projectRes.json(),
        userRes.json(),
        messageRes.json(),
      ]);

      setProjects(Array.isArray(projectData) ? projectData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setMessages(Array.isArray(messageData) ? messageData : []);
    } catch (error) {
      console.error("Dashboard load failed:", error);
      setNotice("Dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadDashboardData(token);
  }, [loadDashboardData, token]);

  const deleteMessage = async (id: string) => {
    await fetch(`${API_URL}/contact/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    await loadDashboardData();
  };

  const updateUserRole = async (id: string, role: AdminUser["role"]) => {
    const response = await fetch(`${API_URL}/users/${id}/role`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify({ role }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setNotice(data?.message || "User role could not be updated.");
      return;
    }

    setNotice(data?.message || "User role updated.");
    await loadDashboardData();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setNotice(data?.message || "User could not be deleted.");
      return;
    }

    setNotice(data?.message || "User deleted.");
    await loadDashboardData();
  };

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a272f] text-white">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} admin={admin}>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-white/55">
            Admin Panel
          </p>
          <h1 className={`${heading.className} mt-3 text-4xl font-semibold text-white md:text-5xl`}>
            Dashboard
          </h1>
        </div>
        <Link
          href="/"
          className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/82 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
        >
          View website
        </Link>
      </div>

      {notice ? (
        <div className="mb-5 rounded-2xl border border-white/12 bg-white/[0.06] px-5 py-4 text-sm text-white/72">
          {notice}
        </div>
      ) : null}

      {activeTab === "Overview" && (
        <Overview users={users} messages={messages} projects={projects} loading={loading} />
      )}
      {activeTab === "Users" && (
        <UsersTable
          users={users}
          loading={loading}
          currentAdminId={admin._id}
          onRoleChange={updateUserRole}
          onDelete={deleteUser}
        />
      )}
      {activeTab === "Messages" && (
        <MessagesTable messages={messages} loading={loading} onDelete={deleteMessage} />
      )}
      {activeTab === "Projects" && (
        <ProjectsPanel
          projects={projects}
          headers={authHeaders}
          reload={loadDashboardData}
          setNotice={setNotice}
        />
      )}
    </AdminLayout>
  );
}

function AdminLayout({
  activeTab,
  setActiveTab,
  admin,
  children,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  admin: AdminUser;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a272f] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(255,255,255,0.1),transparent),radial-gradient(circle_at_88%_20%,rgba(255,255,255,0.06),transparent_28%)]" />
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] gap-6 px-4 py-5 md:grid-cols-[260px_1fr] md:px-6">
        <aside className="rounded-[28px] border border-white/12 bg-white/[0.06] p-5 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.7)] backdrop-blur-2xl md:sticky md:top-5 md:h-[calc(100vh-40px)]">
          <div className="border-b border-white/10 pb-5">
            <p className="text-lg font-semibold tracking-[0.2em]">ALKOS</p>
            <p className="text-xs uppercase tracking-[0.32em] text-white/58">Admin</p>
          </div>
          <nav className="mt-5 grid gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-white text-[#112734]"
                    : "border border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
            <p className="text-sm font-semibold">{admin.name}</p>
            <p className="mt-1 break-all text-xs text-white/52">{admin.email}</p>
          </div>
        </aside>
        <main className="py-2 md:py-4">{children}</main>
      </div>
    </div>
  );
}

function DashboardCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/[0.06] p-6 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-white/50">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Overview({
  users,
  messages,
  projects,
  loading,
}: {
  users: AdminUser[];
  messages: ContactMessage[];
  projects: Project[];
  loading: boolean;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <DashboardCard label="Users" value={loading ? "..." : users.length} />
      <DashboardCard label="Messages" value={loading ? "..." : messages.length} />
      <DashboardCard label="Projects" value={loading ? "..." : projects.length} />
    </div>
  );
}

function UsersTable({
  users,
  loading,
  currentAdminId,
  onRoleChange,
  onDelete,
}: {
  users: AdminUser[];
  loading: boolean;
  currentAdminId?: string;
  onRoleChange: (id: string, role: AdminUser["role"]) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <TableShell title="Registered users">
      {loading ? <EmptyText>Loading users...</EmptyText> : null}
      {!loading && users.length === 0 ? <EmptyText>No users found.</EmptyText> : null}
      {!loading && users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-white/48">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Change role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => {
                const userId = user._id || "";
                const isCurrentAdmin = Boolean(currentAdminId && userId === currentAdminId);

                return (
                  <tr key={user._id || user.email} className="text-white/76">
                    <td className="px-4 py-4 font-medium text-white">{user.name}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-xs font-semibold capitalize text-white/80">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        disabled={!userId}
                        onChange={(event) =>
                          onRoleChange(userId, event.target.value as AdminUser["role"])
                        }
                        className="rounded-2xl border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition focus:border-white/32 focus:bg-white/[0.09]"
                      >
                        <option value="user" className="bg-[#1a272f] text-white">
                          user
                        </option>
                        <option value="admin" className="bg-[#1a272f] text-white">
                          admin
                        </option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        disabled={!userId || isCurrentAdmin}
                        onClick={() => onDelete(userId)}
                        className="rounded-full border border-rose-200/25 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/12 disabled:cursor-not-allowed disabled:opacity-45"
                        title={isCurrentAdmin ? "You cannot delete the current admin" : undefined}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </TableShell>
  );
}

function MessagesTable({
  messages,
  loading,
  onDelete,
}: {
  messages: ContactMessage[];
  loading: boolean;
  onDelete: (id: string) => void;
}) {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  return (
    <TableShell title="Contact messages">
      {loading ? <EmptyText>Loading messages...</EmptyText> : null}
      {!loading && messages.length === 0 ? <EmptyText>No messages found.</EmptyText> : null}
      <div className="grid gap-4">
        {!loading &&
          messages.map((message) => (
            <article key={message._id} className="rounded-2xl border border-white/10 bg-black/10 p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {message.fullName || message.name || "Unknown"}
                  </h3>
                  <p className="mt-1 text-sm text-white/58">
                    {message.email}
                    {message.phone ? ` · ${message.phone}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-white/52">
                    Project type: {message.projectType || message.type || "-"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.16em] text-white/42">
                    {formatDate(message.createdAt)}
                  </span>
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="rounded-full border border-white/18 px-4 py-2 text-xs font-semibold text-white/78 transition hover:bg-white/10 hover:text-white"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDelete(message._id)}
                    className="rounded-full border border-rose-200/25 px-4 py-2 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/12"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>
      {selectedMessage ? (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      ) : null}
    </TableShell>
  );
}

function MessageDetailModal({
  message,
  onClose,
}: {
  message: ContactMessage;
  onClose: () => void;
}) {
  const details = [
    { label: "Emri dhe mbiemri", value: message.fullName || message.name || "-" },
    { label: "Email", value: message.email || "-" },
    { label: "Numri i telefonit", value: message.phone || "-" },
    { label: "Lloji i projektit", value: message.projectType || message.type || "-" },
    { label: "Lokacioni i projektit", value: message.location || "-" },
    {
      label: "Mënyra e preferuar e kontaktit",
      value: message.preferredContact || message.contactMethod || "-",
    },
    { label: "Dërguar", value: formatDate(message.createdAt) },
  ];

  return (
  <>
    <div className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-md" />

    <div className="fixed left-1/2 top-1/2 z-[99999] max-h-[82vh] w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-white/12 bg-[#1a272f]/95 p-6 shadow-2xl">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">
              Contact request
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {message.fullName || message.name || "Message details"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/18 px-5 py-2.5 text-sm font-semibold text-white/78 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-white/42">
                {detail.label}
              </p>
              <p className="mt-2 break-words text-sm font-medium text-white/82">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/42">
            Përshkrimi i projektit
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/76">
            {message.description || message.message || "-"}
          </p>
        </div>
      </div>
       
  </>
);
}

function ProjectsPanel({
  projects,
  headers,
  reload,
  setNotice,
}: {
  projects: Project[];
  headers: Record<string, string>;
  reload: () => Promise<void>;
  setNotice: (value: string) => void;
}) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const saveProject = async (project: Project, files: ProjectFiles) => {
    const method = project._id ? "PUT" : "POST";
    const url = project._id ? `${API_URL}/portfolio/${project._id}` : `${API_URL}/portfolio`;
    const body = new FormData();

    body.append("title", project.title);
    body.append("category", project.category);
    body.append("description", project.description);
    body.append("location", project.location);
    body.append("year", project.year);
    body.append("client", project.client);
    body.append("area", project.area);
    body.append("status", project.status);
    body.append("isFeatured", String(project.isFeatured));
    body.append("existingImages", JSON.stringify(project.images.filter(Boolean)));

    if (project.mainImage) {
      body.append("mainImage", project.mainImage);
      body.append("imageUrl", project.mainImage);
    }

    if (files.mainImageFile) {
      body.append("mainImage", files.mainImageFile);
    }

    files.galleryFiles.forEach((file) => {
      body.append("images", file);
    });

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: headers.Authorization,
      },
      body,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Project could not be saved.");
    }

    setEditingProject(null);
    setNotice(project._id ? "Project updated." : "Project created.");
    await reload();
  };

  const deleteProject = async (id: string) => {
    const response = await fetch(`${API_URL}/portfolio/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setNotice(data?.message || "Project could not be deleted.");
      return;
    }

    setNotice("Project deleted.");
    await reload();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.2fr)]">
      <ProjectForm
        key={editingProject?._id || "new"}
        project={editingProject || emptyProject}
        onSubmit={saveProject}
        onCancel={() => setEditingProject(null)}
      />
      <ProjectsTable projects={projects} onEdit={setEditingProject} onDelete={deleteProject} />
    </div>
  );
}

function ProjectForm({
  project,
  onSubmit,
  onCancel,
}: {
  project: Project;
  onSubmit: (project: Project, files: ProjectFiles) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Project>({
    ...project,
    mainImage: project.mainImage || project.imageUrl || "",
    images: project.images?.length ? project.images : [],
  });
  const [saving, setSaving] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const updateField = (field: keyof Project, value: string | boolean | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    if (!mainImageFile) {
      setMainImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(mainImageFile);
    setMainImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [mainImageFile]);

  useEffect(() => {
    const objectUrls = galleryFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryFiles]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form, { mainImageFile, galleryFiles });
      setForm(emptyProject);
      setMainImageFile(null);
      setGalleryFiles([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-[28px] border border-white/12 bg-white/[0.06] p-5 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.65)] backdrop-blur-2xl md:p-6">
      <h2 className="text-2xl font-semibold">{form._id ? "Edit project" : "Add new project"}</h2>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <Field label="Title" value={form.title} onChange={(value) => updateField("title", value)} required />
        <div className="grid gap-2">
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            {portfolioCategories.map((category) => (
              <option key={category} value={category} className="bg-[#1a272f]">
                {category}
              </option>
            ))}
          </select>
        </div>
        <TextArea label="Description" value={form.description} onChange={(value) => updateField("description", value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Location" value={form.location} onChange={(value) => updateField("location", value)} />
          <Field label="Year" value={form.year} onChange={(value) => updateField("year", value)} />
          <Field label="Client" value={form.client} onChange={(value) => updateField("client", value)} />
          <Field label="Area" value={form.area} onChange={(value) => updateField("area", value)} />
        </div>
        <Field label="Status" value={form.status} onChange={(value) => updateField("status", value)} />

        <div className="grid gap-3">
          <label className={labelClass}>Main image file</label>
          <input
            type="file"
            accept="image/*"
            required={!form._id && !form.mainImage}
            onChange={(event) => setMainImageFile(event.target.files?.[0] || null)}
            className={inputClass}
          />
          {(mainImagePreview || form.mainImage || form.imageUrl) ? (
            <img
              src={mainImagePreview || form.mainImage || form.imageUrl}
              alt="Main image preview"
              className="h-48 w-full rounded-2xl border border-white/10 object-cover"
            />
          ) : null}
        </div>

        <div className="grid gap-3">
          <label className={labelClass}>Gallery image files</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => setGalleryFiles(Array.from(event.target.files || []))}
            className={inputClass}
          />
          {form.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {form.images.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="Existing gallery image"
                  className="h-24 w-full rounded-2xl border border-white/10 object-cover"
                />
              ))}
            </div>
          ) : null}
          {galleryPreviews.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galleryPreviews.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="Selected gallery preview"
                  className="h-24 w-full rounded-2xl border border-white/10 object-cover"
                />
              ))}
            </div>
          ) : null}
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/78">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => updateField("isFeatured", event.target.checked)}
          />
          Mark as featured
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#112734] transition hover:bg-white/90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save project"}
          </button>
          {form._id ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white/76 hover:bg-white/10"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function ProjectsTable({
  projects,
  onEdit,
  onDelete,
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        categoryFilter === "All" || project.category === categoryFilter;
      const searchable = [
        project.title,
        project.category,
        project.location,
        project.year,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [categoryFilter, projects, search]);

  return (
    <TableShell title="Portfolio projects">
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title, category, location, year"
          className={inputClass}
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className={inputClass}
        >
          {["All", ...portfolioCategories].map((category) => (
            <option key={category} value={category} className="bg-[#1a272f] text-white">
              {category}
            </option>
          ))}
        </select>
      </div>
      {projects.length === 0 ? <EmptyText>No projects found.</EmptyText> : null}
      {projects.length > 0 && filteredProjects.length === 0 ? (
        <EmptyText>No projects match this search.</EmptyText>
      ) : null}
      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <article key={project._id} className="grid gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 md:grid-cols-[120px_1fr]">
            <img
              src={project.mainImage || project.imageUrl || ""}
              alt={project.title}
              className="h-28 w-full rounded-xl object-cover md:w-28"
            />
            <div>
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="mt-1 text-sm text-white/55">
                    {project.category}
                    {project.location ? ` · ${project.location}` : ""}
                    {project.year ? ` · ${project.year}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(project)} className="rounded-full border border-white/18 px-4 py-2 text-xs font-semibold text-white/76 hover:bg-white/10">
                    Edit
                  </button>
                  <button onClick={() => project._id && onDelete(project._id)} className="rounded-full border border-rose-200/25 px-4 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-300/12">
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/65">{project.description}</p>
              {project.isFeatured ? (
                <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#112734]">
                  Featured
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </TableShell>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className={labelClass}>{label}</label>
      <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <label className={labelClass}>{label}</label>
      <textarea className={`${inputClass} min-h-28 resize-y`} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function TableShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[28px] border border-white/12 bg-white/[0.06] p-5 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.65)] backdrop-blur-2xl md:p-6">
      <h2 className="mb-5 text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-white/10 bg-black/10 p-5 text-sm text-white/58">{children}</p>;
}
