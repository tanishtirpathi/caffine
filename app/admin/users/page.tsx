"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Mail, Plus, Search, ShieldCheck, Trash2, UserPlus, Users, X } from "lucide-react";

type User = {
  _id: string;
  name: string;
  loginId: string;
  mobileNo: string;
  role: "student" | "admin";
  createdAt?: string;
};

type NewUserForm = { name: string; mobileNo: string; password: string; role: "student" | "admin" };

const initialForm: NewUserForm = { name: "", mobileNo: "", password: "", role: "student" };

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<NewUserForm>(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        router.replace("/auth/login");
        return;
      }
      if (!response.ok) throw new Error(data.message || "Unable to load users");
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load users");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => [user.name, user.loginId, user.mobileNo, user.role].some((value) => value.toLowerCase().includes(query)));
  }, [search, users]);

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create user");
      setUsers((current) => [data.user, ...current]);
      setForm(initialForm);
      setShowForm(false);
      setMessage(`User created. Login ID: ${data.user.loginId}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create user");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user: User) => {
    if (!window.confirm(`Delete ${user.name}? Their booking history will also be removed.`)) return;
    setDeletingId(user._id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/users/${user._id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete user");
      setUsers((current) => current.filter((item) => item._id !== user._id));
      setMessage(`${user.name} was deleted successfully.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete user");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#101622]"><ArrowLeft size={16} /> Back to admin dashboard</Link>
        <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B28713]">User management</p><h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Manage campus accounts.</h1><p className="mt-3 max-w-2xl text-slate-500">Create accounts for students or administrators, search the directory, and remove accounts that should no longer have access.</p></div><button type="button" onClick={() => { setShowForm((current) => !current); setError(""); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8B928] px-4 py-3 text-sm font-semibold text-[#101622] transition hover:bg-[#d9ab1e]"><UserPlus size={16} /> {showForm ? "Close form" : "Add user"}</button></header>

        {showForm && <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-[#B28713]">New account</p><h2 className="mt-1 text-2xl font-semibold">Add a user</h2><p className="mt-2 text-sm text-slate-500">The login ID is generated automatically after the account is created.</p></div><button type="button" onClick={() => setShowForm(false)} aria-label="Close add user form" className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-slate-500 hover:bg-slate-50"><X size={17} /></button></div><form onSubmit={createUser} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Full name<input required minLength={2} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Aditi Thakur" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-[#E8B928]" /></label><label className="text-sm font-semibold">Mobile number<input required value={form.mobileNo} onChange={(event) => setForm((current) => ({ ...current, mobileNo: event.target.value }))} placeholder="e.g. 9876543210" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-[#E8B928]" /></label><label className="text-sm font-semibold">Temporary password<input required minLength={8} type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="At least 8 characters" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-[#E8B928]" /></label><label className="text-sm font-semibold">Account type<select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as NewUserForm["role"] }))} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#E8B928]"><option value="student">Student</option><option value="admin">Administrator</option></select></label><div className="sm:col-span-2"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#101622] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263246] disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Creating..." : "Create account"}<Plus size={16} /></button></div></form></section>}

        {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {message && <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>}

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-[#B28713]">Account directory</p><h2 className="mt-1 text-2xl font-semibold">{loading ? "Loading users..." : `${users.length} ${users.length === 1 ? "account" : "accounts"}`}</h2></div><label className="flex w-full items-center gap-2 rounded-xl border border-black/10 px-3 py-2.5 sm:max-w-sm"><Search size={17} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users" aria-label="Search users" className="min-w-0 flex-1 text-sm outline-none" /></label></div></section>

        {loading ? <UserLoading /> : filteredUsers.length === 0 ? <EmptyUsers hasSearch={Boolean(search.trim())} /> : <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredUsers.map((user) => <UserCard key={user._id} user={user} deleting={deletingId === user._id} onDelete={deleteUser} />)}</div>}
      </div>
    </main>
  );
}

function UserCard({ user, deleting, onDelete }: { user: User; deleting: boolean; onDelete: (user: User) => void }) {
  return <article className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"><div className="flex items-start justify-between gap-4"><div className="grid h-12 w-12 place-items-center rounded-full bg-[#101622] text-sm font-semibold text-[#E8B928]">{user.name.slice(0, 2).toUpperCase()}</div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${user.role === "admin" ? "bg-[#FFF4C9] text-[#8E6A08]" : "bg-slate-100 text-slate-600"}`}>{user.role}</span></div><h3 className="mt-5 text-xl font-semibold">{user.name}</h3><p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><Mail size={14} /> {user.loginId}</p><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><Users size={14} /> {user.mobileNo}</p><div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4"><span className="flex items-center gap-1.5 text-xs text-slate-400"><ShieldCheck size={14} /> Server-protected account</span><button type="button" disabled={deleting} onClick={() => onDelete(user)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}</button></div></article>;
}

function UserLoading() { return <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl bg-white" />)}</div>; }
function EmptyUsers({ hasSearch }: { hasSearch: boolean }) { return <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center"><Users className="mx-auto text-slate-400" size={30} /><h3 className="mt-4 text-lg font-semibold">{hasSearch ? "No users match your search" : "No users yet"}</h3><p className="mt-2 text-sm text-slate-500">{hasSearch ? "Try a different name, login ID, mobile number, or role." : "Add the first account to start building the directory."}</p></div>; }
