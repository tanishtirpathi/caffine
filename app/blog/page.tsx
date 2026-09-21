import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Database,
  Gauge,
  KeyRound,
  Layers3,
  Monitor,
  Server,
  Zap,
} from "lucide-react";

const stack = [
  {
    icon: Monitor,
    name: "Next.js 14 (App Router) + React 18",
    why: "Server components handle the initial venue render, client components own interactive booking state, and the App Router keeps data-fetching colocated with the routes that need it.",
  },
  {
    icon: Layers3,
    name: "TypeScript, end to end",
    why: "Shared interfaces for Venue, Resource, Booking, and User are imported by both the API route handlers and the client, so a schema change fails the build instead of failing silently in production.",
  },
  {
    icon: Server,
    name: "Node.js API routes",
    why: "Route handlers do auth middleware, request validation, conflict detection, and admin-only actions, each as a discrete function rather than one large controller.",
  },
  {
    icon: Database,
    name: "MongoDB + Mongoose",
    why: "Venues, resources, users, and bookings are stored as documents with Mongoose schemas enforcing shape at the application layer, plus compound indexes on (venue, date, timeSlot) so overlap checks don't scan the collection.",
  },
  {
    icon: Zap,
    name: "Redis (cache-aside)",
    why: "Sits in front of MongoDB on the venue read path only. Reads check Redis first; writes invalidate the relevant keys instead of trying to keep a second copy of state in sync.",
  },
  {
    icon: KeyRound,
    name: "JWT + bcrypt",
    why: "Short-lived access tokens plus a refresh token in an HttpOnly cookie for sessions; bcrypt with a cost factor of 12 for password hashing, so a database leak doesn't leak usable credentials.",
  },
];

const benchmarkRows = [
  { metric: "Throughput (req/s)", before: "139.6", after: "393.7", improvement: "+182%", icon: ArrowUpRight },
  { metric: "Mean response time", before: "3.76 s", after: "0.157 s", improvement: "-96%", icon: Zap },
  { metric: "p95 response time", before: "5.06 s", after: "0.708 s", improvement: "-86%", icon: Gauge },
  { metric: "Error rate", before: "9.47%", after: "0%", improvement: "0 failures", icon: ArrowDown },
];

const implementationSteps = [
  [
    "01",
    "Read path checks the cache first",
    "GET /api/venues hashes the query params into a cache key (venues:list:{hash}) and calls Redis GET before touching Mongo. A hit is serialized JSON, returned as-is, with a short round trip since there's no query planner involved.",
  ],
  [
    "02",
    "A miss falls through to Mongo, then backfills",
    "On a cache miss, Mongoose runs a lean, projected find() against the venues collection, shapes the result the same way the client expects, and writes it back with SETEX and a 60-second TTL before responding.",
  ],
  [
    "03",
    "Writes invalidate, they don't update the cache",
    "POST and PATCH handlers for venues issue a targeted DEL on the affected keys after the Mongo write commits, rather than trying to patch the cached payload. Simpler to reason about, and it removes an entire class of drift bugs.",
  ],
  [
    "04",
    "Bookings never read from cache",
    "Availability checks and conflict detection query MongoDB directly inside the request that creates the booking, using the compound index on (venue, date, timeSlot) to find overlaps. Redis only ever accelerates the venue catalog, never the write path that decides whether a slot is free.",
  ],
];

