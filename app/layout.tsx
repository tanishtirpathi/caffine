
import type { Metadata } from "next";
import {
  Geist,
  EB_Garamond,
  Instrument_Serif,
  Inter,
} from "next/font/google";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "./globals.css";

const garamond = EB_Garamond({ subsets: ["latin"], variable: "--font-garamond" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Bookspot",
  description: "Your campus, one Bookspot",
  icons: {
    icon: "/icon.webp",
    shortcut: "/icon.webp",
    apple: "/icon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${instrumentSerif.variable}
        ${garamond.variable}
        ${geist.variable}
        ${inter.variable}
        h-full antialiased
      `}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>

      <body className="min-h-full bg-[#F8F8F8] text-[#1E293B]">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

