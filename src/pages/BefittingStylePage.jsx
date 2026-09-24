import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VirtualTryOn from "../components/VirtualTryOn";
import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";
import {
  getSavedFitProfile,
  saveCustomerFitProfile,
} from "../data/customerAccount";
import "./BefittingStylePage.css";

const audienceOptions = ["Women", "Men", "Kids"];

const styleOptions = [
  "Classic",
  "Casual",
  "Elegant",
  "Trendy",
  "Traditional",
  "Minimal",
  "Street Style",
  "Festive",
  "Office Wear",
];

const fitOptions = ["Relaxed", "Regular", "Slim", "Oversized", "Comfortable"];
const colorOptions = ["Neutrals", "Pastels", "Bold", "Dark", "Bright", "Earthy"];

const vibeOptions = [
  {
    name: "Everyday Chic",
    emoji: "✨",
    description: "Polished essentials that feel easy and elevated.",
  },
  {
    name: "Elegant Evening",
    emoji: "🌙",
    description: "Refined silhouettes made for evenings and events.",
  },
  {
    name: "Soft & Feminine",
    emoji: "🌸",
    description: "Fluid fabrics, gentle tones and graceful lines.",
  },
  {
    name: "Bold & Trendy",
    emoji: "🔥",
    description: "Statement picks with confidence-driven styling.",
  },
  {
    name: "Traditional Grace",
    emoji: "🪷",
    description: "Heritage-inspired elegance with modern ease.",
  },
  {
    name: "Minimal Luxe",
    emoji: "🖤",
    description: "Understated luxury and clean premium tailoring.",
  },
  {
    name: "Street Style",
    emoji: "👟",
    description: "Cool, expressive outfits built for motion.",
  },
  {
    name: "Festive Ready",
    emoji: "🎉",
    description: "Joyful celebratory looks for every special moment.",
  },
];

const vibeStyleMap = {
  "Everyday Chic": { styles: ["Classic", "Casual"], colors: ["Neutrals", "Pastels"], occasion: "Casual Day Out", keywords: ["casual", "cotton", "classic", "chic"] },
  "Elegant Evening": { styles: ["Elegant", "Minimal"], colors: ["Dark", "Neutrals"], occasion: "Party", keywords: ["elegant", "silk", "dress", "party"] },
  "Soft & Feminine": { styles: ["Elegant", "Minimal"], colors: ["Pastels", "Bright"], occasion: "Date Night", keywords: ["floral", "pastel", "dress", "feminine"] },
  "Bold & Trendy": { styles: ["Trendy", "Street Style"], colors: ["Bold", "Bright"], occasion: "Party", keywords: ["trendy", "street", "bold", "denim"] },
  "Traditional Grace": { styles: ["Traditional", "Elegant"], colors: ["Earthy", "Neutrals"], occasion: "Wedding", keywords: ["saree", "lehenga", "ethnic", "traditional", "silk"] },
  "Minimal Luxe": { styles: ["Minimal", "Classic"], colors: ["Neutrals", "Dark"], occasion: "Office", keywords: ["minimal", "blazer", "shirt", "classic"] },
  "Street Style": { styles: ["Street Style", "Casual"], colors: ["Dark", "Bold"], occasion: "College", keywords: ["street", "sneaker", "jeans", "denim", "casual"] },
  "Festive Ready": { styles: ["Festive", "Traditional"], colors: ["Bright", "Earthy"], occasion: "Festival", keywords: ["festive", "ethnic", "silk", "kurta", "saree"] },
};

const occasionOptions = [
  "College",
  "Office",
  "Casual Day Out",
  "Wedding",
  "Festival",
  "Party",
  "Date Night",
  "Vacation",
];

const allProducts = [
  ...womenProducts.map((product) => ({ ...product, audience: "Women" })),
  ...menProducts.map((product) => ({ ...product, audience: "Men" })),
  ...kidsProducts.map((product) => ({ ...product, audience: product.gender || "Kids" })),
];

function resolveCatalogImage(product) {
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

  if (raw.startsWith("/women/") || raw.startsWith("/men/") || raw.startsWith("/kids/")) {
    return raw;
  }

  const audience = String(product?.audience || product?.gender || "").toLowerCase();
  const folder = audience === "women" ? "women" : audience === "men" ? "men" : audience === "girls" || audience === "boys" || audience === "kids" ? "kids" : "";

  if (folder) {
    return encodeURI(`/${folder}/${raw.replace(/^\/+/, "")}`);
  }

  return raw;
}

function readWishlistIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedWishlist = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
    return savedWishlist.map((item) => item.id || item.name);
  } catch (error) {
    return [];
  }
}

function getDiscountPercent(product) {
  const current = Number(product.price) || 0;
  const original = Number(product.oldPrice || product.originalPrice || product.price) || 0;

  if (!original || original <= current) {
    return 0;
  }

  return Math.round(((original - current) / original) * 100);
}

function matchesAudience(product, audience) {
  const productAudience = String(
    product?.audience || ""
  ).trim().toLowerCase();

  if (audience === "Women") {
    return productAudience === "women";
  }

  if (audience === "Men") {
    return productAudience === "men";
  }

  if (audience === "Kids") {
    return (
      productAudience === "kids" ||
      productAudience === "boys" ||
      productAudience === "girls"
    );
  }

  return false;
}

function getProductScore(product, selectedStyles, selectedColors, fitPreference, selectedOccasion, vibeData) {
  const text = productText(product);
  let score = 55;

  const styleBoost = selectedStyles.filter((style) => text.includes(style.toLowerCase())).length;
  const colorBoost = selectedColors.filter((color) => text.includes(color.toLowerCase())).length;
  const fitBoost = fitPreference && text.includes(fitPreference.toLowerCase()) ? 1 : 0;
  const occasionBoost = selectedOccasion && text.includes(selectedOccasion.toLowerCase()) ? 12 : 0;
  const vibeKeywords = vibeData?.keywords || [];
  const vibeBoost = vibeKeywords.reduce((total, keyword) => total + (text.includes(keyword) ? 5 : 0), 0);

  score += styleBoost * 14;
  score += colorBoost * 8;
  score += fitBoost * 6;
  score += occasionBoost;
  score += vibeBoost;
  score += getDiscountPercent(product) / 5;

  return score;
}

