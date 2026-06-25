import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageProvider";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://akhyar.dev";

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
  alternates: { canonical: "/" },
  openGraph: {
    title: "Akhyar | Full Stack Developer Portfolio",
    description:
      "Full-stack engineer building production systems — 90+ academic journals, AI-powered attendance, and more. Built with Next.js.",
    siteName: "Akhyar Portfolio",
    url: SITE_URL,
    images: [
      {
        url: "/assets/images/projects/portfolio_next.png",
        width: 1200,
        height: 630,
        alt: "Akhyar Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akhyar | Full Stack Developer Portfolio",
    description:
      "Full-stack engineer building production systems with React, Next.js, and Node.js.",
  },
  icons: { icon: "/favicon.ico" },
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
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
