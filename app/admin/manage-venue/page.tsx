"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, ImageIcon, MapPin, Plus, Search, Trash2, Users } from "lucide-react";

type Venue = {
  _id: string;
  name: string;
  building: string;
  capacity: number;
  images?: string[];
  resources?: string[];
};

export default function ManageVenuePage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadVenues = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/venue", { cache: "no-store" });
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        router.push("/auth/login");
        return;
      }
      if (!response.ok) throw new Error(data.message || "Unable to load venues");

      setVenues(Array.isArray(data.venues) ? data.venues : []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load venues");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadVenues();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadVenues]);

  const filteredVenues = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return venues;

    return venues.filter((venue) =>
      [venue.name, venue.building, ...(venue.resources ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search, venues]);

  const deleteVenue = async (venue: Venue) => {
    if (!window.confirm(`Delete ${venue.name}? Existing bookings for this venue will also be removed.`)) return;

    setDeletingId(venue._id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/venue/${venue._id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete venue");

      setVenues((current) => current.filter((item) => item._id !== venue._id));
      setMessage(`${venue.name} was deleted successfully.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete venue");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#101622]"><ArrowLeft size={16} /> Back to admin dashboard</Link>

        <header className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#B28713]">Venue management</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Manage campus spaces.</h1>
            <p className="mt-3 max-w-2xl text-slate-500">Review every venue, check its capacity and resources, or remove a space that is no longer available.</p>
          </div>
          <Link href="/admin/create-venue" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8B928] px-4 py-3 text-sm font-semibold text-[#101622] transition hover:bg-[#d9ab1e]"><Plus size={16} /> Create venue</Link>
        </header>

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-semibold text-[#B28713]">Venue directory</p><h2 className="mt-1 text-2xl font-semibold">{loading ? "Loading spaces..." : `${venues.length} ${venues.length === 1 ? "space" : "spaces"}`}</h2></div>
            <label className="flex w-full items-center gap-2 rounded-xl border border-black/10 px-3 py-2.5 sm:max-w-sm"><Search size={17} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search venues, buildings, resources" aria-label="Search venues" className="min-w-0 flex-1 text-sm outline-none" /></label>
          </div>
        </section>

        {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {message && <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{message}</div>}

        {loading ? <VenueLoading /> : filteredVenues.length === 0 ? <EmptyVenues hasSearch={Boolean(search.trim())} /> : <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredVenues.map((venue) => <VenueManagementCard key={venue._id} venue={venue} deleting={deletingId === venue._id} onDelete={deleteVenue} />)}</div>}
      </div>
    </main>
  );
}

function VenueManagementCard({ venue, deleting, onDelete }: { venue: Venue; deleting: boolean; onDelete: (venue: Venue) => void }) {
  const image = venue.images?.[0];

  return <article className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
    <div className="relative aspect-[16/9] overflow-hidden bg-[#101622]">
      {image ? <img src={image} alt={venue.name} className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center text-[#E8B928]"><Building2 size={36} /><span className="mt-2 text-xs uppercase tracking-[0.18em] text-white/60">No image</span></div>}
      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#101622]">Active venue</span>
    </div>
    <div className="p-5">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#B28713]"><MapPin size={14} /> {venue.building}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{venue.name}</h3>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500"><span className="flex items-center gap-1.5"><Users size={15} /> Up to {venue.capacity}</span><span className="flex items-center gap-1.5"><ImageIcon size={15} /> {venue.images?.length ?? 0} images</span></div>
      <div className="mt-4 min-h-7">{venue.resources?.length ? <div className="flex flex-wrap gap-1.5">{venue.resources.map((resource) => <span key={resource} className="rounded-full bg-[#FFF4C9] px-2.5 py-1 text-xs font-medium text-[#8E6A08]">{resource}</span>)}</div> : <span className="text-xs text-slate-400">No resources listed</span>}</div>
      <div className="mt-6 flex gap-2"><Link href={`/venue/${venue._id}`} className="flex-1 rounded-xl border border-black/10 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">View venue</Link><button type="button" disabled={deleting} onClick={() => onDelete(venue)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 size={15} /> {deleting ? "Deleting..." : "Delete"}</button></div>
    </div>
  </article>;
}

function VenueLoading() {
  return <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-white" />)}</div>;
}

function EmptyVenues({ hasSearch }: { hasSearch: boolean }) {
  return <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center"><Building2 className="mx-auto text-slate-400" size={30} /><h3 className="mt-4 text-lg font-semibold">{hasSearch ? "No venues match your search" : "No venues yet"}</h3><p className="mt-2 text-sm text-slate-500">{hasSearch ? "Try a different venue, building, or resource." : "Create the first campus venue to start accepting bookings."}</p></div>;
}
