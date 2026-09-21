"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  MapPin,
  Plus,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

type UserProfile = {
  name: string;
  loginId: string;
  mobileNo: string;
  role: string;
};

type Booking = {
  _id: string;
  date: string;
  starting_time: string;
  ending_time: string;
  reason: string;
  status: string;
  numberofStudents?: number;
  resources?: string[];
  venue_id?: { name?: string; building?: string };
};

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [campusBookings, setCampusBookings] = useState<Booking[]>([]);
  const [activeView, setActiveView] = useState<"mine" | "campus">("mine");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userResponse, myBookingsResponse, campusBookingsResponse] = await Promise.all([
          fetch("/api/me"),
          fetch("/api/booking"),
          fetch("/api/booking/all"),
        ]);

        const userData = await userResponse.json();
        const myBookingsData = await myBookingsResponse.json();
        const campusBookingsData = await campusBookingsResponse.json();

        if (!userResponse.ok || !myBookingsResponse.ok || !campusBookingsResponse.ok) {
          throw new Error(
            userData.message ||
              myBookingsData.message ||
              campusBookingsData.message ||
              "Unable to load dashboard"
          );
        }

        setUser(userData.user);
        setMyBookings(Array.isArray(myBookingsData.bookings) ? myBookingsData.bookings : []);
        setCampusBookings(
          Array.isArray(campusBookingsData.bookings) ? campusBookingsData.bookings : []
        );
      } catch (requestError) {
        if (requestError instanceof Error && /token|login|authorized/i.test(requestError.message)) {
          router.push("/auth/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const upcomingBookings = useMemo(
    () =>
      [...myBookings]
        .filter((booking) => new Date(booking.date) >= startOfToday())
        .sort(byDate)
        .slice(0, 3),
    [myBookings]
  );
  const pendingCount = myBookings.filter((booking) => booking.status === "pending").length;
  const displayBookings = activeView === "mine" ? myBookings : campusBookings;

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B28713]">
              Student dashboard
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              {loading ? "Welcome back" : `Welcome back, ${user?.name ?? "Student"}`}
            </h1>
            <p className="mt-3 text-slate-500">
              Keep track of your requests and see what is happening across campus.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/venue"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E8B928] px-4 py-3 text-sm font-semibold text-[#101622] transition hover:bg-[#d9ab1e]"
            >
              <Plus size={16} /> Book a venue
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<CalendarDays size={19} />}
            label="My bookings"
            value={loading ? "--" : String(myBookings.length)}
          />
          <StatCard
            icon={<Clock3 size={19} />}
            label="Pending requests"
            value={loading ? "--" : String(pendingCount)}
          />
          <StatCard
            icon={<MapPin size={19} />}
            label="Campus bookings"
            value={loading ? "--" : String(campusBookings.length)}
          />
          <StatCard
            icon={<Users size={19} />}
            label="Account"
            value={user?.role ?? "--"}
            capitalize
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#B28713]">Booking activity</p>
                <h2 className="mt-2 text-2xl font-semibold">Stay up to date</h2>
              </div>
              <div className="flex rounded-xl bg-[#f7f7f5] p-1">
                <ViewButton active={activeView === "mine"} onClick={() => setActiveView("mine")}>
                  My bookings
                </ViewButton>
                <ViewButton
                  active={activeView === "campus"}
                  onClick={() => setActiveView("campus")}
                >
                  Campus schedule
                </ViewButton>
              </div>
            </div>

            {loading ? (
              <LoadingRows />
            ) : displayBookings.length === 0 ? (
              <EmptyBookings />
            ) : (
              <div className="mt-6 space-y-3">
                {displayBookings.slice(0, 6).map((booking) => (
                  <BookingRow key={booking._id} booking={booking} />
                ))}
              </div>
            )}
            {displayBookings.length > 6 && (
              <Link
                href="/calendar"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#8E6A08] hover:text-[#101622]"
              >
                View full calendar <ArrowRight size={15} />
              </Link>
            )}
          </div>

          <aside className="rounded-3xl bg-[#101622] p-6 text-white shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#E8B928] text-[#101622]">
                <UserRound size={21} />
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#E8B928]">
                Your account
              </span>
            </div>
            <h2 className="mt-7 text-2xl font-semibold">{user?.name ?? "Your profile"}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {user?.loginId ?? "Loading account details..."}
            </p>
            <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Mobile</span>
                <span>{user?.mobileNo ?? "--"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Next booking</span>
                <span>
                  {upcomingBookings[0] ? formatDate(upcomingBookings[0].date) : "None yet"}
                </span>
              </div>
            </div>
            <Link
              href="/profile"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              View profile
            </Link>
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#B28713]">Coming up</p>
              <h2 className="mt-2 text-2xl font-semibold">Your next bookings</h2>
            </div>
            <Link
              href="/calendar"
              className="text-sm font-semibold text-[#8E6A08] hover:text-[#101622]"
            >
              Open calendar
            </Link>
          </div>
          {loading ? (
            <LoadingRows />
          ) : upcomingBookings.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              You have no upcoming bookings. Find a venue to get started.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <BookingRow key={booking._id} booking={booking} compact />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#FFF4C9] text-[#8E6A08]">
        {icon}
      </div>
      <p className="mt-5 text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${active ? "bg-white text-[#171A2B] shadow-sm" : "text-slate-500 hover:text-[#171A2B]"}`}
    >
      {children}
    </button>
  );
}

function BookingRow({ booking, compact = false }: { booking: Booking; compact?: boolean }) {
  return (
    <article
      className={`rounded-2xl border border-black/10 bg-[#f7f7f5] p-4 ${compact ? "h-full" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{booking.venue_id?.name ?? "Campus venue"}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={13} /> {booking.venue_id?.building ?? "Campus"}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={13} /> {formatDate(booking.date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock3 size={13} /> {booking.starting_time} - {booking.ending_time}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">{booking.reason}</p>
      {booking.resources?.length ? (
        <p className="mt-2 text-xs text-slate-500">Resources: {booking.resources.join(", ")}</p>
      ) : null}
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: "bg-green-50 text-green-700",
    pending: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-700",
    cancelled: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {status === "approved" ? (
        <CheckCircle2 size={12} />
      ) : status === "rejected" || status === "cancelled" ? (
        <XCircle size={12} />
      ) : (
        <Clock3 size={12} />
      )}{" "}
      {status}
    </span>
  );
}

function LoadingRows() {
  return (
    <div className="mt-6 space-y-3">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

function EmptyBookings() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-black/15 p-8 text-center">
      <CalendarDays className="mx-auto text-slate-400" size={26} />
      <p className="mt-3 text-sm text-slate-500">No bookings to show yet.</p>
      <Link
        href="/venue"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8E6A08]"
      >
        Find a venue <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function byDate(first: Booking, second: Booking) {
  return new Date(first.date).getTime() - new Date(second.date).getTime();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
