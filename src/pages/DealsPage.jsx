import React, { useMemo, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./DealsPage.css";

import {
  getUnifiedCatalog,
  resolveCatalogImage,
  addToCart,
  toggleWishlist,
} from "../data/unifiedCatalog";

/* =========================================================
   CATEGORY DATA
   ========================================================= */

const ALLOWED_CATEGORIES = [
  "Sarees",
  "Kurtis",
  "Chudidars",
  "Lehengas",
  "Dresses",
  "Tops",
  "Shirts",
  "T-Shirts",
  "Trousers",
  "Jeans",
  "Bags",
  "Jewellery",
  "Footwear",
  "Accessories",
];

const PRICE_RANGES = [
  {
    id: "all",
    label: "All Prices",
  },
  {
    id: "under-500",
    label: "Under ₹500",
    min: 0,
    max: 499,
  },
  {
    id: "500-1000",
    label: "₹500 – ₹1,000",
    min: 500,
    max: 1000,
  },
  {
    id: "1000-2000",
    label: "₹1,000 – ₹2,000",
    min: 1000,
    max: 2000,
  },
  {
    id: "2000-5000",
    label: "₹2,000 – ₹5,000",
    min: 2000,
    max: 5000,
  },
  {
    id: "above-5000",
    label: "Above ₹5,000",
    min: 5001,
    max: Infinity,
  },
];

const DISCOUNT_OPTIONS = [
  {
    id: "all",
    label: "All Discounts",
    value: 0,
  },
  {
    id: "10",
    label: "10%+",
    value: 10,
  },
  {
    id: "20",
    label: "20%+",
    value: 20,
  },
  {
    id: "30",
    label: "30%+",
    value: 30,
  },
  {
    id: "40",
    label: "40%+",
    value: 40,
  },
  {
    id: "50",
    label: "50%+",
    value: 50,
  },
  {
    id: "60",
    label: "60%+",
    value: 60,
  },
];

const SORT_OPTIONS = [
  {
    id: "recommended",
    label: "Recommended",
  },
  {
    id: "newest",
    label: "Newest",
  },
  {
    id: "price-asc",
    label: "Price: Low to High",
  },
  {
    id: "price-desc",
    label: "Price: High to Low",
  },
  {
    id: "discount-desc",
    label: "Discount: High to Low",
  },
];

/* =========================================================
   UNIVERSAL DEALS IMAGE RESOLVER
   ========================================================= */

function getImageFolder(product) {
  const audience = String(
    product?.audience ||
    product?.gender ||
    product?.targetAudience ||
    ""
  )
    .trim()
    .toLowerCase();

  if (
    audience === "women" ||
    audience === "woman" ||
    audience === "female"
  ) {
    return "women";
  }

  if (
    audience === "men" ||
    audience === "man" ||
    audience === "male"
  ) {
    return "men";
  }

  if (
    audience === "kids" ||
    audience === "kid" ||
    audience === "boys" ||
    audience === "girls"
  ) {
    return "kids";
  }

  /* Infer folder when audience is missing */

  const text = [
    product?.name,
    product?.category,
    product?.categoryGroup,
    product?.type,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /women|woman|ladies|kurti|saree|lehenga|chudidar|handbag|heels|skirt|frock|jewellery/i.test(
      text
    )
  ) {
    return "women";
  }

  if (
    /men|man|mens|shirt|trouser|jeans|kurta|blazer|sherwani|dhoti/i.test(
      text
    )
  ) {
    return "men";
  }

  if (
    /kids|kid|boy|girl|child|children/i.test(
      text
    )
  ) {
    return "kids";
  }

  return "";
}

/* =========================================================
   GET ALL POSSIBLE IMAGE PATHS
   ========================================================= */

function getImageCandidates(product) {
  const raw = String(
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    ""
  ).trim();

  if (!raw) {
    return [];
  }

  const candidates = [];

  /* External images */

  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return [raw];
  }

  /* Already correct folder */

  if (
    raw.startsWith("/women/") ||
    raw.startsWith("/men/") ||
    raw.startsWith("/kids/")
  ) {
    return [encodeURI(raw)];
  }

  const cleanName = raw.replace(/^\/+/, "");

  const folder = getImageFolder(product);

  /*
   * Primary correct path
   */

  if (folder) {
    candidates.push(
      encodeURI(`/${folder}/${cleanName}`)
    );
  }

  /*
   * Also try all catalog folders.
   * This makes Deals resilient even when
   * an individual product has missing audience data.
   */

  candidates.push(
    encodeURI(`/women/${cleanName}`)
  );

  candidates.push(
    encodeURI(`/men/${cleanName}`)
  );

  candidates.push(
    encodeURI(`/kids/${cleanName}`)
  );

  /*
   * Last fallback
   */

  candidates.push(
    encodeURI(`/${cleanName}`)
  );

  return [...new Set(candidates)];
}

