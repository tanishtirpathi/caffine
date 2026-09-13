"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
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
  const [loginIdCopied, setLoginIdCopied] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load profile");
        setUser(data.user);
      } catch {
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    const loadTimer = window.setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  const handleCopyLoginId = async () => {
    if (!user?.loginId) return;

    await navigator.clipboard.writeText(user.loginId);
    setLoginIdCopied(true);
    window.setTimeout(() => setLoginIdCopied(false), 1800);
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "B";
  const homeHref = user?.role === "admin" ? "/admin" : "/user";

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#101622]"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B28713]">
              Account space
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              Your profile.
            </h1>
            <p className="mt-3 max-w-xl text-slate-500">
              Keep your Bookspot identity close and your campus activity easy to reach.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <LogOut size={16} /> {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="relative overflow-hidden rounded-3xl bg-[#101622] p-7 text-white shadow-xl shadow-black/10 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-[32px] border-[#E8B928]/15" />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-[#E8B928] text-2xl font-semibold text-[#101622]">
                  {loading ? "..." : initials}
                </div>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold capitalize text-[#E8B928]">
                  {loading ? "Account" : user?.role}
                </span>
              </div>
              <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Bookspot member
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {loading ? "Loading your profile" : user?.name}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
                <Mail size={14} /> {loading ? "Please wait..." : user?.loginId}
              </p>
              <div className="mt-10 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-xl ${user?.isAuthorized ? "bg-green-400/15 text-green-300" : "bg-[#E8B928]/15 text-[#E8B928]"}`}
                  >
                    {user?.isAuthorized ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {user?.isAuthorized ? "Account authorized" : "Account status pending"}
                    </p>
                    <p className="mt-1 text-xs text-white/45">
                      {user?.isAuthorized
                        ? "You can use the booking workflow."
                        : "Your account may need admin approval."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-9">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#B28713]">Account information</p>
                <h2 className="mt-2 text-2xl font-semibold">Your details</h2>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4C9] text-[#8E6A08]">
                <UserRound size={19} />
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ProfileField
                icon={<UserRound size={16} />}
                label="Full name"
                value={loading ? "Loading..." : (user?.name ?? "--")}
              />
              <ProfileField
                icon={<Mail size={16} />}
                label="Login ID"
                value={loading ? "Loading..." : (user?.loginId ?? "--")}
                onCopy={handleCopyLoginId}
                copied={loginIdCopied}
                disabled={loading || !user?.loginId}
              />
              <ProfileField
                icon={<MapPin size={16} />}
                label="Mobile number"
                value={loading ? "Loading..." : (user?.mobileNo ?? "--")}
              />
              <ProfileField
                icon={<ShieldCheck size={16} />}
                label="Account type"
                value={loading ? "Loading..." : (user?.role ?? "--")}
                capitalize
              />
            </div>
            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Account protection
              </p>
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#f7f7f5] p-4">
                <ShieldCheck className="mt-0.5 shrink-0 text-[#8E6A08]" size={19} />
                <p className="text-sm leading-6 text-slate-600">
                  Your sign-in session is protected with a secure HttpOnly token. Never share your
                  password or login credentials.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <QuickAction
            href={homeHref}
            icon={<UserRound size={19} />}
            title="Dashboard"
            text="See your activity"
          />
          <QuickAction
            href="/venue"
            icon={<MapPin size={19} />}
            title="Find a venue"
            text="Browse campus spaces"
          />
          <QuickAction
            href="/calendar"
            icon={<CalendarDays size={19} />}
            title="Calendar"
            text="Review your schedule"
          />
        </section>

        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#B28713]">Your next step</p>
              <h2 className="mt-2 text-2xl font-semibold">Make space for what matters.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Discover a venue, request the resources you need, and let the admin team handle the
                coordination.
              </p>
            </div>
            <Link
              href="/venue"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E6A08] transition hover:text-[#101622]"
            >
              Explore venues <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProfileField({
  icon,
  label,
  value,
  capitalize = false,
  onCopy,
  copied = false,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
  onCopy?: () => void;
  copied?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#f7f7f5] p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[#8E6A08]">
          <span>{icon}</span>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>
        </div>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            disabled={disabled}
            title={copied ? "Login ID copied" : "Copy login ID"}
            aria-label={copied ? "Login ID copied" : "Copy login ID"}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-[#8E6A08] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        )}
      </div>
      <p
        className={`mt-3 text-base font-semibold text-[#171A2B] ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#E8B928]/60 hover:shadow-md"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#101622] text-[#E8B928]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{text}</p>
      </div>
      <ArrowUpRight
        className="ml-auto text-slate-300 transition group-hover:text-[#8E6A08]"
        size={17}
      />
    </Link>
  );
}
