import type { Metadata, Viewport } from "next";
import { Fraunces, Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageProvider";
import { profile } from "@/content/profile";

const SITE_URL = profile.siteUrl;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0F15",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} | ${profile.jobTitle}`,
  description: profile.description,
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: { en: "/", id: "/", "x-default": "/" },
  },
  openGraph: {
    title: `${profile.name} | ${profile.jobTitle}`,
    description: profile.description,
    siteName: "Akhyar Portfolio",
    url: SITE_URL,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | ${profile.jobTitle}`,
    description: profile.description,
  },
  verification: {
    google: "YF_pXgxB-6KdItwpFEQPtU_CFXo1sGSWH-Y9qL4QeM8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${fraunces.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-[#61DCA3] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black focus:shadow-lg"
        >
          Skip to content
        </a>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
