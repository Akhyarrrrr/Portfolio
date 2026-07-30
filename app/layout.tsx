import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageProvider";

const SITE_URL = "https://akhyar.dev";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0F15",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Akhyar's Portfolio",
  description:
    "Full-stack engineer from Banda Aceh building production systems with React, Next.js, and Node.js. 90+ academic journals, AI-powered attendance, and more.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: { en: "/", id: "/", "x-default": "/" },
  },
  openGraph: {
    title: "Akhyar | Full Stack Developer Portfolio",
    description:
      "Full-stack engineer building production systems with 90+ academic journals, AI-powered attendance, and more. Built with Next.js.",
    siteName: "Akhyar Portfolio",
    url: SITE_URL,
    // No manual `images` here — app/opengraph-image.tsx generates it at
    // build time (the old hardcoded path 404'd; every shared link showed
    // a blank preview).
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhyar | Full Stack Developer Portfolio",
    description:
      "Full-stack engineer building production systems with React, Next.js, and Node.js.",
  },
  // `apple` was previously entirely absent — no apple-touch-icon meant a
  // blank/default icon when someone added the site to an iOS home screen.
  // app/apple-icon.tsx generates it (the "Y." wordmark, matching the splash
  // screen). favicon.ico is kept as-is: it already works, no reason to
  // replace it with a generated equivalent.
  icons: { icon: "/favicon.ico", apple: "/apple-icon" },
  verification: {
    google: "YF_pXgxB-6KdItwpFEQPtU_CFXo1sGSWH-Y9qL4QeM8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased`}>
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
