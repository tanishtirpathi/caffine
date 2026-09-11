import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight font-serif"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]
           text-sm font-bold text-white">
            C
          </span>
          CampusFlow
        </Link>

        <div className="hidden items-center gap-8 text-sm text-[#64748B] sm:flex">
          <Link
            href="/venues"
            className="transition hover:text-[#0F172A]"
          >
            Venues
          </Link>

          <Link
            href="/calendar"
            className="transition hover:text-[#0F172A]"
          >
            Availabe
          </Link>

          <Link
            href="/auth/login"
            className="rounded-lg bg-[#0F172A] px-4 py-2.5 font-medium text-white transition hover:bg-[#1E293B]"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-24 text-center sm:pt-32">
   

        <h1 className="max-w-4xl text-5xl font-light italic font-serif leading-[1.05]
         tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          Campus resource booking,
          <br />
          <span className="text-[#2563EB] text-7xl">
            without the scheduling chaos.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-7 text-black/80 sm:text-lg">
          Find available venues,  book that , and resolve scheduling
          conflicts with smarter alternatives — all in one place.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/calendar"
            className="rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            Check availability →
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-[#CBD5E1] bg-white px-6 py-3.5 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F1F5F9]"
          >
            Login to book
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#E2E8F0] bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-[#E2E8F0] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-6 py-8 text-center">
            <p className="text-3xl font-semibold tracking-tight">24</p>
            <p className="mt-1 text-sm text-[#64748B]">
              Active venues
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            <p className="text-3xl font-semibold tracking-tight">12</p>
            <p className="mt-1 text-sm text-[#64748B]">
              Bookings today
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            <p className="text-3xl font-semibold tracking-tight">3</p>
            <p className="mt-1 text-sm text-[#64748B]">
              Pending requests
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            From finding a venue to getting it booked.
          </h2>

          <p className="mt-4 leading-7 text-[#64748B]">
            CampusFlow keeps the entire booking process simple while handling
            conflicts behind the scenes.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-sm font-semibold text-[#2563EB]">
              01
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              Find a venue
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              Browse campus venues and check their availability for any date
              and time.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-sm font-semibold text-[#2563EB]">
              02
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              Request a booking
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              Authorized students and teachers can reserve a venue by
              submitting their event details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-sm font-semibold text-[#2563EB]">
              03
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              Resolve conflicts
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#64748B]">
              If your venue is unavailable, CampusFlow suggests suitable
              alternative venues and time slots.
            </p>
          </div>
        </div>
      </section>

     
      {/* Bottom CTA */}
      <section className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Need a venue?
          </h2>

          <p className="mx-auto mt-4 max-w-lg leading-7 text-[#64748B]">
            Check what&apos;s available across campus and find the right space
            for your next event.
          </p>

          <Link
            href="/calendar"
            className="mt-7 inline-flex rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            View campus availability →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 CampusFlow
          </p>

          <p>
            Smart campus resource management
          </p>
        </div>
      </footer>
    </main>
  );
}