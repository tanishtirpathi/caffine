"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  Search,
  Users,
} from "lucide-react";

type Venue = {
  _id: string;
  name: string;
  building: string;
  capacity: number;
  images: string[];
  isActive?: boolean;
};

const capacityFilters = [
  { label: "All capacities", min: 0, max: Infinity },
  { label: "0–100", min: 0, max: 100 },
  { label: "101–250", min: 101, max: 250 },
  { label: "251–500", min: 251, max: 500 },
  { label: "500+", min: 501, max: Infinity },
];

export default function VenuePage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("All capacities");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const response = await fetch("/api/venue");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load venues");
        }

        setVenues(Array.isArray(data.venues) ? data.venues : []);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load venues",
        );
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, []);

  const filteredVenues = useMemo(() => {
    const query = search.trim().toLowerCase();
    const capacityFilter = capacityFilters.find(
      (filter) => filter.label === selectedCapacity,
    ) ?? capacityFilters[0];

    return venues.filter((venue) => {
      const matchesSearch =
        !query ||
        venue.name.toLowerCase().includes(query) ||
        venue.building.toLowerCase().includes(query);
      const matchesCapacity =
        venue.capacity >= capacityFilter.min && venue.capacity <= capacityFilter.max;

      return matchesSearch && matchesCapacity && venue.isActive !== false;
    });
  }, [search, selectedCapacity, venues]);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171A2B]">
      <section className="border-b border-black/10 bg-[#101622] text-white">
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#E8B928]">
              <CalendarDays size={17} /> Campus venues
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Find a space for what matters.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Explore classrooms, halls, labs, and meeting spaces across campus.
              Choose a venue and make your next booking simple.
            </p>
          </div>

          <div className="mt-9 flex max-w-3xl items-center gap-3 rounded-2xl bg-white p-2 shadow-xl shadow-black/20">
            <Search className="ml-3 shrink-0 text-slate-400" size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search venues or buildings"
              aria-label="Search venues or buildings"
              className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-[#171A2B] outline-none placeholder:text-slate-400 sm:text-base"
            />
            <span className="hidden rounded-xl bg-[#E8B928] px-4 py-3 text-sm font-semibold text-[#101622] sm:block">
              {filteredVenues.length} spaces
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#B28713]">Browse campus</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Popular spaces
            </h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter by venue capacity">
            {capacityFilters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => setSelectedCapacity(filter.label)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${selectedCapacity === filter.label ? "border-[#101622] bg-[#101622] text-white" : "border-black/10 bg-white text-slate-600 hover:border-black/30"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-80 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">We could not load the venues.</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center">
            <Building2 className="mx-auto text-slate-400" size={28} />
            <h3 className="mt-4 text-lg font-semibold">No venues found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try a different search term or choose another capacity range.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue._id} venue={venue} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  const image = venue.images?.[0];

  return (
    <Link
      href={`/venue/${venue._id}`}
      className="group block overflow-hidden rounded-2xl border border-black/10
     bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl
      hover:shadow-black/10">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e7e8e5]">
        {image ? (
          <img
            src={image}
            alt={venue.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-[#101622] text-[#E8B928]">
            <Building2 size={34} />
            <span className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Campus space
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#101622] shadow-sm">
          Available
        </span>
      </div>

      <div className="p-5">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-[#B28713]">
          <MapPin size={14} /> {venue.building}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#101622]">
          {venue.name}
        </h3>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Users size={16} /> Up to {venue.capacity} people
        </div>
        <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8B928] px-4 py-3 text-sm font-semibold text-[#101622] transition group-hover:bg-[#d9ab1e]">
          View and book <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}
