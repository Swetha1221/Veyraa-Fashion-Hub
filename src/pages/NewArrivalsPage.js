import React, { useMemo, useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";

import "./NewArrivalsPage.css";

/* =========================================================
   EXISTING PRODUCTS ONLY
   No new product records are created here.
   ========================================================= */

const existingProducts = [
  ...womenProducts.map((product) => ({
    ...product,
    gender: "Women",
  })),
  ...menProducts.map((product) => ({
    ...product,
    gender: "Men",
  })),
  ...kidsProducts.map((product) => ({
    ...product,
    gender: "Kids",
  })),
];

/* =========================================================
   NEW ARRIVALS
   Uses only existing catalog products already marked NEW.
   All existing products already contain oldPrice values.
   ========================================================= */

const newArrivalProducts = existingProducts.filter((product) => {
  const badge = String(product.badge || "").toLowerCase().trim();

  return (
    badge === "new" ||
    badge === "just in" ||
    badge === "new arrival" ||
    badge === "new arrivals"
  );
});

function discountPercent(price, oldPrice) {
  const current = Number(price);
  const original = Number(oldPrice);

  if (!current || !original || original <= current) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
}


function resolveCatalogImage(product) {
  const raw = String(product?.image || "").trim();
  if (!raw) return "";

  const lower = raw.toLowerCase();
  if (lower.indexOf("http://") === 0 ||
      lower.indexOf("https://") === 0 ||
      lower.indexOf("data:") === 0 ||
      lower.indexOf("blob:") === 0) {
    return raw;
  }

  const normalized = raw.replace(/^\/+/, "");
  const firstPart = normalized.split("/")[0].toLowerCase();
  if (firstPart === "women" || firstPart === "men" || firstPart === "kids") {
    return encodeURI("/" + normalized);
  }

  const gender = String(product?.gender || "Women").toLowerCase();
  return encodeURI("/" + gender + "/" + normalized);
}

function fallbackImageFor(product) {
  const gender = String(product?.gender || "Women").toLowerCase();
  if (gender === "men") return "/men/formalshirt.jpg";
  if (gender === "kids") return "/kids/kids-01.jpg";
  return "/women/saree-01.jpg";
}

function NewArrivalsPage() {
  const [gender, setGender] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(10000);

  /* =======================================================
     VIRTUAL TRY-ON
     ======================================================= */

  const [tryOnProduct, setTryOnProduct] = useState(null);
  const [tryOnImage, setTryOnImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const openTryOn = (product) => {
    setTryOnProduct(product);
    setTryOnImage(null);
    setCameraOpen(false);
  };

  const closeTryOn = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    streamRef.current = null;
    setCameraOpen(false);
    setTryOnImage(null);
    setTryOnProduct(null);
  };

  const startCamera = async () => {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert("Camera is not supported. Please upload your photo.");
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (error) {
      alert(
        "Camera permission was not available. Please use Upload Your Photo."
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      alert("Camera is still loading. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setTryOnImage(canvas.toDataURL("image/png"));

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    streamRef.current = null;
    setCameraOpen(false);
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setTryOnImage(reader.result);
      setCameraOpen(false);
    };

    reader.readAsDataURL(file);
  };

  /* =======================================================
     FILTER + SORT
     ======================================================= */

  const displayedProducts = useMemo(() => {
    let result = [...newArrivalProducts];

    if (gender !== "All") {
      result = result.filter(
        (product) => product.gender === gender
      );
    }

    result = result.filter(
      (product) => Number(product.price) <= maxPrice
    );

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "discount") {
      result.sort(
        (a, b) =>
          discountPercent(b.price, b.oldPrice) -
          discountPercent(a.price, a.oldPrice)
      );
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [gender, maxPrice, sort]);

  /* =======================================================
     CART
     ======================================================= */


  const openProduct = (product) => {
    if (product?.id === undefined) return;
    const catalog = product.gender || "Women";
    window.location.href = `/products/${encodeURIComponent(product.id)}?catalog=${encodeURIComponent(catalog)}&source=new-arrivals`;
  };

  const addToCart = (product) => {
    const savedCart =
      JSON.parse(localStorage.getItem("veyraaCart")) || [];

    const existing = savedCart.find(
      (item) => item.id === product.id
    );

    const updatedCart = existing
      ? savedCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item
        )
      : [
          ...savedCart,
          {
            ...product,
            quantity: 1,
          },
        ];

    localStorage.setItem(
      "veyraaCart",
      JSON.stringify(updatedCart)
    );

    alert(`${product.name} added to cart`);
  };

  /* =======================================================
     WISHLIST
     ======================================================= */

  const toggleWishlist = (product) => {
    const savedWishlist =
      JSON.parse(
        localStorage.getItem("veyraaWishlist")
      ) || [];

    const exists = savedWishlist.some(
      (item) => item.id === product.id
    );

    const updatedWishlist = exists
      ? savedWishlist.filter(
          (item) => item.id !== product.id
        )
      : [...savedWishlist, product];

    localStorage.setItem(
      "veyraaWishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  return (
    <div className="new-arrivals-page">
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="new-arrivals-hero">

        <div className="new-arrivals-hero-content">

          <span className="new-arrivals-eyebrow">
            VEYRAA • JUST LANDED
          </span>

          <h1>
            New Arrivals
            <br />
            <em>Fresh. Current. Veyraa.</em>
          </h1>

          <p>
            Discover the newest existing styles across
            Women, Men and Kids — all curated from the
            Veyraa catalog.
          </p>

          <div className="hero-actions">

            <button
              type="button"
              className="hero-primary-btn"
              onClick={() =>
                document
                  .getElementById("new-arrivals-collection")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Shop New Arrivals →
            </button>

            <span className="hero-count">
              <strong>{newArrivalProducts.length}</strong>
              <small>NEW STYLES</small>
            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          COLLECTION INTRO
      ===================================================== */}

      <section className="new-arrivals-intro">

        <span>THE LATEST EDIT</span>

        <h2>
          Fresh From the Veyraa Collection
        </h2>

        <p>
          Explore newly added products already available
          across our Women, Men and Kids sections.
        </p>

      </section>

      {/* =====================================================
          COLLECTION
      ===================================================== */}

      <main
        className="new-arrivals-collection"
        id="new-arrivals-collection"
      >

        {/* WOMEN-STYLE COLLECTION LAYOUT */}
        <div className="new-shop-layout">

          <aside className="new-filters">
            <div className="new-filter-title">
              <h2>FILTERS</h2>
              <button
                type="button"
                onClick={() => {
                  setGender("All");
                  setMaxPrice(10000);
                  setSort("featured");
                }}
              >
                Clear
              </button>
            </div>

            <div className="new-filter-block">
              <h3>Price</h3>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="new-price-range">
                <span>₹500</span>
                <strong>₹{Number(maxPrice).toLocaleString("en-IN")}</strong>
              </div>
            </div>

            <div className="new-filter-block">
              <h3>Collection</h3>
              {["All", "Women", "Men", "Kids"].map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="new-arrivals-audience"
                    checked={gender === option}
                    onChange={() => setGender(option)}
                  />
                  {option}
                </label>
              ))}
            </div>

            <div className="new-filter-block">
              <h3>Fashion Discovery</h3>
              {["All", "Women", "Men", "Kids"].map((option) => (
                <button
                  type="button"
                  className={`new-filter-link ${gender === option ? "active" : ""}`}
                  key={option}
                  onClick={() => setGender(option)}
                >
                  {option === "All" ? "New Arrivals" : `${option}'s New Arrivals`}
                </button>
              ))}
            </div>
          </aside>

          <section className="new-products-area">
            <div className="new-products-toolbar">
              <div>
                <span>VEYRAA NEW ARRIVALS</span>
                <h2>
                  {gender === "All" ? "Latest Styles" : `${gender}'s New Arrivals`}
                </h2>
                <p><strong>{displayedProducts.length}</strong> products</p>
              </div>

              <div className="new-sort-control">
                <span>Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="discount">Biggest Discount</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="new-arrivals-grid">
              {displayedProducts.length === 0 ? (
                <div className="new-products-empty">
                  <h2>No products found</h2>
                  <p>Try another audience or increase the price range.</p>
                </div>
              ) : (
                displayedProducts.map((product) => {
                  const image = resolveCatalogImage(product);

                  return (
                    <article
                      className="new-arrival-card"
                      key={`${product.gender}-${product.id}`}
                    >
                      <div
                        className="new-arrival-image"
                        role="button"
                        tabIndex={0}
                        onClick={() => openProduct(product)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") openProduct(product);
                        }}
                      >
                        <img
                          src={image}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                              e.currentTarget.dataset.fallback = "1";
                              e.currentTarget.src = fallbackImageFor(product);
                            }
                          }}
                        />

                        <span className="new-badge">
                          {product.badge || "NEW"}
                        </span>

                        <button
                          type="button"
                          className="arrival-heart"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          aria-label="Add to wishlist"
                        >
                          ♡
                        </button>

                        <button
                          type="button"
                          className="new-try-on-button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openTryOn(product);
                          }}
                        >
                          ✦ Virtual Try-On
                        </button>
                      </div>

                      <div className="new-arrival-info">
                        <div className="arrival-rating">
                          ★ {Number(product.rating || 4.5).toFixed(1)}
                        </div>

                        <span className="arrival-category">
                          {String(product.gender || "Women").toUpperCase()} ·{" "}
                          {String(product.type || product.category || "Fashion").toUpperCase()}
                        </span>

                        <h3
                          onClick={() => openProduct(product)}
                          style={{ cursor: "pointer" }}
                        >
                          {product.name}
                        </h3>

                        <p className="arrival-material">
                          {product.material || "Premium fabric"} · {product.colour || product.color || "Classic"}
                        </p>

                        <div className="arrival-price">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                          {product.oldPrice && (
                            <del>
                              ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                            </del>
                          )}
                        </div>

                        <div className="arrival-actions">
                          <button
                            type="button"
                            className="arrival-cart"
                            onClick={() => addToCart(product)}
                          >
                            🛒 Add to Cart
                          </button>

                          <button
                            type="button"
                            className="arrival-buy"
                            onClick={() => {
                              const savedCart =
                                JSON.parse(localStorage.getItem("veyraaCart")) || [];
                              const existing = savedCart.find((item) => item.id === product.id);

                              if (!existing) {
                                localStorage.setItem(
                                  "veyraaCart",
                                  JSON.stringify([...savedCart, { ...product, quantity: 1 }])
                                );
                              }

                              window.location.href = "/billing";
                            }}
                          >
                            Buy Now
                          </button>
                        </div>

                        <button
                          type="button"
                          className="new-view-product"
                          onClick={() => openProduct(product)}
                        >
                          View Product →
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>

      </main>

            {/* =====================================================
          VIRTUAL TRY-ON MODAL
      ===================================================== */}

      {tryOnProduct && (
        <div
          className="arrival-tryon-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeTryOn();
            }
          }}
        >

          <div className="arrival-tryon-modal">

            <button
              type="button"
              className="arrival-tryon-close"
              onClick={closeTryOn}
              aria-label="Close Virtual Try-On"
            >
              ×
            </button>

            <div className="arrival-tryon-heading">

              <span>
                VEYRAA SMART FIT
              </span>

              <h2>
                Virtual Try-On
              </h2>

              <p>
                Preview{" "}
                <strong>
                  {tryOnProduct.name}
                </strong>
                {" "}with your photo.
              </p>

            </div>

            {!tryOnImage && !cameraOpen && (
              <div className="arrival-tryon-start">

                <div className="arrival-tryon-product">

                  <img
                    src={tryOnProduct.image}
                    alt={tryOnProduct.name}
                  />

                  <span>
                    Selected New Arrival
                  </span>

                </div>

                <div className="arrival-tryon-options">

                  <button
                    type="button"
                    onClick={startCamera}
                  >
                    📷 Use Camera
                  </button>

                  <label>
                    🖼 Upload Your Photo

                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadPhoto}
                    />
                  </label>

                </div>

                <p className="arrival-tryon-note">
                  Use your camera or upload a photo to preview
                  the selected Veyraa style.
                </p>

              </div>
            )}

            {cameraOpen && (
              <div className="arrival-camera">

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                />

                <div className="arrival-camera-actions">

                  <button
                    type="button"
                    onClick={capturePhoto}
                  >
                    ● Capture Photo
                  </button>

                  <button
                    type="button"
                    onClick={closeTryOn}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

            {tryOnImage && !cameraOpen && (
              <div className="arrival-tryon-result">

                <div className="arrival-preview">

                  <img
                    src={tryOnImage}
                    alt="Customer preview"
                  />

                </div>

                <div className="arrival-result-info">

                  <span>
                    {tryOnProduct.gender}
                  </span>

                  <h3>
                    {tryOnProduct.name}
                  </h3>

                  <p>
                    Selected new arrival:
                    ₹{Number(
                      tryOnProduct.price
                    ).toLocaleString("en-IN")}
                  </p>

                  <div className="arrival-result-buttons">

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(tryOnProduct);
                        closeTryOn();
                      }}
                    >
                      🛒 Add This Look
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTryOnImage(null)
                      }
                    >
                      ← Change Photo
                    </button>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

      <Footer />
    </div>
  );
}

export default NewArrivalsPage;
