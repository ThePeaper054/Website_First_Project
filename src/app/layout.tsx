import type { Metadata } from "next";
import { Cormorant_Garamond, Heebo } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Heebo({
  variable: "--font-body",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nara Nails",
  description: "Private nail studio — gallery, about, and contact",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
