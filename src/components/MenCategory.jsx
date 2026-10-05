import React, { useEffect, useMemo, useState } from "react";
import "./MenCategory.css";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { usePathname } from "../routing";

const productCategories = {
  shirts: ["Shirts", /\bshirt\b/i],
  kurtas: ["Kurtas", /\bkurta\b/i],
  sherwanis: ["Sherwanis", /\bsherwani\b/i],
  blazers: ["Blazers", /\bblazer\b/i],
};

const categories = [
  "All", "Western Wear", "Indian Wear", "Ethnic Wear", "Formal Wear",
  "Casual Wear", "Sportswear", "Nightwear", "Footwear", "Accessories",
];

export const products = [
  // WESTERN WEAR - 4
  {
    id: "men001",
    name: "Classic Cotton T-Shirt",
    category: "Western Wear",
    material: "Cotton",
    colour: "Black",
    price: 699,
    oldPrice: 999,
    rating: 4.5,
    reviews: 128,
    badge: "BESTSELLER",
    image: "/men/tshirt.jpg",
  },
  {
    id: "men002",
    name: "Premium Denim Jacket",
    category: "Western Wear",
    material: "Denim",
    colour: "Blue",
    price: 1499,
    oldPrice: 2199,
    rating: 4.6,
    reviews: 96,
    badge: "TRENDING",
    image: "/men/denim.jpg",
  },
  {
    id: "men003",
    name: "Oversized Graphic T-Shirt",
    category: "Western Wear",
    material: "Cotton",
    colour: "Black",
    price: 799,
    oldPrice: 1199,
    rating: 4.4,
    reviews: 84,
    badge: "NEW",
    image: "/men/graphic.jpg",
  },
  {
    id: "men004",
    name: "Casual Denim Shirt",
    category: "Western Wear",
    material: "Denim",
    colour: "Blue",
    price: 1099,
    oldPrice: 1599,
    rating: 4.5,
    reviews: 72,
    badge: "POPULAR",
    image: "/men/denimshirt.jpg",
  },

  // INDIAN WEAR - 3
  {
    id: "men005",
    name: "Classic Cotton Kurta",
    category: "Indian Wear",
    material: "Cotton",
    colour: "Green",
    price: 899,
    oldPrice: 1299,
    rating: 4.7,
    reviews: 145,
    badge: "BESTSELLER",
    image: "/men/indiankurta.jpg",
  },
  {
    id: "men006",
    name: "Premium Kurta Set",
    category: "Indian Wear",
    material: "Cotton Blend",
    colour: "Grey",
    price: 1399,
    oldPrice: 1999,
    rating: 4.6,
    reviews: 112,
    badge: "TRENDING",
    image: "/men/kurtaset.jpg",
  },
  {
    id: "men007",
    name: "Classic Nehru Jacket",
    category: "Indian Wear",
    material: "Silk Blend",
    colour: "Beige",
    price: 1599,
    oldPrice: 2299,
    rating: 4.5,
    reviews: 68,
    badge: "PREMIUM",
    image: "/men/nehru.jpg",
  },

  // ETHNIC WEAR - 3
  {
    id: "men008",
    name: "Royal Sherwani",
    category: "Ethnic Wear",
    material: "Silk Blend",
    colour: "Black",
    price: 3999,
    oldPrice: 5499,
    rating: 4.8,
    reviews: 58,
    badge: "PREMIUM",
    image: "/men/shrawani.jpg",
  },
  {
    id: "men009",
    name: "Traditional Dhoti Set",
    category: "Ethnic Wear",
    material: "Cotton",
    colour: "Cream",
    price: 1299,
    oldPrice: 1799,
    rating: 4.6,
    reviews: 74,
    badge: "TRADITIONAL",
    image: "/men/dhoti.jpg",
  },
  {
    id: "men010",
    name: "Embroidered Ethnic Kurta",
    category: "Ethnic Wear",
    material: "Cotton Silk",
    colour: "Cream",
    price: 1199,
    oldPrice: 1699,
    rating: 4.5,
    reviews: 61,
    badge: "NEW",
    image: "/men/dhotii.jpg",
  },

  // FORMAL WEAR - 4
  {
    id: "men011",
    name: "Slim Fit Formal Shirt",
    category: "Formal Wear",
    material: "Cotton Blend",
    colour: "White",
    price: 999,
    oldPrice: 1499,
    rating: 4.5,
    reviews: 134,
    badge: "BESTSELLER",
    image: "/men/formalshirt.jpg",
  },
  {
    id: "men012",
    name: "Tailored Formal Trousers",
    category: "Formal Wear",
    material: "Poly Viscose",
    colour: "Black",
    price: 1199,
    oldPrice: 1699,
    rating: 4.4,
    reviews: 89,
    badge: "OFFICE EDIT",
    image: "/men/trousers.jpg",
  },
  {
    id: "men013",
    name: "Classic Formal Blazer",
    category: "Formal Wear",
    material: "Polyester Blend",
    colour: "Black",
    price: 2499,
    oldPrice: 3499,
    rating: 4.7,
    reviews: 76,
    badge: "PREMIUM",
    image: "/men/blazer.jpg",
  },
  {
    id: "men014",
    name: "Executive Formal Suit",
    category: "Formal Wear",
    material: "Suiting Fabric",
    colour: "Brown",
    price: 3499,
    oldPrice: 4999,
    rating: 4.8,
    reviews: 54,
    badge: "LUXE",
    image: "/men/suit.jpg",
  },


  {
    id: "men016",
    name: "Classic Chino Pants",
    category: "Casual Wear",
    material: "Cotton Stretch",
    colour: "Beige",
    price: 1099,
    oldPrice: 1599,
    rating: 4.6,
    reviews: 93,
    badge: "POPULAR",
    image: "/men/chino pant.jpg",
  },
  {
    id: "men017",
    name: "Classic Polo T-Shirt",
    category: "Casual Wear",
    material: "Cotton Pique",
    colour: "Blue",
    price: 799,
    oldPrice: 1199,
    rating: 4.4,
    reviews: 87,
    badge: "BESTSELLER",
    image: "/men/polo1.jpg",
  },
  {
    id: "men018",
    name: "Regular Fit Jeans",
    category: "Casual Wear",
    material: "Denim",
    colour: "Blue",
    price: 1299,
    oldPrice: 1899,
    rating: 4.6,
    reviews: 116,
    badge: "POPULAR",
    image: "/men/jean1.jpg",
  },

  // SPORTSWEAR - 3
  {
    id: "men019",
    name: "Performance Sports T-Shirt",
    category: "Sportswear",
    material: "Performance Fabric",
    colour: "Black",
    price: 899,
    oldPrice: 1299,
    rating: 4.6,
    reviews: 92,
    badge: "ACTIVE",
    image: "/men/sports1.jpg",
  },
  {
    id: "men020",
    name: "Active Joggers",
    category: "Sportswear",
    material: "Polyester",
    colour: "Black",
    price: 999,
    oldPrice: 1499,
    rating: 4.5,
    reviews: 88,
    badge: "TRENDING",
    image: "/men/jogger1.jpg",
  },
  {
    id: "men021",
    name: "Training Shorts",
    category: "Sportswear",
    material: "Dry Fit",
    colour: "Grey",
    price: 699,
    oldPrice: 999,
    rating: 4.4,
    reviews: 64,
    badge: "NEW",
    image: "/men/sports2.jpg",
  },

  // NIGHTWEAR - 3
  {
    id: "men022",
    name: "Cotton Night Suit",
    category: "Nightwear",
    material: "Cotton",
    colour: "White",
    price: 999,
    oldPrice: 1399,
    rating: 4.6,
    reviews: 83,
    badge: "COMFORT",
    image: "/men/nightsuit1.jpg",
  },
  {
    id: "men023",
    name: "Comfort Lounge Pyjama",
    category: "Nightwear",
    material: "Cotton",
    colour: "Lavender",
    price: 799,
    oldPrice: 1199,
    rating: 4.5,
    reviews: 71,
    badge: "SOFT",
    image: "/men/lounge1.jpg",
  },
  {
    id: "men024",
    name: "Sleep T-Shirt & Shorts Set",
    category: "Nightwear",
    material: "Cotton",
    colour: "Grey",
    price: 899,
    oldPrice: 1299,
    rating: 4.6,
    reviews: 69,
    badge: "POPULAR",
    image: "/men/sleepwear1.jpg",
  },

  // FOOTWEAR & SLIPPERS
  {
    id: "men025",
    name: "Classic White Leather Sneakers",
    category: "Footwear",
    type: "Footwear",
    material: "Leather",
    colour: "White",
    price: 1899,
    oldPrice: 2799,
    rating: 4.7,
    reviews: 142,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men026",
    name: "Formal Oxford Leather Shoes",
    category: "Footwear",
    type: "Footwear",
    material: "Leather",
    colour: "Black",
    price: 2499,
    oldPrice: 3699,
    rating: 4.8,
    reviews: 98,
    badge: "OFFICE EDIT",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men027",
    name: "Athletic Running & Gym Shoes",
    category: "Footwear",
    type: "Footwear",
    material: "Mesh",
    colour: "Black",
    price: 1699,
    oldPrice: 2499,
    rating: 4.6,
    reviews: 110,
    badge: "ACTIVE",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men028",
    name: "Premium Comfort Leather Slippers",
    category: "Footwear",
    type: "Slippers",
    material: "Leather",
    colour: "Brown",
    price: 899,
    oldPrice: 1399,
    rating: 4.5,
    reviews: 87,
    badge: "COMFORT",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men029",
    name: "Daily Slides & Ergonomic Slippers",
    category: "Footwear",
    type: "Slippers",
    material: "EVA",
    colour: "Black",
    price: 699,
    oldPrice: 999,
    rating: 4.4,
    reviews: 73,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men030",
    name: "Traditional Ethnic Kolhapuri Slippers",
    category: "Footwear",
    type: "Slippers",
    material: "Leather",
    colour: "Brown",
    price: 1199,
    oldPrice: 1699,
    rating: 4.6,
    reviews: 65,
    badge: "TRADITIONAL",
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=85",
  },

  // WATCHES
  {
    id: "men031",
    name: "Classic Stainless Steel Chronograph Watch",
    category: "Accessories",
    type: "Watches",
    material: "Stainless Steel",
    colour: "Silver",
    price: 2999,
    oldPrice: 4999,
    rating: 4.8,
    reviews: 135,
    badge: "LUXE",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men033",
    name: "Sport Digital Waterproof Watch",
    category: "Accessories",
    type: "Watches",
    material: "Silicone",
    colour: "Black",
    price: 1499,
    oldPrice: 2299,
    rating: 4.5,
    reviews: 82,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=85",
  },

  // BELTS & WALLETS
  {
    id: "men034",
    name: "Reversible Formal Leather Belt",
    category: "Accessories",
    type: "Belts",
    material: "Leather",
    colour: "Black",
    price: 799,
    oldPrice: 1299,
    rating: 4.6,
    reviews: 78,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men035",
    name: "Vintage Brown Leather Casual Belt",
    category: "Accessories",
    type: "Belts",
    material: "Leather",
    colour: "Brown",
    price: 849,
    oldPrice: 1399,
    rating: 4.5,
    reviews: 62,
    badge: "CASUAL",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men036",
    name: "Genuine Leather Bi-fold Wallet",
    category: "Accessories",
    type: "Wallets",
    material: "Leather",
    colour: "Brown",
    price: 899,
    oldPrice: 1499,
    rating: 4.7,
    reviews: 120,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men037",
    name: "Slim RFID Blocking Cardholder Wallet",
    category: "Accessories",
    type: "Wallets",
    material: "Leather",
    colour: "Black",
    price: 699,
    oldPrice: 1099,
    rating: 4.6,
    reviews: 88,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=700&q=85",
  },

  // SUNGLASSES & BAGS
  {
    id: "men038",
    name: "Classic Polarized Aviator Sunglasses",
    category: "Accessories",
    type: "Sunglasses",
    material: "Metal",
    colour: "Gold",
    price: 1199,
    oldPrice: 1899,
    rating: 4.6,
    reviews: 95,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men039",
    name: "Matte Black Wayfarer Sunglasses",
    category: "Accessories",
    type: "Sunglasses",
    material: "Acetate",
    colour: "Black",
    price: 999,
    oldPrice: 1599,
    rating: 4.5,
    reviews: 83,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men040",
    name: "Urban Commuter Laptop Backpack",
    category: "Accessories",
    type: "Bags",
    material: "Polyester",
    colour: "Grey",
    price: 1899,
    oldPrice: 2899,
    rating: 4.7,
    reviews: 104,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "men041",
    name: "Premium Leather Messenger Bag",
    category: "Accessories",
    type: "Bags",
    material: "Leather",
    colour: "Brown",
    price: 2499,
    oldPrice: 3999,
    rating: 4.8,
    reviews: 67,
    badge: "PREMIUM",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
  },
];


