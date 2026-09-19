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

  return (
    <header className={`sticky top-5 z-50 mx-4 rounded-2xl sm:mx-10 ${light ? "text-[#111827]" : ""}`}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href={homeHref}
          onClick={closeMenu}
          className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-[#78caff] focus-visible:ring-offset-2"
        >
          <Name scale={0.7} light={light} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex font-main font-bold  " aria-label="Main navigation">
          {navigation.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={href}
              href={href === "/" ? homeHref : href}
              label={href === "/" && user ? "Dashboard" : label}
              icon={<Icon size={16} />}
              active={Boolean(isActive(pathname, href === "/" ? homeHref : href))}
              light={light}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/profile"
              title={`Open ${user.name}'s profile`}
              aria-label={`Open ${user.name}'s profile`}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78caff] focus-visible:ring-offset-2 ${light ? "border-[#111827]/10 bg-white/70 text-[#111827] hover:bg-white" : "border-white/15 bg-white/10 text-white hover:bg-[#1677FF]"}`}
            >
              <UserRound size={19} />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`hidden rounded-xl border px-4 py-2 font-medium font-main transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78caff] sm:block ${light ? "border-[#111827]/15 bg-[#111827] text-white hover:bg-[#273449]" : "border-white/15 bg-white/10 text-white/90 hover:border-white/30 hover:bg-white/20 hover:text-white"}`}

              >
             sign In 
              </Link>
            </>
          )}
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition hover:bg-white/10 md:hidden ${light ? "border-[#111827]/15 text-[#111827]" : "border-white/15 text-white"}`}
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`${isMenuOpen ? "block" : "hidden"} border-t md:hidden ${light ? "border-[#111827]/10" : "border-white/10"}`}
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
              light={light}
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
      className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78caff] ${light ? (active ? "bg-white/70 text-[#111827]" : "text-[#536071] hover:bg-white/70 hover:text-[#111827]") : (active ? "bg-white/15 text-white" : "text-[#b8cde1] hover:bg-white/10 hover:text-white")}`}
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
      className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition active:scale-[0.98] ${light ? (active ? "bg-white/70 text-[#111827]" : "text-[#536071] hover:bg-white/70 hover:text-[#111827]") : (active ? "bg-white/15 text-white" : "text-[#b8cde1] hover:bg-white/10 hover:text-white")}`}
    >
      {icon}
      {label}
    </Link>
  );
}
