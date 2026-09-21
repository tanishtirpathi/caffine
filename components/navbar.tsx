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

export default function Navbar({ light = false }: { light?: boolean }) {
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

  const shellClasses = light
    ? "border-[#1A365D]/10 bg-white/85 shadow-[0_10px_35px_rgba(15,23,42,0.06)]"
    : "border-[#1A365D]/10 bg-white/80 shadow-[0_12px_35px_rgba(15,23,42,0.06)]";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className={`mx-auto max-w-7xl rounded-full border backdrop-blur-xl ${shellClasses}`}>
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-5">
          <Link
            href={homeHref}
            onClick={closeMenu}
            className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2"
          >
            <Name scale={0.72} light={light} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navigation.map(({ href, label, icon: Icon }) => (
              <NavLink
                key={href}
                href={href === "/" ? homeHref : href}
                label={href === "/" && user ? "Dashboard" : label}
                icon={<Icon size={15} />}
                active={Boolean(isActive(pathname, href === "/" ? homeHref : href))}
                light={light}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/venue"
                  className="inline-flex items-center rounded-full bg-[#1A365D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2"
                >
                  Book a venue
                </Link>
                <Link
                  href="/profile"
                  title={`Open ${user.name}'s profile`}
                  aria-label={`Open ${user.name}'s profile`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A365D]/10 bg-[#F8F8F8] text-[#1E293B] transition hover:bg-[#EEF3F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2"
                >
                  <UserRound size={18} />
                </Link>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/venue"
                  className="rounded-full border border-[#1A365D]/10 bg-white px-4 py-2 text-sm font-semibold text-[#1A365D] transition hover:bg-[#F8F8F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2"
                >
                  Explore venues
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-full bg-[#1A365D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2"
                >
                  Sign in
                </Link>
              </div>
            )}

            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1A365D]/10 bg-white text-[#1E293B] transition hover:bg-[#F8F8F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2 md:hidden"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={`${isMenuOpen ? "block" : "hidden"} border-t border-[#1A365D]/10 md:hidden`}
        >
          <nav className="grid gap-1 px-4 py-3" aria-label="Mobile navigation">
            {navigation.map(({ href, label, icon: Icon }) => (
              <MobileNavLink
                key={href}
                href={href === "/" ? homeHref : href}
                label={href === "/" && user ? "Dashboard" : label}
                icon={<Icon size={16} />}
                active={Boolean(isActive(pathname, href === "/" ? homeHref : href))}
                onClick={closeMenu}
                light={light}
              />
            ))}
            {!user ? (
              <div className="mt-2 grid gap-2 border-t border-[#1A365D]/10 pt-3">
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-full bg-[#1A365D] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/venue"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-full border border-[#1A365D]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A365D]"
                >
                  Explore venues
                </Link>
              </div>
            ) : (
              <Link
                href="/profile"
                onClick={closeMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-[#1A365D]/10 bg-[#F8F8F8] px-4 py-2.5 text-sm font-semibold text-[#1E293B]"
              >
                Open profile
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function isActive(pathname: string | null, href: string): boolean {
  return pathname !== null && (href === "/" ? pathname === href : pathname.startsWith(href));
}

function NavLink({
  href,
  icon,
  label,
  active,
  light,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  light: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2 ${
        active
          ? "bg-[#1A365D] text-white shadow-[0_8px_20px_rgba(26,54,93,0.18)]"
          : light
            ? "text-[#475569] hover:bg-[#F8F8F8] hover:text-[#1E293B]"
            : "text-[#475569] hover:bg-[#F8F8F8] hover:text-[#1E293B]"
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
  active,
  onClick,
  light,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  light: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex min-h-11 items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition active:scale-[0.98] ${
        active
          ? "bg-[#1A365D] text-white"
          : light
            ? "text-[#475569] hover:bg-[#F8F8F8]"
            : "text-[#475569] hover:bg-[#F8F8F8]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
