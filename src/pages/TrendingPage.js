import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VirtualTryOn from "../components/VirtualTryOn";
import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";
import "./TrendingPage.css";

const allProducts = [
  ...womenProducts.map((product) => ({ ...product, gender: "Women" })),
  ...menProducts.map((product) => ({ ...product, gender: "Men" })),
  ...kidsProducts.map((product) => ({ ...product, gender: "Kids" })),
];

const trendingProducts = allProducts.filter((product) => /trending|hot|popular/i.test(String(product.badge || "")));

function resolveImage(product) {
  const image = String(product?.image || "").trim();
  if (/^(https?:|data:|blob:)/i.test(image) || /^\/(women|men|kids)\//i.test(image)) return encodeURI(image);
  return encodeURI(`/${String(product.gender || "women").toLowerCase()}/${image.replace(/^\/+/, "")}`);
}

function discountPercent(product) {
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice || product.originalPrice || price) || price;
  return oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
}

function stockLabel(product) {
  const stock = product.stock ?? product.stockQuantity;
  return stock ? (stock <= 6 ? `Only ${stock} left` : `${stock} items left`) : "In Stock";
}

function readWishlistIds() {
  try {
    return (JSON.parse(localStorage.getItem("veyraaWishlist")) || []).map((item) => item.id);
  } catch (error) {
    return [];
  }
}

function TrendingPage() {
  const [audience, setAudience] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [wishlistIds, setWishlistIds] = useState(readWishlistIds);

  const categories = useMemo(() => [
    "All",
    ...new Set(trendingProducts.map((product) => product.type || product.category).filter(Boolean)),
  ], []);

  const displayedProducts = useMemo(() => {
    const result = trendingProducts.filter((product) => {
      const matchesAudience = audience === "All" || product.gender === audience;
      const matchesCategory = category === "All" || (product.type || product.category) === category;
      return matchesAudience && matchesCategory && Number(product.price) <= maxPrice;
    });

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "discount") result.sort((a, b) => discountPercent(b) - discountPercent(a));
    if (sort === "rating") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [audience, category, maxPrice, sort]);

  const addToCart = (product) => {
    const saved = JSON.parse(localStorage.getItem("veyraaCart")) || [];
    const existing = saved.find((item) => String(item.id) === String(product.id));
    const updated = existing
      ? saved.map((item) => String(item.id) === String(product.id) ? { ...item, quantity: (item.quantity || 1) + 1 } : item)
      : [...saved, { ...product, image: resolveImage(product), quantity: 1 }];
    localStorage.setItem("veyraaCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("veyraa:cart-updated"));
  };

  const buyNow = (product) => {
    addToCart(product);
    window.location.href = "/billing";
  };

  const toggleWishlist = (product) => {
    const saved = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
    const exists = saved.some((item) => String(item.id) === String(product.id));
    const updated = exists
      ? saved.filter((item) => String(item.id) !== String(product.id))
      : [...saved, { ...product, image: resolveImage(product) }];
    localStorage.setItem("veyraaWishlist", JSON.stringify(updated));
    setWishlistIds(readWishlistIds());
  };

  return (
    <div className="trending-page">
      <Navbar />
      <section className="trending-feature-hero">
        <div className="trending-hero-copy">
          <span>WHAT'S HOT AT VEYRAA</span>
          <h1>Trending Now</h1>
          <p>Styles everyone is loving, from the most-wanted Veyraa edits.</p>
          <button type="button" onClick={() => document.getElementById("trending-collection")?.scrollIntoView({ behavior: "smooth" })}>Shop the trend edit</button>
        </div>
        <div className="trending-hero-note"><strong>THE CURRENT EDIT</strong><span>Popular silhouettes, fresh energy.</span></div>
      </section>

      <section className="trending-intro">
        <span>THE TREND REPORT</span>
        <h2>Styles Everyone Is Loving.</h2>
        <p>Explore real products from the existing Veyraa catalog, curated by the signals already attached to each collection.</p>
      </section>

      <main className="trending-collection" id="trending-collection">
        <div className="trending-toolbar">
          <div className="trending-audience-filters">
            {['All', 'Women', 'Men', 'Kids'].map((option) => <button type="button" key={option} className={audience === option ? "active" : ""} onClick={() => setAudience(option)}>{option}</button>)}
          </div>
          <div className="trending-controls">
            <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label>Up to ₹{maxPrice.toLocaleString("en-IN")}<input type="range" min="500" max="10000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label>
            <label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="discount">Highest Discount</option><option value="rating">Highest Rated</option></select></label>
          </div>
        </div>

        <div className="trending-collection-heading"><div><span>CURATED TREND EDIT</span><h2>Trending Collection</h2><p>{displayedProducts.length} styles in the current edit</p></div><strong>POPULAR RIGHT NOW</strong></div>

        {displayedProducts.length ? <div className="trending-grid">{displayedProducts.map((product) => {
          const currentPrice = Number(product.price) || 0;
          const originalPrice = Number(product.oldPrice || product.originalPrice || currentPrice) || currentPrice;
          const discount = discountPercent(product);
          const wishlisted = wishlistIds.includes(product.id);
          return <article className="trending-card" key={`${product.gender}-${product.id}`}>
            <div className="trending-card-image"><img src={resolveImage(product)} alt={product.name} /><span className="trending-badge">{product.badge || "TRENDING"}</span><button type="button" className={wishlisted ? "trending-heart active" : "trending-heart"} onClick={() => toggleWishlist(product)} aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}>{wishlisted ? "♥" : "♡"}</button><span className="trending-popular">Popular pick</span></div>
            <div className="trending-card-info"><span className="trending-category">{product.gender} · {product.type || product.category}</span><a href={`/products/${encodeURIComponent(product.id)}?catalog=${product.gender}`} className="trending-product-name">{product.name}</a><div className="trending-rating">★ {Number(product.rating || 0).toFixed(1)} {product.reviews ? `(${product.reviews})` : ""}</div><div className="trending-price"><strong>₹{currentPrice.toLocaleString("en-IN")}</strong>{originalPrice > currentPrice && <del>₹{originalPrice.toLocaleString("en-IN")}</del>}<span>{discount ? `${discount}% OFF` : "NEW PRICE"}</span></div><div className="trending-saved">{discount ? `You save ₹${(originalPrice - currentPrice).toLocaleString("en-IN")}` : "Current collection price"}</div><div className="trending-stock">{stockLabel(product)}</div><div className="trending-actions"><button type="button" onClick={() => addToCart(product)}>Add to Cart</button><button type="button" onClick={() => buyNow(product)}>Buy Now</button></div><div className="trending-tryon"><VirtualTryOn product={{ ...product, image: resolveImage(product) }} /></div></div>
          </article>;
        })}</div> : <div className="trending-empty"><h3>No styles match these filters</h3><p>Try another audience, category, or price range.</p></div>}
      </main>
      <Footer />
    </div>
  );
}

export default TrendingPage;
