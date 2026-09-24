import { products as homeProducts } from "./homeData";
import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";

/**
 * Normalizes an image path across all existing image types in the project.
 */
export function resolveCatalogImage(product) {
  const raw = String(product?.image || "").trim();
  if (!raw) return "";

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return raw;
  }

  if (
    raw.startsWith("/women/") ||
    raw.startsWith("/men/") ||
    raw.startsWith("/kids/") ||
    raw.startsWith("/hero/")
  ) {
    return raw;
  }

  const audience = String(
    product?.audience || product?.gender || ""
  ).toLowerCase();

  const folder =
    audience === "girls" || audience === "boys" || audience === "kids"
      ? "kids"
      : audience === "men"
      ? "men"
      : "women";

  return `/${folder}/${raw.replace(/^\/+/, "")}`;
}

/**
 * Determines which of the standard category groups a product belongs to.
 */
export function getCategoryGroup(product) {
  const name = String(product?.name || "").toLowerCase();
  const cat = String(product?.category || "").toLowerCase();
  const type = String(product?.type || "").toLowerCase();
  const text = `${name} ${cat} ${type}`;

  if (/saree|sari/.test(text)) return "Sarees";
  if (/kurti/.test(text) || (/kurta/.test(text) && !/shirt/.test(text))) return "Kurtis";
  if (/chudidar|salwar/.test(text)) return "Chudidars";
  if (/lehenga/.test(text)) return "Lehengas";
  if (/frock|dress|jumpsuit/.test(text)) return "Dresses";
  if (/top\b|tops\b/.test(text)) return "Tops";
  if (/t-shirt|tshirt|tee/.test(text)) return "T-Shirts";
  if (/shirt/.test(text)) return "Shirts";
  if (/trouser|pant|chino/.test(text)) return "Trousers";
  if (/jean/.test(text)) return "Jeans";
  if (/bag|handbag|tote|purse/.test(text)) return "Bags";
  if (/jewel|necklace|earring|bangle/.test(text)) return "Jewellery";
  if (/footwear|shoe|heel|sandal|sneaker/.test(text)) return "Footwear";
  if (/watch|sunglass|belt|accessory|accessories/.test(text)) return "Accessories";

  // Additional fallbacks from product.type or category
  if (/ethnic/.test(text)) return "Ethnic Wear";
  if (/nightwear|sleepwear/.test(text)) return "Nightwear";
  if (/sportswear|activewear/.test(text)) return "Sportswear";
  if (/jacket|blazer|suit/.test(text)) return "Jackets & Suits";
  if (/skirt/.test(text)) return "Skirts";

  return product?.type || product?.category || "Fashion";
}

/**
 * Returns the unified catalog of existing products with normalized metadata.
 */
export function getUnifiedCatalog() {
  const catalog = [];
  const seenIds = new Set();

  function addProduct(item, defaultAudience) {
    if (!item) return;
    const rawId = item.id;
    const uniqueKey = `${defaultAudience}-${rawId}`;
    if (seenIds.has(uniqueKey)) return;
    seenIds.add(uniqueKey);

    const price = Number(item.price) || 0;
    const originalPrice =
      Number(item.oldPrice || item.originalPrice || price) || price;
    const discountPercent =
      originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;
    const savings = Math.max(0, originalPrice - price);

    const audience =
      defaultAudience === "Kids"
        ? item.gender || "Kids"
        : defaultAudience;

    const categoryGroup = getCategoryGroup(item);

    // Stock availability
    const rawStock = item.stock ?? item.stockQuantity;
    const isOutOfStock = rawStock === 0;

    catalog.push({
      ...item,
      id: rawId,
      audience: defaultAudience,
      gender: audience,
      price,
      originalPrice,
      discountPercent,
      savings,
      categoryGroup,
      isOutOfStock,
      stockCount: rawStock ?? 12,
      displayBadge:
        item.badge ||
        (discountPercent >= 30
          ? `${discountPercent}% OFF`
          : "SPECIAL DEAL"),
    });
  }

  // 1. Women products
  if (Array.isArray(womenProducts)) {
    womenProducts.forEach((p) => addProduct(p, "Women"));
  }

  // 2. Men products
  if (Array.isArray(menProducts)) {
    menProducts.forEach((p) => addProduct(p, "Men"));
  }

  // 3. Kids products
  if (Array.isArray(kidsProducts)) {
    kidsProducts.forEach((p) => addProduct(p, "Kids"));
  }

  // 4. Home curated products
  if (Array.isArray(homeProducts)) {
    homeProducts.forEach((p) => {
      const isMen =
        p.category &&
        p.category.toLowerCase().includes("men") &&
        !p.category.toLowerCase().includes("women");
      addProduct(p, isMen ? "Men" : "Women");
    });
  }

  return catalog;
}

/**
 * Searches the catalog using case-insensitive, partial-match, category-aware,
 * multi-token matching with word-boundary awareness (e.g. "men" doesn't match "women").
 */
