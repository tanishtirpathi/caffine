"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import Navbar from "../../../components/navbar";

type UserRole = "student" | "admin";

interface LoginFormData {
  loginId: string;
  password: string;
  role: UserRole;
}

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    loginId: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginId: formData.loginId,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess("Login successful.");

      const targetRoute = data?.user?.role === "admin" ? "/admin" : "/user";
      router.push(targetRoute);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f5f2] px-4 pb-10 text-[#101622] sm:px-6">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-112px)] max-w-5xl items-center py-10">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(16,22,34,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[#101622] p-10 text-white lg:flex">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[28px] border-[#E8B928]/20" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border-[34px] border-white/5" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8B928] text-[#101622]">
                <Building2 size={23} />
              </div>
              <p className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-[#E8B928]">
Bookspot              </p>
              <h1 className="mt-5 max-w-sm text-5xl font-semibold leading-[1.02] tracking-[-0.045em]">
                Your campus,<br />One book spot
              </h1>
              <p className="mt-6 max-w-sm text-sm leading-6 text-slate-300">
                Find venues, plan events, and manage bookings with a single account.
              </p>
            </div>

            <div className="relative space-y-4">
              <div className="h-px bg-white/10" />
              <p className="text-xs text-slate-400">Book smarter. Keep campus moving.</p>
            </div>
          </section>

          <section className="p-7 sm:p-12 lg:p-14">
            <div className="mb-9">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5e7ad] text-[#8a6810] lg:hidden">
                <Building2 size={21} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6810]">Account access</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#101622] sm:text-4xl">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Sign in to continue to your campus dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="loginId" className="mb-2 block text-sm font-semibold text-[#253044]">Login ID</label>
                <div className="relative">
                  <UserRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input id="loginId" name="loginId" type="text" value={formData.loginId} onChange={handleChange} placeholder="Enter your login ID" required autoComplete="username" className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-[#101622] outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-[#101622] focus:bg-white focus:ring-4 focus:ring-[#E8B928]/20" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#253044]">Password</label>
                <div className="relative">
                  <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required autoComplete="current-password" className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-[#101622] outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-[#101622] focus:bg-white focus:ring-4 focus:ring-[#E8B928]/20" />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="mb-2 block text-sm font-semibold text-[#253044]">Login as</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 text-sm font-medium text-[#101622] outline-none transition hover:border-slate-400 focus:border-[#101622] focus:bg-white focus:ring-4 focus:ring-[#E8B928]/20">
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-800">{error}</div>}
              {success && <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">{success}</div>}

              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#101622] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#253044] focus:outline-none focus:ring-4 focus:ring-[#E8B928]/35 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Logging in..." : "Login to account"}
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-7 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <LockKeyhole size={14} className="text-slate-400" /> Your session is protected.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}