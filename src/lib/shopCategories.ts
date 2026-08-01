import type { TranslationKey } from "@/i18n/dictionaries";

export const SHOP_CATEGORIES = [
  {
    id: "simple-for-me",
    labelKey: "shop.category.simpleForMe",
  },
  {
    id: "im-a-drama-queen",
    labelKey: "shop.category.imADramaQueen",
  },
  {
    id: "darkness-my-old-friend",
    labelKey: "shop.category.darknessMyOldFriend",
  },
  {
    id: "shop-for-my-life",
    labelKey: "shop.category.shopForMyLife",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: TranslationKey;
}>;

export type ShopCategoryId = (typeof SHOP_CATEGORIES)[number]["id"];

/**
 * Returns whether a string is a known shop category id.
 */
export function isShopCategoryId(
  value: string | null | undefined,
): value is ShopCategoryId {
  return SHOP_CATEGORIES.some((category) => category.id === value);
}

/**
 * Builds the shop URL for a category filter.
 */
export function shopCategoryHref(id: ShopCategoryId) {
  return `/shop?category=${id}`;
}
