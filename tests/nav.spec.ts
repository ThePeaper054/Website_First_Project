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

async function openMenu(page: Page) {
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
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

test.describe("nav menu", () => {
  test("hamburger opens menu and Contact scrolls to section", async ({
    page,
  }) => {
    await gotoApp(page);

    const historyLengthBefore = await page.evaluate(() => history.length);

    await openMenu(page);

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

  test("Accessories menu link navigates to /accessories", async ({ page }) => {
    await gotoApp(page);
    await openMenu(page);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Accessories" })
      .click();

    await expect(page).toHaveURL(/\/accessories$/);
    const accessoriesHeading = page.getByRole("heading", {
      name: "Accessories",
      level: 1,
    });
    await expect(accessoriesHeading).toBeVisible();
    await expect(accessoriesHeading).toBeFocused();
  });

  test("Artwork menu link scrolls to section", async ({ page }) => {
    await gotoApp(page);
    await openMenu(page);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Artwork" })
      .click();

    await expect(page).toHaveURL(/#artwork$/);
    await expect
      .poll(async () => sectionAligned(page, "artwork"), { timeout: 3000 })
      .toBe(true);
  });

  test("What's best toggle keeps keyboard focus on the control", async ({
    page,
  }) => {
    await gotoApp(page);
    await openMenu(page);

    const whatsBest = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("button", { name: "What's best for me" });

    await whatsBest.focus();
    await page.keyboard.press("Enter");

    await expect(whatsBest).toHaveAttribute("aria-expanded", "true");
    await expect(whatsBest).toBeFocused();
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
        name: "Simple for me",
      }),
    ).toBeVisible();
  });

  test("tab cycles within the open menu", async ({ page }) => {
    await gotoApp(page);
    await openMenu(page);

    const nav = page.getByRole("navigation", { name: "Primary" });
    const home = nav.getByRole("link", { name: "Home" });
    const contact = nav.getByRole("link", { name: "Contact" });

    await expect(home).toBeFocused();

    // Home → Artwork → Shop all → What's best → Accessories → Contact
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(contact).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(home).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(contact).toBeFocused();
  });

  test("page content and language switcher are inert while menu is open", async ({
    page,
  }) => {
    await gotoApp(page);
    await openMenu(page);

    const mainInert = await page.locator("main").evaluate((el) => {
      let node: HTMLElement | null = el;
      while (node) {
        if (node.hasAttribute("inert")) return true;
        node = node.parentElement;
      }
      return false;
    });
    expect(mainInert).toBe(true);

    // Language switcher is inert, so avoid role queries that skip inert subtrees.
    const switcherInert = await page
      .locator(".fixed.bottom-4.left-4")
      .evaluate((el) => {
        let node: HTMLElement | null = el;
        while (node) {
          if (node.hasAttribute("inert")) return true;
          node = node.parentElement;
        }
        return false;
      });
    expect(switcherInert).toBe(true);
  });

  test("logo is not interactive while the menu is open", async ({ page }) => {
    await gotoApp(page);
    await openMenu(page);

    const logoLink = page
      .locator("header a")
      .filter({ has: page.locator("img") });
    await expect(logoLink).toHaveAttribute("aria-hidden", "true");
    await expect(logoLink).toHaveCSS("pointer-events", "none");
  });

  test("Escape and backdrop close the menu", async ({ page }) => {
    await gotoApp(page);
    await openMenu(page);

    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await openMenu(page);
    // Backdrop is the last "Close menu" control (header toggle is first).
    await page.getByRole("button", { name: "Close menu" }).last().click();
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeHidden();
  });

  test("Shop all navigates to /shop", async ({ page }) => {
    await gotoApp(page);
    await openMenu(page);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Shop all" })
      .click();

    await expect(page).toHaveURL(/\/shop$/);
    const shopHeading = page.getByRole("heading", { name: "Shop" });
    await expect(shopHeading).toBeVisible();
    await expect(shopHeading).toBeFocused();
    await expect(
      page.getByRole("button", { name: /Change language/i }),
    ).toBeVisible();
  });

  test("shop page lists all artwork products only", async ({ page }) => {
    await gotoApp(page, "/shop");

    await expect(
      page.getByRole("heading", { name: "Shop", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Night Flower", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Sushi Bar", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(11);
    await expect(page.getByText("₪250").first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Accessory 01", level: 2 }),
    ).toHaveCount(0);
  });

  test("accessories page lists four accessory products", async ({ page }) => {
    await gotoApp(page, "/accessories");

    await expect(
      page.getByRole("heading", { name: "Accessories", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Accessory 01", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Accessory 04", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(4);
    await expect(
      page.getByRole("heading", { name: "Night Flower", level: 2 }),
    ).toHaveCount(0);
  });

  test("What's best category navigates to filtered shop", async ({ page }) => {
    await gotoApp(page);
    await openMenu(page);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("button", { name: "What's best for me" })
      .click();

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Simple for me" })
      .click();

    await expect(page).toHaveURL(/\/shop\?category=simple-for-me$/);
    await expect(
      page.getByRole("heading", { name: "Simple for me" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Night Flower", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Garden", level: 2 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Ruby Necklace", level: 2 }),
    ).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(6);
  });

  test("invalid shop category shows notice and cleans the URL", async ({
    page,
  }) => {
    await gotoApp(page, "/shop?category=not-a-real-tag");

    await expect(
      page.getByText(
        "That category was not found — showing all styles instead",
      ),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();
  });

  test("valid category clears the unknown-category notice", async ({
    page,
  }) => {
    await gotoApp(page, "/shop?category=not-a-real-tag");
    await expect(
      page.getByText(
        "That category was not found — showing all styles instead",
      ),
    ).toBeVisible();

    await openMenu(page);
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("button", { name: "What's best for me" })
      .click();
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Simple for me" })
      .click();

    await expect(page).toHaveURL(/\/shop\?category=simple-for-me$/);
    await expect(
      page.getByRole("heading", { name: "Simple for me" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "That category was not found — showing all styles instead",
      ),
    ).toHaveCount(0);
  });

  test("legacy #about hash scrolls to accessories", async ({ page }) => {
    await gotoApp(page, "/#about");

    await expect(page).toHaveURL(/#accessories$/);
    await expect
      .poll(async () => sectionAligned(page, "accessories"), { timeout: 3000 })
      .toBe(true);
  });

  test("legacy #gallery hash scrolls to artwork", async ({ page }) => {
    await gotoApp(page, "/#gallery");

    await expect(page).toHaveURL(/#artwork$/);
    await expect
      .poll(async () => sectionAligned(page, "artwork"), { timeout: 3000 })
      .toBe(true);
  });

  test("language switcher is covered while the menu is open", async ({
    page,
  }) => {
    await gotoApp(page);
    await openMenu(page);

    // Inert removes the switcher from the a11y tree; hit-test the fixed root instead.
    const switcher = page.locator(".fixed.bottom-4.left-4");
    await expect(switcher).toBeVisible();

    const blocked = await switcher.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const top = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      return top !== el && !el.contains(top);
    });
    expect(blocked).toBe(true);
  });

  test("Contact from shop navigates home and scrolls", async ({ page }) => {
    await gotoApp(page, "/shop");
    await openMenu(page);

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Contact" })
      .click();

    await expect(page).toHaveURL(/\/?#contact$/);
    await expect
      .poll(async () => sectionAligned(page, "contact"), { timeout: 5000 })
      .toBe(true);
  });

  test("loads with a hash and scrolls to that section", async ({ page }) => {
    await gotoApp(page, "/#accessories");

    await expect(page).toHaveURL(/#accessories$/);
    await expect
      .poll(async () => sectionAligned(page, "accessories"), { timeout: 3000 })
      .toBe(true);
  });

  test("hashchange re-scrolls to the current hash", async ({ page }) => {
    await gotoApp(page);

    await openMenu(page);
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Contact" })
      .click();
    await expect(page).toHaveURL(/#contact$/);
    await expect
      .poll(async () => sectionAligned(page, "contact"), { timeout: 3000 })
      .toBe(true);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    await expect
      .poll(async () => sectionAligned(page, "contact"), { timeout: 3000 })
      .toBe(true);
  });

  test("popstate re-scrolls to the current hash", async ({ page }) => {
    await gotoApp(page);

    await openMenu(page);
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Contact" })
      .click();
    await expect(page).toHaveURL(/#contact$/);
    await expect
      .poll(async () => sectionAligned(page, "contact"), { timeout: 3000 })
      .toBe(true);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    await expect
      .poll(async () => sectionAligned(page, "contact"), { timeout: 3000 })
      .toBe(true);
  });
});
