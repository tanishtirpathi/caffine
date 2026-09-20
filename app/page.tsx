"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);

const featureCards = [
  {
    title: "Campus-ready space discovery",
    description:
      "Browse classrooms, studios, labs, and meeting rooms with availability that updates in real time.",
    icon: SearchIcon,
  },
  {
    title: "One-step booking requests",
    description:
      "Submit a request with the right date, capacity, and equipment needs without chasing approvals manually.",
    icon: CalendarIcon,
  },
  {
    title: "Trusted access and visibility",
    description:
      "Keep bookings transparent for students and staff with clear status tracking and secure access checks.",
    icon: ShieldIcon,
  },
];

const processSteps = [
  { title: "Find a space", text: "Filter by room type, capacity, and features that match your event or class." },
  { title: "Request a booking", text: "Share your time, attendee count, and any equipment you need in minutes." },
  { title: "Get approved", text: "Track the status in one place and coordinate with the campus team easily." },
];

const stats = [
  { value: "150+", label: "bookable spaces" },
  { value: "4 min", label: "average request time" },
  { value: "98%", label: "approval visibility" },
];

const categoryPills = ["Lecture halls", "Labs", "Studios", "Meeting rooms", "Event spaces", "Sports halls"];

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
    <main className="min-h-screen overflow-x-hidden bg-[#F8F8F8] text-[#1E293B]">
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_25%),radial-gradient(circle_at_right,_rgba(26,54,93,0.10),_transparent_30%)]" />

        <section className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pb-20">
          <div className="overflow-hidden rounded-[32px] border border-[#1A365D]/10 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
            <div className="relative px-5 pb-16 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pb-20 lg:pt-10">
              <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
                <motion.div
                  className="max-w-xl"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1A365D]/10 bg-[#1A365D]/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A365D]">
                    <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                    Campus booking made simple
                  </div>

                  <h1 className="font-[var(--font-geist)] text-4xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#1E293B] sm:text-5xl lg:text-[4.3rem]">
                    Book the right space
                    <span className="mt-1 block text-[#1A365D]">for every moment.</span>
                  </h1>

                  <p className="mt-5 max-w-lg text-base leading-7 text-[#475569] sm:text-lg">
                    Discover reliable campus venues, request bookings in minutes, and keep every event, class, or meeting organized from one place.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <MotionLink
                      href="/venue"
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1A365D] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#132848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Explore venues
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </MotionLink>

                    <MotionLink
                      href="/auth/login"
                      className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#1A365D]/15 bg-white px-6 py-3.5 text-sm font-semibold text-[#1A365D] transition-all duration-200 hover:border-[#1A365D]/25 hover:bg-[#F8F8F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign in to book
                      <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </MotionLink>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#475569]">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-full border border-[#1A365D]/10 bg-[#F8F8F8] px-3 py-2">
                        <span className="font-semibold text-[#1A365D]">{stat.value}</span>
                        <span className="ml-2">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
                >
                  <div className="relative mx-auto max-w-[520px] rounded-[28px] border border-[#1A365D]/10 bg-[#EEF3F8] p-4 shadow-[0_26px_48px_rgba(26,54,93,0.10)] sm:p-6">
                    <div className="absolute -right-10 -top-8 h-28 w-28 rounded-full bg-[#D4AF37]/25 blur-2xl" />
                    <div className="absolute -bottom-10 -left-8 h-28 w-28 rounded-full bg-[#1A365D]/10 blur-2xl" />

                    <div className="relative rounded-[24px] border border-white/80 bg-white/80 p-4 backdrop-blur-sm sm:p-5">
                      <div className="flex items-center justify-between gap-4 border-b border-[#1A365D]/10 pb-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748B]">Today on campus</p>
                          <h2 className="mt-2 font-[var(--font-geist)] text-2xl font-semibold text-[#1E293B]">Seminar Hall</h2>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1A365D] text-white">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-[1.3fr_0.7fr]">
                        <div className="rounded-[20px] bg-[#1A365D] p-4 text-white shadow-[0_18px_28px_rgba(26,54,93,0.22)]">
                          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/70">
                            <span>Available</span>
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                              Live
                            </span>
                          </div>

                          <div className="mt-5 flex items-end justify-between gap-3">
                            <div>
                              <p className="font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em]">120 seats</p>
                              <p className="mt-2 flex items-center gap-1 text-xs text-white/70">
                                <MapPin className="h-3.5 w-3.5" /> Main Block
                              </p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-2.5">
                              <Building2 className="h-4 w-4 text-[#D4AF37]" />
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[10px] text-white/80">
                            {[
                              { time: "09:00", active: false },
                              { time: "11:30", active: true },
                              { time: "14:00", active: false },
                              { time: "16:30", active: false },
                            ].map((slot) => (
                              <div
                                key={slot.time}
                                className={`rounded-lg px-2 py-2 ${slot.active ? "bg-[#D4AF37] font-semibold text-[#1E293B]" : "bg-white/10"}`}
                              >
                                {slot.time}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="rounded-[18px] border border-[#1A365D]/10 bg-[#F8F8F8] p-3">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
                              <BadgeCheck className="h-3.5 w-3.5 text-[#1A365D]" />
                              Approved
                            </div>
                            <p className="mt-3 text-sm font-semibold text-[#1E293B]">Room 204</p>
                            <p className="mt-1 text-xs text-[#64748B]">Just now</p>
                          </div>

                          <div className="rounded-[18px] border border-[#D4AF37]/30 bg-[#FFF9E9] p-3">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7C5E15]">
                              <Clock3 className="h-3.5 w-3.5" />
                              Next up
                            </div>
                            <p className="mt-3 text-sm font-semibold text-[#1E293B]">Lab 2 · 3:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">Why students choose Bookspot</p>
              <h3 className="mt-2 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em] text-[#1E293B] sm:text-4xl">
                Built for fast, confident bookings.
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categoryPills.map((pill) => (
                <span key={pill} className="rounded-full border border-[#1A365D]/10 bg-white px-3 py-1.5 text-xs font-medium text-[#475569]">
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <motion.article
                key={title}
                className="group rounded-[26px] border border-[#1A365D]/10 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A365D]/5 text-[#1A365D]">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-[var(--font-geist)] text-xl font-semibold tracking-[-0.04em] text-[#1E293B]">{title}</h4>
                <p className="mt-3 text-sm leading-6 text-[#475569]">{description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[30px] border border-[#1A365D]/10 bg-[#1A365D] text-white">
            <div className="grid gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">How it works</p>
                <h3 className="mt-3 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                  A smoother booking flow from first search to final approval.
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {processSteps.map((step, index) => (
                  <div key={step.title} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-sm font-bold text-[#1E293B]">
                      {index + 1}
                    </div>
                    <h4 className="font-[var(--font-geist)] text-lg font-semibold text-white">{step.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-200">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-[30px] border border-[#1A365D]/10 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.04)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">For students and organizers</p>
                <h3 className="mt-3 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em] text-[#1E293B] sm:text-4xl">
                  Everything needed to plan, request, and manage campus spaces.
                </h3>
                <div className="mt-6 space-y-4">
                  {[
                    "Clear venue filters for capacity, location, and resources",
                    "Approval visibility for admin and student workflows",
                    "Responsive booking experience across mobile, tablet, and desktop",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3 rounded-2xl bg-[#F8F8F8] p-3">
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#1A365D]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm leading-6 text-[#475569]">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#1A365D]/10 bg-[#F8F8F8] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">Campus overview</p>
                    <p className="mt-2 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em] text-[#1E293B]">24 spaces</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A365D] text-white">
                    <Users2 className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: "Lecture halls", value: "8" },
                    { label: "Labs", value: "6" },
                    { label: "Event rooms", value: "5" },
                    { label: "Sports spaces", value: "5" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm text-[#475569]">
                        <span>{item.label}</span>
                        <span className="font-semibold text-[#1E293B]">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                        <div
                          className="h-full rounded-full bg-[#D4AF37]"
                          style={{ width: `${(Number(item.value) / 8) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SearchIcon(props: React.ComponentProps<typeof Search>) {
  const { className, ...rest } = props;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...rest} className={className}><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" strokeLinecap="round" /></svg>;
}

function CalendarIcon(props: React.ComponentProps<typeof CalendarDays>) {
  const { className, ...rest } = props;
  return <CalendarDays {...rest} className={className} />;
}

function ShieldIcon(props: React.ComponentProps<typeof ShieldCheck>) {
  const { className, ...rest } = props;
  return <ShieldCheck {...rest} className={className} />;
}