function productText(product) {
  return [
    product?.name,
    product?.category,
    product?.type,
    product?.material,
    product?.colour,
    product?.color,
    product?.fit,
    product?.style,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getLookRole(product) {
  const text = productText(product);
  const audience = product.audience;

  if (/shoe|shoes|sandal|sandals|slipper|slippers|footwear|sneaker|loafer|heel|heels|juti|jutti|kolhapuri/.test(text)) return "footwear";
  if (/bag|handbag|watch|jewellery|jewelry|belt|sunglass|scarf|wallet/.test(text)) return "accessory";
  if (/jean|trouser|palazzo|chudidar|skirt|shorts|legging|pants|pant|dhoti/.test(text)) return "bottom";
  if (audience === "Kids" || audience === "Girls" || audience === "Boys") {
    return /dress|frock|gown|romper/.test(text) ? "top" : "bottom";
  }
  return "top";
}

function getLookTotal(look) {
  return Object.values(look).reduce((total, product) => total + (Number(product?.price) || 0), 0);
}

function getRoleProducts(pool, role) {
  return pool.filter((product) => getLookRole(product) === role);
}

function BefittingStylePage() {
  const [selectedAudience, setSelectedAudience] = useState("Women");
  const [selectedStyles, setSelectedStyles] = useState(["Elegant", "Classic"]);
  const [selectedFit, setSelectedFit] = useState("Regular");
  const [selectedColors, setSelectedColors] = useState(["Neutrals", "Pastels"]);
  const [selectedOccasion, setSelectedOccasion] = useState("Office");
  const [selectedVibe, setSelectedVibe] = useState("Everyday Chic");
  const [profileCreated, setProfileCreated] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(() => readWishlistIds());
  const [lookSelections, setLookSelections] = useState({ top: null, bottom: null, footwear: null, accessory: null });
  const [selectorRole, setSelectorRole] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assistPrompt, setAssistPrompt] = useState("");
  const [assistResult, setAssistResult] = useState(null);
  const [measurements, setMeasurements] = useState({
    height: "165 cm",
    weight: "60 kg",
    bust: "34 in",
    waist: "28 in",
    hip: "36 in",
  });

  const toggleSelection = (value, list, setList) => {
    const exists = list.includes(value);
    setList(exists ? list.filter((item) => item !== value) : [...list, value]);
  };

  const selectedVibeData = vibeStyleMap[selectedVibe] || vibeStyleMap["Everyday Chic"];

  const recommendationPool = useMemo(() => {
    return allProducts
      .filter((product) => matchesAudience(product, selectedAudience))
      .map((product) => ({ ...product, image: resolveCatalogImage(product) }));
  }, [selectedAudience]);

  const recommendedProducts = useMemo(() => {
    const sorted = [...recommendationPool].sort((a, b) => {
      const aScore = getProductScore(a, selectedStyles, selectedColors, selectedFit, selectedOccasion, selectedVibeData);
      const bScore = getProductScore(b, selectedStyles, selectedColors, selectedFit, selectedOccasion, selectedVibeData);
      return bScore - aScore;
    });

    return sorted.slice(0, 6);
  }, [recommendationPool, selectedColors, selectedFit, selectedOccasion, selectedStyles, selectedVibeData]);

  const occasionProducts = useMemo(() => {
    const filtered = [...recommendationPool].filter((product) => {
      const lower = `${product.name} ${product.category} ${product.type}`.toLowerCase();
      if (selectedOccasion === "Wedding") return lower.includes("saree") || lower.includes("lehenga") || lower.includes("bridal");
      if (selectedOccasion === "Festival") return lower.includes("festive") || lower.includes("silk") || lower.includes("ethnic");
      if (selectedOccasion === "Office") return lower.includes("shirt") || lower.includes("blazer") || lower.includes("trouser");
      if (selectedOccasion === "College") return lower.includes("tee") || lower.includes("jeans") || lower.includes("casual");
      if (selectedOccasion === "Party") return lower.includes("dress") || lower.includes("frock") || lower.includes("party");
      if (selectedOccasion === "Date Night") return lower.includes("dress") || lower.includes("silk") || lower.includes("top");
      if (selectedOccasion === "Vacation") return lower.includes("cotton") || lower.includes("dress") || lower.includes("shirt");
      return lower.includes("t-shirt") || lower.includes("casual") || lower.includes("kurti");
    });

    return filtered.slice(0, 4);
  }, [recommendationPool, selectedOccasion]);

  const styleMatch = useMemo(() => {
    const baseStyles = selectedStyles.length ? selectedStyles.slice(0, 2).join(" + ") : "Contemporary";
    const colorMood = selectedColors.length ? selectedColors.slice(0, 2).join(" + ") : "Pastel + Neutral";
    const score = Math.min(97, 78 + selectedStyles.length * 3 + selectedColors.length * 2 + (selectedFit ? 3 : 0));

    return {
      score,
      style: baseStyles,
      colorMood,
      fit: selectedFit || "Regular",
    };
  }, [selectedColors, selectedFit, selectedStyles]);

  const completeLook = useMemo(() => {
    const ranked = (role) =>
      [...getRoleProducts(recommendationPool, role)].sort(
        (a, b) =>
          getProductScore(b, selectedStyles, selectedColors, selectedFit, selectedOccasion, selectedVibeData) -
          getProductScore(a, selectedStyles, selectedColors, selectedFit, selectedOccasion, selectedVibeData)
      );

    const topChoices = ranked("top");
    const bottomChoices = ranked("bottom");
    const footwearChoices = ranked("footwear");
    const accessoryChoices = ranked("accessory");

    return {
      top: lookSelections.top || topChoices[0] || recommendationPool[0],
      bottom: lookSelections.bottom || bottomChoices[0] || recommendationPool[1] || recommendationPool[0],
      footwear: lookSelections.footwear || footwearChoices[0] || null,
      accessory: lookSelections.accessory || accessoryChoices[0] || null,
    };
  }, [lookSelections, recommendationPool, selectedColors, selectedFit, selectedOccasion, selectedStyles, selectedVibeData]);

  const selectedLook = useMemo(
    () => Object.values(lookSelections).filter(Boolean),
    [lookSelections]
  );

  useEffect(() => {
    setLookSelections({ top: null, bottom: null, footwear: null, accessory: null });
  }, [selectedAudience]);

  useEffect(() => {
    const savedProfile = getSavedFitProfile();
    if (savedProfile?.isCompleted) {
      setMeasurements({
        height: savedProfile.height || "",
        weight: savedProfile.weight || "",
        bust: savedProfile.chest || savedProfile.bust || "",
        waist: savedProfile.waist || "",
        hip: savedProfile.hip || "",
      });
      if (savedProfile.fit) setSelectedFit(savedProfile.fit);
      setProfileCreated(true);
    }
  }, []);

  useEffect(() => {
    const openSearch = () => setSearchOpen(true);
    window.addEventListener("befitting:open-search", openSearch);
    return () => window.removeEventListener("befitting:open-search", openSearch);
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setMeasurements((current) => ({ ...current, [name]: value }));
  };

  const saveFitProfile = () => {
    saveCustomerFitProfile({
      height: measurements.height,
      weight: measurements.weight,
      chest: measurements.bust,
      waist: measurements.waist,
      hip: measurements.hip,
      shoulder: "",
      armLength: "",
      fit: selectedFit,
      isCompleted: true,
    });
    setProfileCreated(true);
  };

  const applyVibe = (vibeName) => {
    const data = vibeStyleMap[vibeName] || vibeStyleMap["Everyday Chic"];
    setSelectedVibe(vibeName);
    setSelectedStyles(data.styles);
    setSelectedColors(data.colors);
    setSelectedOccasion(data.occasion);
    setLookSelections({ top: null, bottom: null, footwear: null, accessory: null });
  };

  const addProductsToCart = (productsToAdd) => {
    const validProducts = productsToAdd.filter(Boolean);
    if (!validProducts.length) return;
    let savedCart = JSON.parse(localStorage.getItem("veyraaCart")) || [];

    validProducts.forEach((product) => {
      const productId = product.id ?? product.name;
      const existing = savedCart.find((item) => (item.id ?? item.name) === productId);
      savedCart = existing
        ? savedCart.map((item) =>
            (item.id ?? item.name) === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
          )
        : [...savedCart, { ...product, image: resolveCatalogImage(product), quantity: 1 }];
    });

    localStorage.setItem("veyraaCart", JSON.stringify(savedCart));
    window.dispatchEvent(new Event("veyraa:cart-updated"));
  };

  const buyProducts = (productsToBuy) => {
    const validProducts = productsToBuy.filter(Boolean);
    if (!validProducts.length) return;
    addProductsToCart(validProducts);
    window.location.href = "/billing";
  };

  const addToCart = (product) => {
    const savedCart = JSON.parse(localStorage.getItem("veyraaCart")) || [];
    const productId = product.id ?? product.name;
    const existing = savedCart.find((item) => (item.id ?? item.name) === productId);

    const updatedCart = existing
      ? savedCart.map((item) =>
          (item.id ?? item.name) === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      : [...savedCart, { ...product, image: resolveCatalogImage(product), quantity: 1 }];

    localStorage.setItem("veyraaCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("veyraa:cart-updated"));
  };

  const buyNow = (product) => {
    const savedCart = JSON.parse(localStorage.getItem("veyraaCart")) || [];
    const productId = product.id ?? product.name;
    const exists = savedCart.some((item) => (item.id ?? item.name) === productId);

    if (!exists) {
      localStorage.setItem("veyraaCart", JSON.stringify([...savedCart, { ...product, image: resolveCatalogImage(product), quantity: 1 }]));
      window.dispatchEvent(new Event("veyraa:cart-updated"));
    }

    window.location.href = "/billing";
  };

  const toggleWishlist = (product) => {
    const savedWishlist = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
    const productKey = product.id ?? product.name;
    const exists = savedWishlist.some((item) => (item.id ?? item.name) === productKey);
    const updatedWishlist = exists
      ? savedWishlist.filter((item) => (item.id ?? item.name) !== productKey)
      : [...savedWishlist, { ...product, image: resolveCatalogImage(product) }];

    localStorage.setItem("veyraaWishlist", JSON.stringify(updatedWishlist));
    setWishlistIds(readWishlistIds());
  };

  const openProduct = (product) => {
    if (product?.id === undefined) return;
    window.location.href = `/products/${encodeURIComponent(product.id)}?catalog=${encodeURIComponent(product.audience || selectedAudience)}`;
  };

  const openLookPreview = () => {
    sessionStorage.setItem("veyraaLookPreview", JSON.stringify(Object.values(completeLook).filter(Boolean)));
    window.location.href = "/look-preview";
  };

  const selectLookProduct = (product) => {
    setLookSelections((current) => ({ ...current, [selectorRole]: product }));
    setSelectorRole(null);
  };

  const assistPrompts = {
    "What should I wear for a wedding?": {
      label: "Wedding",
      text: "Elegant festive styling with refined traditional silhouettes and statement accessories.",
      filter: (product) => /saree|lehenga|ethnic|festive|silk|bridal|party|frock/i.test(productText(product)),
    },
    "Find something for a casual day out": {
      label: "Casual Day Out",
      text: "Easy, polished layers in breathable fabrics for an effortless day out.",
      filter: (product) => /casual|cotton|t-shirt|jeans|denim|shirt/i.test(productText(product)),
    },
    "Suggest an outfit for college": {
      label: "College",
      text: "Comfort-first casual pieces with an expressive, youthful finish.",
      filter: (product) => /casual|t-shirt|jeans|denim|shirt|sneaker/i.test(productText(product)),
    },
    "Help me complete this look": {
      label: "Complete My Look",
      text: `Your current look pairs ${completeLook.top?.name || "a top"} with ${completeLook.bottom?.name || "a bottom"}, ${completeLook.footwear?.name || "footwear"}${completeLook.accessory ? ` and ${completeLook.accessory.name}` : ""}.`,
      filter: () => true,
    },
  };

  const matchingSearchProducts = searchTerm.trim()
    ? allProducts.filter((product) => productText(product).includes(searchTerm.trim().toLowerCase())).slice(0, 8)
    : [];

  const matchingAssistProducts = assistResult
    ? recommendationPool.filter(assistResult.filter).slice(0, 3)
    : [];

  const promptSuggestions = [
    "What should I wear for a wedding?",
    "Find something for a casual day out",
    "Suggest an outfit for college",
    "Help me complete this look",
  ];

  return (
    <div className="befitting-style-page">
      <Navbar />

      {searchOpen && (
        <div className="befitting-overlay" role="presentation" onClick={() => setSearchOpen(false)}>
          <section className="befitting-search-dialog" role="dialog" aria-modal="true" aria-label="Search Veyraa fashion" onClick={(event) => event.stopPropagation()}>
            <div className="overlay-heading">
              <div>
                <span className="eyebrow">VEYRAA SEARCH</span>
                <h2>Find your next look</h2>
              </div>
              <button type="button" className="overlay-close" onClick={() => setSearchOpen(false)} aria-label="Close search">×</button>
            </div>
            <input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search lehenga, kurti, jeans, wedding..." />
            <div className="search-results">
              {matchingSearchProducts.map((product) => (
                <button type="button" key={`${product.audience}-${product.id}`} className="search-result" onClick={() => openProduct({ ...product, image: resolveCatalogImage(product) })}>
                  <img src={resolveCatalogImage(product)} alt={product.name} />
                  <span><strong>{product.name}</strong><small>{product.category || product.type} · ₹{product.price}</small></span>
                </button>
              ))}
              {searchTerm && !matchingSearchProducts.length && <p className="empty-search">No matching styles yet. Try a product, category or occasion.</p>}
            </div>
          </section>
        </div>
      )}

      <section className="befitting-hero">
        <div className="befitting-hero-overlay">
          <div className="befitting-hero-copy">
            <span className="eyebrow">PERSONALIZED STYLE DESTINATION</span>
            <h1>BEFITTING YOUR STYLE</h1>
            <p>Discover fashion that fits your style, your occasion, and your way.</p>

            <div className="hero-actions">
              <button type="button" className="primary-btn" onClick={() => document.getElementById("style-profile")?.scrollIntoView({ behavior: "smooth" })}>
                Discover My Style →
              </button>
              <button type="button" className="secondary-btn" onClick={() => document.getElementById("fit-profile")?.scrollIntoView({ behavior: "smooth" })}>
                Explore My Fit
              </button>
            </div>
          </div>

          <div className="hero-badge-card">
            <span>Signature Fit Blend</span>
            <strong>92% Match</strong>
            <small>Elegant + Contemporary</small>
          </div>
        </div>
      </section>

      <section className="style-profile" id="style-profile">
        <div className="section-heading center">
          <span className="eyebrow">BUILD YOUR STYLE PROFILE</span>
          <h2>Your Style, Your Way</h2>
          <p>Tell us a little about yourself and we&apos;ll help you discover styles made for you.</p>
        </div>

        <div className="profile-steps">
          <div className="step-card">
            <div className="step-head">
              <span>STEP 1</span>
              <h3>Who are you shopping for?</h3>
            </div>
            <div className="choice-pills">
              {audienceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={selectedAudience === option ? "pill active" : "pill"}
                  onClick={() => setSelectedAudience(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="step-card">
            <div className="step-head">
              <span>STEP 2</span>
              <h3>Your Style</h3>
            </div>
            <div className="choice-pills multi-select">
              {styleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={selectedStyles.includes(option) ? "pill active" : "pill"}
                  onClick={() => toggleSelection(option, selectedStyles, setSelectedStyles)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="step-card">
            <div className="step-head">
              <span>STEP 3</span>
              <h3>Your Preferred Fit</h3>
            </div>
            <div className="choice-pills">
              {fitOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={selectedFit === option ? "pill active" : "pill"}
                  onClick={() => setSelectedFit(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="step-card">
            <div className="step-head">
              <span>STEP 4</span>
              <h3>Your Color Mood</h3>
            </div>
            <div className="choice-pills multi-select">
              {colorOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={selectedColors.includes(option) ? "pill active" : "pill"}
                  onClick={() => toggleSelection(option, selectedColors, setSelectedColors)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button type="button" className="primary-btn" onClick={() => setProfileCreated(true)}>
            Complete My Style Profile
          </button>
          <span>{profileCreated ? "Profile updated with your current style preferences." : "Build your look to unlock personalized recommendations."}</span>
        </div>
      </section>

      <section className="fit-profile" id="fit-profile">
        <div className="section-heading">
          <span className="eyebrow">FIT PROFILE CHECK</span>
          <h2>Get recommendations based on your measurements and preferred fit.</h2>
        </div>

        <div className="fit-panel">
          <div className="measurements-grid">
            <label>
              <span>Height</span>
              <input type="text" name="height" value={measurements.height} onChange={handleFieldChange} />
            </label>
            <label>
              <span>Weight</span>
              <input type="text" name="weight" value={measurements.weight} onChange={handleFieldChange} />
            </label>
            <label>
              <span>Chest/Bust</span>
              <input type="text" name="bust" value={measurements.bust} onChange={handleFieldChange} />
            </label>
            <label>
              <span>Waist</span>
              <input type="text" name="waist" value={measurements.waist} onChange={handleFieldChange} />
            </label>
            <label>
              <span>Hip</span>
              <input type="text" name="hip" value={measurements.hip} onChange={handleFieldChange} />
            </label>
            <label>
              <span>Preferred fit</span>
              <select value={selectedFit} onChange={(event) => setSelectedFit(event.target.value)}>
                {fitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="fit-panel-actions">
            <button type="button" className="primary-btn" onClick={saveFitProfile}>
              {profileCreated ? "Update My Fit Profile →" : "Create My Fit Profile →"}
            </button>
            <small>Your measurements are used only to improve your fashion recommendations.</small>
          </div>
        </div>
      </section>

      <section className="style-match">
        <div className="section-heading center">
          <span className="eyebrow">STYLE MATCH RESULT</span>
          <h2>Your Style Match</h2>
        </div>

        <div className="match-summary">
          <div className="match-metric">
            <span>STYLE MATCH</span>
            <strong>{Math.round(styleMatch.score)}%</strong>
          </div>
          <div className="match-metric">
            <span>FIT PREFERENCE</span>
            <strong>{styleMatch.fit}</strong>
          </div>
          <div className="match-metric">
            <span>COLOR MOOD</span>
            <strong>{styleMatch.colorMood}</strong>
          </div>
        </div>

 <p className="match-caption">
  Your style profile leans toward {styleMatch.style}, with a{" "}
  {String(selectedVibe || "Everyday Chic").toLowerCase()} direction for{" "}
  {String(selectedOccasion || "Casual Day Out").toLowerCase()}.
</p>

        <div className="match-grid">
          {recommendedProducts.slice(0, 4).map((product) => (
            <article className="product-card" key={product.id || product.name}>
              <div className="product-image-wrap">
                <button type="button" className="product-image-button" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} /></button>
                <button
                  type="button"
                  className={wishlistIds.includes(product.id || product.name) ? "wishlist-btn active" : "wishlist-btn"}
                  onClick={() => toggleWishlist(product)}
                  aria-label={`Wishlist ${product.name}`}
                >
                  ♡
                </button>
              </div>
              <div className="product-body">
                <div className="product-meta">
                  <span>{product.category || product.type}</span>
                  <span className="discount-tag">-{getDiscountPercent(product)}%</span>
                </div>
                <button type="button" className="product-name-button" onClick={() => openProduct(product)}>{product.name}</button>
                <div className="price-row">
                  <span className="current-price">₹{product.price}</span>
                  <span className="original-price">₹{product.oldPrice || product.originalPrice || product.price}</span>
                </div>
                <div className="shop-actions">
                  <button type="button" onClick={() => toggleWishlist(product)}>♡ Wishlist</button>
                  <VirtualTryOn product={{ ...product, image: resolveCatalogImage(product) }} />
                  <button type="button" onClick={() => addToCart(product)}>Add to Cart</button>
                  <button type="button" className="buy-button" onClick={() => buyNow(product)}>Buy Now</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="made-for-you">
        <div className="section-heading">
          <span className="eyebrow">MADE FOR YOU</span>
          <h2>Made For You</h2>
        </div>

        <div className="product-grid">
          {recommendedProducts.map((product) => (
            <article className="product-card" key={product.id || product.name}>
              <div className="product-image-wrap">
                <button type="button" className="product-image-button" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} /></button>
                <button
                  type="button"
                  className={wishlistIds.includes(product.id || product.name) ? "wishlist-btn active" : "wishlist-btn"}
                  onClick={() => toggleWishlist(product)}
                  aria-label={`Wishlist ${product.name}`}
                >
                  ♡
                </button>
              </div>
              <div className="product-body">
                <div className="product-meta">
                  <span>{product.category || product.type}</span>
                  <span className="discount-tag">-{getDiscountPercent(product)}%</span>
                </div>
                <button type="button" className="product-name-button" onClick={() => openProduct(product)}>{product.name}</button>
                <div className="price-row">
                  <span className="current-price">₹{product.price}</span>
                  <span className="original-price">₹{product.oldPrice || product.originalPrice || product.price}</span>
                </div>
                <div className="shop-actions">
                  <button type="button" onClick={() => toggleWishlist(product)}>♡ Wishlist</button>
                  <VirtualTryOn product={{ ...product, image: resolveCatalogImage(product) }} />
                  <button type="button" onClick={() => addToCart(product)}>Add to Cart</button>
                  <button type="button" className="buy-button" onClick={() => buyNow(product)}>Buy Now</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="complete-look">
        <div className="section-heading">
          <span className="eyebrow">COMPLETE MY LOOK</span>
          <h2>Complete My Look</h2>
        </div>

        <div className="look-builder">
          <div className="look-items">
            <div className="look-item">
              <span>TOP</span>
              <img src={resolveCatalogImage(completeLook.top || {})} alt={completeLook.top?.name || "Top"} />
              <strong>{completeLook.top?.name || "Top"}</strong>
            </div>
            <div className="look-plus">+</div>
            <div className="look-item">
              <span>BOTTOM</span>
              <img src={resolveCatalogImage(completeLook.bottom || {})} alt={completeLook.bottom?.name || "Bottom"} />
              <strong>{completeLook.bottom?.name || "Bottom"}</strong>
            </div>
            <div className="look-plus">+</div>
            <div className="look-item">
              <span>FOOTWEAR</span>
              {completeLook.footwear ? <img src={resolveCatalogImage(completeLook.footwear)} alt={completeLook.footwear.name} /> : <div className="look-empty">Optional</div>}
              <strong>{completeLook.footwear?.name || "Footwear / Slippers"}</strong>
            </div>
            <div className="look-plus">+</div>
            <div className="look-item">
              <span>ACCESSORY</span>
              {completeLook.accessory ? <img src={resolveCatalogImage(completeLook.accessory)} alt={completeLook.accessory.name} /> : <div className="look-empty">Optional</div>}
              <strong>{completeLook.accessory?.name || "Optional Accessory"}</strong>
            </div>
          </div>

          <div className="look-buttons">
            <button type="button" onClick={() => setSelectorRole("top")}>
              Change Top
            </button>
            <button type="button" onClick={() => setSelectorRole("bottom")}>
              Change Bottom
            </button>
            <button type="button" onClick={() => setSelectorRole("footwear")}>
              Change Footwear
            </button>
            <button type="button" onClick={() => setSelectorRole("accessory")}>
              Change Accessory
            </button>
          </div>

<div className="look-totals">

  <div className="look-total selected-total">
    <span>BUY SEPARATELY</span>
    <strong>₹5,000</strong>
  </div>

  <div className="look-total complete-total">
    <span>BUY COMPLETE LOOK</span>
    <strong>₹4,000</strong>
  </div>

</div>
          <div className="look-purchase-actions">
            <button type="button" className="secondary-btn" disabled={!selectedLook.length} onClick={() => buyProducts(selectedLook)}>
              Buy Selected Items →
            </button>
            <button type="button" className="primary-btn shop-look-btn" onClick={() => buyProducts(Object.values(completeLook).filter(Boolean))}>
              Buy Complete Look →
            </button>
            <button type="button" className="secondary-btn" onClick={openLookPreview}>
              Preview Full Look
            </button>
          </div>
        </div>
      </section>

      <section className="style-vibes">
        <div className="section-heading center">
          <span className="eyebrow">STYLE VIBES</span>
          <h2>Pick Your Vibe</h2>
        </div>

        <div className="vibe-grid">
          {vibeOptions.map((vibe) => (
            <button
              key={vibe.name}
              type="button"
              className={selectedVibe === vibe.name ? "vibe-card active" : "vibe-card"}
              onClick={() => applyVibe(vibe.name)}
            >
              <span className="vibe-emoji">{vibe.emoji}</span>
              <strong>{vibe.name}</strong>
              <small>{vibe.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="occasion-styling">
        <div className="section-heading center">
          <span className="eyebrow">OCCASION STYLING</span>
          <h2>What are you dressing for?</h2>
        </div>

        <div className="occasion-grid">
          {occasionOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={selectedOccasion === option ? "occasion-card active" : "occasion-card"}
              onClick={() => setSelectedOccasion(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="occasion-results">
          {occasionProducts.map((product) => (
            <article className="mini-product" key={product.id || product.name}>
              <img src={product.image} alt={product.name} />
              <div>
                <span>{product.category || product.type}</span>
                <h3>{product.name}</h3>
                <strong>₹{product.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="style-assistant">
        <div className="assistant-copy">
          <span className="eyebrow">VEYRAA STYLE ASSIST</span>
          <h2>Not sure what to wear? Let your style profile guide you.</h2>
        </div>

        <div className="assistant-panel">
          <div className="prompt-stack">
            {promptSuggestions.map((prompt) => (
              <button key={prompt} type="button" className={assistPrompt === prompt ? "prompt-btn active" : "prompt-btn"} onClick={() => setAssistPrompt(prompt)}>
                {prompt}
              </button>
            ))}
          </div>



          <div className="assistant-response">
            <div className="assistant-header">
              <span>AI Styling Guide</span>
              <strong>{assistResult?.label || selectedOccasion}</strong>
            </div>
            <p>
{assistResult?.text ||
  `Based on your ${selectedAudience || "All"} profile, ${String(
    selectedFit || "Regular"
  ).toLowerCase()} fit and ${String(
    selectedVibe || "Everyday Chic"
  ).toLowerCase()} mood, we suggest a refined look with soft layers, elegant tailoring and a fresh color pairing.`}
            </p>
            <button type="button" className="primary-btn" onClick={() => setAssistResult(assistPrompts[assistPrompt] || assistPrompts["Help me complete this look"])}>
              Get Style Suggestions →
            </button>
            {matchingAssistProducts.length > 0 && <div className="assistant-products">{matchingAssistProducts.map((product) => <button type="button" key={`${product.audience}-${product.id}`} onClick={() => openProduct(product)}><img src={product.image} alt={product.name} /><span>{product.name}</span></button>)}</div>}
          </div>
        </div>
      </section>

      <section className="style-journey">
        <div className="section-heading center">
          <span className="eyebrow">STYLE JOURNEY</span>
          <h2>Discover your signature style in 6 steps.</h2>
        </div>

        <div className="journey-track">
          <div className="journey-step">
            <span>DISCOVER</span>
          </div>
          <div className="journey-arrow">↓</div>
          <div className="journey-step">
            <span>DEFINE YOUR STYLE</span>
          </div>
          <div className="journey-arrow">↓</div>
          <div className="journey-step">
            <span>CHECK YOUR FIT</span>
          </div>
          <div className="journey-arrow">↓</div>
          <div className="journey-step">
            <span>GET PERSONALIZED PICKS</span>
          </div>
          <div className="journey-arrow">↓</div>
          <div className="journey-step">
            <span>TRY IT ON</span>
          </div>
          <div className="journey-arrow">↓</div>
          <div className="journey-step">
            <span>SHOP YOUR LOOK</span>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <span className="eyebrow">YOUR STYLE. YOUR FIT. YOUR VEYRAA.</span>
        <h2>Because fashion feels better when it feels like you.</h2>
        <div className="final-actions">
          <button type="button" className="primary-btn" onClick={() => document.getElementById("style-profile")?.scrollIntoView({ behavior: "smooth" })}>
            Build My Style Profile
          </button>
          <button type="button" className="secondary-btn" onClick={() => window.location.href = "/women"}>
            Explore Fashion
          </button>
        </div>
      </section>

      <Footer />

      {selectorRole && (
        <div className="befitting-overlay" role="presentation" onClick={() => setSelectorRole(null)}>
          <section className="look-selector-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="overlay-heading">
              <div><span className="eyebrow">COMPLETE THE LOOK</span><h2>Choose a {selectorRole}</h2></div>
              <button type="button" className="overlay-close" onClick={() => setSelectorRole(null)} aria-label="Close selector">×</button>
            </div>
            <div className="selector-grid">
              {getRoleProducts(recommendationPool, selectorRole).slice(0, 12).map((product) => (
                <button type="button" key={`${product.audience}-${product.id}`} className="selector-product" onClick={() => selectLookProduct(product)}>
                  <img src={product.image} alt={product.name} /><strong>{product.name}</strong><span>₹{product.price}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default BefittingStylePage;
