import type { ShopCategoryId } from "@/lib/shopCategories";

export type Product = {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  /** Used by the shop page to filter products by “What’s best for me” category. */
  categoryIds: readonly ShopCategoryId[];
};

/**
 * Artwork catalog for the home scroller and shop.
 * Image paths and names are filled as real product assets arrive.
 */
export const PRODUCTS: readonly Product[] = [
  {
    id: "artwork-01",
    name: "Night Flower",
    price: 250,
    imageSrc: "/products/artwork-01.png",
    categoryIds: ["shop-for-my-life", "simple-for-me"],
  },
  {
    id: "artwork-02",
    name: "Blue River",
    price: 270,
    imageSrc: "/products/artwork-02.png",
    categoryIds: ["simple-for-me", "shop-for-my-life"],
  },
  {
    id: "artwork-03",
    name: "The Ocean",
    price: 270,
    imageSrc: "/products/artwork-03.png",
    categoryIds: ["simple-for-me", "shop-for-my-life"],
  },
  {
    id: "artwork-04",
    name: "Cosmic Space",
    price: 300,
    imageSrc: "/products/artwork-04.png",
    categoryIds: ["im-a-drama-queen", "shop-for-my-life"],
  },
  {
    id: "artwork-05",
    name: "The Garden",
    price: 250,
    imageSrc: "/products/artwork-05.png",
    categoryIds: ["simple-for-me"],
  },
  {
    id: "artwork-06",
    name: "Ruby Necklace",
    price: 300,
    imageSrc: "/products/artwork-06.png",
    categoryIds: ["im-a-drama-queen"],
  },
  {
    id: "artwork-07",
    name: "Silver Snake",
    price: 350,
    imageSrc: "/products/artwork-07.png",
    categoryIds: ["im-a-drama-queen", "darkness-my-old-friend"],
  },
  {
    id: "artwork-08",
    name: "Green and Gold",
    price: 290,
    imageSrc: "/products/artwork-08.png",
    categoryIds: ["im-a-drama-queen", "darkness-my-old-friend"],
  },
  {
    id: "artwork-09",
    name: "Blood and Silver",
    price: 300,
    imageSrc: "/products/artwork-09.png",
    categoryIds: ["darkness-my-old-friend", "im-a-drama-queen"],
  },
  {
    id: "artwork-10",
    name: "Sushi Bar",
    price: 300,
    imageSrc: "/products/artwork-10.png",
    categoryIds: ["simple-for-me", "shop-for-my-life"],
  },
  {
    id: "artwork-11",
    name: "Pink Paradise",
    price: 300,
    imageSrc: "/products/artwork-11.png",
    categoryIds: ["simple-for-me"],
  },
] as const;

/**
 * Placeholder catalog for accessories (home section + /accessories page only).
 * Not included in the artwork shop catalog.
 */
export const ACCESSORIES_PRODUCTS: readonly Product[] = [
  {
    id: "accessory-01",
    name: "Accessory 01",
    price: 49,
    imageSrc: "/products/product-01.svg",
    categoryIds: [],
  },
  {
    id: "accessory-02",
    name: "Accessory 02",
    price: 59,
    imageSrc: "/products/product-02.svg",
    categoryIds: [],
  },
  {
    id: "accessory-03",
    name: "Accessory 03",
    price: 69,
    imageSrc: "/products/product-03.svg",
    categoryIds: [],
  },
  {
    id: "accessory-04",
    name: "Accessory 04",
    price: 79,
    imageSrc: "/products/product-04.svg",
    categoryIds: [],
  },
] as const;

/**
 * Returns artwork products for the shop, optionally filtered by category.
 *
 * @param category - When set, only products that include this category id.
 * @returns Matching products, or the full artwork catalog when unfiltered.
 */
export function getShopProducts(category?: ShopCategoryId | null) {
  if (!category) return PRODUCTS;
  return PRODUCTS.filter((product) => product.categoryIds.includes(category));
}

/**
 * Formats a product price in Israeli shekels for display.
 */
export function formatProductPrice(price: number) {
  return `₪${price}`;
}
