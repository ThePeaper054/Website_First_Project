import { test, expect, type Page } from "@playwright/test";
import { LOCALE_COOKIE_KEY, LOCALE_STORAGE_KEY } from "../src/i18n/locales";

const BASE = `http://127.0.0.1:${process.env.PORT ?? "3000"}`;

/** Next.js dev tools sit bottom-left and intercept pointer events over the switcher. */
async function disableNextDevOverlay(page: Page) {
  await page.addStyleTag({
    content:
      "nextjs-portal { display: none !important; pointer-events: none !important; }",
  });
}

async function gotoApp(page: Page) {
  await page.goto("/");
  await disableNextDevOverlay(page);
}

async function languageTrigger(
  page: Page,
  name = /Change language:\s*English/i,
) {
  return page.getByRole("button", { name });
}

test.describe("i18n", () => {
  test("has site title", async ({ page }) => {
    await gotoApp(page);
    await expect(page).toHaveTitle(/Nara Nails/);
  });

  test("switches language on hover, updates dir/lang, and persists", async ({
    page,
  }) => {
    await gotoApp(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("#home")).toContainText("Home");

    const switcher = await languageTrigger(page);
    await switcher.hover();
    await page.getByRole("menuitem", { name: "עברית" }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#home")).toContainText("בית");

    await page.reload();
    await disableNextDevOverlay(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#home")).toContainText("בית");
  });

  test("translates nav menu chrome", async ({ page }) => {
    await gotoApp(page);

    const switcher = await languageTrigger(page);
    await switcher.hover();
    await page.getByRole("menuitem", { name: "עברית" }).click();

    await page.getByRole("button", { name: "פתח תפריט" }).click();
    const nav = page.getByRole("navigation", { name: "ניווט ראשי" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: "בית" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "יצירות" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "כל החנות" })).toBeVisible();
    await expect(
      nav.getByRole("button", { name: "מה הכי מתאים לי" }),
    ).toBeVisible();
    await expect(nav.getByRole("link", { name: "אקססוריז" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "צור קשר" })).toBeVisible();
  });

  test("opens on click and selects a language", async ({ page }) => {
    await gotoApp(page);

    const trigger = await languageTrigger(page);
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("menuitem", { name: "Русский" }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("#home")).toContainText("Главная");
  });

  test("closes language menu when pointer leaves", async ({ page }) => {
    await gotoApp(page);

    const trigger = await languageTrigger(page);
    await trigger.hover();
    await expect(page.getByRole("menuitem", { name: "עברית" })).toBeVisible();

    await page.mouse.move(0, 0);
    await expect(page.getByRole("menuitem", { name: "עברית" })).toHaveCount(0);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("opens with keyboard and closes with Escape", async ({ page }) => {
    await gotoApp(page);

    const trigger = await languageTrigger(page);
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const firstItem = page.getByRole("menuitem", { name: "עברית" });
    await expect(firstItem).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
      )
      .toBe("עברית");

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("menuitem", { name: "עברית" })).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("moves focus across language options with arrow keys", async ({
    page,
  }) => {
    await gotoApp(page);

    const trigger = await languageTrigger(page);
    await trigger.focus();
    await trigger.press("Enter");

    await expect(page.getByRole("menuitem", { name: "עברית" })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
      )
      .toBe("עברית");
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
      )
      .toBe("العربية");
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
      )
      .toBe("Русский");
    await page.keyboard.press("Home");
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
      )
      .toBe("עברית");
    await page.keyboard.press("End");
    await expect
      .poll(() =>
        page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
      )
      .toBe("Русский");
    await page.keyboard.press("Enter");

    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    // Aria label is translated (ru: "Сменить язык"), so match on the native name.
    await expect(page.getByRole("button", { name: /Русский/i })).toBeFocused();
  });

  test("prefers localStorage over a conflicting cookie", async ({ page }) => {
    await page.addInitScript(
      ({ storageKey, cookieKey }) => {
        window.localStorage.setItem(storageKey, "ru");
        document.cookie = `${cookieKey}=he;path=/;max-age=31536000;SameSite=Lax`;
      },
      { storageKey: LOCALE_STORAGE_KEY, cookieKey: LOCALE_COOKIE_KEY },
    );

    await gotoApp(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "ru");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.locator("#home")).toContainText("Главная");
  });

  test("uses cookie when localStorage has no locale", async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: LOCALE_COOKIE_KEY,
        value: "ar",
        url: BASE,
      },
    ]);
    await page.addInitScript((storageKey) => {
      window.localStorage.removeItem(storageKey);
    }, LOCALE_STORAGE_KEY);

    await gotoApp(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#home")).toContainText("الرئيسية");
  });
});

test.describe("i18n touch", () => {
  test.use({ hasTouch: true });

  test("opens on tap and selects a language", async ({ page }) => {
    await gotoApp(page);

    const trigger = await languageTrigger(page);
    await trigger.tap();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.getByRole("menuitem", { name: "العربية" }).tap();

    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("#home")).toContainText("الرئيسية");
  });
});
