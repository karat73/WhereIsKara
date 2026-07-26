import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Where in the world is Kara?",
  description: "A live map of Kara's 6-month sabbatical.",
  metadataBase: new URL("https://whereiskara.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text-primary">
        <Header />
        <main className="flex-1 min-h-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
