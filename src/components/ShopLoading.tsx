"use client";

import { useLocale } from "@/i18n/LocaleProvider";

/**
 * Suspense fallback for the shop page.
 */
export function ShopLoading() {
  const { t } = useLocale();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 pt-[var(--nav-height)]">
      <p className="font-[family-name:var(--font-body),var(--font-cyrillic)] text-sm text-charcoal/45">
        {t("shop.loading")}
      </p>
    </main>
  );
}
