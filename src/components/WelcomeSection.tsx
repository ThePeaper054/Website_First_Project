"use client";

import { useBrandMorph, welcomeBrandOpacity } from "@/components/BrandMorph";
import { useMenuModality } from "@/components/MenuModality";
import { useLayoutEffect, useRef } from "react";

const LOGO_ASPECT = 48 / 160;
const LARGE_MAX_WIDTH_PX = 480;

/**
 * Linearly interpolates between two numbers.
 */
function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

/**
 * Header height used as the Artwork alignment target.
 */
function getNavOffset() {
  const header = document.querySelector("header");
  return header?.getBoundingClientRect().height ?? 68;
}

/**
 * Scroll progress from page top (0) until Artwork sits under the nav (1).
 */
function scrollProgressToArtwork() {
  const artwork = document.getElementById("artwork");
  if (!artwork) return 0;
  const artworkDocTop = artwork.getBoundingClientRect().top + window.scrollY;
  const maxScroll = Math.max(1, artworkDocTop - getNavOffset());
  return Math.min(1, Math.max(0, window.scrollY / maxScroll));
}

/**
 * Home welcome: large brand mark that slides and shrinks into the nav logo.
 */
export function WelcomeSection() {
  const { setProgress, setMorphActive } = useBrandMorph();
  const { menuOpen } = useMenuModality();
  const brandRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(menuOpen);
  const progressRef = useRef(0);
  const lastPublishedProgress = useRef(-1);

  menuOpenRef.current = menuOpen;

  useLayoutEffect(() => {
    setMorphActive(true);
    setProgress(0);

    let frame = 0;

    /**
     * Moves the big brand toward the nav logo based on scroll position.
     */
    function update() {
      const brand = brandRef.current;
      if (!brand) return;

      const slot = document.querySelector<HTMLElement>("[data-brand-slot]");
      const progress = scrollProgressToArtwork();
      progressRef.current = progress;

      if (Math.abs(progress - lastPublishedProgress.current) >= 0.01) {
        lastPublishedProgress.current = progress;
        setProgress(progress);
      } else if (progress === 0 || progress === 1) {
        if (lastPublishedProgress.current !== progress) {
          lastPublishedProgress.current = progress;
          setProgress(progress);
        }
      }

      const startWidth = Math.min(window.innerWidth * 0.88, LARGE_MAX_WIDTH_PX);
      const startHeight = startWidth * LOGO_ASPECT;
      const startLeft = (window.innerWidth - startWidth) / 2;
      const startTop = (window.innerHeight - startHeight) / 2;

      const slotRect = slot?.getBoundingClientRect();
      const endWidth = slotRect?.width ?? 112;
      const endHeight = slotRect?.height ?? endWidth * LOGO_ASPECT;
      const endLeft = slotRect?.left ?? window.innerWidth - endWidth - 24;
      const endTop = slotRect?.top ?? 16;

      const width = lerp(startWidth, endWidth, progress);
      const height = lerp(startHeight, endHeight, progress);
      const left = lerp(startLeft, endLeft, progress);
      const top = lerp(startTop, endTop, progress);
      const opacity = menuOpenRef.current ? 0 : welcomeBrandOpacity(progress);
      const handedOff = progress >= 0.999;

      brand.style.width = `${width}px`;
      brand.style.height = `${height}px`;
      brand.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      brand.style.opacity = String(opacity);
      brand.style.visibility =
        handedOff || menuOpenRef.current ? "hidden" : "visible";
    }

    /**
     * Coalesces scroll/resize work onto one animation frame.
     */
    function scheduleUpdate() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      setMorphActive(false);
    };
  }, [setMorphActive, setProgress]);

  useLayoutEffect(() => {
    const brand = brandRef.current;
    if (!brand) return;
    if (menuOpen) {
      brand.style.opacity = "0";
      brand.style.visibility = "hidden";
      return;
    }
    const progress = progressRef.current;
    brand.style.opacity = String(welcomeBrandOpacity(progress));
    brand.style.visibility = progress >= 0.999 ? "hidden" : "visible";
  }, [menuOpen]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-6 pt-[var(--nav-height)]"
    >
      <h1 className="sr-only">Nara Nails</h1>
      <div
        ref={brandRef}
        data-welcome-brand
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[61] will-change-[transform,width,height,opacity]"
        style={{
          width: LARGE_MAX_WIDTH_PX,
          height: LARGE_MAX_WIDTH_PX * LOGO_ASPECT,
          opacity: 1,
          transform: "translate3d(-9999px, -9999px, 0)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- live width/height for scroll morph */}
        <img
          src="/logo.svg"
          alt=""
          width={480}
          height={144}
          className="h-full w-full object-contain object-center"
          draggable={false}
        />
      </div>
      <div
        className="invisible w-[min(88vw,30rem)]"
        style={{ aspectRatio: `${1 / LOGO_ASPECT}` }}
        aria-hidden="true"
      />
    </section>
  );
}
