"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Nav } from "@/components/Nav";
import { useLocale } from "@/i18n/LocaleProvider";
import type { TranslationKey } from "@/i18n/dictionaries";

const sections = [
  { id: "home", labelKey: "nav.home" },
  { id: "gallery", labelKey: "nav.gallery" },
  { id: "about", labelKey: "nav.about" },
  { id: "contact", labelKey: "nav.contact" },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: TranslationKey;
}>;

/**
 * Home page with translated section placeholders and the language switcher.
 */
export default function Home() {
  const { t } = useLocale();

  return (
    <>
      <Nav />
      <main>
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="flex min-h-screen items-center justify-center px-6 pt-[var(--nav-height)]"
          >
            <p className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-wide text-charcoal/45 sm:text-4xl">
              {t(section.labelKey)}
            </p>
          </section>
        ))}
      </main>
      <LanguageSwitcher />
    </>
  );
}
