import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import Image from "next/image"; // Imported for the logo
import {
  Home,
  LayoutDashboard,
  Info,
  CircleHelp,
} from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CampusFlow",
  description: "Smart campus resource booking and conflict management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f7f5] text-[#171717]">
        {/* Navbar Header */}
        <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f7f5]/95 backdrop-blur">
          <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
            
            {/* Image Logo Container */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Bookspot Logo" 
                width={160} // Adjusted to fit your wide text-based logo aspect ratio
                height={40} 
                className="h-9 w-auto object-contain"
                priority // Ensures the logo loads instantly without layout shifts
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink href="/" icon={<Home size={16} />} label="Home" />
              <NavLink href="/dashboard" icon={<LayoutDashboard size={16} />} label="Dashboard" />
              <NavLink href="/about" icon={<Info size={16} />} label="About" />
              <NavLink href="/faqs" icon={<CircleHelp size={16} />} label="FAQs" />
            </nav>

            {/* Right side Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/5 sm:block"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="border-t border-black/5 md:hidden">
            <nav className="mx-auto flex max-w-[1440px] items-center justify-between overflow-x-auto px-4 py-2">
              <MobileNavLink href="/" icon={<Home size={15} />} label="Home" />
              <MobileNavLink href="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" />
              <MobileNavLink href="/about" icon={<Info size={15} />} label="About" />
              <MobileNavLink href="/faqs" icon={<CircleHelp size={15} />} label="FAQs" />
            </nav>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}

/* Helper Nav Components */
function NavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-black/55 transition hover:bg-black/5 hover:text-black"
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
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-black/60"
    >
      {icon}
      {label}
    </Link>
  );
}
