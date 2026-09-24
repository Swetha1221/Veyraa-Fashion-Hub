import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VirtualTryOn from "../components/VirtualTryOn";

import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";

import "./DiscoveryPage.css";

function readWishlistIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedWishlist = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
    return savedWishlist.map((item) => item.id);
  } catch (error) {
    return [];
  }
}

const allProducts = [
  ...womenProducts.map((product) => ({ ...product, gender: "Women", audience: "Women" })),
  ...menProducts.map((product) => ({ ...product, gender: "Men", audience: "Men" })),
  ...kidsProducts.map((product) => ({
    ...product,
    gender: "Kids",
    audience: product.gender || "Kids",
  })),
];

function resolveCatalogImage(product) {
  const raw = String(product?.image || "").trim();

  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }
  if (raw.startsWith("/women/") || raw.startsWith("/men/") || raw.startsWith("/kids/")) {
    return raw;
  }

  const gender = String(product?.gender || "").toLowerCase();
  if (gender === "women" || gender === "men" || gender === "kids") {
    return `/${gender}/${raw}`;
  }

  return raw;
}

function getCollectionProducts(title) {
  const normalizedTitle = title?.toLowerCase().trim();
  const normalizedProducts = allProducts.filter(Boolean);

  if (normalizedTitle === "new arrivals") {
    return normalizedProducts.filter((product) => {
      const badge = String(product.badge || "").toLowerCase().trim();
      return badge === "new" || badge === "just in" || badge === "new arrival" || badge === "new arrivals";
    });
  }

  if (normalizedTitle === "trending now") {
    return normalizedProducts.filter((product) => {
      const badge = String(product.badge || "").toLowerCase().trim();
      return badge === "trending" || badge === "hot" || badge === "popular";
    });
  }

  if (normalizedTitle === "best sellers") {
    return normalizedProducts.filter((product) => {
      const badge = String(product.badge || "").toLowerCase().trim();
      return badge === "bestseller" || badge === "best seller";
    });
  }

  return normalizedProducts;
}

function getDiscountPercent(product) {
  const current = Number(product.price) || 0;
  const original = Number(product.oldPrice || product.originalPrice || product.price) || 0;

  if (!original || original <= current) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
}

function getStockLeft(product) {
  const key = String(product?.id || product?.name || "");
  const hash = [...key].reduce((total, character) => total + character.charCodeAt(0), 0);
  return 2 + (hash % 8);
}

