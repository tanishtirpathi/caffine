import Link from "next/link";
import Name from "../../components/name";
import {
	CircleHelp,
	Code2,
	Database,
	House,
	Info,
	LayoutDashboard,
	Search,
	Users,
} from "lucide-react";

const contributions = [
	{
		number: "01",
		icon: <Database size={20} />,
		title: "Reliable foundations",
		description:
			"We build the behind-the-scenes systems that keep venue information, accounts, and booking requests dependable.",
	},
	{
		number: "02",
		icon: <Search size={20} />,
		title: "Research-led decisions",
		description:
			"We learn what students and campus teams actually need, then turn those insights into focused, useful features.",
	},
	{
		number: "03",
		icon: <Code2 size={20} />,
		title: "Clear experiences",
		description:
			"We make the visible product easy to understand so finding a space and requesting it feels straightforward.",
	},
];

const team = [
	{
		initials: "TT",
		name: "Tanish Tirpathi",
		role: "Team leader · Backend developer",
		contribution:
			"Tanish guides the team's direction and builds the backend systems that power authentication, venues, and booking workflows.",
		avatar: "bg-[#0B1120] text-[#E8B928]",
		accent: "bg-[#E8B928]",
	},
	{
		initials: "AT",
		name: "Aditi Thakur",
		role: "Researcher",
		contribution:
			"Aditi turns questions into useful insights by researching campus needs, user expectations, and the details that make the product relevant.",
		avatar: "bg-[#FFF4C9] text-[#8E6A08]",
		accent: "bg-[#E8B928]",
	},
	{
		initials: "ST",
		name: "Suraj Thapa",
		role: "Frontend developer",
		contribution:
			"Suraj shapes the interface users interact with, focusing on responsive layouts, clear flows, and a smooth booking experience.",
		avatar: "bg-[#E5EEF5] text-[#315A78]",
		accent: "bg-[#315A78]",
	},
];

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-white text-[#0B1120]">
			<header className="sticky top-5 z-50 mx-4 rounded-2xl border border-slate-200 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl sm:mx-10">
				<div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
					<Link
						href="/"
						className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B928] focus-visible:ring-offset-2"
					>
						<Name scale={0.7} />
					</Link>

					<nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
						<NavLink href="/" icon={<House size={16} />} label="Home" />
						<NavLink href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
						<NavLink href="/about" icon={<Info size={16} />} label="About" active />
						<NavLink href="/faqs" icon={<CircleHelp size={16} />} label="FAQs" />
					</nav>

					<div className="flex items-center gap-2">
						<Link
							href="/auth/login"
							className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#0B1120] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B928] sm:block"
						>
							Login
						</Link>
						<Link
							href="/auth/register"
							className="rounded-lg bg-[#0B1120] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#161f33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B928] focus-visible:ring-offset-2"
						>
							Get started
						</Link>
					</div>
				</div>

				<div className="border-t border-slate-200 md:hidden">
					<nav className="flex items-center gap-1 overflow-x-auto px-4 py-2" aria-label="Mobile navigation">
						<MobileNavLink href="/" icon={<House size={15} />} label="Home" />
						<MobileNavLink href="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />
						<MobileNavLink href="/about" icon={<Info size={15} />} label="About" active />
						<MobileNavLink href="/faqs" icon={<CircleHelp size={15} />} label="FAQs" />
					</nav>
				</div>
			</header>

			{/* HERO */}
			<section className="relative overflow-hidden border-b border-slate-200 bg-[#F6F6F3]">
				<div className="pointer-events-none absolute -right-24 -top-28 size-96 rounded-full bg-[#E8B928]/15 blur-3xl" />
				<div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pb-28 sm:pt-28">
					<div className="max-w-3xl">
						<span className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#B28713]">
							<Info size={16} /> About CampusFlow
						</span>
						<h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#0B1120] sm:text-6xl">
							Better campus spaces begin with better coordination.
						</h1>
						<p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
							CampusFlow is built on a simple belief: booking a room for a class, meeting, or event should feel clear, fair, and easy for everyone involved.
						</p>
					</div>
				</div>
			</section>

			{/* PHILOSOPHY */}
			<section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:py-24 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
				<div>
					<SectionLabel>Our philosophy</SectionLabel>
					<h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#0B1120] sm:text-4xl">
						Make the complicated parts feel simple.
					</h2>
				</div>
				<div className="space-y-6 border-l border-slate-200 pl-8 text-base leading-8 text-slate-600">
					<p>
						Campuses are full of people, plans, and shared spaces. When information is scattered, a small booking can become a long chain of messages and avoidable conflicts.
					</p>
					<p>
						We believe technology should create calm instead of more noise. That means presenting the right information at the right moment, protecting the details that matter, and helping people make confident decisions quickly.
					</p>
					<p>
						CampusFlow is our contribution to a more connected campus: one where resources are visible, requests are easier to manage, and students and administrators can spend more time on the work that matters.
					</p>
				</div>
			</section>

			{/* HOW WE CONTRIBUTE */}
			<section className="border-y border-slate-200 bg-[#F6F6F3]">
				<div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
					<div className="max-w-2xl">
						<SectionLabel>How we contribute</SectionLabel>
						<h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0B1120] sm:text-4xl">
							Three perspectives, one useful product.
						</h2>
						<p className="mt-4 leading-7 text-slate-600">
							Our roles are different by design. Together, they help us balance technical reliability, real user needs, and a thoughtful experience.
						</p>
					</div>

					<div className="mt-12 grid gap-5 md:grid-cols-3">
						{contributions.map((contribution) => (
							<article
								key={contribution.title}
								className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm shadow-slate-900/5 transition duration-300 hover:border-[#E8B928]/50 hover:shadow-lg hover:shadow-[#E8B928]/10"
							>
								<div className="flex items-center justify-between">
									<div className="grid size-11 place-items-center rounded-xl bg-[#0B1120] text-[#E8B928]">
										{contribution.icon}
									</div>
									<span className="text-sm font-semibold text-slate-300">{contribution.number}</span>
								</div>
								<h3 className="mt-6 text-lg font-semibold text-[#0B1120]">{contribution.title}</h3>
								<p className="mt-3 text-sm leading-7 text-slate-600">{contribution.description}</p>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* TEAM */}
			<section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
				<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
					<div>
						<SectionLabel>Meet the team</SectionLabel>
						<h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#0B1120] sm:text-4xl">
							The people behind the work.
						</h2>
					</div>
					<div className="flex items-center gap-2 text-sm text-slate-500">
						<Users size={17} /> Built together, for campus communities.
					</div>
				</div>

				<div className="mt-12 grid gap-5 md:grid-cols-3">
					{team.map((member) => (
						<article
							key={member.name}
							className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
						>
							<div className={`h-[3px] w-full ${member.accent}`} />
							<div className="p-7">
								<div className={`grid size-14 place-items-center rounded-2xl text-lg font-semibold ${member.avatar}`}>
									{member.initials}
								</div>
								<h3 className="mt-6 text-xl font-semibold tracking-tight text-[#0B1120]">{member.name}</h3>
								<p className="mt-1 text-sm font-medium text-[#B28713]">{member.role}</p>
								<p className="mt-5 text-sm leading-7 text-slate-600">{member.contribution}</p>
							</div>
						</article>
					))}
				</div>
			</section>

			<footer className="border-t border-slate-200 bg-white">
				<div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
					<p>© 2026 CampusFlow</p>
					<p>Smart campus resource management</p>
				</div>
			</footer>
		</main>
	);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-2">
			<span className="h-[3px] w-6 rounded-full bg-[#E8B928]" />
			<p className="text-sm font-semibold text-[#B28713]">{children}</p>
		</div>
	);
}

function NavLink({
	href,
	icon,
	label,
	active = false,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
	active?: boolean;
}) {
	return (
		<Link
			href={href}
			className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B928] ${
				active ? "bg-slate-100 text-[#0B1120]" : "text-slate-600 hover:bg-slate-100 hover:text-[#0B1120]"
			}`}
		>
			{icon}
			{label}
		</Link>
	);
}

function MobileNavLink({
	href,
	icon,
	label,
	active = false,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
	active?: boolean;
}) {
	return (
		<Link
			href={href}
			className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
				active ? "bg-slate-100 text-[#0B1120]" : "text-slate-600 hover:bg-slate-100"
			}`}
		>
			{icon}
			{label}
		</Link>
	);
}