import { test, expect, type Page } from "@playwright/test";

/** Next.js dev tools sit bottom-left and can intercept pointer events. */
async function disableNextDevOverlay(page: Page) {
  await page.addStyleTag({
    content:
      "nextjs-portal { display: none !important; pointer-events: none !important; }",
  });
}

async function gotoApp(page: Page, path = "/") {
  await page.goto(path);
  await disableNextDevOverlay(page);
}

async function sectionAligned(page: Page, id: string) {
  return page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return false;
    const header = document.querySelector("header");
    const offset = header?.getBoundingClientRect().height ?? 0;
    return Math.abs(el.getBoundingClientRect().top - offset) < 3;
  }, id);
}

test.describe("nav scroll", () => {
  test("nav link scrolls to section and replaces the hash", async ({
    page,
  }) => {
    await gotoApp(page);

    const historyLengthBefore = await page.evaluate(() => history.length);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Gallery" })
      .click();

    await expect(page).toHaveURL(/#gallery$/);
    await expect
      .poll(async () => sectionAligned(page, "gallery"), { timeout: 3000 })
      .toBe(true);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Contact" })
      .click();

    await expect(page).toHaveURL(/#contact$/);
    await expect
      .poll(async () => sectionAligned(page, "contact"), { timeout: 3000 })
      .toBe(true);

    // In-page section jumps use replaceState, not pushState.
    expect(await page.evaluate(() => history.length)).toBe(historyLengthBefore);
  });

  test("loads with a hash and scrolls to that section", async ({ page }) => {
    await gotoApp(page, "/#about");

    await expect(page).toHaveURL(/#about$/);
    await expect
      .poll(async () => sectionAligned(page, "about"), { timeout: 3000 })
      .toBe(true);
  });

  test("hashchange re-scrolls to the current hash", async ({ page }) => {
    await gotoApp(page);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Gallery" })
      .click();
    await expect(page).toHaveURL(/#gallery$/);
    await expect
      .poll(async () => sectionAligned(page, "gallery"), { timeout: 3000 })
      .toBe(true);

    // App Router may strip hashes set only via history APIs; use the URL the
    // nav already established, then prove the hashchange listener re-scrolls.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    await expect
      .poll(async () => sectionAligned(page, "gallery"), { timeout: 3000 })
      .toBe(true);
  });

  test("popstate re-scrolls to the current hash", async ({ page }) => {
    await gotoApp(page);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/#about$/);
    await expect
      .poll(async () => sectionAligned(page, "about"), { timeout: 3000 })
      .toBe(true);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    await expect
      .poll(async () => sectionAligned(page, "about"), { timeout: 3000 })
      .toBe(true);
  });
});
