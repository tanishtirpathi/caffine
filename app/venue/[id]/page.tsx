"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
} from "lucide-react";
import Navbar from "../../../components/navbar";
import { VENUE_RESOURCES } from "../../../lib/resources";

type Venue = {
  _id: string;
  name: string;
  building: string;
  capacity: number;
  images: string[];
  resources: string[];
};

type VenueSuggestion = Pick<
  Venue,
  "_id" | "name" | "building" | "capacity" | "images" | "resources"
>;

type Booking = {
  venue_id?: string | { _id?: string };
  date: string;
  starting_time: string;
  ending_time: string;
  status: string;
};

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const MAX_REASON_LENGTH = 250;
const VENUE_CONFLICT_MESSAGE = "Venue is already booked for that time";

export default function VenueDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [date, setDate] = useState("");
  const [startingTime, setStartingTime] = useState("09:00");
  const [endingTime, setEndingTime] = useState("10:00");
  const [numberOfStudents, setNumberOfStudents] = useState("");
  const [reason, setReason] = useState("");
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<VenueSuggestion[]>([]);

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const response = await fetch(`/api/venue/${params.id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Venue not found");
        setVenue(data.venue);
        setImageIndex(0);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Venue not found");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadVenue();
  }, [params.id]);

  function getTodayDate() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    setSuggestions([]);

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
          resources: selectedResources,
        }),
      });
      const data = await response.json();
      if (response.status === 401) {
        setError("You need to log in before booking. Redirecting you to the login page...");
        window.setTimeout(() => router.push("/auth/login"), 1500);
        return;
      }
      if (
        response.status === 400 &&
        data.message === "Bookings cannot be made for a previous date"
      ) {
        setError(data.message);
        return;
      }
      if (response.status === 409) {
        if (data.message !== VENUE_CONFLICT_MESSAGE) {
          throw new Error(data.message || "Booking request failed");
        }

        // Keep the user's form values intact while the browser finds alternatives.
        setError(VENUE_CONFLICT_MESSAGE);
        setSuggestions(await findVenueSuggestions());
        return;
      }
      if (!response.ok) throw new Error(data.message || "Booking request failed");
      setMessage("Booking request sent successfully.");
      setReason("");
      setSuggestions([]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Booking request failed");
    } finally {
      setSubmitting(false);
    }
  };

  async function findVenueSuggestions(): Promise<VenueSuggestion[]> {
    try {
      // Suggestions are deliberately calculated in the UI after the backend reports
      // a conflict, so the booking endpoint remains responsible only for booking.
      const [venueResponse, bookingResponse] = await Promise.all([
        fetch("/api/venue", { cache: "no-store" }),
        fetch("/api/booking/all", { cache: "no-store" }),
      ]);
      const venueData = await venueResponse.json();
      const bookingData = await bookingResponse.json();

      if (!venueResponse.ok || !bookingResponse.ok) return [];

      const allVenues: VenueSuggestion[] = Array.isArray(venueData.venues) ? venueData.venues : [];
      const allBookings: Booking[] = Array.isArray(bookingData.bookings)
        ? bookingData.bookings
        : [];
      const requestedStart = timeSlots.indexOf(startingTime);
      const requestedEnd = timeSlots.indexOf(endingTime);
      const blockedVenueIds = new Set(
        allBookings
          .filter(
            (booking) =>
              booking.date === date &&
              (booking.status === "pending" || booking.status === "approved")
          )
          .filter((booking) => {
            const existingStart = timeSlots.indexOf(booking.starting_time);
            const existingEnd = timeSlots.indexOf(booking.ending_time);
            return requestedStart < existingEnd && requestedEnd > existingStart;
          })
          .map((booking) =>
            typeof booking.venue_id === "string" ? booking.venue_id : booking.venue_id?._id
          )
          .filter((venueId): venueId is string => Boolean(venueId))
      );

      // Capacity is the primary match: show spaces that fit the group and are closest
      // to the original venue, while excluding the venue that just conflicted.
      return allVenues
        .filter(
          (candidate) =>
            candidate._id !== params.id &&
            candidate.capacity >= Number(numberOfStudents) &&
            !blockedVenueIds.has(candidate._id)
        )
        .sort(
          (first, second) =>
            Math.abs(first.capacity - (venue?.capacity ?? 0)) -
            Math.abs(second.capacity - (venue?.capacity ?? 0))
        )
        .slice(0, 3);
    } catch {
      return [];
    }
  }

  const showPreviousImage = () => {
    if (!venue?.images?.length) return;
    setImageIndex((currentIndex) =>
      currentIndex === 0 ? venue.images.length - 1 : currentIndex - 1
    );
  };

  const showNextImage = () => {
    if (!venue?.images?.length) return;
    setImageIndex((currentIndex) =>
      currentIndex === venue.images.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <Link
          href="/venue" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#101622]"
        >
          <ArrowLeft size={16} /> All venues
        </Link>

        {loading ? (
          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-white" />
        ) : error && !venue ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : venue ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
              <div className="relative aspect-[16/9] bg-[#101622]">
                {venue.images?.[imageIndex] ? (
                  <img
                    src={venue.images[imageIndex]}
                    alt={`${venue.name} image ${imageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-[#E8B928]">
                    <Building2 size={48} />
                    <span className="mt-3 text-sm text-white/70">Campus space</span>
                  </div>
                )}
                {venue.images?.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Show previous venue image"
                      onClick={showPreviousImage}
                      className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      aria-label="Show next venue image"
                      onClick={showNextImage}
                      className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white transition hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <ChevronRight size={22} />
                    </button>
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
                      {imageIndex + 1} / {venue.images.length}
                    </span>
                  </>
                )}
              </div>
              <div className="p-7 sm:p-9">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#B28713]">
                  <MapPin size={16} /> {venue.building}
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight">{venue.name}</h1>
                <p className="mt-4 flex items-center gap-2 text-slate-500">
                  <Users size={17} /> Capacity: {venue.capacity} people
                </p>
                <div className="mt-7 border-t border-black/10 pt-6">
                  <h2 className="text-sm font-semibold">Available resources</h2>
                  {venue.resources?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {venue.resources.map((resource) => (
                        <span
                          key={resource}
                          className="rounded-full bg-[#FFF4C9] px-3 py-1.5 text-xs font-medium text-[#8E6A08]"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">No additional resources listed.</p>
                  )}
                </div>
              </div>
            </section>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm sm:p-9"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-[#B28713]">
                <CalendarDays size={17} /> Request this venue
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Plan your booking</h2>
              <div className="mt-6 space-y-4">
                <label className="block text-sm font-medium">
                  Date
                  <input
                    required
                    type="date"
                    value={date}
                    min={getTodayDate()}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E8B928]"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm font-medium">
                    From
                    <select
                      value={startingTime}
                      onChange={(event) => setStartingTime(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3"
                    >
                      <option value="09:00">09:00</option>
                      {timeSlots.slice(1).map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-medium">
                    Until
                    <select
                      value={endingTime}
                      onChange={(event) => setEndingTime(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-3"
                    >
                      {timeSlots.slice(1).map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block text-sm font-medium">
                  Expected attendance
                  <input
                    required
                    type="number"
                    min="1"
                    max={venue.capacity}
                    value={numberOfStudents}
                    onChange={(event) => setNumberOfStudents(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E8B928]"
                  />
                </label>
                {venue.resources?.length > 0 && (
                  <fieldset>
                    <legend className="text-sm font-medium">Resources needed</legend>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {VENUE_RESOURCES.filter((resource) => venue.resources.includes(resource)).map(
                        (resource) => (
                          <label
                            key={resource}
                            className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2.5 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedResources.includes(resource)}
                              onChange={(event) =>
                                setSelectedResources((current) =>
                                  event.target.checked
                                    ? [...current, resource]
                                    : current.filter((item) => item !== resource)
                                )
                              }
                              className="h-4 w-4 accent-[#E8B928]"
                            />
                            {resource}
                          </label>
                        )
                      )}
                    </div>
                  </fieldset>
                )}
                <label className="block text-sm font-medium">
                  What is the event for?
                  <textarea
                    required
                    rows={3}
                    maxLength={MAX_REASON_LENGTH}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    className="mt-2 w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-[#E8B928]"
                  />
                  <span className="mt-1 block text-right text-xs text-slate-500">
                    {reason.length}/{MAX_REASON_LENGTH}
                  </span>
                </label>
              </div>
              {error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
              )}
              {suggestions.length > 0 && (
                <div className="mt-4 rounded-2xl border border-[#E8B928]/40 bg-[#FFF9E7] p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#E8B928] text-[#101622]">
                      <Building2 size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#101622]">
                        Try a similar available venue
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#8E6A08]">
                        These spaces have a similar capacity and are free for your selected time.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {suggestions.map((suggestion) => (
                      <Link
                        key={suggestion._id}
                        href={`/venue/${suggestion._id}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#E8B928]/30 bg-white px-3 py-3 transition hover:border-[#E8B928] hover:shadow-sm"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-[#101622]">
                            {suggestion.name}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {suggestion.building} · Capacity {suggestion.capacity}
                          </span>
                        </span>
                        <ChevronRight size={17} className="shrink-0 text-[#8E6A08]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {message && (
                <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>
              )}
              <button
                disabled={submitting}
                className="mt-6 w-full rounded-xl bg-[#E8B928] px-5 py-3.5 text-sm font-semibold text-[#101622] transition hover:bg-[#d9ab1e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending request..." : "Request booking"}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
