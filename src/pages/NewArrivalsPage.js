import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VirtualTryOn from "../components/VirtualTryOn";

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


/* =========================================================
   EXISTING PRODUCT IMAGE RESOLVER
   Uses the real /public/women, /public/men and /public/kids
   files already used by the existing catalog.
   ========================================================= */

function resolveExistingProductImage(product) {
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
    raw.startsWith("/kids/")
  ) {
    return encodeURI(raw);
  }

  const folder = String(product?.gender || "")
    .toLowerCase()
    .trim();

  if (folder === "women" || folder === "men" || folder === "kids") {
    return encodeURI(`/${folder}/${raw}`);
  }

  return encodeURI(raw);
}

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


/* =========================================================
   EXISTING CATALOG IMAGE RESOLUTION
   No new products or new product URLs are created.
   ========================================================= */

const EXISTING_LOCAL_IMAGES = {
  women: [
    "/women/floral-01.jpg",
    "/women/black dress-01.jpg",
    "/women/pastel-01.jpg",
    "/women/new img-01.jpg",
    "/women/whitedress-01.jpg",
    "/women/black ribbed-01.jpg",
    "/women/pink-01.jpg",
    "/women/pinkos-01.jpg",
    "/women/blackcas-01.jpg",
    "/women/wide-01.jpg",
    "/women/blacktrouser-01.jpg",
    "/women/creamwhite-01.jpg",
    "/women/pleatedskirt.jpg",
    "/women/floraldress.jpg",
    "/women/denimskirt.jpg",
    "/women/beige.jpg",
    "/women/grey.jpg",
    "/women/pinkfit.jpg",
    "/women/night.jpg",
    "/women/floralnightwear.jpg",
    "/women/satin.jpg",
    "/women/sneaker.jpg",
    "/women/beigeheel.jpg",
    "/women/everyday.jpg",
    "/women/brownbag.jpg",
    "/women/blackhand.jpg",
    "/women/pinkhandbag.jpg",
    "/women/goldwatch.jpg",
    "/women/goldwatchh.jpg",
    "/women/blackcooler.jpg",
    "/women/browncooler.jpg",
    "/women/blackbelt.jpg",
  ],

  men: [
    "/men/tshirt.jpg",
    "/men/denim.jpg",
    "/men/graphic.jpg",
    "/men/denimshirt.jpg",
    "/men/indiankurta.jpg",
    "/men/kurtaset.jpg",
    "/men/nehru.jpg",
    "/men/shrawani.jpg",
    "/men/dhoti.jpg",
    "/men/dhotii.jpg",
    "/men/formalshirt.jpg",
    "/men/trousers.jpg",
    "/men/blazer.jpg",
    "/men/suit.jpg",
    "/men/cashirt.jpg",
    "/men/chino pant.jpg",
    "/men/polo1.jpg",
    "/men/jean1.jpg",
    "/men/sports1.jpg",
    "/men/jogger1.jpg",
    "/men/sports2.jpg",
    "/men/nightsuit1.jpg",
    "/men/lounge1.jpg",
    "/men/sleepwear1.jpg",
  ],

  kids: [
    "/kids/bhangraboy.jpg",
    "/kids/casualboy.jpg",
    "/kids/casualwearboy.jpg",
    "/kids/dhoti.jpg",
    "/kids/dhotiboy.jpg",
    "/kids/frock1.jpg",
    "/kids/frock2.jpg",
    "/kids/frock3.jpg",
    "/kids/frock4.jpg",
    "/kids/frock5.jpg",
    "/kids/frock7.jpg",
    "/kids/greenshirt.jpg",
    "/kids/jeantype.jpg",
    "/kids/jumpsuit.jpg",
    "/kids/kurtaboy.jpg",
    "/kids/ni8wear.jpg",
    "/kids/ni8wearboy.jpg",
    "/kids/paattu.jpg",
    "/kids/pinkfrock1.jpg",
    "/kids/pinkpeplumgirl.jpg",
    "/kids/purplegirl.jpg",
    "/kids/purplegirlfrock.jpg",
    "/kids/royalboy.jpg",
    "/kids/shirt.jpg",
    "/kids/suitboy.jpg",
    "/kids/tshirtboy.jpg",
    "/kids/yellowboy.jpg",
    "/kids/yellowgirl.jpg",
  ],
};

