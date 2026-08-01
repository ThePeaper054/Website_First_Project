"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { localeMeta, locales, type Locale } from "@/i18n/locales";
import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { flushSync } from "react-dom";

/**
 * Fixed bottom-left language control: hover or click/tap reveals other flags;
 * choosing a flag sets the locale. Escape closes the menu; arrows move focus.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  /** Hover opens before click; ignore the trailing click so it does not toggle closed. */
  const openedByHoverRef = useRef(false);
  /** Keyboard open already handled the gesture; ignore the synthetic click. */
  const ignoreClickRef = useRef(false);
  const listId = useId();
  const current = localeMeta[locale];
  const others = locales.filter((id) => id !== locale);

  const show = () => setOpen(true);
  const hide = () => {
    openedByHoverRef.current = false;
    setOpen(false);
    setFocusIndex(0);
  };
  const hideUnlessFocused = () => {
    if (rootRef.current?.contains(document.activeElement)) return;
    hide();
  };

  const closeAndFocusTrigger = () => {
    hide();
    triggerRef.current?.focus();
  };

  const moveFocus = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(others.length - 1, nextIndex));
    setFocusIndex(clamped);
    itemRefs.current[clamped]?.focus();
  };

  /** Opens the menu and moves focus into the first option (keyboard path). */
  const openAndFocusMenu = () => {
    flushSync(() => {
      setFocusIndex(0);
      setOpen(true);
    });
    // Query after paint styles apply; visibility:hidden blocks focus.
    requestAnimationFrame(() => {
      const first =
        itemRefs.current[0] ??
        document
          .getElementById(listId)
          ?.querySelector<HTMLButtonElement>('[role="menuitem"]');
      first?.focus();
    });
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!open) return;

    switch (event.key) {
      case "Escape": {
        event.preventDefault();
        closeAndFocusTrigger();
        break;
      }
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        // From the trigger, first arrow enters the menu at index 0.
        if (document.activeElement === triggerRef.current) {
          moveFocus(0);
          break;
        }
        moveFocus(focusIndex + 1);
        break;
      }
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        if (document.activeElement === triggerRef.current) {
          moveFocus(others.length - 1);
          break;
        }
        moveFocus(focusIndex - 1);
        break;
      }
      case "Home": {
        event.preventDefault();
        moveFocus(0);
        break;
      }
      case "End": {
        event.preventDefault();
        moveFocus(others.length - 1);
        break;
      }
      default:
        break;
    }
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (open) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      // Prevent the subsequent click so we do not toggle closed immediately.
      event.preventDefault();
      ignoreClickRef.current = true;
      openAndFocusMenu();
    }
  };

  return (
    <div
      ref={rootRef}
      dir="ltr"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-1"
      onMouseEnter={() => {
        openedByHoverRef.current = true;
        show();
      }}
      onMouseLeave={hideUnlessFocused}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && event.currentTarget.contains(next)) return;
        // Defer: moving focus into a menuitem can emit blur with relatedTarget=null.
        requestAnimationFrame(() => {
          if (!rootRef.current?.contains(document.activeElement)) {
            hide();
          }
        });
      }}
      onKeyDown={onMenuKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t("lang.switcherAria")}: ${current.nativeName}`}
        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-md bg-surface/95 px-1.5 py-1 leading-none text-charcoal shadow-sm ring-1 ring-charcoal/10 backdrop-blur-md transition-colors hover:text-blush-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep"
        onKeyDown={onTriggerKeyDown}
        onClick={() => {
          if (ignoreClickRef.current) {
            ignoreClickRef.current = false;
            return;
          }
          if (openedByHoverRef.current) {
            openedByHoverRef.current = false;
            show();
            return;
          }
          if (!open) {
            setFocusIndex(0);
            show();
            return;
          }
          hide();
        }}
      >
        <FlagIcon src={current.flagSrc} alt="" />
        <span
          aria-hidden="true"
          className={`inline-block text-[0.65rem] text-charcoal/60 transition-transform ${open ? "translate-x-0.5" : ""}`}
        >
          ▸
        </span>
      </button>

      <ul
        id={listId}
        role="menu"
        aria-label={t("lang.switcherAria")}
        aria-hidden={!open}
        className={`flex items-center gap-1 transition-[opacity,transform] duration-150 ${
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-1 opacity-0"
        }`}
      >
        {others.map((id, index) => (
          <LocaleOption
            key={id}
            id={id}
            tabIndex={open && index === focusIndex ? 0 : -1}
            buttonRef={(node) => {
              itemRefs.current[index] = node;
            }}
            onSelect={(next) => {
              setLocale(next);
              hide();
              triggerRef.current?.focus();
            }}
          />
        ))}
      </ul>
    </div>
  );
}

function FlagIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={22}
      height={15}
      className="h-[15px] w-[22px] rounded-[2px] object-cover ring-1 ring-charcoal/15"
      unoptimized
    />
  );
}

function LocaleOption({
  id,
  tabIndex,
  buttonRef,
  onSelect,
}: {
  id: Locale;
  tabIndex: number;
  buttonRef: (node: HTMLButtonElement | null) => void;
  onSelect: (locale: Locale) => void;
}) {
  const meta = localeMeta[id];

  return (
    <li role="none" className="shrink-0">
      <button
        ref={buttonRef}
        type="button"
        role="menuitem"
        tabIndex={tabIndex}
        aria-label={meta.nativeName}
        className="rounded-md bg-surface/95 px-1.5 py-1 leading-none shadow-sm ring-1 ring-charcoal/10 backdrop-blur-md transition-colors hover:bg-blush/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-deep"
        onClick={() => onSelect(id)}
      >
        <FlagIcon src={meta.flagSrc} alt="" />
      </button>
    </li>
  );
}