/* =========================================================
   DEALS IMAGE
   ========================================================= */

function resolveDealsImage(product) {
  const candidates = getImageCandidates(product);

  return candidates[0] || "";
}

/* =========================================================
   IMAGE WITH AUTOMATIC FALLBACK
   ========================================================= */

function DealProductImage({
  product,
  className = "",
}) {
  const candidates = useMemo(
    () => getImageCandidates(product),
    [product]
  );

  const [imageIndex, setImageIndex] =
    useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [product?.id]);

  const image =
    candidates[imageIndex] || "";

  const handleImageError = (event) => {
    if (
      imageIndex <
      candidates.length - 1
    ) {
      setImageIndex(
        (current) => current + 1
      );
      return;
    }

    /*
     * Do not display browser broken-image icon.
     */

    event.currentTarget.style.opacity =
      "0";
  };

  return (
    <img
      className={className}
      src={image}
      alt={product?.name || "Fashion product"}
      loading="lazy"
      onError={handleImageError}
    />
  );
}

/* =========================================================
   DEALS PAGE
   ========================================================= */

function DealsPage() {
  const allProducts = useMemo(
    () => getUnifiedCatalog(),
    []
  );

  /* =======================================================
     FILTER STATES
     ======================================================= */

  const [
    selectedAudience,
    setSelectedAudience,
  ] = useState("All");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    selectedPriceRange,
    setSelectedPriceRange,
  ] = useState("all");

  const [
    selectedDiscount,
    setSelectedDiscount,
  ] = useState("all");

  const [
    selectedAvailability,
    setSelectedAvailability,
  ] = useState("all");

  const [
    selectedSort,
    setSelectedSort,
  ] = useState("recommended");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  /* =======================================================
     UI STATES
     ======================================================= */

  const [
    mobileDrawerOpen,
    setMobileDrawerOpen,
  ] = useState(false);

  const [
    wishlistMap,
    setWishlistMap,
  ] = useState({});

  const [
    toastMessage,
    setToastMessage,
  ] = useState("");

  /* =======================================================
     WISHLIST SYNC
     ======================================================= */

  const syncWishlist = () => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "veyraaWishlist"
          )
        ) || [];

      const map = {};

      saved.forEach((item) => {
        map[String(item.id)] = true;
      });

      setWishlistMap(map);
    } catch (error) {
      setWishlistMap({});
    }
  };

  useEffect(() => {
    syncWishlist();

    window.addEventListener(
      "storage",
      syncWishlist
    );

    window.addEventListener(
      "veyraa:wishlist-updated",
      syncWishlist
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncWishlist
      );

      window.removeEventListener(
        "veyraa:wishlist-updated",
        syncWishlist
      );
    };
  }, []);

  /* =======================================================
     AVAILABLE CATEGORIES
     ======================================================= */

  const availableCategories = useMemo(() => {
    const audienceProducts =
      selectedAudience === "All"
        ? allProducts
        : allProducts.filter(
          (product) =>
            product.audience ===
            selectedAudience ||
            (selectedAudience === "Kids" &&
              [
                "Boys",
                "Girls",
                "Kids",
              ].includes(product.gender))
        );

    const counts = {};

    audienceProducts.forEach(
      (product) => {
        if (product.categoryGroup) {
          counts[
            product.categoryGroup
          ] =
            (counts[
              product.categoryGroup
            ] || 0) + 1;
        }
      }
    );

    return ALLOWED_CATEGORIES.filter(
      (category) =>
        (counts[category] || 0) > 0
    );
  }, [
    allProducts,
    selectedAudience,
  ]);

  /* =======================================================
     RESET INVALID CATEGORY
     ======================================================= */

  useEffect(() => {
    if (
      selectedCategory !== "All" &&
      !availableCategories.includes(
        selectedCategory
      )
    ) {
      setSelectedCategory("All");
    }
  }, [
    selectedCategory,
    availableCategories,
  ]);

  /* =======================================================
     FILTER PRODUCTS
     ======================================================= */

  const filteredProducts = useMemo(() => {
    return allProducts.filter(
      (product) => {

        /* Audience */

        if (
          selectedAudience !== "All"
        ) {
          const matchesAudience =
            product.audience ===
            selectedAudience ||
            (selectedAudience ===
              "Kids" &&
              [
                "Boys",
                "Girls",
                "Kids",
              ].includes(
                product.gender
              ));

          if (!matchesAudience) {
            return false;
          }
        }

        /* Category */

        if (
          selectedCategory !== "All" &&
          product.categoryGroup !==
          selectedCategory
        ) {
          return false;
        }

        /* Price */

        if (
          selectedPriceRange !==
          "all"
        ) {
          const range =
            PRICE_RANGES.find(
              (item) =>
                item.id ===
                selectedPriceRange
            );

          if (range) {
            if (
              product.price <
              range.min ||
              product.price >
              range.max
            ) {
              return false;
            }
          }
        }

        /* Discount */

        if (
          selectedDiscount !==
          "all"
        ) {
          const minDiscount =
            Number(
              selectedDiscount
            );

          if (
            product.discountPercent <
            minDiscount
          ) {
            return false;
          }
        }

        /* Availability */

        if (
          selectedAvailability ===
          "in-stock"
        ) {
          if (
            product.isOutOfStock
          ) {
            return false;
          }
        }

        if (
          selectedAvailability ===
          "out-of-stock"
        ) {
          if (
            !product.isOutOfStock
          ) {
            return false;
          }
        }

        /* Search */

        if (
          searchQuery.trim()
        ) {
          const query =
            searchQuery
              .toLowerCase()
              .trim();

          const text = `
            ${product.name}
            ${product.categoryGroup}
            ${product.audience}
            ${product.type || ""}
          `.toLowerCase();

          if (
            !text.includes(query)
          ) {
            return false;
          }
        }

        return true;
      }
    );
  }, [
    allProducts,
    selectedAudience,
    selectedCategory,
    selectedPriceRange,
    selectedDiscount,
    selectedAvailability,
    searchQuery,
  ]);

  /* =======================================================
     SORT
     ======================================================= */

  const displayedProducts =
    useMemo(() => {
      const list = [
        ...filteredProducts,
      ];

      switch (selectedSort) {
        case "price-asc":
          list.sort(
            (a, b) =>
              a.price - b.price
          );
          break;

        case "price-desc":
          list.sort(
            (a, b) =>
              b.price - a.price
          );
          break;

        case "discount-desc":
          list.sort(
            (a, b) =>
              (b.discountPercent ||
                0) -
              (a.discountPercent ||
                0)
          );
          break;

        case "newest":
          list.sort((a, b) => {
            const aNew =
              /new/i.test(
                a.badge || ""
              );

            const bNew =
              /new/i.test(
                b.badge || ""
              );

            return bNew - aNew;
          });
          break;

        default:
          list.sort(
            (a, b) =>
              (b.discountPercent ||
                0) -
              (a.discountPercent ||
                0)
          );
      }

      return list;
    }, [
      filteredProducts,
      selectedSort,
    ]);

  /* =======================================================
     FILTER HANDLERS
     ======================================================= */

  const handleClearAll = () => {
    setSelectedAudience("All");
    setSelectedCategory("All");
    setSelectedPriceRange("all");
    setSelectedDiscount("all");
    setSelectedAvailability("all");
    setSelectedSort("recommended");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedAudience !== "All" ||
    selectedCategory !== "All" ||
    selectedPriceRange !== "all" ||
    selectedDiscount !== "all" ||
    selectedAvailability !== "all" ||
    searchQuery.trim().length > 0;

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2400);
  };

  /* =======================================================
     CART
     ======================================================= */

  const handleAddToCart = (
    event,
    product
  ) => {
    event.stopPropagation();

    const normalizedProduct = {
      ...product,
      image:
        resolveDealsImage(product),
    };

    addToCart(
      normalizedProduct
    );

    showToast(
      `"${product.name}" added to cart ✓`
    );
  };

  /* =======================================================
     WISHLIST
     ======================================================= */

  const handleToggleWishlist = (
    event,
    product
  ) => {
    event.stopPropagation();

    const normalizedProduct = {
      ...product,
      image:
        resolveDealsImage(product),
    };

    const added =
      toggleWishlist(
        normalizedProduct
      );

    setWishlistMap((previous) => ({
      ...previous,
      [String(product.id)]: added,
    }));

    showToast(
      added
        ? "Added to wishlist ♥"
        : "Removed from wishlist"
    );
  };

  /* =======================================================
     OPEN PRODUCT
     ======================================================= */

  const handleViewProduct = (
    product
  ) => {
    const catalog = product?.audience || product?.gender || "";
    const query = catalog
      ? `?catalog=${encodeURIComponent(catalog)}`
      : "";

    window.location.href =
      `/products/${encodeURIComponent(product.id)}${query}`;
  };

  /* =======================================================
     SCROLL TO DEALS
     ======================================================= */

  const scrollToDeals = () => {
    document
      .getElementById(
        "deals-catalog"
      )
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  /* =======================================================
     FILTER CONTROLS
     ======================================================= */

  const renderFilterControls = () => (
    <div className="deals-filter-controls">

      {/* AUDIENCE */}

      <div className="filter-group">

        <h4 className="filter-title">
          Audience
        </h4>

        <div className="filter-pill-group">

          {[
            "All",
            "Women",
            "Men",
            "Kids",
          ].map((audience) => (
            <button
              key={audience}
              type="button"
              className={`filter-pill ${selectedAudience ===
                  audience
                  ? "active"
                  : ""
                }`}
              onClick={() =>
                setSelectedAudience(
                  audience
                )
              }
            >
              {audience}
            </button>
          ))}

        </div>

      </div>

      {/* CATEGORY */}

      <div className="filter-group">

        <h4 className="filter-title">
          Category
        </h4>

        <div className="filter-category-list">

          <label
            className={`category-radio-item ${selectedCategory ===
                "All"
                ? "selected"
                : ""
              }`}
          >

            <input
              type="radio"
              name="category"
              checked={
                selectedCategory ===
                "All"
              }
              onChange={() =>
                setSelectedCategory(
                  "All"
                )
              }
            />

            <span>
              All Categories
            </span>

          </label>

          {availableCategories.map(
            (category) => (
              <label
                key={category}
                className={`category-radio-item ${selectedCategory ===
                    category
                    ? "selected"
                    : ""
                  }`}
              >

                <input
                  type="radio"
                  name="category"
                  checked={
                    selectedCategory ===
                    category
                  }
                  onChange={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                />

                <span>
                  {category}
                </span>

              </label>
            )
          )}

        </div>

      </div>

      {/* PRICE */}

      <div className="filter-group">

        <h4 className="filter-title">
          Price
        </h4>

        <div className="filter-category-list">

          {PRICE_RANGES.map(
            (range) => (
              <label
                key={range.id}
                className={`category-radio-item ${selectedPriceRange ===
                    range.id
                    ? "selected"
                    : ""
                  }`}
              >

                <input
                  type="radio"
                  name="price"
                  checked={
                    selectedPriceRange ===
                    range.id
                  }
                  onChange={() =>
                    setSelectedPriceRange(
                      range.id
                    )
                  }
                />

                <span>
                  {range.label}
                </span>

              </label>
            )
          )}

        </div>

      </div>

      {/* DISCOUNT */}

      <div className="filter-group">

        <h4 className="filter-title">
          Discount
        </h4>

        <div className="filter-pill-group wrap">

          {DISCOUNT_OPTIONS.map(
            (discount) => (
              <button
                key={discount.id}
                type="button"
                className={`filter-pill ${selectedDiscount ===
                    discount.id
                    ? "active"
                    : ""
                  }`}
                onClick={() =>
                  setSelectedDiscount(
                    discount.id
                  )
                }
              >
                {discount.label}
              </button>
            )
          )}

        </div>

      </div>

      {/* AVAILABILITY */}

      <div className="filter-group">

        <h4 className="filter-title">
          Availability
        </h4>

        <div className="filter-pill-group">

          {[
            {
              id: "all",
              label: "All",
            },
            {
              id: "in-stock",
              label: "In Stock",
            },
            {
              id: "out-of-stock",
              label: "Out of Stock",
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              className={`filter-pill ${selectedAvailability ===
                  item.id
                  ? "active"
                  : ""
                }`}
              onClick={() =>
                setSelectedAvailability(
                  item.id
                )
              }
            >
              {item.label}
            </button>
          ))}

        </div>

      </div>

      {/* RESET */}

      {hasActiveFilters && (
        <button
          type="button"
          className="deals-clear-filters-btn"
          onClick={
            handleClearAll
          }
        >
          Reset All Filters
        </button>
      )}

    </div>
  );

  /* =======================================================
     PAGE
     ======================================================= */

  return (
    <div className="deals-page">

      <Navbar />

      {/* TOAST */}

      {toastMessage && (
        <div
          className="deals-toast"
          role="status"
        >
          {toastMessage}
        </div>
      )}

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="maha-hero-section">

        <div className="maha-hero-inner">

          <div className="maha-hero-badge-wrap">

            <span className="maha-limited-badge">
              LIMITED TIME OFFER
            </span>

            <span className="maha-festive-tag">
              EXCLUSIVE FESTIVAL OF DEALS
            </span>

          </div>

          <h1 className="maha-hero-title">
            MAHA INDIAN SALE
          </h1>

          <div className="maha-discount-tagline">

            <span className="maha-discount-highlight">
              Up to 60% OFF
            </span>

          </div>

          <p className="maha-hero-sub">
            Exclusive fashion offers
            across Women, Men & Kids
          </p>

          <div className="maha-hero-cta-wrap">

            <button
              type="button"
              className="maha-hero-cta"
              onClick={
                scrollToDeals
              }
            >
              SHOP DEALS →
            </button>

          </div>

          <div className="maha-perks-strip">

            <div className="perk-item">
              <span className="perk-icon">
                ✦
              </span>

              <span>
                100% Genuine Styles
              </span>
            </div>

            <div className="perk-divider">
              •
            </div>

            <div className="perk-item">
              <span className="perk-icon">
                ⚡
              </span>

              <span>
                Instant Discounts Applied
              </span>
            </div>

            <div className="perk-divider">
              •
            </div>

            <div className="perk-item">
              <span className="perk-icon">
                ↺
              </span>

              <span>
                Easy Returns & Exchange
              </span>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CATALOG
          ===================================================== */}

      <main
        className="deals-main-layout"
        id="deals-catalog"
      >

        {/* SIDEBAR */}

        <aside className="deals-sidebar">

          <div className="sidebar-header">

            <h3>
              Filters
            </h3>

            {hasActiveFilters && (
              <button
                type="button"
                className="sidebar-clear-btn"
                onClick={
                  handleClearAll
                }
              >
                Clear All
              </button>
            )}

          </div>

          {renderFilterControls()}

        </aside>

        {/* PRODUCT COLUMN */}

        <section className="deals-products-column">

          {/* TOOLBAR */}

          <div className="deals-toolbar">

            <div className="deals-toolbar-left">

              <button
                type="button"
                className="mobile-filter-trigger-btn"
                onClick={() =>
                  setMobileDrawerOpen(
                    true
                  )
                }
              >

                <span>
                  ⚙ FILTER & SORT
                </span>

                {hasActiveFilters && (
                  <span className="active-dot">
                    •
                  </span>
                )}

              </button>

              <span className="deals-result-count">
                Showing{" "}
                <strong>
                  {
                    displayedProducts.length
                  }
                </strong>{" "}
                {displayedProducts.length ===
                  1
                  ? "style"
                  : "styles"}
              </span>

            </div>

            <div className="deals-toolbar-right">

              <label
                className="deals-sort-label"
                htmlFor="deals-sort-select"
              >
                Sort By:
              </label>

              <select
                id="deals-sort-select"
                className="deals-sort-select"
                value={selectedSort}
                onChange={(event) =>
                  setSelectedSort(
                    event.target.value
                  )
                }
              >

                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* ACTIVE FILTERS */}

          {hasActiveFilters && (
            <div className="active-filter-chips-row">

              {selectedAudience !==
                "All" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() =>
                      setSelectedAudience(
                        "All"
                      )
                    }
                  >
                    {selectedAudience}
                    <span className="chip-x">
                      ×
                    </span>
                  </button>
                )}

              {selectedCategory !==
                "All" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() =>
                      setSelectedCategory(
                        "All"
                      )
                    }
                  >
                    {selectedCategory}
                    <span className="chip-x">
                      ×
                    </span>
                  </button>
                )}

              {selectedPriceRange !==
                "all" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() =>
                      setSelectedPriceRange(
                        "all"
                      )
                    }
                  >
                    {
                      PRICE_RANGES.find(
                        (range) =>
                          range.id ===
                          selectedPriceRange
                      )?.label
                    }

                    <span className="chip-x">
                      ×
                    </span>
                  </button>
                )}

              {selectedDiscount !==
                "all" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() =>
                      setSelectedDiscount(
                        "all"
                      )
                    }
                  >
                    {selectedDiscount}%+ OFF

                    <span className="chip-x">
                      ×
                    </span>
                  </button>
                )}

              {selectedAvailability !==
                "all" && (
                  <button
                    type="button"
                    className="filter-chip"
                    onClick={() =>
                      setSelectedAvailability(
                        "all"
                      )
                    }
                  >
                    {selectedAvailability ===
                      "in-stock"
                      ? "In Stock"
                      : "Out of Stock"}

                    <span className="chip-x">
                      ×
                    </span>
                  </button>
                )}

              {searchQuery.trim() && (
                <button
                  type="button"
                  className="filter-chip"
                  onClick={() =>
                    setSearchQuery("")
                  }
                >
                  "{searchQuery}"

                  <span className="chip-x">
                    ×
                  </span>
                </button>
              )}

              <button
                type="button"
                className="clear-all-text-btn"
                onClick={
                  handleClearAll
                }
              >
                Clear All
              </button>

            </div>
          )}

          {/* =================================================
              PRODUCT GRID
              ================================================= */}

          {displayedProducts.length ===
            0 ? (

            <div className="deals-empty-state">

              <div className="empty-icon">
                🏷
              </div>

              <h3>
                No matching deals found
              </h3>

              <p>
                We couldn't find any
                products matching your
                selected combination of
                filters.
              </p>

              <button
                type="button"
                className="empty-clear-btn"
                onClick={
                  handleClearAll
                }
              >
                Clear All Filters
              </button>

            </div>

          ) : (

            <div className="deals-grid">

              {displayedProducts.map(
                (product) => {

                  const isWishlisted =
                    !!wishlistMap[
                    String(product.id)
                    ];

                  const originalPrice =
                    Number(
                      product.originalPrice ||
                      product.oldPrice ||
                      product.price
                    );

                  const salePrice =
                    Number(
                      product.price
                    ) || 0;

                  const discount =
                    Number(
                      product.discountPercent
                    ) || 0;

                  const savings =
                    Number(
                      product.savings
                    ) || 0;

                  return (
                    <article
                      key={`${product.audience}-${product.id}`}
                      className="deal-product-card"
                    >

                      {/* IMAGE */}

                      <div
                        className="deal-card-image-wrap"
                        onClick={() =>
                          handleViewProduct(
                            product
                          )
                        }
                      >

                        <DealProductImage
                          product={
                            product
                          }
                        />

                        {/* BADGES */}

                        <div className="deal-card-badges-top-left">

                          {discount > 0 && (
                            <span className="deal-badge-sale">
                              {discount}% OFF
                            </span>
                          )}

                          {product.badge && (
                            <span className="deal-badge-type">
                              {product.badge}
                            </span>
                          )}

                        </div>

                        {/* WISHLIST */}

                        <button
                          type="button"
                          className={`deal-card-wishlist-btn ${isWishlisted
                              ? "active"
                              : ""
                            }`}
                          onClick={(
                            event
                          ) =>
                            handleToggleWishlist(
                              event,
                              product
                            )
                          }
                          aria-label={
                            isWishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          {isWishlisted
                            ? "♥"
                            : "♡"}
                        </button>

                      </div>

                      {/* DETAILS */}

                      <div className="deal-card-info">

                        <span className="deal-card-eyebrow">
                          {product.audience} •{" "}
                          {product.categoryGroup ||
                            product.type ||
                            product.category}
                        </span>

                        <h3
                          className="deal-card-name"
                          title={
                            product.name
                          }
                          onClick={() =>
                            handleViewProduct(
                              product
                            )
                          }
                        >
                          {product.name}
                        </h3>

                        {/* PRICE */}

                        <div className="deal-card-price-block">

                          <div className="deal-card-prices">

                            <span className="deal-sale-price">
                              ₹
                              {salePrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            {originalPrice >
                              salePrice && (
                                <del className="deal-orig-price">
                                  ₹
                                  {originalPrice.toLocaleString(
                                    "en-IN"
                                  )}
                                </del>
                              )}

                          </div>

                          {savings > 0 && (
                            <span className="deal-savings-label">
                              Save ₹
                              {savings.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}

                        </div>

                        {/* ACTIONS */}

                        <div className="deal-card-actions">

                          <button
                            type="button"
                            className="deal-view-btn"
                            onClick={() =>
                              handleViewProduct(
                                product
                              )
                            }
                          >
                            View Product
                          </button>

                          <button
                            type="button"
                            className="deal-cart-btn"
                            onClick={(
                              event
                            ) =>
                              handleAddToCart(
                                event,
                                product
                              )
                            }
                          >
                            Add to Cart
                          </button>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

      </main>

      {/* =====================================================
          MOBILE FILTER DRAWER
          ===================================================== */}

      {mobileDrawerOpen && (

        <div
          className="mobile-drawer-backdrop"
          onClick={() =>
            setMobileDrawerOpen(
              false
            )
          }
        >

          <div
            className="mobile-drawer-container"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="mobile-drawer-header">

              <h3>
                Filter & Sort
              </h3>

              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() =>
                  setMobileDrawerOpen(
                    false
                  )
                }
              >
                ✕
              </button>

            </div>

            <div className="mobile-drawer-body">

              {/* SORT */}

              <div className="filter-group">

                <h4 className="filter-title">
                  Sort By
                </h4>

                <select
                  className="deals-sort-select full-width"
                  value={selectedSort}
                  onChange={(event) =>
                    setSelectedSort(
                      event.target.value
                    )
                  }
                >

                  {SORT_OPTIONS.map(
                    (option) => (
                      <option
                        key={option.id}
                        value={option.id}
                      >
                        {option.label}
                      </option>
                    )
                  )}

                </select>

              </div>

              {renderFilterControls()}

            </div>

            <div className="mobile-drawer-footer">

              <button
                type="button"
                className="mobile-drawer-apply-btn"
                onClick={() =>
                  setMobileDrawerOpen(
                    false
                  )
                }
              >
                Apply Filters (
                {
                  displayedProducts.length
                }{" "}
                Results)
              </button>

            </div>

          </div>

        </div>

      )}

      <Footer />

    </div>
  );
}

export default DealsPage;