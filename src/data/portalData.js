// src/data/portalData.js

import { products as homeProducts } from "./homeData";
import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";

/*
=========================================================
SHARED VEYRAA CATALOGUE

IMPORTANT:
These are the SAME products already used by Customer Portal.
We are NOT creating another product catalogue.
=========================================================
*/

export const catalogProducts = [
  ...homeProducts.map((item) => ({
    ...item,
    audience: item.audience || "Women",
  })),

  ...womenProducts.map((item) => ({
    ...item,
    audience: "Women",
  })),

  ...menProducts.map((item) => ({
    ...item,
    audience: "Men",
  })),

  ...kidsProducts.map((item) => ({
    ...item,
    audience: item.audience || item.gender || "Kids",
  })),
];

/*
=========================================================
IMAGE RESOLVER
=========================================================
*/

export function resolveProductImage(product) {
  const raw = String(product?.image || "").trim();

  if (!raw) return "";

  if (/^(https?:|data:|blob:)/i.test(raw)) {
    return raw;
  }

  if (/^\/(women|men|kids)\//i.test(raw)) {
    return raw;
  }

  const audience = String(
    product?.audience || product?.gender || ""
  ).toLowerCase();

  if (["women", "men", "kids"].includes(audience)) {
    return `/${audience}/${raw.replace(/^\/+/, "")}`;
  }

  return raw;
}

/*
=========================================================
PRICE
=========================================================
*/

export function getProductPrice(product) {
  return Number(
    product?.price ||
    product?.sellingPrice ||
    0
  );
}

export function getOriginalPrice(product) {
  const price = getProductPrice(product);

  return Number(
    product?.oldPrice ||
    product?.originalPrice ||
    product?.mrp ||
    price
  );
}

export function getDiscount(product) {
  const price = getProductPrice(product);
  const original = getOriginalPrice(product);

  if (!original || original <= price) return 0;

  return Math.round(
    ((original - price) / original) * 100
  );
}

/*
=========================================================
SELLER INVENTORY
=========================================================
*/

const INVENTORY_KEY = "veyraaSellerInventory";

export function getInventory() {
  try {
    return JSON.parse(
      localStorage.getItem(INVENTORY_KEY)
    ) || {};
  } catch {
    return {};
  }
}

export function saveInventory(inventory) {
  localStorage.setItem(
    INVENTORY_KEY,
    JSON.stringify(inventory)
  );

  window.dispatchEvent(
    new Event("veyraa:inventory-updated")
  );
}

export function getProductStock(product, index = 0) {
  const inventory = getInventory();

  const id = String(
    product?.id ?? product?.name
  );

  if (inventory[id] !== undefined) {
    return Number(inventory[id]);
  }

  /*
  Initial stock is created only for the existing
  customer products. No new products are created.
  */

  return [42, 28, 16, 8, 34, 21, 12][index % 7];
}

export function updateProductStock(product, quantity) {
  const inventory = getInventory();

  const id = String(
    product?.id ?? product?.name
  );

  inventory[id] = Math.max(
    0,
    Number(quantity)
  );

  saveInventory(inventory);
}

/*
=========================================================
SELLER PRODUCT STATUS
=========================================================
*/

export function getStockStatus(stock) {
  if (stock <= 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "Healthy";
}

/*
=========================================================
DEMO ORDER DATA

Orders reference the SAME catalogue products.
=========================================================
*/

export function getOrders() {
  try {
    return JSON.parse(
      localStorage.getItem("veyraaSellerOrders")
    ) || [];
  } catch {
    return [];
  }
}

export function saveOrders(orders) {
  localStorage.setItem(
    "veyraaSellerOrders",
    JSON.stringify(orders)
  );

  window.dispatchEvent(
    new Event("veyraa:orders-updated")
  );
}

/*
Create initial marketplace orders using
existing products only.
*/

export function ensureDemoOrders() {
  const existing = getOrders();

  if (existing.length) {
    return existing;
  }

  const orders = catalogProducts
    .slice(0, Math.min(8, catalogProducts.length))
    .map((product, index) => ({
      id: `VY${10284 + index}`,
      productId: product.id,
      productName: product.name,
      image: resolveProductImage(product),
      amount: getProductPrice(product),
      quantity: index % 3 + 1,
      customer:
        [
          "Priya Sharma",
          "Ananya Rao",
          "Meera Krishnan",
          "Kavya S",
          "Divya Menon",
          "Aaradhya",
          "Sneha R",
          "Ishita",
        ][index] || "Veyraa Customer",
      status:
        [
          "New",
          "Processing",
          "Ready to Ship",
          "Shipped",
          "Delivered",
          "Delivered",
          "Processing",
          "New",
        ][index],
      date: new Date().toLocaleDateString("en-IN"),
    }));

  saveOrders(orders);

  return orders;
}

/*
=========================================================
SELLER METRICS
=========================================================
*/

export function getSellerMetrics() {
  const orders = ensureDemoOrders();

  const revenue = orders.reduce(
    (sum, order) =>
      sum +
      Number(order.amount || 0) *
      Number(order.quantity || 1),
    0
  );

  const units = orders.reduce(
    (sum, order) =>
      sum + Number(order.quantity || 1),
    0
  );

  return {
    orders: orders.length,
    revenue,
    units,
  };
}