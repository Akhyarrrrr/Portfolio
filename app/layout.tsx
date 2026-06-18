import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-next-yar.vercel.app",
  ),
  title: "Yar's Portfolio",
  description:
    "Portfolio of Akhyar, a full-stack engineer from Banda Aceh building production systems with React, Next.js, and Node.js.",
  openGraph: {
    title: "Akhyar | Full Stack Developer Portfolio",
    description:
      "Full-stack engineer building production systems — 90+ academic journals, AI-powered attendance, and more. Built with Next.js.",
    siteName: "Akhyar Portfolio",
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
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
