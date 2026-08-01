"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { isShopCategoryId, SHOP_CATEGORIES } from "@/lib/shopCategories";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const UNKNOWN_CATEGORY_KEY = "nara:shop-unknown-category";

/**
 * Determines whether an unknown-category notice flag is stored for the current session.
 *
 * @returns `true` if the flag is set, `false` otherwise.
 */
function readUnknownCategoryFlag() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(UNKNOWN_CATEGORY_KEY) === "1";
}

/**
 * Records that an unknown shop category was encountered in session storage.
 */
function writeUnknownCategoryFlag() {
  sessionStorage.setItem(UNKNOWN_CATEGORY_KEY, "1");
}

/**
 * Clears the stored indicator for an unknown shop category.
 */
function clearUnknownCategoryFlag() {
  sessionStorage.removeItem(UNKNOWN_CATEGORY_KEY);
}

/**
 * Displays the shop page with an optional validated category filter.
 *
 * Invalid category parameters display a localized notice and redirect to the default shop URL.
 *
 * @returns The rendered shop page.
 */
export function ShopPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rawCategory = searchParams.get("category");
  const category = isShopCategoryId(rawCategory) ? rawCategory : null;
  const isInvalidCategory = Boolean(
    rawCategory && !isShopCategoryId(rawCategory),
  );
  const [showUnknownNotice, setShowUnknownNotice] = useState(
    () => isInvalidCategory || readUnknownCategoryFlag(),
  );
  const categoryMeta = category
    ? SHOP_CATEGORIES.find((item) => item.id === category)
    : null;

  useEffect(() => {
    if (isInvalidCategory) {
      writeUnknownCategoryFlag();
      setShowUnknownNotice(true);
      router.replace("/shop");
      return;
    }

    if (category) {
      clearUnknownCategoryFlag();
      setShowUnknownNotice(false);
      return;
    }

    if (readUnknownCategoryFlag()) {
      setShowUnknownNotice(true);
      clearUnknownCategoryFlag();
    }
  }, [category, isInvalidCategory, router]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [category, showUnknownNotice]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-[var(--nav-height)]">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-3xl font-medium tracking-wide text-charcoal/70 outline-none sm:text-4xl"
      >
        {categoryMeta ? t(categoryMeta.labelKey) : t("shop.title")}
      </h1>
      <p className="mt-3 max-w-md text-center font-[family-name:var(--font-body),var(--font-cyrillic)] text-sm text-charcoal/50 sm:text-base">
        {showUnknownNotice
          ? t("shop.unknownCategory")
          : categoryMeta
            ? t("shop.filteredHint")
            : t("shop.allHint")}
      </p>
    </main>
  );
}
