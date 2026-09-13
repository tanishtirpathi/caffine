"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Filter,
  LogOut,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import Navbar from "../../components/navbar";

type Booking = {
  _id: string;
  date: string;
  starting_time: string;
  ending_time: string;
  reason: string;
  status: string;
  numberofStudents: number;
  resources?: string[];
  venue_id?: { name?: string; building?: string; capacity?: number };
  user_id?: { name?: string; loginId?: string; mobileNo?: string };
};

type Venue = { _id: string };
type User = { _id: string };

const statusOrder: Record<string, number> = { pending: 0, approved: 1, rejected: 2, cancelled: 3, completed: 4 };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [venueCount, setVenueCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingResponse, venueResponse, userResponse] = await Promise.all([
        fetch("/api/admin/bookings"),
        fetch("/api/venue"),
        fetch("/api/admin/users"),
      ]);
      const bookingData = await bookingResponse.json();
      const venueData = await venueResponse.json();
      const userData = await userResponse.json();

      if (bookingResponse.status === 401 || bookingResponse.status === 403) {
        router.replace("/auth/login");
        return;
      }
      if (!bookingResponse.ok) throw new Error(bookingData.message || "Unable to load bookings");

      setBookings(Array.isArray(bookingData.bookings) ? bookingData.bookings : []);
      setVenueCount(Array.isArray(venueData.venues) ? venueData.venues.length : 0);
      setUserCount(Array.isArray(userData.users) ? userData.users.length : 0);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  const todayCount = bookings.filter((booking) => isToday(new Date(booking.date))).length;
  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...bookings]
      .filter((booking) => statusFilter === "all" || booking.status === statusFilter)
      .filter((booking) => {
        if (!query) return true;
        return [booking.user_id?.name, booking.user_id?.loginId, booking.venue_id?.name, booking.venue_id?.building, booking.reason]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      })
      .sort((first, second) => (statusOrder[first.status] ?? 9) - (statusOrder[second.status] ?? 9) || new Date(first.date).getTime() - new Date(second.date).getTime());
  }, [bookings, search, statusFilter]);

  const updateBooking = async (bookingId: string, status: "approved" | "rejected") => {
    setUpdatingId(bookingId);
    setError("");
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update booking");
      setBookings((current) => current.map((booking) => booking._id === bookingId ? data.booking : booking));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update booking");
    } finally {
      setUpdatingId("");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B28713]">Admin control center</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Review the campus at a glance.</h1>
            <p className="mt-3 text-slate-500">Approve requests, watch venue activity, and keep campus bookings moving.</p>
          </div>
