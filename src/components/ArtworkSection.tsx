"use client";

import Link from "next/link";
import { useRef } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

/**
 * Home artwork section: title + Shop all link, and a horizontal product scroller.
 */
export function ArtworkSection() {
  const { t } = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls the product rail by roughly one tile width.
   * Direction is flipped in RTL so buttons match visual left/right.
   */
  function scrollByTile(direction: "prev" | "next") {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const firstTile = scroller.querySelector<HTMLElement>(
      "[data-product-tile]",
    );
    const tileWidth = firstTile?.offsetWidth ?? scroller.clientWidth / 3;
    const gap = 16;
    const delta = tileWidth + gap;
    const isRtl = document.documentElement.dir === "rtl";
    const sign = direction === "next" ? (isRtl ? -1 : 1) : isRtl ? 1 : -1;

    scroller.scrollBy({ left: sign * delta, behavior: "smooth" });
  }

  return (
    <section
      id="artwork"
      className="flex min-h-screen flex-col justify-center px-6 pt-[var(--nav-height)] pb-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display),var(--font-arabic),var(--font-cyrillic)] text-3xl font-medium tracking-wide text-charcoal sm:text-4xl">
            {t("nav.artwork")}
          </h2>
          <Link
            href="/shop"
            className="font-[family-name:var(--font-body),var(--font-arabic),var(--font-cyrillic)] text-base tracking-wide text-charcoal/85 transition-colors duration-300 hover:text-blush-deep sm:text-lg"
          >
            {t("nav.shopAll")}
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByTile("prev")}
            aria-label={t("artwork.scrollPrevAria")}
            className="absolute start-0 top-[calc((100%-3.5rem)/2)] z-10 flex h-10 w-10 -translate-y-1/2 -translate-x-1 items-center justify-center text-charcoal/70 transition-colors duration-300 hover:text-blush-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep rtl:translate-x-1 sm:-translate-x-3 sm:rtl:translate-x-3"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scrollByTile("next")}
            aria-label={t("artwork.scrollNextAria")}
            className="absolute end-0 top-[calc((100%-3.5rem)/2)] z-10 flex h-10 w-10 -translate-y-1/2 translate-x-1 items-center justify-center text-charcoal/70 transition-colors duration-300 hover:text-blush-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep rtl:-translate-x-1 sm:translate-x-3 sm:rtl:-translate-x-3"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                data-product-tile
                className="group w-[calc((100%-2rem)/3)] min-w-[calc((100%-2rem)/3)] shrink-0 snap-start max-sm:w-[calc((100%-1rem)/2)] max-sm:min-w-[calc((100%-1rem)/2)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
