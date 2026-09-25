"use client";

import { Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Name from "./name";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/venue", label: "Venues" },
  { href: "/calendar", label: "Calendar" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faqs", label: "FAQs" },
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
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href={homeHref}
          onClick={closeMenu}
          className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2"
          aria-label="Bookspot home"
        >
          <Name scale={0.62} light={light} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navigation.map(({ href, label }) => (
            <NavLink
              key={href}
              href={href === "/" ? homeHref : href}
              label={href === "/" && user ? "Dashboard" : label}
              active={Boolean(isActive(pathname, href === "/" ? homeHref : href))}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/venue"
                className="text-sm font-medium text-[#475569] transition hover:text-[#111827]"
              >
                Book a venue
              </Link>
              <Link
                href="/profile"
                title={`Open ${user.name}'s profile`}
                aria-label={`Open ${user.name}'s profile`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] transition hover:border-[#CBD5E1] hover:bg-[#F1F5F9]"
              >
                <UserRound size={16} />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/venue"
                className="text-sm font-medium text-[#475569] transition hover:text-[#111827]"
              >
                Explore venues
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1F2937]"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#111827] transition hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A365D] focus-visible:ring-offset-2 md:hidden"
          style={{ touchAction: "manipulation" }}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        } border-t border-[#E2E8F0] bg-white transition-all duration-200 ease-out md:hidden`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Mobile navigation">
          {navigation.map(({ href, label }) => (
            <MobileNavLink
              key={href}
              href={href === "/" ? homeHref : href}
              label={href === "/" && user ? "Dashboard" : label}
              active={Boolean(isActive(pathname, href === "/" ? homeHref : href))}
              onClick={closeMenu}
            />
          ))}

          <div className="mt-2 border-t border-[#E2E8F0] pt-3">
            {!user ? (
              <div className="grid gap-2">
                <Link
                  href="/venue"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#111827]"
                  style={{ touchAction: "manipulation" }}
                >
                  Explore venues
                </Link>
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-full bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ touchAction: "manipulation" }}
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <Link
                href="/profile"
                onClick={closeMenu}
                className="inline-flex w-full items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 text-sm font-medium text-[#111827]"
                style={{ touchAction: "manipulation" }}
              >
                Open profile
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function isActive(pathname: string | null, href: string): boolean {
  return pathname !== null && (href === "/" ? pathname === href : pathname.startsWith(href));
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
        active ? "bg-[#F3F4F6] text-[#111827]" : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#111827]"
      }`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-full px-3 py-2.5 text-sm font-medium transition ${
        active ? "bg-[#111827] text-white" : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#111827]"
      }`}
    >
      {label}
    </Link>
  );
}