function DiscoveryPage({ title, subtitle }) {
  const [sort, setSort] = useState("featured");
  const [audience, setAudience] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minimumDiscount, setMinimumDiscount] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [wishlistIds, setWishlistIds] = useState(() => readWishlistIds());
  const isTrending = title === "Trending Now";
  const isBestSeller = title === "Best Sellers";

  const collectionProducts = useMemo(() => {
    const products = getCollectionProducts(title);

    if (!isTrending) {
      return products;
    }

    return products.filter((product) => {
      const productDiscount = getDiscountPercent(product);
      const productStock = getStockLeft(product);
      const matchesAudience = audience === "All" || product.audience === audience;
      const matchesPrice = Number(product.price) <= maxPrice;
      const matchesDiscount = minimumDiscount === "all" || productDiscount >= Number(minimumDiscount);
      const matchesStock = stockFilter === "all" || (stockFilter === "limited" && productStock <= 6) || (stockFilter === "available" && productStock > 6);

      return matchesAudience && matchesPrice && matchesDiscount && matchesStock;
    });
  }, [audience, isTrending, maxPrice, minimumDiscount, stockFilter, title]);

  const displayedProducts = useMemo(() => {
    const result = [...collectionProducts];

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [collectionProducts, sort]);

  const addToCart = (product) => {
    const savedCart = JSON.parse(localStorage.getItem("veyraaCart")) || [];
    const existing = savedCart.find((item) => item.id === product.id);

    const updatedCart = existing
      ? savedCart.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      : [...savedCart, { ...product, quantity: 1 }];

    localStorage.setItem("veyraaCart", JSON.stringify(updatedCart));
    alert(`${product.name} added to cart`);
  };

  const buyNow = (product) => {
    const savedCart = JSON.parse(localStorage.getItem("veyraaCart")) || [];
    const existing = savedCart.find((item) => item.id === product.id);

    if (!existing) {
      localStorage.setItem("veyraaCart", JSON.stringify([...savedCart, { ...product, quantity: 1 }]));
    }

    window.location.href = "/billing";
  };

  const toggleWishlist = (product) => {
    const savedWishlist = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
    const exists = savedWishlist.some((item) => item.id === product.id);

    const updatedWishlist = exists
      ? savedWishlist.filter((item) => item.id !== product.id)
      : [...savedWishlist, product];

    localStorage.setItem("veyraaWishlist", JSON.stringify(updatedWishlist));
    setWishlistIds(readWishlistIds());
  };

  return (
    <div className="discovery-page">
      <Navbar />

      <section className={isTrending ? "discovery-hero trending-hero" : "discovery-hero new-arrivals-hero"}>
        <div className="discovery-hero-overlay">
          <span className="discovery-eyebrow">
            {isTrending ? "WHAT'S HOT AT VEYRAA" : isBestSeller ? "VEYRAA CUSTOMER FAVORITES" : "JUST LANDED AT VEYRAA"}
          </span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <button
            type="button"
            onClick={() => document.getElementById("discovery-products")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore Collection
          </button>
        </div>
      </section>

      <section className="collection-intro">
        <span className="collection-eyebrow">
          {isTrending ? "TREND REPORT" : isBestSeller ? "VEYRAA FAVORITES" : "LATEST DROP"}
        </span>
        <h2>{isTrending ? "What's Trending Now" : isBestSeller ? "Best Sellers" : "Fresh From Veyraa"}</h2>
        <p>
          {isTrending
            ? "Trending products from the existing premium collection — curated for now, styled for everywhere."
            : isBestSeller
            ? "Customer-favorite pieces from the existing Veyraa catalog, selected for their repeat appeal."
            : "Fresh arrivals already available across the existing Women, Men and Kids collections."}
        </p>
      </section>

      <section className="discovery-products" id="discovery-products">
        <div className="discovery-header">
          <div>
            <span className="discovery-small-title">
              {isTrending ? "TRENDING COLLECTION" : isBestSeller ? "BEST SELLER COLLECTION" : "NEW COLLECTION"}
            </span>
            <h2>{title}</h2>
            <p>{displayedProducts.length} existing Veyraa products</p>
          </div>

          {isTrending && (
            <div className="discovery-filters" aria-label="Trending collection filters">
              <label>
                Collection
                <select value={audience} onChange={(event) => setAudience(event.target.value)}>
                  <option value="All">All</option>
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Boys">Kids - Boys</option>
                  <option value="Girls">Kids - Girls</option>
                </select>
              </label>

              <label>
                Up to ₹{maxPrice.toLocaleString("en-IN")}
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                />
              </label>

              <label>
                Discount
                <select value={minimumDiscount} onChange={(event) => setMinimumDiscount(event.target.value)}>
                  <option value="all">Any</option>
                  <option value="10">10%+</option>
                  <option value="20">20%+</option>
                  <option value="30">30%+</option>
                </select>
              </label>

              <label>
                Stock
                <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
                  <option value="all">All stock</option>
                  <option value="limited">Limited stock</option>
                  <option value="available">In stock</option>
                </select>
              </label>
            </div>
          )}

          <div className="discovery-sort">
            <label>Sort by</label>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="discovery-grid">
          {displayedProducts.length === 0 ? (
            <div className="discovery-empty">
              <h3>No products available</h3>
              <p>No existing products currently use the required collection badge.</p>
            </div>
          ) : (
            displayedProducts.map((product) => {
              const discount = getDiscountPercent(product);
              const stockLeft = getStockLeft(product);
              const currentPrice = Number(product.price) || 0;
              const originalPrice = Number(product.oldPrice || product.originalPrice || currentPrice) || currentPrice;
              const isHot = String(product.badge || "").toLowerCase().includes("trending") || String(product.badge || "").toLowerCase().includes("hot");
              const isLimited = stockLeft <= 6;
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <article className="discovery-card" key={`${product.gender}-${product.id}`}>
                  <div className="discovery-image">
                    <img src={resolveCatalogImage(product)} alt={product.name} />
                    <span className="discovery-badge">{product.badge || "Trending"}</span>
                    {isHot && <span className="discovery-hot">Hot Pick</span>}
                    {isLimited && <span className="discovery-limited">Limited Stock</span>}
                    <button
                      type="button"
                      className={`discovery-heart ${isWishlisted ? "active" : ""}`}
                      onClick={() => toggleWishlist(product)}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      aria-pressed={isWishlisted}
                    >
                      {isWishlisted ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="discovery-info">
                    <span className="discovery-category">
                      {product.gender} • {product.type || product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <div className="discovery-rating">★ {Number(product.rating || 4.5).toFixed(1)}</div>

                    <div className="discovery-price-row">
                      <div className="discovery-price">
                        <del>₹{originalPrice.toLocaleString("en-IN")}</del>
                        <strong>₹{currentPrice.toLocaleString("en-IN")}</strong>
                      </div>
                      <span className="discovery-offer">
                        {discount > 0 ? `${discount}% OFF` : "NEW PRICE"}
                      </span>
                    </div>

                    <div className="discovery-stock">
                      {isLimited ? `Only ${stockLeft} left` : `${stockLeft} in stock`}
                    </div>

                    <div className="discovery-actions">
                      <button type="button" className="discovery-cart" onClick={() => addToCart(product)}>
                        🛒 Add to Cart
                      </button>
                      <button type="button" className="discovery-buy" onClick={() => buyNow(product)}>
                        Buy Now
                      </button>
                    </div>

                    <div className="discovery-tryon-wrap">
                      <VirtualTryOn
                        product={{
                          ...product,
                          image: resolveCatalogImage(product),
                        }}
                      />
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default DiscoveryPage;
