"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BrandMorphContextValue = {
  /** Scroll morph progress from large welcome (0) to nav hand-off (1). */
  progress: number;
  setProgress: (progress: number) => void;
  /**
   * True while the home welcome section owns the morph.
   * When false, the nav brand is always shown.
   */
  morphActive: boolean;
  setMorphActive: (active: boolean) => void;
};

const BrandMorphContext = createContext<BrandMorphContextValue | null>(null);

/**
 * Provides access to the home→nav brand morph progress.
 *
 * @returns Morph progress and ownership flags.
 * @throws An error if called outside `BrandMorphProvider`.
 */
export function useBrandMorph() {
  const ctx = useContext(BrandMorphContext);
  if (!ctx) {
    throw new Error("useBrandMorph must be used within BrandMorphProvider");
  }
  return ctx;
}

/**
 * Shares brand morph progress between the home welcome mark and the nav logo.
 */
export function BrandMorphProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState(1);
  const [morphActive, setMorphActiveState] = useState(false);

  const setProgress = useCallback((next: number) => {
    setProgressState(Math.min(1, Math.max(0, next)));
  }, []);

  const setMorphActive = useCallback((active: boolean) => {
    setMorphActiveState(active);
    if (!active) {
      setProgressState(1);
    }
  }, []);

  const value = useMemo(
    () => ({ progress, setProgress, morphActive, setMorphActive }),
    [progress, setProgress, morphActive, setMorphActive],
  );

  return (
    <BrandMorphContext.Provider value={value}>
      {children}
    </BrandMorphContext.Provider>
  );
}

/** Progress where welcome and nav logos cross-fade. */
export const BRAND_HANDOFF_START = 0.88;

/**
 * Maps morph progress to nav logo opacity (fades in during the hand-off).
 */
export function navBrandOpacity(progress: number, morphActive: boolean) {
  if (!morphActive) return 1;
  if (progress <= BRAND_HANDOFF_START) return 0;
  return (progress - BRAND_HANDOFF_START) / (1 - BRAND_HANDOFF_START);
}

/**
 * Maps morph progress to welcome logo opacity (fades out during the hand-off).
 */
export function welcomeBrandOpacity(progress: number) {
  if (progress <= BRAND_HANDOFF_START) return 1;
  return 1 - (progress - BRAND_HANDOFF_START) / (1 - BRAND_HANDOFF_START);
}