<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/admin/create-venue" className="inline-flex items-center gap-2 rounded-xl bg-[#E8B928] px-4 py-3 text-sm font-semibold text-[#101622] transition hover:bg-[#d9ab1e]"><Plus size={16} /> create a venue</Link>
          <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 self-start rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600 sm:self-auto"><LogOut size={16} /> Sign out</button>
     </div>
             </header>

        {error && <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={<Clock3 size={19} />} label="Pending requests" value={loading ? "--" : String(pendingCount)} tone="amber" />
          <Metric icon={<CalendarDays size={19} />} label="Bookings today" value={loading ? "--" : String(todayCount)} />
          <Metric icon={<Building2 size={19} />} label="Active venues" value={loading ? "--" : String(venueCount)} />
          <Metric icon={<UserRound size={19} />} label="Registered users" value={loading ? "--" : String(userCount)} />
        </section>

        <section className="mt-8 rounded-3xl border border-black/10 bg-white shadow-sm">
          <div className="border-b border-black/10 p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div><p className="text-sm font-semibold text-[#B28713]">Booking requests</p><h2 className="mt-2 text-2xl font-semibold">Pending first, always.</h2><p className="mt-2 text-sm text-slate-500">Review every request and see the student, venue, timing, and event purpose.</p></div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex min-w-64 items-center gap-2 rounded-xl border border-black/10 px-3 py-2.5"><Search size={17} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search requests" aria-label="Search booking requests" className="min-w-0 flex-1 text-sm outline-none" /></label>
                <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2.5"><Filter size={16} className="text-slate-400" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter bookings by status" className="bg-white text-sm outline-none"><option value="all">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option></select></label>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {loading ? <LoadingRows /> : filteredBookings.length === 0 ? <EmptyRequests /> : <div className="space-y-4">{filteredBookings.map((booking) => <BookingRequest key={booking._id} booking={booking} updating={updatingId === booking._id} onUpdate={updateBooking} />)}</div>}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
         <AdminLink href="/admin/manage-venue" icon={<Building2 size={20} />} title="manage venues" description="Add new campus spaces and keep capacity information current." />
          <AdminLink href="/admin/create-venue" icon={<Building2 size={20} />} title="create venues" description="Add new campus spaces and keep capacity information current." />
          <AdminLink href="/admin/users" icon={<ShieldCheck size={20} />} title="Manage users" description="Review accounts and authorization status across the campus." />
        </section>
      </div>
    </main>
  );
}

function Metric({ icon, label, value, tone = "default" }: { icon: React.ReactNode; label: string; value: string; tone?: "default" | "amber" }) {
  return <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"><div className={`grid h-9 w-9 place-items-center rounded-lg ${tone === "amber" ? "bg-[#FFF4C9] text-[#8E6A08]" : "bg-slate-100 text-slate-600"}`}>{icon}</div><p className="mt-5 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>;
}

function BookingRequest({ booking, updating, onUpdate }: { booking: Booking; updating: boolean; onUpdate: (id: string, status: "approved" | "rejected") => void }) {
  return <article className="rounded-2xl border border-black/10 bg-[#f7f7f5] p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-semibold">{booking.venue_id?.name ?? "Unknown venue"}</h3><StatusBadge status={booking.status} /></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500"><span className="flex items-center gap-1.5"><UserRound size={14} /> {booking.user_id?.name ?? "Unknown student"}</span><span className="flex items-center gap-1.5"><MapPin size={14} /> {booking.venue_id?.building ?? "Unknown building"}</span><span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(booking.date)}</span><span className="flex items-center gap-1.5"><Clock3 size={14} /> {booking.starting_time} - {booking.ending_time}</span></div></div>{booking.status === "pending" && <div className="flex shrink-0 gap-2"><button disabled={updating} type="button" onClick={() => onUpdate(booking._id, "approved")} className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"><Check size={14} /> Approve</button><button disabled={updating} type="button" onClick={() => onUpdate(booking._id, "rejected")} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"><X size={14} /> Reject</button></div>}</div><div className="mt-4 grid gap-3 border-t border-black/10 pt-4 text-sm sm:grid-cols-3"><p><span className="text-slate-400">Event:</span> {booking.reason}</p><p><span className="text-slate-400">Attendance:</span> {booking.numberofStudents} / {booking.venue_id?.capacity ?? "--"}</p><p><span className="text-slate-400">Resources:</span> {booking.resources?.length ? booking.resources.join(", ") : "None"}</p></div></article>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { pending: "bg-amber-50 text-amber-700", approved: "bg-green-50 text-green-700", rejected: "bg-red-50 text-red-700", cancelled: "bg-slate-100 text-slate-600" };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function AdminLink({ href, icon, title, description }: { href: string; icon: React.ReactNode; title: string; description: string }) {
  return <Link href={href} className="group rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#101622] text-[#E8B928]">{icon}</div><h2 className="mt-5 text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></Link>;
}

function LoadingRows() {
  return <div className="space-y-4"><div className="h-36 animate-pulse rounded-2xl bg-slate-100" /><div className="h-36 animate-pulse rounded-2xl bg-slate-100" /></div>;
}

function EmptyRequests() {
  return <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center"><ShieldCheck className="mx-auto text-slate-400" size={28} /><p className="mt-3 text-sm text-slate-500">No requests match the current filters.</p></div>;
}

function isToday(date: Date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
