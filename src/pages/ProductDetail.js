import React, { useState } from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import VirtualTryOn from "../components/VirtualTryOn";

import { products } from "../data/homeData";
import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";

/* =========================================================
   COMPLETE PRODUCT CATALOG
   ========================================================= */

const catalogProducts = [
  ...products,

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
    audience: item.gender || "Kids",
  })),
];

/* =========================================================
   PRODUCT INFORMATION
   ========================================================= */

const productInformation = {
  1: {
    description:
      "A structured black top with a clean silhouette for polished everyday styling.",
    details:
      "Soft structured fabric with a modern, comfortable fit.",
    sizes: "XS - XL",
  },

  2: {
    description:
      "A relaxed oversized shirt designed for easy layering and effortless styling.",
    details:
      "Lightweight cotton blend with a breathable finish.",
    sizes: "S - XXL",
  },

  3: {
    description:
      "A contemporary midi dress that balances an elegant shape with everyday comfort.",
    details:
      "Smooth flowing fabric with a soft, easy-care finish.",
    sizes: "XS - XL",
  },

  4: {
    description:
      "A versatile denim essential with a straight fit for everyday outfits.",
    details:
      "Durable stretch denim with a comfortable structured feel.",
    sizes: "28 - 36",
  },
};

/* =========================================================
   PRODUCT DETAIL PAGE
   ========================================================= */

