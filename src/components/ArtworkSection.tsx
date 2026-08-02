"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const VISIBLE_COUNT = 4;
const TILE_GAP_PX = 16;

let slideAnimationId = 0;

/**
 * Calculates a cubic ease-out interpolation value (same feel as nav section glide).
 */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Home artwork section: title + Shop all link, and a gliding product rail.
 */
export function ArtworkSection() {
  const { t } = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  function updateArrowState() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    setCanPrev(scroller.scrollLeft > 1);
    setCanNext(scroller.scrollLeft < maxScroll - 1);
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateArrowState();
    scroller.addEventListener("scroll", updateArrowState, { passive: true });
    const observer = new ResizeObserver(updateArrowState);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", updateArrowState);
      observer.disconnect();
      slideAnimationId += 1;
    };
  }, []);

  /**
   * Glides the product rail by four tiles, using the same ease as menu section scroll.
   */
  function glide(direction: "prev" | "next") {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const firstTile = scroller.querySelector<HTMLElement>(
      "[data-product-tile]",
    );
    const tileWidth =
      firstTile?.offsetWidth ?? scroller.clientWidth / VISIBLE_COUNT;
    const step = (tileWidth + TILE_GAP_PX) * VISIBLE_COUNT;
    const startX = scroller.scrollLeft;
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const targetX = Math.max(
      0,
      Math.min(maxScroll, startX + (direction === "next" ? step : -step)),
    );
    const distance = targetX - startX;
    if (Math.abs(distance) < 1) return;

    const duration = Math.min(900, Math.max(450, Math.abs(distance) * 0.55));
    const animationId = ++slideAnimationId;
    let startTime: number | null = null;

    const stepFrame = (timestamp: number) => {
      if (animationId !== slideAnimationId) return;
      if (startTime === null) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      scroller.scrollLeft = startX + distance * easeOutCubic(progress);
      updateArrowState();

      if (progress < 1) {
        window.requestAnimationFrame(stepFrame);
      }
    };

    window.requestAnimationFrame(stepFrame);
  }

  const arrowClass =
    "absolute z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface text-charcoal/80 shadow-sm ring-1 ring-charcoal/10 transition-colors duration-300 hover:bg-surface hover:text-blush-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep disabled:pointer-events-none disabled:cursor-default disabled:opacity-35";

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

        <div className="relative" dir="ltr">
          <div
            ref={scrollerRef}
            className="relative z-0 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                data-product-tile
                className="group w-[calc((100%_-_3rem)/4)] min-w-[calc((100%_-_3rem)/4)] shrink-0"
              >
                <ProductCard product={product} sizes="25vw" />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => glide("prev")}
            disabled={!canPrev}
            aria-label={t("artwork.scrollPrevAria")}
            className={`${arrowClass} left-0 top-[calc((100%_-_3.5rem)/2)]`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none h-5 w-5"
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
            onClick={() => glide("next")}
            disabled={!canNext}
            aria-label={t("artwork.scrollNextAria")}
            className={`${arrowClass} right-0 top-[calc((100%_-_3.5rem)/2)]`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="pointer-events-none h-5 w-5"
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
        </div>
      </div>
    </section>
  );
}
