import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { AuthProvider } from "../context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Yar's Portfolio",
  description: "Portfolio using Next.js",
  openGraph: {
    title: "Akhyar | Next.js Portfolio",
    description:
      "A sleek portfolio built with Next.js and React Bits components. Showcasing modern web development skills and clean UI design.",
    siteName: "Yar's Portfolio",
    images: [
      {
        url: "/assets/images/projects/portfolio_next.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
