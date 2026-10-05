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
/* =========================================================
   VEYRAA MARKETPLACE REVENUE ENGINE
   ---------------------------------------------------------
   Uses the SAME existing catalogue, orders and inventory.
   No duplicate products are created.
   ========================================================= */

const REVENUE_KEY = "veyraaMarketplaceRevenue";

/* ---------------------------------------------------------
   DEFAULT REVENUE STATE
   --------------------------------------------------------- */

const defaultRevenueState = {
  commissionRate: 10,

  subscription: {
    plan: "Starter",
    active: true,
    renewalDate: "",
  },

  sponsoredProducts: [],

  featuredProducts: [],

  sponsoredSearch: [],

  campaigns: [],

  catalogueServices: [],

  fulfilment: {
    enabled: false,
    service: "Veyraa Standard Fulfilment",
    fee: 49,
    ordersProcessed: 0,
  },

  verifiedSeller: {
    verified: true,
    badge: "Veyraa Verified",
    since: new Date().toISOString(),
  },
};

/* ---------------------------------------------------------
   REVENUE STATE
   --------------------------------------------------------- */

export function getRevenueState() {
  try {
    const stored = localStorage.getItem(REVENUE_KEY);

    if (!stored) {
      return defaultRevenueState;
    }

    return {
      ...defaultRevenueState,
      ...JSON.parse(stored),
    };
  } catch {
    return defaultRevenueState;
  }
}

export function saveRevenueState(state) {
  localStorage.setItem(
    REVENUE_KEY,
    JSON.stringify(state)
  );

  window.dispatchEvent(
    new Event("veyraa:revenue-updated")
  );
}

/* ---------------------------------------------------------
   SELLER COMMISSION
   --------------------------------------------------------- */

export function getCommissionRate() {
  return Number(
    getRevenueState().commissionRate || 10
  );
}

export function calculateSellerCommission(orderAmount) {
  const amount = Number(orderAmount || 0);
  const rate = getCommissionRate();

  return Number(
    ((amount * rate) / 100).toFixed(2)
  );
}

export function calculateSellerSettlement(orderAmount) {
  const amount = Number(orderAmount || 0);
  const commission =
    calculateSellerCommission(amount);

  return Number(
    (amount - commission).toFixed(2)
  );
}

/* ---------------------------------------------------------
   SELLER SUBSCRIPTION
   --------------------------------------------------------- */

export const sellerSubscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    commission: 12,
    description:
      "Essential marketplace tools for growing sellers.",
  },

  {
    id: "growth",
    name: "Growth",
    price: 999,
    commission: 10,
    description:
      "Advanced selling and promotional capabilities.",
  },

  {
    id: "premium",
    name: "Premium",
    price: 2499,
    commission: 7,
    description:
      "Priority marketplace tools and premium visibility.",
  },
];

export function getSellerSubscription() {
  return getRevenueState().subscription;
}

