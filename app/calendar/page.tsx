"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";

type Booking = {
  _id: string;
  date: string;
  starting_time: string;
  ending_time: string;
  reason: string;
  status: string;
  venue_id?: { name?: string; building?: string };
};

export default function CalendarPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/booking/all")
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 401) {
          router.replace("/auth/login");
          return [];
        }
        if (!response.ok) throw new Error(data.message || "Unable to load bookings");
        return Array.isArray(data.bookings) ? data.bookings : [];
      })
      .then(setBookings)
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Unable to load bookings");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const monthLabel = selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const days = useMemo(() => getMonthDays(selectedDate), [selectedDate]);
  const selectedBookings = bookings.filter((booking) => isSameDay(new Date(booking.date), selectedDate));

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        <Link href="/venue" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#101622]"><ArrowLeft size={16} /> Browse venues</Link>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-[#B28713]"><CalendarDays size={17} /> Booking calendar</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">Your campus schedule</h1>
            <p className="mt-3 text-slate-500">Select a date to see every campus booking and occupied space.</p>
          </div>
          <Link href="/venue" className="rounded-xl bg-[#E8B928] px-5 py-3 text-center text-sm font-semibold text-[#101622] transition hover:bg-[#d9ab1e]">Book a venue</Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{monthLabel}</h2>
              <div className="flex gap-2">
                <MonthButton label="Previous month" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}>←</MonthButton>
                <MonthButton label="Next month" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}>→</MonthButton>
              </div>
            </div>
            <div className="mt-7 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
              {weekdays.map((day) => <span key={day} className="py-2">{day}</span>)}
              {days.map((day, index) => {
                const hasBooking = day && bookings.some((booking) => isSameDay(new Date(booking.date), day));
                return <button key={`${day?.toISOString() ?? "empty"}-${index}`} type="button" disabled={!day} onClick={() => day && setSelectedDate(day)} className={`relative aspect-square rounded-xl text-sm transition ${day && isSameDay(day, selectedDate) ? "bg-[#101622] font-semibold text-white" : day ? "text-slate-700 hover:bg-[#FFF4C9]" : "cursor-default"}`}>
                  {day?.getDate()}
                  {hasBooking && <span className={`absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSameDay(day, selectedDate) ? "bg-[#E8B928]" : "bg-[#B28713]"}`} />}
                </button>;
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-[#B28713]">Selected date</p>
            <h2 className="mt-2 text-2xl font-semibold">{selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</h2>
            {loading ? <p className="mt-8 text-sm text-slate-500">Loading bookings...</p> : error ? <p className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : selectedBookings.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-black/15 p-6 text-center"><CalendarDays className="mx-auto text-slate-400" size={25} /><p className="mt-3 text-sm text-slate-500">No bookings on this date.</p></div> : <div className="mt-6 space-y-3">{selectedBookings.map((booking) => <BookingItem key={booking._id} booking={booking} />)}</div>}
          </section>
        </div>
      </div>
    </main>
  );
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthDays(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : new Date(date.getFullYear(), date.getMonth(), index - firstDay + 1));
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function MonthButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-lg text-slate-600 transition hover:bg-slate-100">{children}</button>;
}

function BookingItem({ booking }: { booking: Booking }) {
  return <article className="rounded-2xl border border-black/10 bg-[#f7f7f5] p-4"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold">{booking.venue_id?.name || "Campus venue"}</h3><span className="rounded-full bg-[#FFF4C9] px-2.5 py-1 text-xs font-semibold capitalize text-[#8E6A08]">{booking.status}</span></div><p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin size={14} /> {booking.venue_id?.building || "Campus"}</p><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><Clock3 size={14} /> {booking.starting_time} - {booking.ending_time}</p><p className="mt-3 text-sm text-slate-600">{booking.reason}</p></article>;
}
