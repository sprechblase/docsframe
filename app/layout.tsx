import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/main-nav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Docsframe — Documentation framework",
    template: "%s — Docsframe",
  },
  description: "The easiest documentation framework for your Next.js app",
  keywords: [
    "components",
    "documentation",
    "docs",
    "framework",
    "shadcn",
    "tailwind",
    "ui",
    "nextjs",
    "mdx",
    "react",
    "typescript",
  ],
  openGraph: {
    title: "Docsframe — Documentation framework",
    description: "The easiest documentation framework for your Next.js app",
    type: "website",
    images: [
      {
        url: "https://docsframe.work/meta-tags.png",
        width: 1200,
        height: 628,
        alt: "Docsframe — Documentation framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docsframe — Documentation framework",
    description: "The easiest documentation framework for your Next.js app",
    images: ["https://docsframe.work/meta-tags.png"],
    creator: "@skredev",
  },
  metadataBase: new URL("https://docsframe.work"),
  authors: {
    name: "skredev",
    url: "https://skre.dev",
  },
  creator: "skredev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative flex min-h-screen w-full flex-col overflow-x-hidden scroll-smooth bg-background antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
