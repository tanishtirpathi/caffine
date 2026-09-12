import Link from "next/link";
import {
	ArrowRight,
	CalendarDays,
	CircleHelp,
	House,
	Info,
	LayoutDashboard,
	Plus,
} from "lucide-react";

const faqGroups = [
	{
		label: "Getting started",
		questions: [
			{
				question: "What is CampusFlow?",
				answer:
					"CampusFlow is a simple way to find campus venues, check their availability, and request a booking without chasing spreadsheets or sending back-and-forth messages.",
			},
			{
				question: "Who can use CampusFlow?",
				answer:
					"Students can browse venues and submit booking requests. Campus administrators manage venue details, review requests, and keep campus availability up to date.",
			},
			{
				question: "How do I find a suitable venue?",
				answer:
					"Open the dashboard to browse available venues. You can review each space's capacity, location, facilities, and current availability before choosing one for your event.",
			},
		],
	},
	{
		label: "Bookings",
		questions: [
			{
				question: "How do I request a booking?",
				answer:
					"Choose a venue, select your date and time, then add the event details requested in the booking form. Submit the request to send it to the campus administrator for review.",
			},
			{
				question: "Can I book a venue that is already reserved?",
				answer:
					"No. CampusFlow shows unavailable time slots and helps prevent overlapping requests, so you can choose another time or find a different venue before submitting.",
			},
			{
				question: "How do I know whether my booking was approved?",
				answer:
					"Your booking request is reviewed by an administrator. Check your user dashboard for the latest status and any updates connected to your request.",
			},
			{
				question: "Can I cancel or change a booking?",
				answer:
					"Please contact your campus administrator as soon as possible with the booking details. They can confirm whether the request can be changed or cancelled based on campus policy.",
			},
		],
	},
	{
		label: "Account & support",
		questions: [
			{
				question: "I forgot my login details. What should I do?",
				answer:
					"Use the login page with the account details provided by your campus. If you still cannot sign in, contact your campus administrator for help restoring access.",
			},
			{
				question: "What information should I include in an event request?",
				answer:
					"Include a clear event name, the date and time, expected attendance, and any setup or facility needs. Good details help administrators approve requests faster.",
			},
		],
	},
];

export default function FaqsPage() {
	return (
		<main className="min-h-screen bg-white text-[#0B1120]">
			<header className="sticky top-5 z-50 mx-4 rounded-2xl border border-slate-200 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl sm:mx-10">
				<div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
					<Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
						<span className="grid size-9 place-items-center rounded-xl bg-[#0B1120] text-[#E8B928]"><CalendarDays size={18} /></span>
						<span>CampusFlow</span>
					</Link>
					<nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
						<NavLink href="/" icon={<House size={16} />} label="Home" />
						<NavLink href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
						<NavLink href="/about" icon={<Info size={16} />} label="About" />
						<NavLink href="/faqs" icon={<CircleHelp size={16} />} label="FAQs" active />
					</nav>
					<div className="flex items-center gap-2">
						<Link href="/auth/login" className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#0B1120] sm:block">Login</Link>
						<Link href="/auth/register" className="rounded-lg bg-[#0B1120] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#161f33]">Get started</Link>
					</div>
				</div>
				<div className="border-t border-slate-200 md:hidden">
					<nav className="flex items-center gap-1 overflow-x-auto px-4 py-2" aria-label="Mobile navigation">
						<MobileNavLink href="/" icon={<House size={15} />} label="Home" />
						<MobileNavLink href="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />
						<MobileNavLink href="/about" icon={<Info size={15} />} label="About" />
						<MobileNavLink href="/faqs" icon={<CircleHelp size={15} />} label="FAQs" active />
					</nav>
				</div>
			</header>

			<section className="relative overflow-hidden border-b border-slate-200 bg-[#f7f7f5]">
				<div className="pointer-events-none absolute -right-20 -top-22 size-96 rounded-full bg-[#E8B928]/15 blur-3xl" />
				<div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pb-20 sm:pt-28">
					<div className="max-w-3xl">
						<p className="flex items-center gap-2 text-sm font-semibold text-[#B28713]"><CircleHelp size={17} /> Help center</p>
						<h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#0B1120] sm:text-6xl">Answers for a smoother campus day.</h1>
						<p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Find quick answers about venues, booking requests, account access, and keeping your next event on track.</p>
					</div>
				</div>
			</section>

			<section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[220px_1fr] lg:gap-20">
				<aside className="h-fit lg:sticky lg:top-32">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">On this page</p>
					<nav className="mt-4 space-y-2" aria-label="FAQ sections">
						{faqGroups.map((group, index) => <a key={group.label} href={`#faq-group-${index + 1}`} className="block border-l-2 border-slate-200 py-1 pl-4 text-sm text-slate-500 transition hover:border-[#E8B928] hover:text-[#0B1120]">{group.label}</a>)}
					</nav>
				</aside>

				<div className="max-w-3xl">
					{faqGroups.map((group, groupIndex) => (
						<section key={group.label} id={`faq-group-${groupIndex + 1}`} className="scroll-mt-32 [&+section]:mt-14">
							<div className="mb-4 flex items-center gap-3"><span className="text-sm font-semibold text-[#B28713]">0{groupIndex + 1}</span><h2 className="text-xl font-semibold tracking-tight text-[#0B1120]">{group.label}</h2></div>
							<div className="divide-y divide-slate-200 border-y border-slate-200">
								{group.questions.map((item) => (
									<details key={item.question} className="group">
										<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-[#0B1120] transition hover:text-[#B28713] [&::-webkit-details-marker]:hidden">
											{item.question}
											<span className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition group-open:rotate-45 group-open:border-[#E8B928] group-open:bg-[#FFF8DF] group-open:text-[#B28713]"><Plus size={17} /></span>
										</summary>
										<p className="max-w-2xl pb-5 pr-12 text-sm leading-7 text-slate-600">{item.answer}</p>
									</details>
								))}
							</div>
						</section>
					))}

				
				</div>
			</section>

			<footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 CampusFlow</p><p>Smart campus resource management</p></div></footer>
		</main>
	);
}

function NavLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
	return <Link href={href} className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${active ? "bg-slate-100 text-[#0B1120]" : "text-slate-600 hover:bg-slate-100 hover:text-[#0B1120]"}`}>{icon}{label}</Link>;
}

function MobileNavLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
	return <Link href={href} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${active ? "bg-slate-100 text-[#0B1120]" : "text-slate-600 hover:bg-slate-100"}`}>{icon}{label}</Link>;
}
