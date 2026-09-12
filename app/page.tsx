import Link from "next/link";
import Name from "../components/name";

import {
  CircleHelp,
  House,
  Info,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  MapPin,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#0B1120]">
      {/* HEADER */}
      <header className="sticky top-5 z-50 border border-slate-200 bg-white/90 backdrop-blur-xl mx-10 rounded-2xl shadow-sm shadow-slate-900/5">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center">
            <Name scale={0.7} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/" icon={<House size={16} />} label="Home" />
            <NavLink
              href="/dashboard"
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
            />
            <NavLink href="/about" icon={<Info size={16} />} label="About" />
            <NavLink
              href="/faqs"
              icon={<CircleHelp size={16} />}
              label="FAQs"
            />
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#0B1120] sm:block"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="rounded-lg bg-[#0B1120] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#161f33]"
            >
              Get started
            </Link>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="border-t border-slate-200 md:hidden">
          <nav className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2">
            <MobileNavLink href="/" icon={<House size={15} />} label="Home" />
            <MobileNavLink
              href="/dashboard"
              icon={<LayoutDashboard size={15} />}
              label="Dashboard"
            />
            <MobileNavLink
              href="/about"
              icon={<Info size={15} />}
              label="About"
            />
            <MobileNavLink
              href="/faqs"
              icon={<CircleHelp size={15} />}
              label="FAQs"
            />
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-[#E8B928]/10 blur-3xl" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-20 text-center sm:pt-28">  
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#0B1120] sm:text-6xl lg:text-7xl">
            Campus booking,
            <span className="block">without the chaos.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Find available venues, schedule events, and manage bookings
            effortlessly with a simple platform built for modern campuses.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8B928] px-6 py-3.5 text-sm font-semibold text-[#0B1120] shadow-lg shadow-[#E8B928]/25 transition hover:-translate-y-0.5 hover:bg-[#D9AB1E]"
            >
              Check availability
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-[#0B1120] shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Login to book
            </Link>
          </div>

          {/* Small trust text */}
          <div className="mt-7 flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 size={16} className="text-[#C99A1F]" />
            Simple booking · Conflict prevention · Campus-wide availability
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-3">
          <Stat number="24" label="Active venues" />
          <Stat number="12" label="Bookings today" />
          <Stat number="3" label="Pending requests" />
        </div>
      </section>

      {/* FEATURES / HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-[#C99A1F]">How it works</p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0B1120] sm:text-4xl">
            Everything you need to manage campus bookings.
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            CampusFlow keeps the entire booking process simple while helping
            prevent scheduling conflicts.
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
            description="CampusFlow helps identify unavailable slots and makes finding alternatives easier."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#0B1120] px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-[#E8B928]/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold text-[#E8B928]">
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
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#E8B928] px-6 py-3.5 text-sm font-semibold text-[#0B1120] transition hover:bg-[#D9AB1E]"
            >
              View campus availability
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CampusFlow</p>
          <p>Smart campus resource management</p>
        </div>
      </footer>
    </main>
  );
}

/* NAV LINK */

function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#0B1120]"
    >
      {icon}
      {label}
    </Link>
  );
}

/* MOBILE NAV */

function MobileNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
    >
      {icon}
      {label}
    </Link>
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
    <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#E8B928]/50 hover:shadow-lg hover:shadow-[#E8B928]/10">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1120] text-[#E8B928]">
          {icon}
        </div>

        <span className="text-sm font-semibold text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="mt-7 text-lg font-semibold text-[#0B1120]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}