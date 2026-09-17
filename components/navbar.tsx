"use client";

import {
  CircleHelp,
  House,
  Calendar,
  Info,
  LayoutDashboard,
  Menu,
  Newspaper,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Name from "./name";

const navigation = [
  { href: "/", label: "Home", icon: House },
  { href: "/venue", label: "Venues", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/about", label: "About", icon: Info },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/faqs", label: "FAQs", icon: CircleHelp },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  const closeMenu = () => setIsMenuOpen(false);
  const homeHref = user?.role === "admin" ? "/admin" : user ? "/user" : "/";

  useEffect(() => {
    let isMounted = true;

    fetch("/api/me")
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user as { name: string; role: string } | undefined;
      })
      .then((currentUser) => {
        if (isMounted) setUser(currentUser ?? null);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 mx-4 rounded-b-2xl border border-t-0 border-slate-200 bg-white/90
     shadow-sm shadow-slate-900/5 backdrop-blur-xl sm:mx-10">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href={homeHref}
          onClick={closeMenu}
          className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-
           focus-visible:ring-[#1677FF] focus-visible:ring-offset-2"
        >
          <Name scale={0.7} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={href}
              href={href === "/" ? homeHref : href}
              label={href === "/" && user ? "Dashboard" : label}
              icon={<Icon size={16} />}
              active={Boolean(isActive(pathname, href === "/" ? homeHref : href))}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/profile"
              title={`Open ${user.name}'s profile`}
              aria-label={`Open ${user.name}'s profile`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#102A43] text-white transition hover:bg-[#1677FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] focus-visible:ring-offset-2"
            >
              <UserRound size={19} />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-lg bg-[#102A43] px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-[#1677FF] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] sm:block"
              >
                Login
              </Link>
            </>
          )}
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#0B1120] transition hover:bg-slate-100 md:hidden"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`${isMenuOpen ? "block" : "hidden"} border-t border-slate-200 md:hidden`}
      >
        <nav className="grid gap-1 px-4 py-3" aria-label="Mobile navigation">
          {navigation.map(({ href, label, icon: Icon }) => (
            <MobileNavLink
              key={href}
              href={href === "/" ? homeHref : href}
              label={href === "/" && user ? "Dashboard" : label}
              icon={<Icon size={17} />}
              active={Boolean(isActive(pathname, href === "/" ? homeHref : href))}
              onClick={closeMenu}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}

function isActive(pathname: string | null, href: string): boolean {
  return pathname !== null &&
    (href === "/" ? pathname === href : pathname.startsWith(href));
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] ${active ? "bg-[#EAF3FF] text-[#102A43]" : "text-slate-600 hover:bg-[#F0F6FF] hover:text-[#102A43]"}`}
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
  active,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition active:scale-[0.98] ${active ? "bg-[#EAF3FF] text-[#102A43]" : "text-slate-600 hover:bg-[#F0F6FF] hover:text-[#102A43]"}`}
    >
      {icon}
      {label}
    </Link>
  );
}
