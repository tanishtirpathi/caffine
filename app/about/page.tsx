import Link from "next/link";
import { ArrowUpRight, Code2, Database, Search, Users } from "lucide-react";

const contributions = [
  ["01", <Database key="foundations" size={19} />, "Reliable foundations", "We build the systems that keep venue information, accounts, and booking requests dependable."],
  ["02", <Search key="research" size={19} />, "Research-led decisions", "We learn what students and campus teams need, then turn those insights into focused features."],
  ["03", <Code2 key="experiences" size={19} />, "Clear experiences", "We make finding a space and requesting it feel straightforward for everyone involved."],
] as const;

const team = [
  ["TT", "Tanish Tirpathi", "Team leader · Backend developer", "Tanish guides the team's direction and builds the backend systems behind authentication, venues, and bookings."],
  ["AT", "Aditi Thakur", "Researcher", "Aditi researches campus needs and user expectations, turning questions into insights that keep the product relevant."],
  ["ST", "Suraj Thapa", "Frontend developer", "Suraj shapes the responsive interface and the clear flows that make booking a campus space feel simple."],
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F5FAFF] text-[#102A43]">
      <article>
        <header className="mx-auto max-w-4xl px-6 pb-16 pt-24 sm:px-10 sm:pt-32">
          <p className="text-sm font-medium text-[#1677FF]">About Bookspot</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-light leading-[1.05] tracking-[-0.03em] text-[#0B1120] sm:text-6xl">Better campus spaces begin with better coordination.</h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">Bookspot is a campus resource platform built around one simple idea: booking a room for a class, meeting, or event should feel clear, fair, and easy.</p>
          <div className="mt-10 flex flex-wrap gap-2 text-sm text-slate-500"><span className="rounded-full border border-[#D7E4F5] bg-white px-3 py-1.5">Bookspot</span><span className="rounded-full border border-[#D7E4F5] bg-white px-3 py-1.5">Our story</span><span className="rounded-full border border-[#D7E4F5] bg-white px-3 py-1.5">Campus resource management</span></div>
        </header>

        <section className="border-y border-[#D7E4F5] bg-[#EDF5FF]"><div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 sm:py-20"><p className="font-serif text-4xl italic leading-tight text-[#0B1120] sm:text-5xl">Why we built this</p><div className="mt-8 space-y-6 text-base leading-8 text-slate-600 sm:text-lg"><p>Campus spaces are shared resources, but the process for using them is often scattered across messages, spreadsheets, and memory. That makes a simple booking harder than it needs to be.</p><p>We wanted one place where students could discover a venue, understand its capacity and available resources, choose a time, and submit a request. Administrators needed the other half: validated requests, clear approvals, and a current view of campus activity.</p><p>Bookspot is our answer to that problem: a focused platform that makes shared spaces visible, requests manageable, and coordination less stressful.</p></div></div></section>

        <section className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-24"><SectionHeading eyebrow="Our philosophy" title="Make the complicated parts feel simple." /><div className="mt-10 grid gap-4 sm:grid-cols-3"><Callout number="01" title="Make it visible" text="Show people which spaces exist, where they are, what they hold, and which resources are available." /><Callout number="02" title="Make it dependable" text="Validate requests at the API boundary and keep booking conflicts from becoming someone else's problem." /><Callout number="03" title="Make it human" text="Give students and administrators a calm, direct workflow instead of another complicated system." /></div><p className="mt-10 max-w-3xl text-lg leading-8 text-slate-600">Technology should create calm instead of more noise. That means presenting the right information at the right moment, protecting the details that matter, and helping people make confident decisions quickly.</p></section>

        <section className="border-y border-[#D7E4F5] bg-[#F2F8FF]"><div className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-24"><SectionHeading eyebrow="How we contribute" title="Three perspectives, one useful product." /><p className="mt-6 max-w-2xl leading-7 text-slate-600">Our roles are different by design. Together, they help us balance technical reliability, real user needs, and a thoughtful experience.</p><div className="mt-12 divide-y divide-[#D7E4F5] border-y border-[#D7E4F5]">{contributions.map(([number, icon, title, description]) => <div key={title} className="grid gap-4 py-7 sm:grid-cols-[48px_220px_1fr] sm:items-start"><div className="grid size-10 place-items-center rounded-full bg-[#EAF3FF] text-[#1677FF]">{icon}</div><div className="flex items-baseline justify-between gap-4 sm:contents"><h3 className="text-lg font-semibold text-[#102A43]">{title}</h3><span className="text-sm font-medium text-slate-400">{number}</span></div><p className="leading-7 text-slate-600 sm:col-start-3">{description}</p></div>)}</div></div></section>

        <section className="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-24"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><SectionHeading eyebrow="Meet the team" title="The people behind the work." /><div className="flex items-center gap-2 text-sm text-slate-500"><Users size={17} /> Built together, for campus communities.</div></div><div className="mt-12 grid gap-4 sm:grid-cols-3">{team.map(([initials, name, role, contribution]) => <article key={name} className="border-t border-[#D7E4F5] pt-5"><div className="grid size-12 place-items-center rounded-full bg-[#102A43] text-sm font-semibold text-[#75B8FF]">{initials}</div><h3 className="mt-6 text-xl font-semibold text-[#102A43]">{name}</h3><p className="mt-1 text-sm font-medium text-[#1677FF]">{role}</p><p className="mt-5 text-sm leading-7 text-slate-600">{contribution}</p></article>)}</div></section>
      </article>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="max-w-2xl"><p className="text-sm font-medium text-[#1677FF]">{eyebrow}</p><h2 className="mt-5 text-4xl font-light leading-tight tracking-[-0.03em] text-[#102A43] sm:text-5xl">{title}</h2></div>;
}

function Callout({ number, title, text }: { number: string; title: string; text: string }) {
  return <article className="border-t border-[#D7E4F5] pt-5"><p className="text-xs font-semibold text-[#1677FF]">{number}</p><h3 className="mt-5 text-xl font-semibold text-[#102A43]">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>;
}