function MenCategory() {
  const pathname = usePathname();

  /* =========================
     MEN PRODUCTS
  ========================= */

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedColour, setSelectedColour] = useState("All");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("featured");

  const [wishlist, setWishlist] = useState([]);
  const [, setCart] = useState([]);
  const [tryOnProduct, setTryOnProduct] = useState(null);
  const [tryOnImage, setTryOnImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  useEffect(() => {
    const slug = pathname.split("/")[2] || "";
    const category = categories.find((item) => item.toLowerCase().replace(/\s+/g, "-") === slug);
    setSelectedCategory(productCategories[slug]?.[0] || category || "All");
  }, [pathname]);
  /* =========================
     LOAD WISHLIST + CART
  ========================= */

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("veyraaWishlist")) || [];

    const savedCart =
      JSON.parse(localStorage.getItem("veyraaCart")) || [];

    setWishlist(savedWishlist.map((item) => item.id));
    setCart(savedCart);
  }, []);

  /* =========================
     WISHLIST
  ========================= */

  const toggleWishlist = (product) => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("veyraaWishlist")) || [];

    const exists = savedWishlist.some(
      (item) => item.id === product.id
    );

    let updatedWishlist;

    if (exists) {
      updatedWishlist = savedWishlist.filter(
        (item) => item.id !== product.id
      );
    } else {
      updatedWishlist = [...savedWishlist, product];
    }

    localStorage.setItem(
      "veyraaWishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist.map((item) => item.id));
  };

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (product) => {
    const savedCart =
      JSON.parse(localStorage.getItem("veyraaCart")) || [];

    const existingProduct = savedCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = savedCart.map((item) =>
        item.id === product.id
          ? {
            ...item,
            quantity: (item.quantity || 1) + 1,
          }
          : item
      );
    } else {
      updatedCart = [
        ...savedCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "veyraaCart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);

    alert(`${product.name} added to cart`);
  };

  /* =========================
     BUY NOW
  ========================= */

  const buyNow = (product) => {
    const savedCart =
      JSON.parse(localStorage.getItem("veyraaCart")) || [];

    const existingProduct = savedCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = savedCart.map((item) =>
        item.id === product.id
          ? {
            ...item,
            quantity: (item.quantity || 1) + 1,
          }
          : item
      );
    } else {
      updatedCart = [
        ...savedCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "veyraaCart",
      JSON.stringify(updatedCart)
    );

    window.location.href = "/billing";
  };
  /* =========================
   VIRTUAL TRY-ON
========================= */

  const openTryOn = (product) => {
    setTryOnProduct(product);
    setTryOnImage(null);
  };

  const closeTryOn = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    setCameraOpen(false);
    setCameraStream(null);
    setTryOnProduct(null);
    setTryOnImage(null);
  }; const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      setCameraStream(stream);
      setCameraOpen(true);
    } catch (error) {
      alert(
        "Camera access was blocked. Please allow camera permission in your browser."
      );
    }
  };

  const captureCameraPhoto = () => {
    const video = document.getElementById("men-tryon-camera");

    if (!video) return;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageUrl = canvas.toDataURL("image/jpeg");

    setTryOnImage(imageUrl);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    setCameraOpen(false);
    setCameraStream(null);
  };

  const uploadTryOnPhoto = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setTryOnImage(imageUrl);
  };

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
        product.category === selectedCategory ||
        Object.values(productCategories).some(([label, pattern]) =>
          label === selectedCategory && pattern.test(product.type || product.name)
        );

      const materialMatch =
        selectedMaterial === "All" ||
        product.material === selectedMaterial;

      const colourMatch =
        selectedColour === "All" ||
        product.colour === selectedColour;

      const priceMatch = product.price <= maxPrice;

      return (
        categoryMatch &&
        materialMatch &&
        colourMatch &&
        priceMatch
      );
    });

    if (sortBy === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    selectedCategory,
    selectedMaterial,
    selectedColour,
    maxPrice,
    sortBy,
  ]);

  /* =========================
     RESET FILTERS
  ========================= */

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedMaterial("All");
    setSelectedColour("All");
    setMaxPrice(5000);
    setSortBy("featured");
  };

  return (
    <>
      <Navbar />

      <div className="men-page">

        {/* ================= HERO ================= */}

        <section
          className="men-hero"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(35, 24, 24, 0.95), rgba(35, 24, 24, 0.62), rgba(35, 24, 24, 0.15)), url("/men/blazer.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          <div className="men-hero-content">
            <span className="men-eyebrow">
              VEYRAA MEN'S EDIT
            </span>

            <h1>
              Modern Style.
              <br />
              <span>Made for Him.</span>
            </h1>

            <p>
              Discover refined essentials, ethnic classics,
              smart formals and everyday styles curated for
              the modern man.
            </p>

            <button
              className="men-hero-button"
              onClick={() => {
                setSelectedCategory("All");
                window.scrollTo({
                  top: 500,
                  behavior: "smooth",
                });
              }}
            >
              Explore Men's Collection →
            </button>
          </div>

          <div className="men-hero-badge">
            <strong>{products.length}</strong>
            <span>CURATED<br />STYLES</span>
          </div>

        </section>

        {/* ================= CATEGORY BAR ================= */}

        <section className="men-category-section">

          <div className="men-section-heading">
            <div>
              <span>SHOP BY STYLE</span>
              <h2>Men's Fashion</h2>
            </div>

            <p>
              From everyday essentials to occasion-ready
              statement pieces.
            </p>
          </div>

          <div className="men-category-pills">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? "men-category-pill active"
                    : "men-category-pill"
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>

        </section>

        {/* ================= SHOP AREA ================= */}

        <section className="men-shop-section">

          {/* FILTER SIDEBAR */}

          <aside className="men-filters">

            <div className="filter-title-row">
              <h3>Filters</h3>

              <button onClick={resetFilters}>
                Reset
              </button>
            </div>

            {/* MATERIAL */}

            <div className="filter-group">
              <h4>Material</h4>

              {[
                "All",
                "Cotton",
                "Denim",
                "Cotton Blend",
                "Silk Blend",
                "Cotton Silk",
                "Poly Viscose",
                "Polyester Blend",
                "Suiting Fabric",
                "Cotton Stretch",
                "Cotton Pique",
                "Performance Fabric",
                "Polyester",
                "Dry Fit",
              ].map((material) => (
                <label key={material}>
                  <input
                    type="radio"
                    name="material"
                    checked={selectedMaterial === material}
                    onChange={() =>
                      setSelectedMaterial(material)
                    }
                  />
                  <span>{material}</span>
                </label>
              ))}
            </div>

            {/* COLOUR */}

            <div className="filter-group">
              <h4>Colour</h4>

              {[
                "All",
                "Black",
                "Blue",
                "Green",
                "Grey",
                "Beige",
                "Cream",
                "White",
                "Brown",
                "Lavender",
              ].map((colour) => (
                <label key={colour}>
                  <input
                    type="radio"
                    name="colour"
                    checked={selectedColour === colour}
                    onChange={() =>
                      setSelectedColour(colour)
                    }
                  />
                  <span>{colour}</span>
                </label>
              ))}
            </div>

            {/* PRICE */}

            <div className="filter-group">
              <h4>Maximum Price</h4>

              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value))
                }
              />

              <div className="price-range">
                <span>₹500</span>
                <strong>₹{maxPrice}</strong>
              </div>
            </div>

          </aside>

          {/* PRODUCTS */}

          <div className="men-products-area">

            <div className="men-products-top">

              <div>
                <span className="product-count">
                  {filteredProducts.length} Products
                </span>

                <h2>
                  {selectedCategory === "All"
                    ? "All Men's Fashion"
                    : selectedCategory}
                </h2>
              </div>

              <div className="sort-box">
                <label>Sort by</label>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
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

                  <option value="rating">
                    Customer Rating
                  </option>
                </select>
              </div>

            </div>

            {/* PRODUCT GRID */}

            <div className="men-product-grid">

              {filteredProducts.map((product) => (

                <article
                  className="men-product-card"
                  key={product.id}
                >

                  {/* IMAGE */}

                  <div
                    className="men-product-image"
                    onClick={() => {
                      window.location.href = `/products/${encodeURIComponent(product.id)}?catalog=Men`;
                    }}
                    style={{ cursor: "pointer" }}
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/men/formalshirt.jpg";
                      }}
                    />

                    <span className="men-product-badge">
                      {product.badge}
                    </span>

                    <button
                      className={
                        wishlist.includes(product.id)
                          ? "men-wishlist active"
                          : "men-wishlist"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      aria-label="Wishlist"
                    >
                      {wishlist.includes(product.id)
                        ? "♥"
                        : "♡"}
                    </button>

                  </div>

                  {/* DETAILS */}

                  <div className="men-product-details">

                    <div className="men-product-rating">
                      ★ {product.rating}
                      <span>
                        ({product.reviews})
                      </span>
                    </div>

                    <span className="men-product-category">
                      {product.category}
                    </span>

                    <h3
                      onClick={() => {
                        window.location.href = `/products/${encodeURIComponent(product.id)}?catalog=Men`;
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </h3>

                    <p className="men-product-info">
                      {product.material} · {product.colour}
                    </p>

                    <div className="men-product-price">
                      <strong>
                        ₹{product.price.toLocaleString("en-IN")}
                      </strong>

                      <del>
                        ₹
                        {product.oldPrice.toLocaleString(
                          "en-IN"
                        )}
                      </del>

                      <span>
                        {Math.round(
                          ((product.oldPrice -
                            product.price) /
                            product.oldPrice) *
                          100
                        )}
                        % OFF
                      </span>
                    </div>

                    {/* ACTIONS */}

                    <div className="men-product-actions">

                      <button
                        className="men-add-cart"
                        onClick={() =>
                          addToCart(product)
                        }
                      >
                        Add to Cart
                      </button>

                      <button
                        className="men-buy-now"
                        onClick={() =>
                          buyNow(product)
                        }
                      >
                        Buy Now
                      </button>

                    </div>

                    <a
                      className="men-quick-view"
                      href={`/products/${encodeURIComponent(product.id)}?catalog=Men`}
                      style={{ textAlign: "center", textDecoration: "none", display: "block" }}
                    >
                      View Product →
                    </a>
                    {!["Accessories", "Footwear"].includes(product.category) && !["Watches", "Belts", "Wallets"].includes(product.type) && (
                      <button
                        className="men-quick-view men-tryon-button"
                        onClick={() => openTryOn(product)}
                      >
                        ✨ Virtual Try-On
                      </button>
                    )}

                  </div>

                </article>

              ))}

            </div>

            {/* EMPTY RESULT */}

            {filteredProducts.length === 0 && (
              <div className="men-empty-products">

                <div>⌕</div>

                <h3>
                  No products found
                </h3>

                <p>
                  Try changing your filters to discover
                  more styles.
                </p>

                <button onClick={resetFilters}>
                  Clear Filters
                </button>

              </div>
            )}

          </div>

        </section>

      </div>
      {/* =========================
    VIRTUAL TRY-ON MODAL
========================= */}

      {tryOnProduct && (
        <div className="men-tryon-overlay">

          <div className="men-tryon-modal">

            <button
              className="men-tryon-close"
              onClick={closeTryOn}
            >
              ×
            </button>

            <span className="men-tryon-eyebrow">
              VEYRAA SMART FIT
            </span>

            <h2>Virtual Try-On</h2>

            <p className="men-tryon-description">
              See how{" "}
              <strong>{tryOnProduct.name}</strong>{" "}
              could look with your photo.
            </p>

            {!tryOnImage ? (
              <div className="men-tryon-upload">

                <div className="men-tryon-product">

                  <img
                    src={tryOnProduct.image}
                    alt={tryOnProduct.name}
                  />

                  <h3>{tryOnProduct.name}</h3>

                  <p>
                    ₹{tryOnProduct.price.toLocaleString("en-IN")}
                  </p>

                </div>

                <div className="men-tryon-action">

                  <div className="men-tryon-icon">
                    📷
                  </div>

                  <h3>Try Your Style</h3>

                  <p>
                    Use your camera or upload a photo to
                    preview your selected fashion style.
                  </p>

                  <div className="men-tryon-buttons">

                    <button
                      type="button"
                      className="men-camera-button"
                      onClick={startCamera}
                    >
                      📷 Use Camera
                    </button>

                    <label className="men-upload-button">
                      🖼 Choose Photo

                      <input
                        type="file"
                        accept="image/*"
                        onChange={uploadTryOnPhoto}
                      />
                    </label>

                  </div>

                </div>

              </div>
            ) : (
              <div className="men-tryon-result">

                <div className="men-tryon-photo">

                  <img
                    src={tryOnImage}
                    alt="Your upload"
                  />

                  <span>YOUR PHOTO</span>

                </div>

                <div className="men-tryon-product">

                  <img
                    src={tryOnProduct.image}
                    alt={tryOnProduct.name}
                  />

                  <span>SELECTED STYLE</span>

                  <h3>
                    {tryOnProduct.name}
                  </h3>

                  <strong>
                    ₹{tryOnProduct.price.toLocaleString("en-IN")}
                  </strong>

                </div>

              </div>
            )}{cameraOpen && (
              <div className="men-camera-section">

                <div className="men-camera-preview">

                  <video
                    id="men-tryon-camera"
                    autoPlay
                    playsInline
                    ref={(video) => {
                      if (video && cameraStream) {
                        video.srcObject = cameraStream;
                      }
                    }}
                  />

                </div>

                <div className="men-camera-controls">

                  <button
                    className="men-camera-capture"
                    onClick={captureCameraPhoto}
                  >
                    📸 Capture Photo
                  </button>

                  <button
                    className="men-camera-cancel"
                    onClick={() => {
                      if (cameraStream) {
                        cameraStream
                          .getTracks()
                          .forEach((track) => track.stop());
                      }

                      setCameraOpen(false);
                      setCameraStream(null);
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

            <div className="men-tryon-footer">

              {tryOnImage && (
                <button
                  className="men-tryon-secondary"
                  onClick={() => setTryOnImage(null)}
                >
                  ← Change Photo
                </button>
              )}

              <button
                className="men-tryon-secondary"
                onClick={closeTryOn}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}
      <Footer />
    </>
  );
}

export default MenCategory;
