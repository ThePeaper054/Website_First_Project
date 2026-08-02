export type Product = {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
};

/**
 * Placeholder catalog for the home artwork scroller.
 * Image paths and names will be replaced with real product assets later.
 */
export const PRODUCTS: readonly Product[] = [
  {
    id: "artwork-01",
    name: "Artwork 01",
    price: 89,
    imageSrc: "/products/product-01.svg",
  },
  {
    id: "artwork-02",
    name: "Artwork 02",
    price: 99,
    imageSrc: "/products/product-02.svg",
  },
  {
    id: "artwork-03",
    name: "Artwork 03",
    price: 109,
    imageSrc: "/products/product-03.svg",
  },
  {
    id: "artwork-04",
    name: "Artwork 04",
    price: 119,
    imageSrc: "/products/product-04.svg",
  },
  {
    id: "artwork-05",
    name: "Artwork 05",
    price: 129,
    imageSrc: "/products/product-05.svg",
  },
  {
    id: "artwork-06",
    name: "Artwork 06",
    price: 139,
    imageSrc: "/products/product-06.svg",
  },
  {
    id: "artwork-07",
    name: "Artwork 07",
    price: 149,
    imageSrc: "/products/product-07.svg",
  },
  {
    id: "artwork-08",
    name: "Artwork 08",
    price: 159,
    imageSrc: "/products/product-08.svg",
  },
  {
    id: "artwork-09",
    name: "Artwork 09",
    price: 169,
    imageSrc: "/products/product-09.svg",
  },
  {
    id: "artwork-10",
    name: "Artwork 10",
    price: 189,
    imageSrc: "/products/product-10.svg",
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
  },
  {
    id: "accessory-02",
    name: "Accessory 02",
    price: 59,
    imageSrc: "/products/product-02.svg",
  },
  {
    id: "accessory-03",
    name: "Accessory 03",
    price: 69,
    imageSrc: "/products/product-03.svg",
  },
  {
    id: "accessory-04",
    name: "Accessory 04",
    price: 79,
    imageSrc: "/products/product-04.svg",
  },
] as const;

/**
 * Formats a product price in Israeli shekels for display.
 */
export function formatProductPrice(price: number) {
  return `₪${price}`;
}
