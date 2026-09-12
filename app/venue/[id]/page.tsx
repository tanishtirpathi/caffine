"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Building2, CalendarDays, MapPin, Users } from "lucide-react";
import Navbar from "../../../components/navbar";

type Venue = {
  _id: string;
  name: string;
  building: string;
  capacity: number;
  images: string[];
};

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function VenueDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [date, setDate] = useState("");
  const [startingTime, setStartingTime] = useState("09:00");
  const [endingTime, setEndingTime] = useState("10:00");
  const [numberOfStudents, setNumberOfStudents] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const response = await fetch(`/api/venue/${params.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Venue not found");
        setVenue(data.venue);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Venue not found");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadVenue();
  }, [params.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId: params.id,
          date,
          startingTime,
          endingTime,
          numberOfStudents: Number(numberOfStudents),
          reason,
        }),
      });
      const data = await response.json();
      if (response.status === 401) {
        setError("You need to log in before booking. Redirecting you to the login page...");
        window.setTimeout(() => router.push("/auth/login"), 1500);
        return;
      }
      if (!response.ok) throw new Error(data.message || "Booking request failed");
      setMessage("Booking request sent successfully.");
      setReason("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Booking request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <Link href="/venue" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#101622]"><ArrowLeft size={16} /> All venues</Link>

        {loading ? (
          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-white" />
        ) : error && !venue ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        ) : venue ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              <div className="aspect-[16/9] bg-[#101622]">
                {venue.images?.[0] ? <img src={venue.images[0]} alt={venue.name} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center text-[#E8B928]"><Building2 size={48} /><span className="mt-3 text-sm text-white/70">Campus space</span></div>}
              </div>
              <div className="p-7 sm:p-9">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#B28713]"><MapPin size={16} /> {venue.building}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">{venue.name}</h1>
                <p className="mt-4 flex items-center gap-2 text-slate-500"><Users size={17} /> Capacity: {venue.capacity} people</p>
              </div>
            </section>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm sm:p-9">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#B28713]"><CalendarDays size={17} /> Request this venue</p>
              <h2 className="mt-3 text-2xl font-semibold">Plan your booking</h2>
              <div className="mt-6 space-y-4">
                <label className="block text-sm font-medium">Date<input required type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E8B928]" /></label>
                <div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">From<select value={startingTime} onChange={(event) => setStartingTime(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3"><option value="09:00">09:00</option>{timeSlots.slice(1).map((time) => <option key={time} value={time}>{time}</option>)}</select></label><label className="text-sm font-medium">Until<select value={endingTime} onChange={(event) => setEndingTime(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3">{timeSlots.slice(1).map((time) => <option key={time} value={time}>{time}</option>)}</select></label></div>
                <label className="block text-sm font-medium">Expected attendance<input required type="number" min="1" max={venue.capacity} value={numberOfStudents} onChange={(event) => setNumberOfStudents(event.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E8B928]" /></label>
                <label className="block text-sm font-medium">What is the event for?<textarea required rows={3} value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E8B928]" /></label>
              </div>
              {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              {message && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
              <button disabled={submitting} className="mt-6 w-full rounded-xl bg-[#E8B928] px-5 py-3.5 text-sm font-semibold text-[#101622] transition hover:bg-[#d9ab1e] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending request..." : "Request booking"}</button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