function imageCandidates(product) {
  const raw = String(product?.image || "").trim();
  const gender = String(product?.gender || "").toLowerCase().trim();
  const name = String(product?.name || "").toLowerCase();
  const category = String(
    product?.type || product?.category || ""
  ).toLowerCase();

  const candidates = [];

  if (raw) {
    if (
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("data:") ||
      raw.startsWith("blob:")
    ) {
      candidates.push(raw);
    } else if (
      raw.startsWith("/women/") ||
      raw.startsWith("/men/") ||
      raw.startsWith("/kids/")
    ) {
      candidates.push(encodeURI(raw));
    } else if (gender === "women" || gender === "men" || gender === "kids") {
      candidates.push(
        encodeURI(`/${gender}/${raw}`)
      );
    } else {
      candidates.push(encodeURI(raw));
    }
  }

  if (gender === "women") {
    const keywordMap = [
      ["black ribbed", "/women/black ribbed-01.jpg"],
      ["fitness", "/women/pinkfit.jpg"],
      ["sleepwear", "/women/floralnightwear.jpg"],
      ["nightwear", "/women/night.jpg"],
      ["skirt", "/women/pleatedskirt.jpg"],
      ["jean", "/women/denimskirt.jpg"],
      ["trouser", "/women/blacktrouser-01.jpg"],
      ["handbag", "/women/pinkhandbag.jpg"],
      ["bag", "/women/pinkhandbag.jpg"],
      ["watch", "/women/goldwatch.jpg"],
      ["sunglass", "/women/blackcooler.jpg"],
      ["belt", "/women/blackbelt.jpg"],
      ["frock", "/women/floral-01.jpg"],
      ["dress", "/women/floraldress.jpg"],
      ["top", "/women/black ribbed-01.jpg"],
      ["salwar", "/women/pastel-01.jpg"],
      ["saree", "/women/satin.jpg"],
      ["kurti", "/women/floral-01.jpg"],
      ["chudidar", "/women/creamwhite-01.jpg"],
      ["lehenga", "/women/pink-01.jpg"],
      ["jacket", "/women/beige.jpg"],
    ];

    keywordMap.forEach(([keyword, path]) => {
      if (
        name.includes(keyword) ||
        category.includes(keyword)
      ) {
        candidates.push(path);
      }
    });
  }

  if (gender === "men") {
    const keywordMap = [
      ["formal", "/men/formalshirt.jpg"],
      ["shirt", "/men/shirt.jpg"],
      ["t-shirt", "/men/tshirt.jpg"],
      ["tshirt", "/men/tshirt.jpg"],
      ["jacket", "/men/denim.jpg"],
      ["kurta", "/men/indiankurta.jpg"],
      ["nehru", "/men/nehru.jpg"],
      ["sherwani", "/men/shrawani.jpg"],
      ["dhoti", "/men/dhoti.jpg"],
      ["blazer", "/men/blazer.jpg"],
      ["suit", "/men/suit.jpg"],
      ["trouser", "/men/trousers.jpg"],
      ["chino", "/men/chino pant.jpg"],
      ["jean", "/men/jean1.jpg"],
      ["sport", "/men/sports1.jpg"],
      ["jogger", "/men/jogger1.jpg"],
      ["night", "/men/nightsuit1.jpg"],
      ["sleep", "/men/sleepwear1.jpg"],
    ];

    keywordMap.forEach(([keyword, path]) => {
      if (
        name.includes(keyword) ||
        category.includes(keyword)
      ) {
        candidates.push(path);
      }
    });
  }

  if (gender === "kids") {
    const keywordMap = [
      ["frock", "/kids/frock2.jpg"],
      ["dress", "/kids/frock3.jpg"],
      ["girl", "/kids/frock2.jpg"],
      ["party", "/kids/frock4.jpg"],
      ["pink", "/kids/pinkfrock1.jpg"],
      ["purple", "/kids/purplegirl.jpg"],
      ["lehenga", "/kids/purplegirlfrock.jpg"],
      ["kurta", "/kids/kurtaboy.jpg"],
      ["dhoti", "/kids/dhotiboy.jpg"],
      ["suit", "/kids/suitboy.jpg"],
      ["shirt", "/kids/shirt.jpg"],
      ["t-shirt", "/kids/tshirtboy.jpg"],
      ["tshirt", "/kids/tshirtboy.jpg"],
      ["jean", "/kids/jeantype.jpg"],
      ["jumpsuit", "/kids/jumpsuit.jpg"],
      ["night", "/kids/ni8wear.jpg"],
      ["boy", "/kids/casualboy.jpg"],
    ];

    keywordMap.forEach(([keyword, path]) => {
      if (
        name.includes(keyword) ||
        category.includes(keyword)
      ) {
        candidates.push(path);
      }
    });
  }

  const folderImages =
    EXISTING_LOCAL_IMAGES[gender] || [];

  candidates.push(...folderImages);

  return [...new Set(candidates)];
}