function ProductDetail() {
  /* =======================================================
     GET PRODUCT ID FROM URL
     Example:
     /products/3
     productId = 3
     ======================================================= */

  const path = window.location.pathname;

  const productId = path
    .split("/")
    .filter(Boolean)
    .pop();

  /* =======================================================
     FIND PRODUCT
     ======================================================= */

  const product = catalogProducts.find(
    (item) => String(item.id) === String(productId)
  );

  /* =======================================================
     WISHLIST STATE
     ======================================================= */

  const [wishlistActive, setWishlistActive] = useState(() => {
    try {
      const saved =
        JSON.parse(localStorage.getItem("veyraaWishlist")) || [];

      return saved.some(
        (item) =>
          String(item.id ?? item.name) === String(productId)
      );
    } catch (error) {
      return false;
    }
  });

  /* =======================================================
     PRICE
     ======================================================= */

  const productPrice = Number(product?.price) || 0;

  const originalPrice =
    Number(
      product?.oldPrice ||
        product?.originalPrice ||
        productPrice
    ) || productPrice;

  /* =======================================================
     TOGGLE WISHLIST
     ======================================================= */

  const toggleWishlist = () => {
    if (!product) return;

    try {
      const saved =
        JSON.parse(localStorage.getItem("veyraaWishlist")) || [];

      const key = String(product.id ?? product.name);

      const exists = saved.some(
        (item) =>
          String(item.id ?? item.name) === key
      );

      const updated = exists
        ? saved.filter(
            (item) =>
              String(item.id ?? item.name) !== key
          )
        : [...saved, product];

      localStorage.setItem(
        "veyraaWishlist",
        JSON.stringify(updated)
      );

      setWishlistActive(!exists);

      window.dispatchEvent(
        new Event("veyraa:wishlist-updated")
      );
    } catch (error) {
      console.error("Wishlist update failed:", error);
    }
  };

  /* =======================================================
     ADD TO CART
     ======================================================= */

  const addToCart = () => {
    if (!product) return;

    try {
      const saved =
        JSON.parse(localStorage.getItem("veyraaCart")) || [];

      const key = String(product.id ?? product.name);

      const existing = saved.find(
        (item) =>
          String(item.id ?? item.name) === key
      );

      const updated = existing
        ? saved.map((item) =>
            String(item.id ?? item.name) === key
              ? {
                  ...item,
                  quantity: (item.quantity || 1) + 1,
                }
              : item
          )
        : [
            ...saved,
            {
              ...product,
              quantity: 1,
            },
          ];

      localStorage.setItem(
        "veyraaCart",
        JSON.stringify(updated)
      );

      window.dispatchEvent(
        new Event("veyraa:cart-updated")
      );
    } catch (error) {
      console.error("Cart update failed:", error);
    }
  };

  /* =======================================================
     BUY NOW
     ======================================================= */

  const buyNow = () => {
    if (!product) return;

    addToCart();

    window.location.href = "/billing";
  };

  /* =======================================================
     PRODUCT INFORMATION FALLBACK
     ======================================================= */

  const information =
    productInformation[productId] || {
      description: `${
        product?.name || "This fashion product"
      } is part of the Veyraa Fashion collection, curated for modern everyday styling.`,

      details:
        "Premium fashion piece designed for comfort, style and versatile everyday wear.",

      sizes: "XS - XL",
    };

  /* =======================================================
     PRODUCT NOT FOUND
     ======================================================= */

  if (!product) {
    return (
      <div className="product-detail-page">

        <Navbar />

        <main className="product-detail-empty">

          <h1>Product Not Found</h1>

          <p>
            We couldn't find this product in the Veyraa
            Fashion collection.
          </p>

          <a
            className="primary-button"
            href="/#trending"
          >
            Back to Trending Fashion
          </a>

        </main>

        <Footer />

      </div>
    );
  }

  /* =======================================================
     PRODUCT DETAIL UI
     ======================================================= */

  return (
    <div className="product-detail-page">

      <Navbar />

      <main className="product-detail-main">

        {/* BACK BUTTON */}

        <a
          className="product-detail-back"
          href="/#trending"
        >
          ← Back to Trending Fashion
        </a>

        <section className="product-detail-layout">

          {/* =================================================
              PRODUCT IMAGE
              ================================================= */}

          <div className="product-detail-image">

            <img
              src={product.image}
              alt={product.name}
            />

            {product.badge && (
              <span className="product-badge">
                {product.badge}
              </span>
            )}

          </div>

          {/* =================================================
              PRODUCT INFORMATION
              ================================================= */}

          <div className="product-detail-content">

            {/* CATEGORY */}

            <span className="product-category">
              {product.category}
            </span>

            {/* PRODUCT NAME */}

            <h1>
              {product.name}
            </h1>

            {/* DESCRIPTION */}

            <p className="product-detail-description">
              {information.description}
            </p>

            {/* =================================================
                PRICE
                ================================================= */}

            <div className="product-detail-price">

              <strong>
                ₹{product.price}
              </strong>

              {originalPrice > productPrice && (
                <del>
                  ₹{originalPrice}
                </del>
              )}

            </div>

            {/* =================================================
                PRODUCT DETAILS
                ================================================= */}

            <div className="product-detail-specs">

              <div>

                <span>
                  DETAILS
                </span>

                <strong>
                  {information.details}
                </strong>

              </div>

              <div>

                <span>
                  AVAILABLE SIZES
                </span>

                <strong>
                  {information.sizes}
                </strong>

              </div>

            </div>

            {/* =================================================
                ACTION BUTTONS
                ================================================= */}

            <div className="product-detail-actions">

              {/* WISHLIST */}

              <button
                type="button"
                className={
                  wishlistActive
                    ? "product-detail-wishlist active"
                    : "product-detail-wishlist"
                }
                onClick={toggleWishlist}
              >
                {wishlistActive
                  ? "♥ Wishlisted"
                  : "♡ Wishlist"}
              </button>

              {/* ADD TO CART */}

              <button
                type="button"
                className="product-detail-cart"
                onClick={addToCart}
              >
                Add to Cart
              </button>

              {/* BUY NOW */}

              <button
                type="button"
                className="product-detail-buy"
                onClick={buyNow}
              >
                Buy Now
              </button>

            </div>

            {/* =================================================
                VIRTUAL TRY-ON
                ================================================= */}

            <VirtualTryOn
              product={product}
            />

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}

export default ProductDetail;