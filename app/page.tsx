"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  Check,
  ChevronRight,
  Clock3,
  GraduationCap,
  Sparkles,
  Users2,
} from "lucide-react";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);

const features = [
  {
    eyebrow: "Room discovery",
    title: "Find spaces that actually fit",
    description:
      "Browse classrooms, lecture halls, labs, and event spaces using filters for capacity, building, time, and required equipment.",
  },
  {
    eyebrow: "Approval",
    title: "Keep approvals transparent",
    description:
      "Track each booking from request to decision with clear visibility for coordinators, faculty, and admins.",
  },
  {
    eyebrow: "Scheduling",
    title: "Coordinate campus operations",
    description:
      "Stay ahead of overlaps, duplication, and missed bookings across departments with a single scheduling view.",
  },
];

const steps = [
  { number: "01", label: "Discover", text: "Search rooms by purpose, capacity, and availability." },
  { number: "02", label: "Request", text: "Submit a booking with the right schedule and resources." },
  { number: "03", label: "Approve", text: "Review, confirm, and keep every campus booking organized." },
];

const stats = [
  { value: "120+", label: "spaces" },
  { value: "14", label: "departments" },
  { value: "96%", label: "approval clarity" },
];

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
    <main className="min-h-screen bg-[#F8F8F8] text-[#111827]">
      <section className="mx-auto max-w-7xl overflow-x-hidden px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        <div className="w-full overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white">
          <div className="grid w-full gap-12 px-5 py-8 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex flex-col justify-center"
            >
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#475569]">
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                Campus operations platform
              </div>

              <h1 className="max-w-xl font-[var(--font-geist)] text-4xl font-semibold tracking-[-0.06em] text-[#0F172A] sm:text-5xl lg:text-[4.25rem] lg:leading-[0.96]">
                The simpler way to manage campus space.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-[#475569] sm:text-lg">
                Bookspot helps colleges coordinate classrooms, labs, seminar halls, and event spaces with a faster, clearer booking workflow for staff and faculty.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <MotionLink
                  href="/venue"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore spaces
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </MotionLink>
                <MotionLink
                  href="/auth/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Staff login
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </MotionLink>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#475569]">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5">
                    <span className="font-semibold text-[#111827]">{stat.value}</span>
                    <span className="ml-2">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-[520px] rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5">
                <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_10px_25px_rgba(15,23,42,0.03)]">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B]">Campus overview</p>
                      <h2 className="mt-2 font-[var(--font-geist)] text-2xl font-semibold text-[#0F172A]">Academic schedule</h2>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111827] text-white">
                      <CalendarCheck2 className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-[1.25fr_0.75fr]">
                    <div className="rounded-[18px] bg-[#111827] p-4 text-white">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-slate-300">
                        <span>Live status</span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                          Live
                        </span>
                      </div>

                      <div className="mt-5">
                        <p className="font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em]">18 requests</p>
                        <p className="mt-2 text-xs text-slate-300">Pending approval this week</p>
                      </div>

                      <div className="mt-5 space-y-2 text-[11px] text-slate-200">
                        {[
                          { label: "A-Block Seminar", time: "Tue · 10:00" },
                          { label: "Lab 4", time: "Wed · 13:30" },
                          { label: "Civic Hall", time: "Thu · 16:00" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-2">
                            <span>{item.label}</span>
                            <span>{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#64748B]">
                          <BadgeCheck className="h-3.5 w-3.5 text-[#111827]" />
                          Approved
                        </div>
                        <p className="mt-3 text-sm font-semibold text-[#0F172A]">Room 204</p>
                        <p className="mt-1 text-xs text-[#64748B]">Faculty seminar</p>
                      </div>

                      <div className="rounded-[16px] border border-[#F1D27A]/60 bg-[#FFF8E1] p-3">
                        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#7C5E15]">
                          <Clock3 className="h-3.5 w-3.5" />
                          Next review
                        </div>
                        <p className="mt-3 text-sm font-semibold text-[#0F172A]">3:00 PM today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B]">Built for colleges</p>
            <h2 className="mt-2 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em] text-[#0F172A] sm:text-4xl">
              A structured campus booking system.
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="rounded-[24px] border border-[#E2E8F0] bg-white p-6"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">{feature.eyebrow}</p>
              <h3 className="mt-4 font-[var(--font-geist)] text-2xl font-semibold tracking-[-0.04em] text-[#0F172A]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#475569]">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B]">How it works</p>
              <h2 className="mt-2 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em] text-[#0F172A] sm:text-4xl">
                A clear workflow from start to approval.
              </h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-[22px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B]">{step.number}</span>
                  <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                </div>
                <h3 className="mt-5 font-[var(--font-geist)] text-xl font-semibold text-[#0F172A]">{step.label}</h3>
                <p className="mt-3 text-sm leading-6 text-[#475569]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-6 sm:p-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B]">Why colleges choose it</p>
            <h2 className="mt-3 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em] text-[#0F172A] sm:text-4xl">
              Confident planning for academic teams.
            </h2>
            <div className="mt-6 space-y-3">
              {[
                "Reduce booking back-and-forth across departments and staff members.",
                "Keep venue availability clear, structured, and easier to review.",
                "Support lectures, events, and campus activities without operational chaos.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F0FF] text-[#111827]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm leading-6 text-[#475569]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E2E8F0] bg-[#111827] p-6 text-white sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">Campus coverage</p>
                <p className="mt-2 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em]">24 spaces</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#D4AF37]">
                <Users2 className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {[
                { label: "Lecture halls", value: "8" },
                { label: "Labs", value: "6" },
                { label: "Event rooms", value: "5" },
                { label: "Sports spaces", value: "5" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-medium text-white">{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#D4AF37]" style={{ width: `${(Number(item.value) / 8) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-white">
            <GraduationCap className="h-7 w-7" />
          </div>
          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748B]">Campus confidence</p>
          <h2 className="mt-3 font-[var(--font-geist)] text-3xl font-semibold tracking-[-0.05em] text-[#0F172A] sm:text-4xl">
            Keep every campus booking clear and accountable.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#475569]">
            Bookspot helps institutions organize rooms, approvals, and scheduling in one place, creating a smoother experience for staff, faculty, and students.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/venue" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1F2937]">
              View venues
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-[#F8FAFC]">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