function discountPercent(price, oldPrice) {
  const current = Number(price);
  const original = Number(oldPrice);

  if (!current || !original || original <= current) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
}

function getStockLeft(product) {
  return product?.stock ?? product?.stockQuantity ?? null;
}

function resolveProductPreviewImage(product) {
  const candidates = imageCandidates(product);
  return candidates[0] || String(product?.image || "").trim() || "";
}

function NewArrivalsPage() {
  const [gender, setGender] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minimumDiscount, setMinimumDiscount] = useState("all");
  const [category, setCategory] = useState("All");
  const [wishlistIds, setWishlistIds] = useState(() => readWishlistIds());

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

    if (category !== "All") {
      result = result.filter((product) => (product.type || product.category || "") === category);
    }

    if (minimumDiscount !== "all") {
      result = result.filter((product) => discountPercent(product.price, product.oldPrice) >= Number(minimumDiscount));
    }

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
  }, [category, gender, maxPrice, minimumDiscount, sort]);

  const categories = useMemo(() => [
    "All",
    ...new Set(newArrivalProducts.map((product) => product.type || product.category).filter(Boolean)),
  ], []);

  /* =======================================================
     CART
     ======================================================= */

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

    window.dispatchEvent(new Event("veyraa:cart-updated"));
  };

  /* =======================================================
     BUY NOW
     ======================================================= */

  const buyNow = (product) => {
    const savedCart =
      JSON.parse(localStorage.getItem("veyraaCart")) || [];

    const existing = savedCart.find(
      (item) => item.id === product.id
    );

    const updatedCart = existing
      ? savedCart
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

    window.location.href = "/billing";
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

    setWishlistIds(readWishlistIds());
  };

  return (
    <div className="new-arrivals-page">
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="new-arrivals-hero">
        <div className="new-arrivals-hero-content">
          <span className="new-arrivals-eyebrow">NEW ARRIVALS</span>

          <h1>
            Fresh Styles.
            <em> Real You.</em>
          </h1>

          <p>
            Curated seasonal edits and new favourites from the Veyraa fashion world — polished,
            expressive, and made to move with you.
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
              Shop New Arrivals
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

        {/* FILTER BAR */}

        <div className="new-arrivals-toolbar">

          <div className="gender-filters">

            <button
              className={gender === "All" ? "active" : ""}
              onClick={() => setGender("All")}
            >
              All
            </button>

            <button
              className={gender === "Women" ? "active" : ""}
              onClick={() => setGender("Women")}
            >
              Women
            </button>

            <button
              className={gender === "Men" ? "active" : ""}
              onClick={() => setGender("Men")}
            >
              Men
            </button>

            <button
              className={gender === "Kids" ? "active" : ""}
              onClick={() => setGender("Kids")}
            >
              Kids
            </button>

          </div>

          <div className="new-arrivals-controls">

            <div className="price-control">

              <label>
                Up to ₹{maxPrice}
              </label>

              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value))
                }
              />

            </div>

            <div className="category-control">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>

            <div className="discount-control">
              <label>Discount</label>
              <select value={minimumDiscount} onChange={(e) => setMinimumDiscount(e.target.value)}>
                <option value="all">Any</option>
                <option value="10">10%+</option>
                <option value="20">20%+</option>
                <option value="30">30%+</option>
              </select>
            </div>

            <div className="sort-control">

              <label>Sort by</label>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
              >
                <option value="featured">
                  Featured
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>

                <option value="discount">
                  Biggest Discount
                </option>

                <option value="rating">
                  Highest Rated
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* COLLECTION HEADER */}

        <div className="new-arrivals-section-head">

          <div>

            <span>
              VEYRAA NEW ARRIVALS
            </span>

            <h2>
              {gender === "All"
                ? "Latest Styles"
                : `${gender}'s New Arrivals`}
            </h2>

            <p>
              {displayedProducts.length} products
            </p>

          </div>

          <div className="discount-note">
            ✦ Exclusive launch pricing
          </div>

        </div>

        {/* PRODUCT GRID */}

        <div className="new-arrivals-grid">

          {displayedProducts.map((product) => {

            const discount = discountPercent(
              product.price,
              product.oldPrice
            );
            const stockLeft = getStockLeft(product);
            const isWishlisted = wishlistIds.includes(product.id);

            return (
              <article
                className="new-arrival-card"
                key={`${product.gender}-${product.id}`}
              >

                <div className="new-arrival-image">

                  <img
                    src={imageCandidates(product)[0] || ""}
                    alt={product.name}
                    data-image-index="0"
                    onError={(e) => {
                      const candidates =
                        imageCandidates(product);

                      const nextIndex =
                        Number(
                          e.currentTarget.dataset.imageIndex || "0"
                        ) + 1;

                      if (
                        nextIndex < candidates.length
                      ) {
                        e.currentTarget.dataset.imageIndex =
                          String(nextIndex);

                        e.currentTarget.src =
                          candidates[nextIndex];
                      }
                    }}
                  />

                  <span className="new-badge">
                    NEW
                  </span>

                  {discount > 0 && (
                    <span className="discount-badge">
                      {discount}% OFF
                    </span>
                  )}

                  <button
                    type="button"
                    className={`arrival-heart ${isWishlisted ? "active" : ""}`}
                    onClick={() =>
                      toggleWishlist(product)
                    }
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={isWishlisted}
                  >
                    {isWishlisted ? "♥" : "♡"}
                  </button>

                </div>

                <div className="new-arrival-info">

                  <span className="arrival-category">
                    {product.gender}
                    {" • "}
                    {product.type || product.category}
                  </span>

                  <a className="arrival-product-name" href={`/products/${encodeURIComponent(product.id)}?catalog=${product.gender}`}>
                    {product.name}
                  </a>

                  <div className="arrival-rating">
                    ★ {Number(product.rating || 0).toFixed(1)} {product.reviews ? `(${product.reviews})` : ""}
                  </div>

                  <div className="arrival-price">

                    <strong>
                      ₹
                      {Number(product.price).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    {product.oldPrice && (
                      <del>
                        ₹
                        {Number(product.oldPrice).toLocaleString(
                          "en-IN"
                        )}
                      </del>
                    )}

                  </div>

                  <div className="arrival-saved">
                    {discount > 0
                      ? `You save ₹${(
                          Number(product.oldPrice) -
                          Number(product.price)
                        ).toLocaleString("en-IN")}`
                      : "New collection price"}
                  </div>

                  <div className="arrival-discount-line">
                    {discount > 0 ? `${discount}% OFF` : "New collection price"}
                  </div>

                  <div className="arrival-stock">
                    {stockLeft ? (stockLeft <= 6 ? `Only ${stockLeft} left` : `${stockLeft} items left`) : "In Stock"}
                  </div>

                  <div className="arrival-actions">

                    <button
                      type="button"
                      className="arrival-cart"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      type="button"
                      className="arrival-buy"
                      onClick={() =>
                        buyNow(product)
                      }
                    >
                      Buy Now
                    </button>

                  </div>

                  <div className="arrival-tryon-wrap">
                    <VirtualTryOn
                      product={{
                        ...product,
                        image: resolveProductPreviewImage(product),
                      }}
                    />
                  </div>

                </div>

              </article>
            );
          })}

        </div>

        {displayedProducts.length === 0 && (
          <div className="new-arrivals-empty">
            <h3>No new arrivals in this filter</h3>
            <p>
              Increase the price range or switch the category
              to view more existing Veyraa new arrivals.
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default NewArrivalsPage;
