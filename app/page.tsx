"use client";
import Link from "next/link";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../components/navbar";
import { ArrowUpRight, CalendarDays, Check, ChevronRight, Clock3, MapPin, Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const MotionLink = motion.create(Link);

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
    <main className="min-h-screen overflow-hidden bg-[#ffffff] text-[#101827] px-10 ">
      <NoiseTexture/>

      <Navbar light />
      <section className="relative mx-auto mt-5 max-w-6xl rounded-t-xl 
      bg-[linear-gradient(to_bottom #b8b8b8_0%,#ffffff_100%)] 
      px-5 pb-10 pt-12 sm:px-8 lg:px-10 lg:pb-15 lg:pt-15">
        <NoiseTexture className="rounded-t-xl"/>
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <motion.div
            className="relative z-10 max-w-lg"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
            }}
          >
            <motion.h2
              className="font-serif text-5xl font-medium leading-[0.88] tracking-[-0.05em] text-[#101827] sm:text-6xl lg:text-[5.2rem]"
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
              }}
            >
              Find your
              <span className="block italic text-[#d19d00]">
                perfect space.
              </span>
            </motion.h2>
            <motion.div
              className="my-6 h-1 w-64 bg-[linear-gradient(90deg,transparent_0%,#69c9ff_22%,#dff7ff_50%,#69c9ff_78%,transparent_100%)]
              [clip-path:polygon(0_50%,22%_42%,45%_42%,48%_0,52%_0,55%_42%,78%_42%,100%_50%,78%_58%,55%_58%,52%_100%,48%_100%,45%_58%,22%_58%)] opacity-90"
              variants={{
                hidden: { opacity: 0, scaleX: 0.35 },
                visible: { opacity: 1, scaleX: 1, transition: { duration: 0.65, ease: "easeOut" } },
              }}
            />
            <motion.p
              className="mt-5 max-w-md font-sans text-sm leading-6 text-[#5b6573] sm:text-xs"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
            >
              Book classrooms, labs, halls, and every useful corner of your campus without the endless permission chase.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
              }}
            >
              <MotionLink
                href="/venue"
                className="group inline-flex items-center justify-center gap-2 
                rounded-full bg-[#101827] px-6 py-3.5 text-sm font-semibold text-white
                 shadow-[0_12px_25px_rgba(16,24,39,0.18)] transition hover:-translate-y-0.5 hover:bg-[#26334a]"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CalendarDays size={17} className="text-[#f1c62c]" />
                Explore venues
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1" />
              </MotionLink>
              <MotionLink
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-1 px-3 py-3.5 text-sm font-semibold text-[#596372] transition hover:text-[#101827]"
                whileHover={{ x: 4, color: "#0c0a0ace" }}
                whileTap={{ scale: 0.98 }}
              >
                Sign in to book
                <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
              </MotionLink>
            </motion.div>
          </motion.div>
          {/* Right side visual container */}
          <motion.div
            className="relative min-h-[280px] overflow-hidden rounded-[2rem] bg-[#dce9e9] 
            p-5 shadow-[0_25px_70px_rgba(43,55,68,0.14)] sm:min-h-[330px] sm:p-7"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#f4c82e]/60 blur-2xl" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#8bc4c4]/45 blur-3xl" />

            <div className="relative flex h-full min-h-[360px] flex-col justify-between gap-5 rounded-[1.5rem] border border-white/70 bg-white/55 p-5 backdrop-blur-sm sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#65717d]">Bookspot live</p>
                  <p className="mt-2 font-serif text-2xl text-[#101827]">Today on campus</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#101827] text-white">
                  <CalendarDays size={18} />
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm rounded-[1.5rem] bg-[#172235] p-6 text-white shadow-[0_24px_40px_rgba(16,24,39,0.24)] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/65">Available now</span>
                  <span className="flex items-center gap-1.5 text-xs text-[#f4c82e]">
                    <span className="h-2 w-2 rounded-full bg-[#f4c82e]" /> Live
                  </span>
                </div>
                <div className="mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-serif text-4xl">Seminar Hall</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-white/55">
                      <MapPin size={12} /> Main Block · 120 seats
                    </p>
                  </div>
                  <div className="shrink-0 rounded-xl bg-white/10 p-3">
                    <Search size={20} className="text-[#f4c82e]" />
                  </div>
                </div>
                <div className="mt-7 grid grid-cols-4 gap-2.5">
                  {["09:00", "11:30", "14:00", "16:30"].map((time, index) => (
                    <div
                      key={time}
                      className={`rounded-lg px-2 py-2.5 text-center text-[10px] ${index === 1 ? "bg-[#f4c82e] font-bold text-[#101827]" : "bg-white/10 text-white/70"
                        }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="h-8 w-8 rounded-full border-2 border-white bg-[#e5a98f]" />
                  <span className="h-8 w-8 rounded-full border-2 border-white bg-[#779ba8]" />
                  <span className="h-8 w-8 rounded-full border-2 border-white bg-[#bd8976]" />
                </div>
                <p className="text-xs font-medium text-[#65717d]">42 spaces checked this morning</p>
              </div>
            </div>

            <div className="absolute right-4 top-36 rounded-2xl bg-white px-4 py-3 shadow-xl sm:right-2 sm:top-40">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#101827]">
                <Check size={14} className="rounded-full bg-[#c7e7d0] p-0.5 text-[#22834b]" /> Request approved
              </div>
              <p className="mt-1 text-[10px] text-[#77808c]">Room 204 · just now</p>
            </div>

            <div className="absolute bottom-20 left-4 rounded-2xl bg-[#f4c82e] px-4 py-3 text-[#101827] shadow-xl sm:left-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em]">Next up</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-semibold">
                <Clock3 size={14} /> Lab 2 · 3:00 PM
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      
    </main>
  );
}