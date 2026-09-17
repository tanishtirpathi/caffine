"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../components/navbar";

import {
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  MapPin,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user as { role?: string } | undefined;
      })
      .then((user) => {
        if (user) router.replace(user.role === "admin" ? "/admin" : "/user");
      })
      .catch(() => undefined);
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F7FAFF] text-[#102A43]">
      <Navbar />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-[#1677FF]/10 blur-3xl" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-20 text-center sm:pt-28">  
          <h1 className="max-w-4xl text-5xl leading-[1.05] tracking-[-0.045em] text-[#102A43] sm:text-6xl lg:text-7xl">
            <span className="block font-serif italic font-light">Your campus </span>
            <span className="block">One Booking spot </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Find available venues, schedule events, and manage bookings
            effortlessly with a simple platform built for modern campuses.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/venue"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#1677FF] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1677FF]/25 transition hover:-translate-y-0.5 hover:bg-[#0F5FCC]"
            >
              Check availability
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-xl border border-[#D7E4F5] bg-white px-6 py-3.5 text-sm font-semibold text-[#102A43] shadow-sm transition hover:border-[#AFC8E8] hover:bg-[#F0F6FF]"
            >
              Login to book
            </Link>
          </div>

        </div>
      </section>


      {/* FEATURES / HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-[#0F5FCC]">How it works</p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#102A43] sm:text-4xl">
            Everything you need to manage campus bookings.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Bookspot keeps the entire booking process simple while helping
            prevent scheduling conflicts
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          <FeatureCard
            number="01"
            icon={<MapPin size={20} />}
            title="Find a venue"
            description="Browse campus venues and instantly check their availability for any date and time."
          />

          <FeatureCard
            number="02"
            icon={<CalendarDays size={20} />}
            title="Request a booking"
            description="Submit your event details and request the venue you need in just a few steps."
          />

          <FeatureCard
            number="03"
            icon={<CheckCircle2 size={20} />}
            title="Avoid conflicts"
            description="Bookspot helps identify unavailable slots and makes finding alternatives easier."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#0B1120] px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-[#1677FF]/25 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold text-[#75B8FF]">
              Ready to book?
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Find your next campus space.
            </h2>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-400">
              Check availability across campus and find the right space for
              your next class, meeting, seminar, or event.
            </p>

            <Link
              href="/venue"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1677FF] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0F5FCC]"
            >
              View campus availability
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#D7E4F5] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Bookspot</p>
          <p>Smart campus resource management</p>
        </div>
      </footer>
    </main>
  );
}

/* STAT */

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-b border-slate-200 px-6 py-8 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-3xl font-semibold tracking-tight text-[#0B1120]">
        {number}
      </p>

      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

/* FEATURE CARD */

function FeatureCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-[#D7E4F5] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#1677FF]/50 hover:shadow-lg hover:shadow-[#1677FF]/10">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#102A43] text-[#75B8FF]">
          {icon}
        </div>

        <span className="text-sm font-semibold text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="mt-7 text-lg font-semibold text-[#102A43]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}