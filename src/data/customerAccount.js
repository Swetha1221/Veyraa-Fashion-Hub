import { getUnifiedCatalog } from "./unifiedCatalog";

/*
 * Veyraa customer account + fit-profile persistence.
 * Keeps customer data scoped to the logged-in customer while preserving
 * the localStorage keys already used by the account UI.
 */

const CURRENT_CUSTOMER_KEY = "veyraaCurrentCustomer";
const CUSTOMER_FLAG_KEY = "veyraaCustomer";
const CUSTOMER_NAME_KEY = "veyraaCustomerName";
const FIT_PROFILE_KEY = "veyraaFitProfile";
const PROFILE_KEY = "veyraaCustomerProfile";

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function normaliseCustomer(customer) {
  if (!customer || typeof customer !== "object") {
    return {
      id: "guest",
      name: "Customer",
      email: "",
      phone: "",
      isLoggedIn: false,
    };
  }

  return {
    id: customer.id || "guest",
    name: customer.name || "Customer",
    email: customer.email || "",
    phone: customer.phone || "",
    isLoggedIn: Boolean(customer.isLoggedIn),
  };
}

export function getCurrentCustomer() {
  if (typeof window === "undefined") {
    return normaliseCustomer(null);
  }

  const saved = safeParse(localStorage.getItem(CURRENT_CUSTOMER_KEY), null);
  if (saved && saved.id && saved.isLoggedIn !== false) {
    return normaliseCustomer({ ...saved, isLoggedIn: true });
  }

  const loggedIn = localStorage.getItem(CUSTOMER_FLAG_KEY) === "true";
  if (!loggedIn) {
    return normaliseCustomer(null);
  }

  const name = localStorage.getItem(CUSTOMER_NAME_KEY) || "Customer";
  const profile = safeParse(localStorage.getItem(PROFILE_KEY), {});
  const email = profile.email || "";
  const phone = profile.phone || "";
  const id = email ? `customer_${email.toLowerCase().replace(/[^a-z0-9]+/g, "_")}` : "customer";

  return normaliseCustomer({
    id,
    name,
    email,
    phone,
    isLoggedIn: true,
  });
}

export function loginCustomer(customer = {}) {
  if (typeof window === "undefined") return normaliseCustomer(customer);

  const email = String(customer.email || "").trim();
  const id = customer.id ||
    (email
      ? `customer_${email.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`
      : `customer_${Date.now()}`);

  const current = normaliseCustomer({
    id,
    name: customer.name || (email ? email.split("@")[0] : "Customer"),
    email,
    phone: customer.phone || "",
    isLoggedIn: true,
  });

  localStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(current));
  localStorage.setItem(CUSTOMER_FLAG_KEY, "true");
  localStorage.setItem(CUSTOMER_NAME_KEY, current.name);

  const existingProfile = safeParse(
    localStorage.getItem(`${PROFILE_KEY}_${current.id}`),
    safeParse(localStorage.getItem(PROFILE_KEY), {})
  );

  const mergedProfile = {
    ...existingProfile,
    name: existingProfile.name || current.name,
    email: existingProfile.email || current.email,
    phone: existingProfile.phone || current.phone,
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(mergedProfile));
  localStorage.setItem(`${PROFILE_KEY}_${current.id}`, JSON.stringify(mergedProfile));

  // Load this customer's fit profile into the legacy active key for existing UI code.
  const scopedFit = getSavedFitProfile(current.id);
  localStorage.setItem(FIT_PROFILE_KEY, JSON.stringify(scopedFit));

  window.dispatchEvent(new Event("veyraa:auth-updated"));
  return current;
}

export function logoutCustomer() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CURRENT_CUSTOMER_KEY);
  localStorage.removeItem(CUSTOMER_FLAG_KEY);
  localStorage.removeItem(CUSTOMER_NAME_KEY);
  localStorage.removeItem(FIT_PROFILE_KEY);

  window.dispatchEvent(new Event("veyraa:auth-updated"));
}

function emptyFitProfile() {
  return {
    height: "",
    weight: "",
    chest: "",
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    armLength: "",
    fit: "Regular",
    isCompleted: false,
  };
}

export function getSavedFitProfile(customerId) {
  if (typeof window === "undefined") return emptyFitProfile();

  const id = customerId || getCurrentCustomer().id;

  if (id && id !== "guest") {
    const scoped = safeParse(localStorage.getItem(`${FIT_PROFILE_KEY}_${id}`), null);
    if (scoped) {
      return { ...emptyFitProfile(), ...scoped, isCompleted: scoped.isCompleted !== false };
    }
    return emptyFitProfile();
  }

  const active = safeParse(localStorage.getItem(FIT_PROFILE_KEY), null);
  return active ? { ...emptyFitProfile(), ...active } : emptyFitProfile();
}

export function saveCustomerFitProfile(data = {}, customerId) {
  if (typeof window === "undefined") return data;

  const customer = getCurrentCustomer();
  const id = customerId || customer.id;
  const profile = {
    ...emptyFitProfile(),
    ...data,
    // Support both names used by the two existing UIs.
    chest: data.chest || data.bust || "",
    bust: data.bust || data.chest || "",
    isCompleted: data.isCompleted !== false,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(FIT_PROFILE_KEY, JSON.stringify(profile));

  if (id && id !== "guest") {
    localStorage.setItem(`${FIT_PROFILE_KEY}_${id}`, JSON.stringify(profile));
  }

  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("veyraa:fit-profile-updated"));

  return profile;
}

export function getFitRecommendations(fitProfile, maxCount = 4) {
  if (typeof window === "undefined") return [];

  let catalog = [];
  try {
    catalog = getUnifiedCatalog();
  } catch (error) {
    catalog = [];
  }

  const profile = fitProfile || getSavedFitProfile();
  const list = Array.isArray(catalog) ? catalog : [];

  if (!list.length) return [];

  const savedCustomerProfile = safeParse(
    localStorage.getItem(PROFILE_KEY),
    {}
  );

  const preferredStyle = String(savedCustomerProfile.style || profile.style || "").toLowerCase();
  const preferredSize = String(savedCustomerProfile.size || profile.size || "").toUpperCase();
  const preferredFit = String(profile.fit || savedCustomerProfile.fit || "Regular").toLowerCase();

  const scored = list.map((product) => {
    const text = [
      product.name,
      product.category,
      product.categoryGroup,
      product.type,
      product.material,
      product.colour,
      product.color,
      product.fit,
      product.style,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    let score = 50;
    if (preferredStyle && text.includes(preferredStyle)) score += 25;
    if (preferredFit && text.includes(preferredFit)) score += 10;

    const sizes = Array.isArray(product.sizes)
      ? product.sizes.map((size) => String(size).toUpperCase())
      : [];
    if (preferredSize && sizes.includes(preferredSize)) score += 15;
    if (Number(product.rating) >= 4.5) score += 5;

    const price = Number(product.price) || 0;
    const original = Number(product.oldPrice || product.originalPrice || price) || price;
    if (original > price && original > 0) score += Math.min(10, ((original - price) / original) * 10);

    return {
      ...product,
      score,
      fitBadge: preferredSize ? `Available in size ${preferredSize}` : "Recommended for your profile",
      fitNote: "Based on your saved fashion preferences",
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxCount);
}
