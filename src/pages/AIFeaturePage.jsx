import React, { useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";

import "./AIFeaturePage.css";

/* =========================================================
   VEYRAA AI CATALOG
========================================================= */

const catalog = [
  ...womenProducts.map((product) => ({
    ...product,
    audience: "Women",
  })),

  ...menProducts.map((product) => ({
    ...product,
    audience: "Men",
  })),

  ...kidsProducts.map((product) => ({
    ...product,
    audience: product.gender || "Kids",
  })),
];

/* =========================================================
   ONLY 4 AI FEATURES
========================================================= */

const features = {
  "/ai/fashion-matchmaker": {
    name: "Fashion Matchmaker",
    eyebrow: "FIND YOUR PERFECT MATCH",
    description:
      "Answer a few simple shopping questions and Veyraa will create a personalized fashion edit for you.",
  },

  "/ai/pick-my-vibe": {
    name: "Pick My Vibe",
    eyebrow: "SHOP YOUR ENERGY",
    description:
      "Choose your audience and today's vibe, then refine the collection using practical shopping filters.",
  },

  "/ai/complete-my-look": {
    name: "Complete My Look",
    eyebrow: "BUILD THE COMPLETE OUTFIT",
    description:
      "Select one main fashion piece and Veyraa will suggest coordinated accessories to complete your outfit.",
  },

  "/ai/fit-profile": {
    name: "Fit Profile Check",
    eyebrow: "FIT MADE PERSONAL",
    description:
      "Create your personal fit profile once and discover products aligned with your measurements and preferences.",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function imageFor(product) {
  const raw = String(product?.image || "").trim();

  if (
    /^(https?:|data:|blob:)/i.test(raw) ||
    /^\/(women|men|kids)\//i.test(raw)
  ) {
    return encodeURI(raw);
  }

  return encodeURI(
    `/${String(product?.audience || "women").toLowerCase()}/${raw.replace(
      /^\/+/,
      ""
    )}`
  );
}

function textFor(product) {
  return [
    product?.name,
    product?.category,
    product?.type,
    product?.material,
    product?.colour,
    product?.color,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function discountFor(product) {
  const price = Number(product?.price) || 0;

  const original =
    Number(product?.oldPrice || product?.originalPrice || price) || price;

  return original > price
    ? Math.round(((original - price) / original) * 100)
    : 0;
}

function stockNumber(product) {
  const value = product?.stock ?? product?.stockQuantity;

  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function stockFor(product) {
  const stock = stockNumber(product);

  if (stock === null) return "In Stock";

  if (stock <= 6) return `Only ${stock} left`;

  return `${stock} items left`;
}

function readIds(key) {
  try {
    return (JSON.parse(localStorage.getItem(key)) || []).map((item) =>
      String(item.id ?? item.name)
    );
  } catch {
    return [];
  }
}

/* =========================================================
   SHOPPING ACTIONS
========================================================= */

function useShopping() {
  const [wishlistIds, setWishlistIds] = useState(() =>
    readIds("veyraaWishlist")
  );

  const addToCart = (product) => {
    const saved = JSON.parse(localStorage.getItem("veyraaCart")) || [];

    const key = String(product.id ?? product.name);

    const existing = saved.find(
      (item) => String(item.id ?? item.name) === key
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
            image: imageFor(product),
            quantity: 1,
          },
        ];

    localStorage.setItem("veyraaCart", JSON.stringify(updated));

    window.dispatchEvent(new Event("veyraa:cart-updated"));
  };

  const buyNow = (product) => {
    addToCart(product);
    window.location.href = "/billing";
  };

  const toggleWishlist = (product) => {
    const saved = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];

    const key = String(product.id ?? product.name);

    const exists = saved.some(
      (item) => String(item.id ?? item.name) === key
    );

    const updated = exists
      ? saved.filter(
          (item) => String(item.id ?? item.name) !== key
        )
      : [
          ...saved,
          {
            ...product,
            image: imageFor(product),
          },
        ];

    localStorage.setItem("veyraaWishlist", JSON.stringify(updated));

    setWishlistIds(readIds("veyraaWishlist"));
  };

  return {
    wishlistIds,
    addToCart,
    buyNow,
    toggleWishlist,
  };
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product, actions, fitLabel }) {
  const price = Number(product?.price) || 0;

  const original =
    Number(product?.oldPrice || product?.originalPrice || price) || price;

  const discount = discountFor(product);

  const image = imageFor(product);

  const key = String(product.id ?? product.name);

  const wished = actions.wishlistIds.includes(key);

  return (
    <article className="ai-product-card">

      <div className="ai-product-image">

        <img
          src={image}
          alt={product.name}
        />

        <span className="ai-product-badge">
          {product.badge || "VEYRAA EDIT"}
        </span>

        <button
          type="button"
          className={wished ? "ai-heart active" : "ai-heart"}
          onClick={() => actions.toggleWishlist(product)}
        >
          {wished ? "♥" : "♡"}
        </button>

      </div>

      <div className="ai-product-info">

        <span className="ai-product-category">
          {product.audience} · {product.type || product.category}
        </span>

        <a
          className="ai-product-name"
          href={`/products/${encodeURIComponent(
            product.id
          )}?catalog=${product.audience}`}
        >
          {product.name}
        </a>

        <div className="ai-product-rating">
          ★ {Number(product.rating || 0).toFixed(1)}
        </div>

        <div className="ai-product-price">

          <strong>
            ₹{price.toLocaleString("en-IN")}
          </strong>

          {original > price && (
            <del>
              ₹{original.toLocaleString("en-IN")}
            </del>
          )}

          <span>
            {discount ? `${discount}% OFF` : "CURATED"}
          </span>

        </div>

        <div className="ai-product-savings">
          {discount
            ? `You save ₹${(
                original - price
              ).toLocaleString("en-IN")}`
            : "Current collection price"}
        </div>

        <div className="ai-product-stock">
          {fitLabel || stockFor(product)}
        </div>

        <div className="ai-product-actions">

          <button
            type="button"
            onClick={() => actions.addToCart(product)}
          >
            Add to Cart
          </button>

          <button
            type="button"
            onClick={() => actions.buyNow(product)}
          >
            Buy Now
          </button>

        </div>

      </div>

    </article>
  );
}

/* =========================================================
   PRODUCT GRID
========================================================= */

function ProductGrid({
  products,
  actions,
  fitLabel,
  emptyMessage,
}) {
  if (!products.length) {
    return (
      <div className="ai-empty-state">
        <div className="ai-empty-icon">⌕</div>

        <h3>No matching styles yet</h3>

        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="ai-product-grid">
      {products.map((product) => (
        <ProductCard
          key={`${product.audience}-${product.id}`}
          product={product}
          actions={actions}
          fitLabel={fitLabel}
        />
      ))}
    </div>
  );
}

/* =========================================================
   FILTER BAR
========================================================= */

function FilterBar({
  filters,
  setFilters,
  categories,
  sort,
  setSort,
}) {
  return (
    <div className="ai-filter-bar">

      <div className="ai-filter-heading">
        <span>SMART FILTERS</span>
        <strong>Refine your collection</strong>
      </div>

      <label>
        CATEGORY

        <select
          value={filters.category}
          onChange={(event) =>
            setFilters({
              ...filters,
              category: event.target.value,
            })
          }
        >
          {categories.map((category) => (
            <option key={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        PRICE

        <div className="ai-range-value">
          Up to ₹
          {Number(filters.maxPrice).toLocaleString("en-IN")}
        </div>

        <input
          type="range"
          min="500"
          max="10000"
          step="100"
          value={filters.maxPrice}
          onChange={(event) =>
            setFilters({
              ...filters,
              maxPrice: Number(event.target.value),
            })
          }
        />
      </label>

      <label>
        DISCOUNT

        <select
          value={filters.discount}
          onChange={(event) =>
            setFilters({
              ...filters,
              discount: event.target.value,
            })
          }
        >
          <option value="all">Any</option>
          <option value="10">10%+</option>
          <option value="20">20%+</option>
          <option value="30">30%+</option>
        </select>
      </label>

      <label>
        RATING

        <select
          value={filters.rating}
          onChange={(event) =>
            setFilters({
              ...filters,
              rating: event.target.value,
            })
          }
        >
          <option value="all">Any</option>
          <option value="4">4.0+</option>
          <option value="4.5">4.5+</option>
          <option value="4.8">4.8+</option>
        </select>
      </label>

      <label>
        STOCK

        <select
          value={filters.stock}
          onChange={(event) =>
            setFilters({
              ...filters,
              stock: event.target.value,
            })
          }
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
        </select>
      </label>

      <label>
        SORT

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
        >
          <option value="popular">
            Most Popular
          </option>

          <option value="rating">
            Highest Rated
          </option>

          <option value="discount">
            Highest Discount
          </option>

          <option value="low">
            Price: Low to High
          </option>

          <option value="high">
            Price: High to Low
          </option>
        </select>
      </label>

    </div>
  );
}

/* =========================================================
   FILTER LOGIC
========================================================= */

function filterProducts(products, filters, sort) {
  const result = products.filter((product) => {

    const stock = stockNumber(product);

    return (
      (!filters.audience ||
        filters.audience === "All" ||
        product.audience === filters.audience) &&

      (filters.category === "All" ||
        (product.type || product.category) ===
          filters.category) &&

      Number(product.price || 0) <=
        Number(filters.maxPrice) &&

      (filters.discount === "all" ||
        discountFor(product) >=
          Number(filters.discount)) &&

      (filters.rating === "all" ||
        Number(product.rating || 0) >=
          Number(filters.rating)) &&

      (filters.stock === "all" ||
        (filters.stock === "limited"
          ? stock !== null && stock <= 6
          : stock === null || stock > 6))
    );
  });

  if (
    sort === "rating" ||
    sort === "popular"
  ) {
    result.sort(
      (a, b) =>
        Number(b.rating || 0) -
        Number(a.rating || 0)
    );
  }

  if (sort === "discount") {
    result.sort(
      (a, b) =>
        discountFor(b) -
        discountFor(a)
    );
  }

  if (sort === "low") {
    result.sort(
      (a, b) =>
        Number(a.price || 0) -
        Number(b.price || 0)
    );
  }

  if (sort === "high") {
    result.sort(
      (a, b) =>
        Number(b.price || 0) -
        Number(a.price || 0)
    );
  }

  return result;
}

/* =========================================================
   AUDIENCE
========================================================= */

function audienceProducts(audience, childAudience) {
  return catalog
    .filter(
      (product) =>
        audience === "All" ||
        product.audience === audience ||
        (audience === "Kids" &&
          ["Kids", "Girls", "Boys"].includes(
            product.audience
          ))
    )
    .filter(
      (product) =>
        !childAudience ||
        product.gender === childAudience ||
        product.audience === childAudience
    );
}

/* =========================================================
   1. FASHION MATCHMAKER
========================================================= */

const matchQuestions = [
  {
    key: "need",
    label: "WHAT DO YOU NEED?",
    title: "What are you looking for today?",
    options: [
      {
        value: "dress",
        label: "Dress",
        icon: "✦",
      },
      {
        value: "saree",
        label: "Saree",
        icon: "◇",
      },
      {
        value: "kurti",
        label: "Kurti",
        icon: "◈",
      },
      {
        value: "lehenga",
        label: "Lehenga",
        icon: "✧",
      },
      {
        value: "shirt",
        label: "Shirt",
        icon: "□",
      },
      {
        value: "trouser",
        label: "Trousers",
        icon: "▱",
      },
    ],
  },

  {
    key: "audience",
    label: "WHO ARE YOU SHOPPING FOR?",
    title: "Who is this fashion edit for?",
    options: [
      {
        value: "Women",
        label: "Women",
        icon: "♀",
      },
      {
        value: "Men",
        label: "Men",
        icon: "♂",
      },
      {
        value: "Kids",
        label: "Kids",
        icon: "♧",
      },
    ],
  },

  {
    key: "purpose",
    label: "WHAT ARE YOU SHOPPING FOR?",
    title: "Where will you wear it?",
    options: [
      {
        value: "Everyday",
        label: "Everyday",
        icon: "01",
      },
      {
        value: "Office",
        label: "Office",
        icon: "02",
      },
      {
        value: "Party",
        label: "Party",
        icon: "03",
      },
      {
        value: "Wedding",
        label: "Wedding",
        icon: "04",
      },
      {
        value: "College",
        label: "College",
        icon: "05",
      },
      {
        value: "Vacation",
        label: "Vacation",
        icon: "06",
      },
    ],
  },

  {
    key: "budget",
    label: "WHAT IS YOUR BUDGET?",
    title: "How much would you like to spend?",
    options: [
      {
        value: 1500,
        label: "Under ₹1,500",
        icon: "₹",
      },
      {
        value: 3000,
        label: "Under ₹3,000",
        icon: "₹",
      },
      {
        value: 5000,
        label: "Under ₹5,000",
        icon: "₹",
      },
      {
        value: 10000,
        label: "Under ₹10,000",
        icon: "₹",
      },
    ],
  },

  {
    key: "style",
    label: "WHAT STYLE DO YOU WANT?",
    title: "What should your look feel like?",
    options: [
      {
        value: "Elegant",
        label: "Elegant",
        icon: "✦",
      },
      {
        value: "Casual",
        label: "Casual",
        icon: "○",
      },
      {
        value: "Traditional",
        label: "Traditional",
        icon: "◇",
      },
      {
        value: "Bold",
        label: "Bold",
        icon: "◆",
      },
      {
        value: "Street",
        label: "Street",
        icon: "↗",
      },
      {
        value: "Formal",
        label: "Formal",
        icon: "▣",
      },
    ],
  },
];

const matchWords = {
  dress: [
    "dress",
    "gown",
    "frock",
  ],

  saree: [
    "saree",
    "sari",
  ],

  kurti: [
    "kurti",
    "kurta",
    "chudidar",
  ],

  lehenga: [
    "lehenga",
    "lehenga set",
  ],

  shirt: [
    "shirt",
    "t-shirt",
    "top",
  ],

  trouser: [
    "trouser",
    "jeans",
    "pant",
    "palazzo",
    "skirt",
  ],
};

function FashionMatchmaker({ actions }) {
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState({
    need: "dress",
    audience: "Women",
    purpose: "Everyday",
    budget: 3000,
    style: "Elegant",
  });

  const [submitted, setSubmitted] = useState(false);

  const choose = (value) => {
    const question = matchQuestions[step];

    setAnswers((current) => ({
      ...current,
      [question.key]: value,
    }));
  };

  const next = () => {
    if (step < matchQuestions.length - 1) {
      setStep((current) => current + 1);
    } else {
      setSubmitted(true);
    }
  };

  const back = () => {
    if (submitted) {
      setSubmitted(false);
      setStep(matchQuestions.length - 1);
      return;
    }

    setStep((current) =>
      Math.max(0, current - 1)
    );
  };

  const restart = () => {
    setStep(0);
    setSubmitted(false);

    setAnswers({
      need: "dress",
      audience: "Women",
      purpose: "Everyday",
      budget: 3000,
      style: "Elegant",
    });
  };

  const matches = useMemo(() => {
    const needWords = matchWords[answers.need] || [];

    const audienceList = audienceProducts(
      answers.audience,
      ""
    );

    const scored = audienceList.map((product) => {
      const text = textFor(product);

      let score = 0;

      if (
        needWords.some((word) =>
          text.includes(word)
        )
      ) {
        score += 45;
      }

      if (
        answers.purpose !== "Everyday" &&
        text.includes(
          answers.purpose.toLowerCase()
        )
      ) {
        score += 15;
      }

      if (
        text.includes(
          answers.style.toLowerCase()
        )
      ) {
        score += 20;
      }

      if (
        Number(product.price || 0) <=
        Number(answers.budget)
      ) {
        score += 15;
      }

      if (Number(product.rating || 0) >= 4.5) {
        score += 5;
      }

      return {
        product,
        score,
      };
    });

    return scored
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 6);
  }, [answers]);

  if (submitted) {
    const matchPercent = Math.min(
      98,
      Math.max(
        88,
        matches[0]?.score + 50 || 92
      )
    );

    return (
      <div className="match-result-page">

        <div className="match-result-header">

          <div className="match-score-ring">
            <strong>{matchPercent}%</strong>
            <span>MATCH</span>
          </div>

          <div>
            <span className="ai-kicker">
              YOUR PERSONALIZED MATCH
            </span>

            <h2>
              We found your fashion direction.
            </h2>

            <p>
              {answers.audience} ·{" "}
              {answers.need} ·{" "}
              {answers.purpose} ·{" "}
              {answers.style}
            </p>
          </div>

        </div>

        <div className="match-summary-strip">

          <div>
            <span>SHOPPING FOR</span>
            <strong>{answers.need}</strong>
          </div>

          <div>
            <span>OCCASION</span>
            <strong>{answers.purpose}</strong>
          </div>

          <div>
            <span>STYLE</span>
            <strong>{answers.style}</strong>
          </div>

          <div>
            <span>BUDGET</span>
            <strong>
              ₹{Number(answers.budget).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

        </div>

        <div className="match-result-title">

          <span className="ai-kicker">
            CURATED FOR YOU
          </span>

          <h2>
            Your Veyraa collection
          </h2>

          <p>
            We matched products from the existing
            Veyraa catalog using your answers.
          </p>

        </div>

        <ProductGrid
          products={matches.map(
            (item) => item.product
          )}
          actions={actions}
          emptyMessage="Try changing one of your answers."
        />

        <div className="match-result-actions">

          <button
            type="button"
            className="ai-secondary"
            onClick={restart}
          >
            Start Again
          </button>

        </div>

      </div>
    );
  }

  const question = matchQuestions[step];

  return (
    <div className="matchmaker">

      <div className="matchmaker-top">

        <div>
          <span className="ai-kicker">
            FASHION MATCHMAKER
          </span>

          <h2>
            Let's find what you actually want.
          </h2>

          <p>
            Answer five quick questions. Veyraa
            will turn your answers into a
            personalized fashion collection.
          </p>
        </div>

        <div className="match-counter">
          <strong>
            {String(step + 1).padStart(2, "0")}
          </strong>

          <span>
            / {String(matchQuestions.length).padStart(2, "0")}
          </span>
        </div>

      </div>

      <div className="match-progress">

        {matchQuestions.map(
          (item, index) => (
            <span
              key={item.key}
              className={
                index <= step
                  ? "active"
                  : ""
              }
            />
          )
        )}

      </div>

      <div className="match-question-card">

        <span className="match-question-label">
          {question.label}
        </span>

        <h2>
          {question.title}
        </h2>

        <p>
          Choose the option that best matches
          what you need right now.
        </p>

        <div className="match-option-grid">

          {question.options.map(
            (option) => (
              <button
                type="button"
                key={option.value}
                className={
                  answers[question.key] ===
                  option.value
                    ? "match-option active"
                    : "match-option"
                }
                onClick={() =>
                  choose(option.value)
                }
              >
                <span className="match-option-icon">
                  {option.icon}
                </span>

                <strong>
                  {option.label}
                </strong>

                {answers[question.key] ===
                  option.value && (
                  <span className="match-check">
                    ✓
                  </span>
                )}
              </button>
            )
          )}

        </div>

        <div className="match-navigation">

          <button
            type="button"
            className="ai-secondary"
            onClick={back}
            disabled={step === 0}
          >
            ← Back
          </button>

          <button
            type="button"
            className="ai-primary"
            onClick={next}
          >
            {step ===
            matchQuestions.length - 1
              ? "Find My Matches →"
              : "Continue →"}
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   2. PICK MY VIBE
========================================================= */

const vibeVisuals = {
  Elegant: {
    emoji: "✦",
    description:
      "Refined silhouettes, polished fabrics and graceful details.",
    words: [
      "silk",
      "saree",
      "dress",
      "premium",
      "occasion",
      "kurti",
    ],
  },

  Casual: {
    emoji: "○",
    description:
      "Easy everyday pieces with relaxed styling.",
    words: [
      "casual",
      "cotton",
      "t-shirt",
      "jeans",
      "denim",
      "shirt",
    ],
  },

  Party: {
    emoji: "✧",
    description:
      "Statement pieces for celebrations and special plans.",
    words: [
      "party",
      "dress",
      "lehenga",
      "frock",
      "festive",
      "saree",
    ],
  },

  Formal: {
    emoji: "▣",
    description:
      "Clean tailoring and polished work-ready essentials.",
    words: [
      "formal",
      "blazer",
      "trouser",
      "shirt",
      "suit",
      "office",
    ],
  },

  Street: {
    emoji: "↗",
    description:
      "Expressive denim, layers and urban energy.",
    words: [
      "denim",
      "oversized",
      "graphic",
      "jacket",
      "street",
      "sneaker",
    ],
  },

  Traditional: {
    emoji: "◇",
    description:
      "Heritage-inspired fashion with modern styling.",
    words: [
      "traditional",
      "ethnic",
      "kurta",
      "saree",
      "silk",
      "lehenga",
    ],
  },

  Vacation: {
    emoji: "☼",
    description:
      "Light, easy pieces made for getting away.",
    words: [
      "cotton",
      "casual",
      "dress",
      "shirt",
      "summer",
      "vacation",
    ],
  },

  College: {
    emoji: "⌁",
    description:
      "Comfort-first looks with youthful styling.",
    words: [
      "casual",
      "t-shirt",
      "jeans",
      "denim",
      "shirt",
    ],
  },
};

function PickMyVibe({ actions }) {
  const [audience, setAudience] =
    useState("Women");

  const [child, setChild] =
    useState("");

  const [vibe, setVibe] =
    useState("Elegant");

  const [filters, setFilters] =
    useState({
      category: "All",
      maxPrice: 10000,
      discount: "all",
      rating: "all",
      stock: "all",
    });

  const [sort, setSort] =
    useState("popular");

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        audienceProducts(
          audience,
          child
        )
          .map(
            (product) =>
              product.type ||
              product.category
          )
          .filter(Boolean)
      ),
    ],
    [audience, child]
  );

  const base = audienceProducts(
    audience,
    child
  ).filter((product) =>
    vibeVisuals[vibe].words.some(
      (word) =>
        textFor(product).includes(word)
    )
  );

  const products = filterProducts(
    base,
    filters,
    sort
  );

  return (
    <div className="vibe-page">

      <div className="vibe-selector-card">

        <div className="vibe-card-heading">
          <span className="ai-kicker">
            STEP 01 · AUDIENCE
          </span>

          <h2>
            Who are you styling today?
          </h2>
        </div>

        <div className="audience-pills">

          {["Women", "Men", "Kids"].map(
            (option) => (
              <button
                type="button"
                className={
                  audience === option
                    ? "active"
                    : ""
                }
                key={option}
                onClick={() => {
                  setAudience(option);
                  setChild("");
                }}
              >
                {option}
              </button>
            )
          )}

        </div>

        {audience === "Kids" && (
          <div className="audience-pills child-pills">

            {["Boys", "Girls"].map(
              (option) => (
                <button
                  type="button"
                  className={
                    child === option
                      ? "active"
                      : ""
                  }
                  key={option}
                  onClick={() =>
                    setChild(option)
                  }
                >
                  {option}
                </button>
              )
            )}

          </div>
        )}

      </div>

      <div className="vibe-selector-card">

        <div className="vibe-card-heading">

          <span className="ai-kicker">
            STEP 02 · VIBE
          </span>

          <h2>
            What do you feel like wearing?
          </h2>

        </div>

        <div className="vibe-choice-grid">

          {Object.entries(vibeVisuals).map(
            ([name, data]) => (
              <button
                type="button"
                className={
                  vibe === name
                    ? "vibe-choice active"
                    : "vibe-choice"
                }
                key={name}
                onClick={() =>
                  setVibe(name)
                }
              >
                <b>{data.emoji}</b>

                <strong>{name}</strong>

                <span>
                  {data.description}
                </span>
              </button>
            )
          )}

        </div>

      </div>

      <div className="vibe-result-banner">

        <div>
          <span>YOUR VIBE</span>
          <h2>{vibe}</h2>
        </div>

        <p>
          {products.length} styles selected
          for {child || audience}
        </p>

      </div>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        sort={sort}
        setSort={setSort}
      />

      <ProductGrid
        products={products}
        actions={actions}
        emptyMessage="Try another vibe or adjust your filters."
      />

    </div>
  );
}

/* =========================================================
   3. COMPLETE MY LOOK
========================================================= */

function isMainFashionPiece(product) {
  const text = textFor(product);

  return /dress|gown|frock|saree|sari|lehenga|kurti|kurta|chudidar|suit|shirt|t-shirt|blazer|sherwani|top/.test(
    text
  );
}

function getAccessoryRoles(main) {
  const audience = main?.audience;

  if (audience === "Men") {
    return [
      {
        role: "FOOTWEAR",
        words: [
          "shoe",
          "sneaker",
          "sandal",
          "footwear",
        ],
      },

      {
        role: "WATCH / ACCESSORY",
        words: [
          "watch",
          "belt",
          "wallet",
          "accessory",
        ],
      },

      {
        role: "BAG",
        words: [
          "bag",
          "backpack",
          "wallet",
        ],
      },
    ];
  }

  if (audience === "Kids") {
    return [
      {
        role: "FOOTWEAR",
        words: [
          "shoe",
          "sandal",
          "sneaker",
          "footwear",
        ],
      },

      {
        role: "BAG",
        words: [
          "bag",
          "backpack",
          "pouch",
        ],
      },

      {
        role: "ACCESSORY",
        words: [
          "accessory",
          "watch",
          "hair",
        ],
      },
    ];
  }

  return [
    {
      role: "JEWELLERY",
      words: [
        "jewellery",
        "jewelry",
        "necklace",
        "earring",
        "bangle",
        "bracelet",
      ],
    },

    {
      role: "BAG",
      words: [
        "bag",
        "clutch",
        "handbag",
        "purse",
      ],
    },

    {
      role: "FOOTWEAR",
      words: [
        "shoe",
        "heel",
        "sandal",
        "footwear",
      ],
    },
  ];
}

function CompleteLook({ actions }) {
  const mainPieces = useMemo(
    () =>
      catalog.filter((product) =>
        isMainFashionPiece(product)
      ),
    []
  );

  const [mainId, setMainId] =
    useState(
      String(mainPieces[0]?.id || "")
    );

  const [selected, setSelected] =
    useState({});

  const main =
    mainPieces.find(
      (product) =>
        String(product.id) ===
        String(mainId)
    ) || mainPieces[0];

  const roles = getAccessoryRoles(main);

  const recommendations = roles.map(
    (role) => {
      const found = catalog
        .filter(
          (product) =>
            product.id !== main.id &&
            product.audience ===
              main.audience &&
            role.words.some((word) =>
              textFor(product).includes(word)
            )
        )
        .sort(
          (a, b) =>
            Math.abs(
              Number(a.price || 0) -
                Number(main.price || 0) /
                  4
            ) -
            Math.abs(
              Number(b.price || 0) -
                Number(main.price || 0) /
                  4
            )
        )[0];

      return {
        role: role.role,
        product: found,
      };
    }
  ).filter((item) => item.product);

  const pieces = [
    main,
    ...Object.values(selected),
  ].filter(Boolean);

  const total = pieces.reduce(
    (sum, product) =>
      sum + Number(product.price || 0),
    0
  );

  return (
    <div className="complete-look-page">

      <div className="look-selector-hero">

        <div>

          <span className="ai-kicker">
            STEP 01 · CHOOSE YOUR MAIN PIECE
          </span>

          <h2>
            Start with something you love.
          </h2>

          <p>
            Select a dress, saree, lehenga,
            kurti or other main fashion piece.
          </p>

        </div>

        <div className="look-select-wrap">

          <label>
            YOUR MAIN FASHION PIECE

            <select
              value={main?.id || ""}
              onChange={(event) => {
                setMainId(event.target.value);
                setSelected({});
              }}
            >
              {mainPieces
                .slice(0, 80)
                .map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}
            </select>

          </label>

        </div>

      </div>

      {main && (
        <>

          <div className="selected-main-card">

            <div className="selected-main-image">
              <img
                src={imageFor(main)}
                alt={main.name}
              />
            </div>

            <div className="selected-main-info">

              <span className="ai-kicker">
                SELECTED MAIN PIECE
              </span>

              <h2>{main.name}</h2>

              <p>
                {main.audience} ·{" "}
                {main.type ||
                  main.category}
              </p>

              <strong>
                ₹
                {Number(
                  main.price || 0
                ).toLocaleString("en-IN")}
              </strong>

            </div>

          </div>

          <div className="look-section-header">

            <span className="ai-kicker">
              STEP 02 · COMPLETE THE OUTFIT
            </span>

            <h2>
              What goes with your piece?
            </h2>

            <p>
              Veyraa has selected complementary
              accessories based on your chosen
              product and audience.
            </p>

          </div>

          <div className="accessory-grid">

            {recommendations.map(
              ({ role, product }) => {
                const key = String(
                  product.id
                );

                const active =
                  Boolean(selected[key]);

                return (
                  <article
                    className={
                      active
                        ? "accessory-card active"
                        : "accessory-card"
                    }
                    key={key}
                  >

                    <div className="accessory-image">

                      <img
                        src={imageFor(product)}
                        alt={product.name}
                      />

                      <span>
                        {role}
                      </span>

                    </div>

                    <div className="accessory-info">

                      <span className="ai-product-category">
                        {product.type ||
                          product.category}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <strong>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          setSelected(
                            (current) => {
                              if (active) {
                                const next = {
                                  ...current,
                                };

                                delete next[key];

                                return next;
                              }

                              return {
                                ...current,
                                [key]: product,
                              };
                            }
                          )
                        }
                      >
                        {active
                          ? "✓ Added"
                          : "Add to Look"}
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>

          <div className="complete-look-summary">

            <div>

              <span>
                YOUR COMPLETE LOOK
              </span>

              <strong>
                {pieces.length} pieces
              </strong>

            </div>

            <div>

              <span>
                TOTAL
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <button
              type="button"
              className="ai-primary"
              onClick={() =>
                pieces.forEach(
                  actions.addToCart
                )
              }
            >
              Add Complete Look →
            </button>

          </div>

        </>
      )}

    </div>
  );
}

/* =========================================================
   4. FIT PROFILE
========================================================= */

function FitProfile({ actions }) {

  const [step, setStep] =
    useState(1);

  const [profile, setProfile] =
    useState({
      height: "",
      weight: "",
      bust: "",
      waist: "",
      hip: "",
      shoulder: "",
      arm: "",

      fit: "Regular Fit",

      audience: "Women",

      child: "",

      style: "Elegant",
    });

  const update = (event) => {

    setProfile({
      ...profile,
      [event.target.name]:
        event.target.value,
    });

  };

  const chooseAudience =
    (audience) => {

      setProfile({
        ...profile,
        audience,
        child: "",
      });

    };

  const recommendations =
    useMemo(() => {

      let products =
        audienceProducts(
          profile.audience,
          profile.child
        );

     const styleProducts =
  products.filter((product) =>
    textFor(product).includes(
      profile.style.toLowerCase()
    )
  );

  
      return (
        styleProducts.length
          ? styleProducts
          : products
      ).slice(0, 6);

    }, [
      profile.audience,
      profile.child,
      profile.style,
    ]);

  const steps = [
    "Profile",
    "Measurements",
    "Fit",
    "Style",
    "Recommendations",
  ];

  return (
    <section className="fit-profile-premium">

      {/* HERO */}

      <div className="fit-premium-hero">

        <div>

          <span className="ai-kicker">
            VEYRAA AI · FIT PROFILE
          </span>

          <h1>
            Find your personal fit.
          </h1>

          <p>
            Tell Veyraa a few details and
            we'll make your fashion discovery
            more relevant to you.
          </p>

        </div>

        <div className="fit-profile-badge">
          <strong>
            {String(step).padStart(2, "0")}
          </strong>
          <span>/05</span>
        </div>

      </div>

      {/* AUDIENCE FILTER */}

      <div className="fit-audience-panel">

        <div>

          <span>
            SHOPPING FOR
          </span>

          <strong>
            Choose your audience
          </strong>

        </div>

        <div className="fit-audience-buttons">

          {[
            "Women",
            "Men",
            "Kids",
          ].map((item) => (

            <button
              type="button"
              key={item}
              className={
                profile.audience === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                chooseAudience(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

        {profile.audience === "Kids" && (

          <div className="fit-kids-buttons">

            {[
              "Boys",
              "Girls",
            ].map((item) => (

              <button
                type="button"
                key={item}
                className={
                  profile.child === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setProfile({
                    ...profile,
                    child: item,
                  })
                }
              >
                {item}
              </button>

            ))}

          </div>

        )}

      </div>

      {/* PROGRESS */}

      <div className="fit-premium-progress">

        {steps.map(
          (item, index) => (

            <div
              key={item}
              className={
                step === index + 1
                  ? "active"
                  : step > index + 1
                  ? "complete"
                  : ""
              }
            >

              <span>
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              <strong>
                {item}
              </strong>

            </div>

          )
        )}

      </div>

      {/* CONTENT */}

      <div className="fit-premium-card">

        {step === 1 && (

          <>

            <span className="ai-kicker">
              STEP 01 · PROFILE
            </span>

            <h2>
              Tell us about you.
            </h2>

            <p>
              These details help us understand
              your overall fit requirements.
            </p>

            <div className="fit-modern-grid">

              <label>
                HEIGHT
                <div>
                  <input
                    name="height"
                    type="number"
                    placeholder="165"
                    value={profile.height}
                    onChange={update}
                  />
                  <span>cm</span>
                </div>
              </label>

              <label>
                WEIGHT
                <div>
                  <input
                    name="weight"
                    type="number"
                    placeholder="60"
                    value={profile.weight}
                    onChange={update}
                  />
                  <span>kg</span>
                </div>
              </label>

            </div>

          </>

        )}

        {step === 2 && (

          <>

            <span className="ai-kicker">
              STEP 02 · MEASUREMENTS
            </span>

            <h2>
              Your measurements.
            </h2>

            <p>
              Add the measurements you normally
              use when selecting clothes.
            </p>

            <div className="fit-modern-grid">

              {[
                ["bust", "Bust / Chest"],
                ["waist", "Waist"],
                ["hip", "Hip"],
                ["shoulder", "Shoulder"],
                ["arm", "Arm / Hand"],
              ].map(
                ([name, label]) => (

                  <label key={name}>

                    {label.toUpperCase()}

                    <div>

                      <input
                        name={name}
                        type="number"
                        placeholder="Enter"
                        value={profile[name]}
                        onChange={update}
                      />

                      <span>
                        cm
                      </span>

                    </div>

                  </label>

                )
              )}

            </div>

          </>

        )}

        {step === 3 && (

          <>

            <span className="ai-kicker">
              STEP 03 · FIT
            </span>

            <h2>
              How do you like your clothes to fit?
            </h2>

            <div className="fit-option-grid">

              {[
                [
                  "Slim Fit",
                  "Close and structured",
                ],
                [
                  "Regular Fit",
                  "Balanced everyday fit",
                ],
                [
                  "Relaxed Fit",
                  "Comfort with more room",
                ],
                [
                  "Oversized",
                  "Loose contemporary fit",
                ],
              ].map(
                ([name, description]) => (

                  <button
                    type="button"
                    key={name}
                    className={
                      profile.fit === name
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setProfile({
                        ...profile,
                        fit: name,
                      })
                    }
                  >

                    <strong>
                      {name}
                    </strong>

                    <span>
                      {description}
                    </span>

                  </button>

                )
              )}

            </div>

          </>

        )}

        {step === 4 && (

          <>

            <span className="ai-kicker">
              STEP 04 · STYLE
            </span>

            <h2>
              What style feels like you?
            </h2>

            <div className="fit-option-grid">

              {[
                "Casual",
                "Elegant",
                "Traditional",
                "Party",
                "Formal",
                "Street",
              ].map((style) => (

                <button
                  type="button"
                  key={style}
                  className={
                    profile.style === style
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setProfile({
                      ...profile,
                      style,
                    })
                  }
                >

                  <strong>
                    {style}
                  </strong>

                </button>

              ))}

            </div>

          </>

        )}

        {step === 5 && (

          <>

            <span className="ai-kicker">
              STEP 05 · YOUR COLLECTION
            </span>

            <h2>
              Fits your profile.
            </h2>

            <div className="fit-profile-summary">

              <div>
                <span>
                  AUDIENCE
                </span>
                <strong>
                  {profile.audience}
                  {profile.child
                    ? ` · ${profile.child}`
                    : ""}
                </strong>
              </div>

              <div>
                <span>
                  FIT
                </span>
                <strong>
                  {profile.fit}
                </strong>
              </div>

              <div>
                <span>
                  STYLE
                </span>
                <strong>
                  {profile.style}
                </strong>
              </div>

            </div>

            <ProductGrid
              products={recommendations}
              actions={actions}
              fitLabel={`${profile.fit} · Profile match`}
              emptyMessage="No matching products found."
            />

          </>

        )}

      </div>

      {/* NAVIGATION */}

      <div className="fit-modern-navigation">

        <button
          type="button"
          disabled={step === 1}
          onClick={() =>
            setStep(
              Math.max(1, step - 1)
            )
          }
        >
          ← Back
        </button>

        {step < 5 ? (

          <button
            type="button"
            className="ai-primary"
            onClick={() =>
              setStep(step + 1)
            }
          >
            {step === 4
              ? "Create My Fit Profile →"
              : "Continue →"}
          </button>

        ) : (

          <button
            type="button"
            className="ai-primary"
            onClick={() =>
              setStep(1)
            }
          >
            Edit Profile
          </button>

        )}

      </div>

    </section>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

function AIFeaturePage() {
  const path =
    window.location.pathname;

  const feature =
    features[path] ||
    features[
      "/ai/fashion-matchmaker"
    ];

  const actions = useShopping();

  let content = null;

  if (
    feature.name ===
    "Fashion Matchmaker"
  ) {
    content = (
      <FashionMatchmaker
        actions={actions}
      />
    );
  }

  if (
    feature.name ===
    "Pick My Vibe"
  ) {
    content = (
      <PickMyVibe
        actions={actions}
      />
    );
  }

  if (
    feature.name ===
    "Complete My Look"
  ) {
    content = (
      <CompleteLook
        actions={actions}
      />
    );
  }

  if (
    feature.name ===
    "Fit Profile Check"
  ) {
    content = (
      <FitProfile
        actions={actions}
      />
    );
  }

  return (
    <div className="ai-feature-page">

      <Navbar />

      <main className="ai-feature-main">

        <a
          className="ai-back-link"
          href="/"
        >
          ← Back to AI Fashion Studio
        </a>

        <header className="ai-feature-hero">

          <div className="ai-hero-orbit orbit-one" />
          <div className="ai-hero-orbit orbit-two" />

          <span>
            VEYRAA AI STUDIO ·{" "}
            {feature.name.toUpperCase()}
          </span>

          <h1>
            {feature.eyebrow}
          </h1>

          <p>
            {feature.description}
          </p>

        </header>

        <section className="ai-feature-content-wrap">

          <div className="ai-feature-heading">

            <span>
              PERSONALIZED SHOPPING EXPERIENCE
            </span>

            <h2>
              {feature.name}
            </h2>

            <p>
              A focused Veyraa experience designed
              around the way you actually shop.
            </p>

          </div>

          {content}

        </section>

      </main>

      <Footer />

    </div>
  );
}

export default AIFeaturePage;
