"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../components/navbar";
import Image from "next/image";
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
      <section className="relative overflow-hidden mb-60">
       
      
        <div className="mx-auto flex max-w-full flex-col items-center px-6 pb-20 pt-30 text-center sm:pt-38">
                
<div className="mb-16 flex items-center gap-3">
  <div className="flex items-center -space-x-3">
    <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-sm">
      <Image
        src="/logo/logo2.webp"
        alt="College 1"
        width={36}
        height={36}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-sm">
      <Image
        src="/logo/logo1.webp"
        alt="College 2"
        width={36}
        height={36}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-black text-xs font-semibold text-white shadow-sm">
      +14
    </div>
  </div>

  <h4 className="text-sm text-gray-500">
    used by{" "}
    <span className="font-bold text-gray-900">many colleges</span> and{" "}
    <span className="font-bold text-gray-900">universities</span> to manage
    their campus resources efficiently.
  </h4>
</div>
          <h1 className="max-w-6xl text-4xl leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-6xl">
            <span className="block font-main font-bold  text-[#000000]">Your campus </span>
            <span className=" block font-bold font-main text-black/60">One Booking spot for collages</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Find available venues, schedule events, and manage bookings
            effortlessly.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/venue"
              className="group inline-flex items-center gap-2 rounded-full
               bg-white/80 px-5 py-3 text-sm font-semibold text-gray-900 shadow-md 
               transition-colors hover:bg-gray-100"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-white">
                
              </span>
              Check availability
            </Link>

            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-1 px-2 py-3.5 text-sm font-bold text-[#2377bc] hover:text-[#1677FF]"
            >
              Login to book
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
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