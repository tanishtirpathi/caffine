import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/venue", label: "Venues" },
      { href: "/calendar", label: "Calendar" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/faqs", label: "FAQs" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/auth/login", label: "Sign in" },
      { href: "/profile", label: "Profile" },
      { href: "/user", label: "Dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1A365D]/10 bg-[#F3F6F9]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 text-[#1E293B] transition hover:text-[#1A365D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A365D] text-sm font-semibold text-white">
                B
              </span>
              <span className="font-[var(--font-geist)] text-xl font-semibold tracking-[-0.04em]">Bookspot</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#475569]">
              Simple campus booking for classrooms, labs, studios, and shared spaces—without the friction.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#64748B]">{group.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#475569]">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-[#1A365D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-[#1A365D]/10 pt-6 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bookspot</p>
          <p>Campus spaces, organized.</p>
        </div>
      </div>
    </footer>
  );
}