export default function TechnicalBlogPage() {
  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#102A43]">
      <article>
        <header className="mx-auto max-w-4xl px-6 pb-16 pt-24 sm:px-10 sm:pt-32">
          <p className="text-sm font-medium text-[#1677FF]">Our case study , Bookspot</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-light font-serif leading-[1.05] tracking-[-0.03em] text-[#0B1120] sm:text-6xl">
            How  we made campus venue booking faster, clearer,easier, and ready for scale
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
            Bookspot is a booking platform for shared campus spaces, built on Next.js, MongoDB, and Redis. This is the
            technical story behind the system: the cache-aside pattern on the read path, and the load test that measured the difference.
          </p>
          <div className="mt-10 flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="rounded-full border border-[#D7E4F5] bg-white px-3 py-1.5">Bookspot</span>
            <span className="rounded-full border border-[#D7E4F5] bg-white px-3 py-1.5">Backend & performance</span>
            <span className="rounded-full border border-[#D7E4F5] bg-white px-3 py-1.5">5 min read</span>
            <span className="rounded-full border border-[#D7E4F5] bg-white px-3 py-1.5">Technical Blog</span>

          </div>
        </header>

        <section className="border-y border-[#D7E4F5] bg-[#EDF5FF]">
          <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 sm:py-20">
            <p className="font-serif text-4xl italic leading-tight text-[#0B1120] sm:text-5xl">Why I built this</p>
            <div className="mt-8 space-y-6 text-base leading-8 text-slate-600 sm:text-lg">
              <p>
                Campus spaces are shared resources, but the process for booking them is usually informal enough to fail:
                students ask around, administrators track requests in a spreadsheet, and two people can end up holding
                the same room for the same hour with no system catching it until someone shows up.
              </p>
              <p>
                I wanted one place where a student could look up a venue, see its live capacity and available resources,
                pick a time, and submit a request without a chain of messages. Administrators needed the other half:
                requests that are already validated, an approval flow that can't create a double-booking, and a
                dashboard that reflects the actual current state of campus spaces rather than a cached guess of it.
              </p>
              <p>
                That's the brief behind Bookspot: a booking API that treats authentication, request validation,
                conflict detection, and cache freshness as separate, testable concerns instead of one bundled
                &ldquo;save to database&rdquo; handler.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-24">
          <SectionHeading eyebrow="The problem" title="A booking flow has more than one kind of correctness" />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Callout
              number="01"
              title="Discovery is read-heavy"
              text="Venue browsing dominates traffic and repeats the same queries: same filters, same date ranges, same handful of popular rooms."
            />
            <Callout
              number="02"
              title="Requests need real validation"
              text="Date, time range, headcount against capacity, and selected resources all have to be checked server-side, not trusted from the client."
            />
            <Callout
              number="03"
              title="Approval must be race-safe"
              text="Two overlapping requests approved at nearly the same time is the failure mode that matters most, and it has to be closed at the database layer."
            />
          </div>
          <p className="mt-10 max-w-3xl text-lg leading-8 text-slate-600">
            Those are different problems with different fixes. Discovery is where caching pays off, because the same
            read gets issued thousands of times for data that changes infrequently. Validation and conflict detection
            are exactly where you don't want a cache in the loop &mdash; they need to see the current, authoritative state
            of the bookings collection on every request.
          </p>
        </section>

        <section className="border-y border-[#D7E4F5] bg-[#F2F8FF]">
          <div className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-24">
            <SectionHeading eyebrow="What we used" title="Every layer has one job" />
            <div className="mt-12 divide-y divide-[#D7E4F5] border-y border-[#D7E4F5]">
              {stack.map(({ icon: Icon, name, why }) => (
                <div key={name} className="grid gap-4 py-7 sm:grid-cols-[48px_220px_1fr] sm:items-start">
                  <div className="grid size-10 place-items-center rounded-full bg-[#EAF3FF] text-[#1677FF]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#102A43]">{name}</h3>
                  <p className="leading-7 text-slate-600">{why}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-24">
          <SectionHeading eyebrow="How the system works" title="A cache-aside read path over an authoritative database" />
          <div className="mt-12 space-y-0 border-l border-[#D7E4F5] pl-6 sm:pl-10">
            {implementationSteps.map(([number, title, text]) => (
              <div key={number} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[43px] top-0 grid size-6 place-items-center rounded-full border border-[#1677FF] bg-white text-[11px] font-semibold text-[#1677FF] sm:-left-[55px]">
                  {number}
                </span>
                <h3 className="text-xl font-semibold text-[#102A43]">{title}</h3>
                <p className="mt-3 max-w-2xl leading-7 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 rounded-2xl border border-[#CFE3FF] bg-[#EAF3FF] p-6 sm:p-8">
            <p className="text-sm font-semibold text-[#102A43]">The important boundary</p>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              Redis makes reads cheaper, and that's the whole extent of its job. It never decides whether a booking is
              valid. The booking handler still queries MongoDB directly for the venue, capacity, requested resources,
              date, time range, and any overlapping pending or approved bookings, using the compound index on (venue,
              date, timeSlot), before a request is ever created.
            </p>
          </div>
        </section>

        <section className="border-y border-[#D7E4F5] bg-[#F2F8FF]">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-24">
            <div className="max-w-3xl">
              <p className="font-serif text-4xl italic leading-tight text-[#0B1120] sm:text-5xl">
                The numbers worth putting on the slide
              </p>
              <p className="mt-6 text-base leading-7 text-slate-600">
                Load-tested with k6, ramping to 1,000 concurrent virtual users against the venue listing endpoint, same
                script run before and after Redis was added to the read path. 
              </p>
            </div>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#D7E4F5] text-sm text-slate-500">
                    <th className="pb-5 pr-6 font-medium">Metric</th>
                    <th className="pb-5 px-6 text-right font-medium">Before Redis</th>
                    <th className="pb-5 px-6 text-right font-medium">After Redis</th>
                    <th className="pb-5 pl-6 text-right font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkRows.map(({ metric, before, after, improvement, icon: Icon }) => (
                    <tr key={metric} className="border-b border-[#D7E4F5] text-base">
                      <th className="py-7 pr-6 font-normal text-[#102A43]">{metric}</th>
                      <td className="px-6 py-7 text-right text-slate-500">{before}</td>
                      <td className="px-6 py-7 text-right text-lg font-semibold text-[#0B1120]">{after}</td>
                      <td className="whitespace-nowrap pl-6 py-7 text-right font-semibold text-[#1677FF]">
                        <span className="inline-flex items-center gap-2">
                          <Icon size={16} />
                          {improvement}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <MetricCard value="+182%" label="Throughput" detail="139.6 to 393.7 req/s at 1,000 VUs" />
              <MetricCard value="0.157 s" label="Mean response time" detail="down from 3.76 s, a 96% drop" />
              <MetricCard value="0%" label="Error rate" detail="down from 9.47% under the same load" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-24">
          <SectionHeading eyebrow="What changed in practice" title="The improvement wasn't just a faster number" />
          <div className="mt-10 space-y-6 text-lg leading-8 text-zinc-600">
            <p>
              Throughput went from 139.6 to 393.7 requests per second under the same 1,000-virtual-user load, a{" "}
              <strong className="font-semibold text-zinc-950">182% increase</strong>. That's the difference between the
              venue endpoint being the bottleneck in the system and it having headroom to spare.
            </p>
            <p>
              Mean response time dropped from 3.76 seconds to 0.157 seconds, roughly a{" "}
              <strong className="font-semibold text-zinc-950">96% reduction</strong>. The p95 improved from 5.06 seconds
              to 0.708 seconds, which is the number that actually matters for user experience: it describes the slower
              edge of requests, not the comfortable average, and it's the number that was making the booking flow feel
              broken under load even when most requests were fine.
            </p>
            <p>
              Error rate went from 9.47% to 0%, meaning the connection pool and event loop stopped saturating under
              concurrent Mongo reads. That result is scoped to this benchmark's test conditions &mdash; a fixed ramp
              profile against a single endpoint &mdash; not a claim that production failures are now impossible. It's
              evidence the read path stopped being the constraint, which is what the change was meant to prove.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold text-[#1677FF]">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.03em] text-[#102A43] sm:text-5xl">{title}</h2>
    </div>
  );
}

function Callout({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="border-t border-[#D7E4F5] pt-5">
      <p className="text-xs font-bold text-[#1677FF]">{number}</p>
      <h3 className="mt-5 text-xl font-semibold text-[#102A43]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function MetricCard({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="border border-[#D7E4F5] bg-white p-5">
      <p className="text-3xl font-semibold text-[#0B1120]">{value}</p>
      <p className="mt-3 text-sm font-semibold text-[#102A43]">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}