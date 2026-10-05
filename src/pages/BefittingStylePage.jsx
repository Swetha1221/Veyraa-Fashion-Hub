import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const explicitAudience = String(product?.audience || "").trim().toLowerCase();

  if (audience === "Women") {
    return explicitAudience === "women";
  }

  if (audience === "Men") {
    return explicitAudience === "men";
  }

  return (
    explicitAudience === "kids" ||
    explicitAudience === "girls" ||
    explicitAudience === "boys"
  );
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

function getComboPrice(total, itemCount) {
  if (!total || itemCount < 2) return total;
  const discountRate = itemCount >= 4 ? 0.20 : 0.16;
  return Math.max(0, Math.round((total * (1 - discountRate)) / 100) * 100);
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
  const [occasionPreview, setOccasionPreview] = useState(null);
  const [occasionPreviewSize, setOccasionPreviewSize] = useState("M");
  const previewSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I’m your Veyraa Style Assistant. Tell me what you’re looking for — you can type it or use the microphone.",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
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
    const keywordMap = {
      Wedding: ["saree", "lehenga", "bridal", "silk", "ethnic", "traditional", "party"],
      Festival: ["festive", "silk", "ethnic", "saree", "kurti", "salwar", "lehenga", "kurta"],
      Office: ["shirt", "blazer", "trouser", "formal", "office", "kurti", "dress", "top"],
      College: ["t-shirt", "tee", "jeans", "casual", "denim", "sneaker", "top"],
      Party: ["dress", "frock", "party", "silk", "heels", "handbag", "top"],
      "Date Night": ["dress", "silk", "top", "heels", "bag"],
      Vacation: ["cotton", "dress", "shirt", "denim", "casual", "sandal"],
      "Casual Day Out": ["t-shirt", "tee", "casual", "cotton", "jeans", "denim", "shirt", "kurti"],
    };

    const keywords = keywordMap[selectedOccasion] || keywordMap["Casual Day Out"];
    const ranked = [...recommendationPool].sort((a, b) => {
      const score = (product) => {
        const text = productText(product);
        return keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 1 : 0), 0);
      };
      return score(b) - score(a);
    });

    return ranked.slice(0, 4);
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
    const hasAnchorProduct = Object.values(lookSelections).some(Boolean);

    if (!hasAnchorProduct) {
      return { top: null, bottom: null, footwear: null, accessory: null };
    }

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

    const chosenTop = lookSelections.top || topChoices[0] || null;
    const chosenBottom = lookSelections.bottom || bottomChoices.find((item) => item.id !== chosenTop?.id) || bottomChoices[0] || null;
    const chosenFootwear = lookSelections.footwear || footwearChoices[0] || null;
    const chosenAccessory = lookSelections.accessory || accessoryChoices[0] || null;

    return {
      top: chosenTop,
      bottom: chosenBottom,
      footwear: chosenFootwear,
      accessory: chosenAccessory,
    };
  }, [lookSelections, recommendationPool, selectedColors, selectedFit, selectedOccasion, selectedStyles, selectedVibeData]);

  const selectedLook = useMemo(
    () => Object.values(lookSelections).filter(Boolean),
    [lookSelections]
  );

  const completeLookProducts = useMemo(
    () => Object.values(completeLook).filter(Boolean),
    [completeLook]
  );
  const separateLookTotal = getLookTotal(completeLookProducts);
  const comboLookPrice = getComboPrice(separateLookTotal, completeLookProducts.length);
  const comboSavings = Math.max(0, separateLookTotal - comboLookPrice);

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

  const openOccasionPreview = (product) => {
    if (!product) return;
    setOccasionPreview(product);
    setOccasionPreviewSize("M");
  };

  const openLookPreview = () => {
    sessionStorage.setItem("veyraaLookPreview", JSON.stringify(Object.values(completeLook).filter(Boolean)));
    window.location.href = "/look-preview";
  };

  const selectLookProduct = (product) => {
    if (!product || !selectorRole) return;
    setLookSelections((current) => ({ ...current, [selectorRole]: product }));
    setSelectorRole(null);
  };

  const buildAssistantReply = (question) => {
    const q = String(question || "").trim().toLowerCase();
    const profile = `${selectedAudience} ${selectedStyles.join(" ")} ${selectedColors.join(" ")} ${selectedFit} ${selectedVibe} ${selectedOccasion}`;
    const pool = recommendationPool;

    let text = "";
    let filter = () => true;

    if (/wedding|marriage|bridal|reception/.test(q)) {
      text = `For your ${selectedAudience} profile, I’d build a wedding look around ${selectedVibe.toLowerCase()} styling. I’d start with an elegant statement piece and finish it with coordinated accessories.`;
      filter = (product) => /saree|lehenga|silk|ethnic|traditional|dress|party|jewellery|jewelry/i.test(productText(product));
    } else if (/festival|diwali|pongal|onam|celebration|festive/.test(q)) {
      text = `For a festival, I’d lean into ${selectedColors.join(" + ").toLowerCase()} tones with a traditional silhouette that still feels easy to wear.`;
      filter = (product) => /saree|kurti|salwar|lehenga|kurta|silk|festive|ethnic|traditional/i.test(productText(product));
    } else if (/college|campus|university/.test(q)) {
      text = `For college, I’d keep it comfortable and expressive: ${selectedFit.toLowerCase()} fits, easy layers and pieces that work across the day.`;
      filter = (product) => /t-shirt|tee|jeans|denim|shirt|casual|sneaker|top|trouser/i.test(productText(product));
    } else if (/office|work|meeting|interview/.test(q)) {
      text = `For work, I’d keep your ${selectedVibe.toLowerCase()} direction polished with clean tailoring and versatile colors.`;
      filter = (product) => /shirt|blazer|trouser|formal|office|kurti|dress|top/i.test(productText(product));
    } else if (/casual|day out|weekend|outing/.test(q)) {
      text = `For a casual day out, I’d keep the look relaxed but intentional — easy separates with one polished detail.`;
      filter = (product) => /casual|cotton|t-shirt|tee|jeans|denim|shirt|top|sneaker/i.test(productText(product));
    } else if (/party|date|evening|night/.test(q)) {
      text = `For an evening look, I’d make one piece the focus and keep the rest coordinated around it.`;
      filter = (product) => /dress|top|silk|party|elegant|heels|heel|bag|handbag/i.test(productText(product));
    } else if (/under|budget|cheap|affordable|price/.test(q)) {
      text = `I’ll keep the recommendation practical and prioritize pieces with a strong value-to-style balance from your selected ${selectedAudience} collection.`;
      filter = (product) => Number(product?.price || 0) <= 2500;
    } else if (/with this|complete|pair|match|go with/.test(q)) {
      text = `Let’s build around your current look. I’ll suggest pieces that complement the ${selectedVibe.toLowerCase()} direction and your ${selectedFit.toLowerCase()} fit preference.`;
      filter = (product) => /jeans|trouser|skirt|top|shirt|kurti|saree|bag|handbag|shoe|sneaker|heel|belt|watch|jewellery|jewelry/i.test(productText(product));
    } else {
      text = `Absolutely. I can help you choose what to wear, find a product, match an outfit, or style you for a specific occasion. Based on your ${selectedAudience} profile and ${selectedVibe.toLowerCase()} direction, I’d keep the look aligned with your ${selectedFit.toLowerCase()} fit preference.`;
    }

    const productsForReply = pool.filter(filter).slice(0, 3);
    return {
      text,
      products: productsForReply.length ? productsForReply : pool.slice(0, 3),
      profile,
    };
  };

  const speakAssistantReply = (text) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const sendAssistantMessage = (rawText) => {
    const text = String(rawText || "").trim();
    if (!text) return;

    const reply = buildAssistantReply(text);

    setAssistantMessages((current) => [
      ...current,
      { role: "user", text },
      {
        role: "assistant",
        text: reply.text,
        products: reply.products,
      },
    ]);
    setAssistantInput("");
    speakAssistantReply(reply.text);
  };

  const startAssistantVoice = () => {
    if (typeof window === "undefined") return;

    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      const message =
        "Voice input is not available in this browser. Please use Google Chrome or Microsoft Edge, or type your question below.";
      setAssistantMessages((current) => [
        ...current,
        { role: "assistant", text: message },
      ]);
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
      setAssistantMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I couldn’t hear that clearly. Please try the microphone again or type your question.",
        },
      ]);
    };
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setAssistantInput(transcript);
      sendAssistantMessage(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const quickAssistantPrompt = (text) => {
    setAssistantInput(text);
    sendAssistantMessage(text);
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="befitting-style-page">
      <Navbar />


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
        <div className="section-heading center">
          <span className="eyebrow">SMART LOOK COMPOSER</span>
          <h2>Complete My Look</h2>
          <p>Start with one piece. Veyraa will style the rest into a polished look — with a little extra value for choosing the full edit.</p>
        </div>

        <div className={`look-builder ${completeLookProducts.length ? "has-look" : "empty-look"}`}>
          {!completeLookProducts.length ? (
            <div className="look-start-panel">
              <div className="look-start-copy">
                <span className="look-kicker">YOUR LOOK, YOUR WAY</span>
                <h3>Pick one piece and let Veyraa finish the story.</h3>
                <p>Choose a top, bottom, footwear or accessory. We&apos;ll instantly curate the missing pieces around your choice.</p>
              </div>

              <div className="look-start-grid">
                {[
                  ["top", "TOP", "Start with a top", "＋"],
                  ["bottom", "BOTTOM", "Start with a bottom", "＋"],
                  ["footwear", "FOOTWEAR", "Add a finishing step", "＋"],
                  ["accessory", "ACCESSORY", "Add your signature", "＋"],
                ].map(([role, label, copy, icon]) => (
                  <button
                    type="button"
                    key={role}
                    className="look-start-card"
                    onClick={() => setSelectorRole(role)}
                  >
                    <span className="look-start-label">{label}</span>
                    <span className="look-start-icon">{icon}</span>
                    <strong>{copy}</strong>
                    <small>Tap to explore curated picks →</small>
                  </button>
                ))}
              </div>

              <div className="look-start-note">
                <span>✦</span>
                <p><strong>One choice is enough.</strong> We&apos;ll build the rest around it.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="look-builder-head">
                <div>
                  <span className="look-kicker">YOUR CURATED EDIT</span>
                  <h3>Styled around your choice.</h3>
                  <p>Don&apos;t love a piece? Swap it anytime — your look updates instantly.</p>
                </div>
                <div className="look-save-badge">
                  <span>SMART COMBO</span>
                  <strong>Save ₹{comboSavings.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="look-items">
                {[
                  ["top", "TOP"],
                  ["bottom", "BOTTOM"],
                  ["footwear", "FOOTWEAR"],
                  ["accessory", "ACCESSORY"],
                ].map(([role, label], index) => {
                  const product = completeLook[role];
                  return (
                    <React.Fragment key={role}>
                      {index > 0 && <div className="look-plus">+</div>}
                      <div className="look-item">
                        <span>{label}</span>
                        {product ? (
                          <button
                            type="button"
                            className="look-product-preview-trigger"
                            onClick={() => openOccasionPreview(product)}
                            aria-label={`Preview ${product.name}`}
                          >
                            <img src={resolveCatalogImage(product)} alt={product.name} />
                            <strong>{product.name}</strong>
                          </button>
                        ) : (
                          <button type="button" className="look-empty" onClick={() => setSelectorRole(role)}>
                            <span>＋</span>
                            <small>Add {label.toLowerCase()}</small>
                          </button>
                        )}
                        <button type="button" className="look-change-btn" onClick={() => setSelectorRole(role)}>
                          Change {label.toLowerCase()} →
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="look-offer-banner">
                <div>
                  <span className="look-offer-kicker">A LITTLE MORE STYLE. A LOT MORE VALUE.</span>
                  <h3>Complete the edit &amp; unlock your combo price.</h3>
                  <p>Buy separately: <strong>₹{separateLookTotal.toLocaleString("en-IN")}</strong></p>
                </div>
                <div className="look-offer-price">
                  <span>CURATED COMBO</span>
                  <strong>₹{comboLookPrice.toLocaleString("en-IN")}</strong>
                  <small>You save ₹{comboSavings.toLocaleString("en-IN")}</small>
                </div>
              </div>

              <div className="look-purchase-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  disabled={!selectedLook.length}
                  onClick={() => buyProducts(selectedLook)}
                >
                  Buy My Selection →
                </button>
                <button
                  type="button"
                  className="primary-btn shop-look-btn"
                  onClick={() => buyProducts(completeLookProducts)}
                >
                  Unlock Complete Look · ₹{comboLookPrice.toLocaleString("en-IN")}
                </button>
                <button type="button" className="secondary-btn" onClick={openLookPreview}>
                  Preview Full Look
                </button>
              </div>
            </>
          )}
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
            <button
              type="button"
              className="mini-product"
              key={product.id || product.name}
              onClick={() => openOccasionPreview(product)}
            >
              <img src={product.image} alt={product.name} />
              <div>
                <span>{product.category || product.type}</span>
                <h3>{product.name}</h3>
                <strong>₹{product.price}</strong>
                <small>View preview →</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="style-assistant">
        <div className="assistant-copy">
          <span className="eyebrow">VEYRAA STYLE ASSISTANT</span>
          <h2>Your personal fashion concierge.</h2>
          <p>Ask naturally. Type it, speak it, or ask Veyraa to style something for you.</p>
        </div>

        <div className="assistant-panel">
          <div className="assistant-brand">
            <div className="assistant-avatar">✦</div>
            <div>
              <strong>Veyraa AI</strong>
              <span><i /> Online · Personal Style Assistant</span>
            </div>
            <button
              type="button"
              className={isSpeaking ? "assistant-stop-speech active" : "assistant-stop-speech"}
              onClick={() => {
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(false);
              }}
              disabled={!isSpeaking}
            >
              {isSpeaking ? "Stop voice" : "Voice ready"}
            </button>
          </div>

          <div className="assistant-chat">
            {assistantMessages.map((message, index) => (
              <div
                className={`assistant-message ${message.role === "user" ? "user" : "ai"}`}
                key={`${message.role}-${index}`}
              >
                <div className="assistant-bubble">
                  <p>{message.text}</p>
                  {message.role === "assistant" && (
                    <button
                      type="button"
                      className="speak-message"
                      onClick={() => speakAssistantReply(message.text)}
                    >
                      🔊 Listen
                    </button>
                  )}
                </div>

                {message.role === "assistant" && message.products?.length > 0 && (
                  <div className="assistant-products">
                    {message.products.map((product) => (
                      <button
                        type="button"
                        key={`${product.audience}-${product.id || product.name}`}
                        onClick={() => openProduct(product)}
                      >
                        <img src={product.image} alt={product.name} />
                        <span>{product.name}</span>
                        <strong>₹{product.price}</strong>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="assistant-quick-actions">
            <button type="button" onClick={() => quickAssistantPrompt("What should I wear for a wedding?")}>
              Wedding edit
            </button>
            <button type="button" onClick={() => quickAssistantPrompt("Show me something for a festival")}>
              Festival edit
            </button>
            <button type="button" onClick={() => quickAssistantPrompt("What can I wear for a casual day out?")}>
              Casual edit
            </button>
          </div>

          <form
            className="assistant-composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendAssistantMessage(assistantInput);
            }}
          >
            <button
              type="button"
              className={isListening ? "assistant-mic listening" : "assistant-mic"}
              onClick={startAssistantVoice}
              aria-label="Speak to Veyraa AI"
              title="Speak to Veyraa AI"
            >
              {isListening ? "●" : "🎙"}
            </button>

            <input
              value={assistantInput}
              onChange={(event) => setAssistantInput(event.target.value)}
              placeholder="Ask Veyraa anything… e.g. What will suit me for a wedding?"
              aria-label="Ask Veyraa Style Assistant"
            />

            <button type="submit" className="assistant-send" aria-label="Send">
              →
            </button>
          </form>

          <small className="assistant-note">
            {isListening
              ? "Listening… speak naturally."
              : "Tip: Chrome and Edge support voice input. Your browser may ask for microphone permission the first time."}
          </small>
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

      {occasionPreview && (
        <div
          className="befitting-overlay"
          role="presentation"
          onClick={() => setOccasionPreview(null)}
        >
          <section
            className="occasion-preview-dialog"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="overlay-close"
              onClick={() => setOccasionPreview(null)}
              aria-label="Close product preview"
            >
              ×
            </button>

            <div className="occasion-preview-image">
              <img src={occasionPreview.image} alt={occasionPreview.name} />
            </div>

            <div className="occasion-preview-content">
              <span className="preview-category">{occasionPreview.category || occasionPreview.type}</span>
              <h2>{occasionPreview.name}</h2>
              <div className="preview-price-row">
                <strong>₹{occasionPreview.price}</strong>
                {(occasionPreview.oldPrice || occasionPreview.originalPrice) && (
                  <del>₹{occasionPreview.oldPrice || occasionPreview.originalPrice}</del>
                )}
              </div>
              <p>
                A Veyraa pick for your {selectedOccasion.toLowerCase()} edit,
                selected for your {selectedAudience.toLowerCase()} profile.
              </p>

              <div className="preview-fit-note">
                <span>✓</span>
                <div>
                  <strong>Find your perfect fit</strong>
                  <small>Choose your size before adding this piece to your look.</small>
                </div>
              </div>

              <div className="preview-size-block">
                <div>
                  <strong>Select size</strong>
                  <button type="button" onClick={() => openProduct(occasionPreview)}>Size guide →</button>
                </div>
                <div className="preview-size-options">
                  {previewSizes.map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={occasionPreviewSize === size ? "active" : ""}
                      onClick={() => setOccasionPreviewSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="occasion-preview-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => toggleWishlist(occasionPreview)}
                >
                  ♡ Wishlist
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => addToCart({ ...occasionPreview, selectedSize: occasionPreviewSize })}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => buyNow({ ...occasionPreview, selectedSize: occasionPreviewSize })}
                >
                  Buy Now →
                </button>
              </div>

              <button
                type="button"
                className="preview-full-product"
                onClick={() => openProduct(occasionPreview)}
              >
                View full product details, sizes &amp; fit →
              </button>
            </div>
          </section>
        </div>
      )}

      {selectorRole && (
        <div className="befitting-overlay" role="presentation" onClick={() => setSelectorRole(null)}>
          <section className="look-selector-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="overlay-heading">
              <div><span className="eyebrow">COMPLETE THE LOOK</span><h2>Choose a {selectorRole}</h2></div>
              <button type="button" className="overlay-close" onClick={() => setSelectorRole(null)} aria-label="Close selector">×</button>
            </div>
            <div className="selector-grid">
              {getRoleProducts(recommendationPool, selectorRole).slice(0, 12).map((product) => (
                <article
                  key={`${product.audience}-${product.id}`}
                  className="selector-product"
                >
                  <button
                    type="button"
                    className="selector-product-main"
                    onClick={() => openOccasionPreview(product)}
                    aria-label={`Preview ${product.name}`}
                  >
                    <img src={product.image} alt={product.name} />
                    <span className="selector-product-type">{product.category || product.type}</span>
                    <strong>{product.name}</strong>
                    <span className="selector-product-price">₹{product.price}</span>
                  </button>
                  <button
                    type="button"
                    className="selector-select-btn"
                    onClick={() => selectLookProduct(product)}
                  >
                    Use this piece →
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default BefittingStylePage;