export function searchCatalog(query) {
  const clean = String(query || "").trim().toLowerCase();
  if (!clean) return [];

  const catalog = getUnifiedCatalog();
  const tokens = clean.split(/\s+/).filter(Boolean);

  return catalog.filter((product) => {
    const audience = String(product.audience || "").toLowerCase();
    const gender = String(product.gender || "").toLowerCase();
    const name = String(product.name || "").toLowerCase();
    const category = String(product.category || "").toLowerCase();
    const type = String(product.type || "").toLowerCase();
    const categoryGroup = String(product.categoryGroup || "").toLowerCase();
    const badge = String(product.badge || "").toLowerCase();
    const colour = String(product.colour || product.color || "").toLowerCase();
    const material = String(product.material || "").toLowerCase();

    return tokens.every((token) => {
      // 1. Audience specific boundaries
      if (token === "men" || token === "man" || token === "mens" || token === "men's") {
        return (
          audience === "men" ||
          gender === "men" ||
          /\bmen\b|\bmens\b/i.test(name) ||
          /\bmen\b/i.test(category)
        );
      }
      if (
        token === "women" ||
        token === "woman" ||
        token === "womens" ||
        token === "women's"
      ) {
        return (
          audience === "women" ||
          gender === "women" ||
          /\bwomen\b|\bwomens\b/i.test(name) ||
          /\bwomen\b/i.test(category)
        );
      }
      if (
        token === "kids" ||
        token === "kid" ||
        token === "child" ||
        token === "children" ||
        token === "boy" ||
        token === "boys" ||
        token === "girl" ||
        token === "girls"
      ) {
        return (
          audience === "kids" ||
          gender === "kids" ||
          gender === "boys" ||
          gender === "girls" ||
          /kid|child|boy|girl/i.test(name)
        );
      }

      // 2. Direct string checks
      const textToSearch = `${name} ${category} ${type} ${categoryGroup} ${badge} ${colour} ${material} ${audience}`;
      if (textToSearch.includes(token)) return true;

      // 3. Synonym / Alias matching
      if (token === "bag" || token === "bags") {
        return (
          textToSearch.includes("bag") ||
          textToSearch.includes("handbag") ||
          textToSearch.includes("purse") ||
          textToSearch.includes("tote")
        );
      }
      if (
        token === "sar" ||
        token === "sari" ||
        token === "sarees" ||
        token === "saree"
      ) {
        return textToSearch.includes("saree") || textToSearch.includes("sari");
      }
      if (token === "kurti" || token === "kurtis") {
        return (
          textToSearch.includes("kurti") ||
          textToSearch.includes("kurta")
        );
      }
      if (token === "shirt" || token === "shirts") {
        return textToSearch.includes("shirt");
      }
      if (token === "dress" || token === "dresses") {
        return textToSearch.includes("dress") || textToSearch.includes("frock");
      }
      if (token === "jean" || token === "jeans") {
        return textToSearch.includes("jean") || textToSearch.includes("denim");
      }
      if (token === "shoe" || token === "shoes" || token === "footwear") {
        return (
          textToSearch.includes("footwear") ||
          textToSearch.includes("shoe") ||
          textToSearch.includes("heel") ||
          textToSearch.includes("sandal")
        );
      }

      return false;
    });
  });
}

/**
 * Cart helper: Adds product to localStorage `veyraaCart` and notifies components.
 */
export function addToCart(product, quantity = 1) {
  if (!product) return;
  try {
    const savedCart = JSON.parse(localStorage.getItem("veyraaCart")) || [];
    const existingIndex = savedCart.findIndex(
      (item) => String(item.id) === String(product.id)
    );

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = [...savedCart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: (updatedCart[existingIndex].quantity || 1) + quantity,
      };
    } else {
      updatedCart = [
        ...savedCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.originalPrice || product.oldPrice,
          image: resolveCatalogImage(product),
          category: product.categoryGroup || product.type || product.category,
          gender: product.gender || product.audience,
          quantity,
        },
      ];
    }

    localStorage.setItem("veyraaCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("veyraa:cart-updated"));
  } catch (error) {
    console.error("Failed to add to cart:", error);
  }
}

/**
 * Wishlist helper: Toggles product in localStorage `veyraaWishlist`.
 */
export function toggleWishlist(product) {
  if (!product) return false;
  try {
    const savedWishlist =
      JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
    const exists = savedWishlist.some(
      (item) => String(item.id) === String(product.id)
    );

    let updatedWishlist;
    let isNowWishlisted = false;

    if (exists) {
      updatedWishlist = savedWishlist.filter(
        (item) => String(item.id) !== String(product.id)
      );
    } else {
      updatedWishlist = [
        ...savedWishlist,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.originalPrice || product.oldPrice,
          image: resolveCatalogImage(product),
          category: product.categoryGroup || product.type || product.category,
          gender: product.gender || product.audience,
        },
      ];
      isNowWishlisted = true;
    }

    localStorage.setItem("veyraaWishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("veyraa:wishlist-updated"));
    return isNowWishlisted;
  } catch (error) {
    console.error("Failed to toggle wishlist:", error);
    return false;
  }
}

/**
 * Checks if product is currently saved in wishlist.
 */
export function isProductWishlisted(productId) {
  try {
    const savedWishlist =
      JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
    return savedWishlist.some(
      (item) => String(item.id) === String(productId)
    );
  } catch (error) {
    return false;
  }
}