export function updateSellerSubscription(plan) {
  const state = getRevenueState();

  const selectedPlan =
    sellerSubscriptionPlans.find(
      (item) => item.id === plan || item.name === plan
    );

  if (!selectedPlan) {
    return state;
  }

  const updated = {
    ...state,

    commissionRate: selectedPlan.commission,

    subscription: {
      plan: selectedPlan.name,
      active: true,
      renewalDate: new Date(
        Date.now() +
          30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  };

  saveRevenueState(updated);

  return updated;
}

/* ---------------------------------------------------------
   SPONSORED PRODUCTS
   --------------------------------------------------------- */

export function getSponsoredProducts() {
  return getRevenueState().sponsoredProducts || [];
}

export function sponsorProduct(product) {
  const state = getRevenueState();

  const id = String(
    product?.id ?? product?.name
  );

  const exists =
    state.sponsoredProducts.some(
      (item) => String(item.productId) === id
    );

  if (exists) {
    return state;
  }

  const updated = {
    ...state,

    sponsoredProducts: [
      ...state.sponsoredProducts,

      {
        productId: id,
        productName: product?.name || "Product",
        image: resolveProductImage(product),
        createdAt: new Date().toISOString(),
        status: "Active",
      },
    ],
  };

  saveRevenueState(updated);

  return updated;
}

export function removeSponsoredProduct(productId) {
  const state = getRevenueState();

  const updated = {
    ...state,

    sponsoredProducts:
      state.sponsoredProducts.filter(
        (item) =>
          String(item.productId) !==
          String(productId)
      ),
  };

  saveRevenueState(updated);

  return updated;
}

/* ---------------------------------------------------------
   FEATURED PLACEMENT
   --------------------------------------------------------- */

export function getFeaturedProducts() {
  return getRevenueState().featuredProducts || [];
}

export function featureProduct(product) {
  const state = getRevenueState();

  const id = String(
    product?.id ?? product?.name
  );

  if (
    state.featuredProducts.some(
      (item) => String(item.productId) === id
    )
  ) {
    return state;
  }

  const updated = {
    ...state,

    featuredProducts: [
      ...state.featuredProducts,

      {
        productId: id,
        productName: product?.name || "Product",
        image: resolveProductImage(product),
        position: "Marketplace Featured",
        status: "Active",
        createdAt: new Date().toISOString(),
      },
    ],
  };

  saveRevenueState(updated);

  return updated;
}

export function removeFeaturedProduct(productId) {
  const state = getRevenueState();

  const updated = {
    ...state,

    featuredProducts:
      state.featuredProducts.filter(
        (item) =>
          String(item.productId) !==
          String(productId)
      ),
  };

  saveRevenueState(updated);

  return updated;
}

/* ---------------------------------------------------------
   SPONSORED SEARCH
   --------------------------------------------------------- */

export function getSponsoredSearch() {
  return getRevenueState().sponsoredSearch || [];
}

export function addSponsoredSearch(keyword, product) {
  const state = getRevenueState();

  const updated = {
    ...state,

    sponsoredSearch: [
      ...state.sponsoredSearch,

      {
        id: `SEARCH-${Date.now()}`,
        keyword: String(keyword || "").trim(),
        productId:
          product?.id ??
          product?.name ??
          "",
        productName:
          product?.name ||
          "Marketplace Product",
        status: "Active",
        createdAt: new Date().toISOString(),
      },
    ],
  };

  saveRevenueState(updated);

  return updated;
}

/* ---------------------------------------------------------
   MARKETING CAMPAIGNS
   --------------------------------------------------------- */

export function getRevenueCampaigns() {
  return getRevenueState().campaigns || [];
}

export function createRevenueCampaign({
  name,
  type = "Promotion",
  discount = 10,
  startDate = "",
  endDate = "",
}) {
  const state = getRevenueState();

  const campaign = {
    id: `CMP-${Date.now()}`,
    name:
      String(name || "").trim() ||
      "New Veyraa Campaign",
    type,
    discount: Number(discount || 0),
    startDate,
    endDate,
    status: "Active",
    createdAt: new Date().toISOString(),
  };

  const updated = {
    ...state,

    campaigns: [
      ...state.campaigns,
      campaign,
    ],
  };

  saveRevenueState(updated);

  return campaign;
}

/* ---------------------------------------------------------
   PROFESSIONAL CATALOGUE SERVICE
   --------------------------------------------------------- */

export function getCatalogueServices() {
  return getRevenueState().catalogueServices || [];
}

export function requestCatalogueService(product) {
  const state = getRevenueState();

  const productId = String(
    product?.id ?? product?.name
  );

  const exists =
    state.catalogueServices.some(
      (item) =>
        String(item.productId) === productId
    );

  if (exists) {
    return state;
  }

  const updated = {
    ...state,

    catalogueServices: [
      ...state.catalogueServices,

      {
        id: `CAT-${Date.now()}`,
        productId,
        productName:
          product?.name || "Product",
        service:
          "Professional Catalogue Service",
        price: 299,
        status: "Requested",
        requestedAt:
          new Date().toISOString(),
      },
    ],
  };

  saveRevenueState(updated);

  return updated;
}

/* ---------------------------------------------------------
   VEYRAA FULFILMENT
   --------------------------------------------------------- */

export function getFulfilmentSettings() {
  return getRevenueState().fulfilment;
}

export function enableFulfilment(enabled = true) {
  const state = getRevenueState();

  const updated = {
    ...state,

    fulfilment: {
      ...state.fulfilment,
      enabled,
    },
  };

  saveRevenueState(updated);

  return updated;
}

export function updateFulfilmentOrders(count) {
  const state = getRevenueState();

  const updated = {
    ...state,

    fulfilment: {
      ...state.fulfilment,
      ordersProcessed:
        Number(count || 0),
    },
  };

  saveRevenueState(updated);

  return updated;
}

/* ---------------------------------------------------------
   ADVANCED SELLER ANALYTICS
   --------------------------------------------------------- */

export function getAdvancedSellerAnalytics() {
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
      sum +
      Number(order.quantity || 1),
    0
  );

  const averageOrderValue =
    orders.length > 0
      ? revenue / orders.length
      : 0;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const deliveryRate =
    orders.length > 0
      ? (deliveredOrders /
          orders.length) *
        100
      : 0;

  const commission =
    orders.reduce(
      (sum, order) =>
        sum +
        calculateSellerCommission(
          Number(order.amount || 0) *
            Number(order.quantity || 1)
        ),
      0
    );

  return {
    revenue: Number(revenue.toFixed(2)),
    units,
    orders: orders.length,

    averageOrderValue:
      Number(
        averageOrderValue.toFixed(2)
      ),

    deliveryRate:
      Number(
        deliveryRate.toFixed(1)
      ),

    commission:
      Number(commission.toFixed(2)),

    settlement:
      Number(
        (revenue - commission).toFixed(2)
      ),
  };
}

/* ---------------------------------------------------------
   VEYRAA VERIFIED SELLER
   --------------------------------------------------------- */

export function getVerifiedSellerStatus() {
  return getRevenueState().verifiedSeller;
}

export function setVerifiedSellerStatus(
  verified
) {
  const state = getRevenueState();

  const updated = {
    ...state,

    verifiedSeller: {
      ...state.verifiedSeller,
      verified: Boolean(verified),
      badge: verified
        ? "Veyraa Verified"
        : "",
      since: verified
        ? state.verifiedSeller.since ||
          new Date().toISOString()
        : "",
    },
  };

  saveRevenueState(updated);

  return updated;
}