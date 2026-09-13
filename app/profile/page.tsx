"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, LogOut, ShieldCheck, UserRound } from "lucide-react";
import Navbar from "../../components/navbar";

type UserProfile = {
  id: string;
  name: string;
  loginId: string;
  mobileNo: string;
  role: string;
  isAuthorized?: boolean;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        setUser(data.user);
      } catch {
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <Navbar />

      <section className="border-b border-black/10 bg-[#101622] text-white">
        <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 sm:py-16">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-[#E8B928]">Your profile</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {loading ? "Loading profile..." : user?.name || "Your account"}
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">Manage your account details and sign out securely from your Bookspot profile.</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="relative rounded-3xl border border-black/10 bg-white px-6 pb-7 pt-20 shadow-xl shadow-black/5 sm:px-10 sm:pb-10">
          <div className="absolute -top-10 left-1/2 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-full border-8 border-[#f7f7f5] bg-[#E8B928] text-[#101622] shadow-lg">
            <UserRound size={32} strokeWidth={1.8} />
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-semibold text-[#B28713]">Account information</p>
            <h2 className="mt-2 text-2xl font-semibold">Your details</h2>
            <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${user?.isAuthorized ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
              <ShieldCheck size={14} /> {user?.isAuthorized ? "Authorized account" : "Account status pending"}
            </div>
          </div>

          {loading ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          ) : user ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ProfileField label="Full name" value={user.name} />
              <ProfileField label="Login ID" value={user.loginId} />
              <ProfileField label="Mobile number" value={user.mobileNo} />
              <ProfileField label="Account type" value={user.role} capitalize />
            </div>
          ) : null}

          <button type="button" onClick={handleLogout} disabled={loggingOut} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60">
            <LogOut size={16} /> {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </section>
    </main>
  );
}

function ProfileField({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#f7f7f5] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <p className={`mt-2 text-base font-medium text-[#171A2B] ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}
