import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Heebo,
  Noto_Sans,
  Noto_Sans_Arabic,
} from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  isLocale,
  localeBootScript,
  localeDir,
} from "@/i18n/locales";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const body = Heebo({
  variable: "--font-body",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600"],
});

const arabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
});

const cyrillic = Noto_Sans({
  variable: "--font-cyrillic",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nara Nails",
  description: "Private nail studio — gallery, about, and contact",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(LOCALE_COOKIE_KEY)?.value;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    <html lang={locale} dir={localeDir(locale)} suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${arabic.variable} ${cyrillic.variable} antialiased`}
      >
        <Script
          id="locale-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: localeBootScript }}
        />
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
