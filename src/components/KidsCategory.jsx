import React, { useMemo, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./KidsCategory.css";

export const kidsProducts = [
  // =========================
  // GIRLS
  // =========================

  {
    id: "girl001",
    name: "Princess Floral Summer Frock",
    gender: "Girls",
    category: "frocks",
    type: "Frocks",
    material: "Cotton",
    colour: "Pink",
    price: 1199,
    oldPrice: 1699,
    rating: 4.8,
    badge: "BESTSELLER",
    image: "/kids/frock1.webp",
  },
  {
    id: "girl002",
    name: "Princess Party Frock",
    gender: "Girls",
    category: "party-dresses",
    type: "Party Dresses",
    material: "Premium",
    colour: "Pink",
    price: 1499,
    oldPrice: 1999,
    rating: 4.9,
    badge: "NEW",
    image: "/kids/frock2.jpg",
  },
  {
    id: "girl003",
    name: "Summer Girls Dress",
    gender: "Girls",
    category: "casual-dresses",
    type: "Casual Dresses",
    material: "Cotton",
    colour: "Green",
    price: 899,
    oldPrice: 1299,
    rating: 4.7,
    badge: "POPULAR",
    image: "/kids/frock3.jpg",
  },
  {
    id: "girl004",
    name: "Princess White Frock",
    gender: "Girls",
    category: "party-dresses",
    type: "Party Dresses",
    material: "Premium",
    colour: "Yellow",
    price: 1599,
    oldPrice: 2199,
    rating: 4.8,
    badge: "NEW",
    image: "/kids/frock4.jpg",
  },
  {
    id: "girl005",
    name: "Elegant Blue Frock",
    gender: "Girls",
    category: "frocks",
    type: "Frocks",
    material: "Cotton",
    colour: "Blue",
    price: 1099,
    oldPrice: 1499,
    rating: 4.6,
    badge: "SALE",
    image: "/kids/frock5.jpg",
  },
  {
    id: "girl006",
    name: "Classic Red Party Frock",
    gender: "Girls",
    category: "party-dresses",
    type: "Party Dresses",
    material: "Cotton",
    colour: "Red",
    price: 1199,
    oldPrice: 1699,
    rating: 4.7,
    badge: "POPULAR",
    image: "/kids/frock7.jpg",
  },
  {
    id: "girl007",
    name: "Girls Denim Dress",
    gender: "Girls",
    category: "jeans",
    type: "Jeans",
    material: "Denim",
    colour: "Blue",
    price: 999,
    oldPrice: 1399,
    rating: 4.6,
    badge: "NEW",
    image: "/kids/jeantype.jpg",
  },
  {
    id: "girl008",
    name: "Girls Summer Jumpsuit",
    gender: "Girls",
    category: "casual-dresses",
    type: "Casual Dresses",
    material: "Cotton",
    colour: "Blue",
    price: 1099,
    oldPrice: 1499,
    rating: 4.7,
    badge: "TRENDING",
    image: "/kids/jumpsuit.jpg",
  },
  {
    id: "girl009",
    name: "Traditional Girls Pattu Dress",
    gender: "Girls",
    category: "ethnic-wear",
    type: "Ethnic Wear",
    material: "Silk",
    colour: "Green",
    price: 1799,
    oldPrice: 2399,
    rating: 4.9,
    badge: "PREMIUM",
    image: "/kids/paatu.jpg",
  },
  {
    id: "girl010",
    name: "Pink Princess Frock",
    gender: "Girls",
    category: "party-dresses",
    type: "Party Dresses",
    material: "Premium",
    colour: "Pink",
    price: 1399,
    oldPrice: 1899,
    rating: 4.8,
    badge: "NEW",
    image: "/kids/pinkfrock1.jpg",
  },
  {
    id: "girl011",
    name: "Pink Peplum Party Dress",
    gender: "Girls",
    category: "party-dresses",
    type: "Party Dresses",
    material: "Cotton",
    colour: "Pink",
    price: 1299,
    oldPrice: 1699,
    rating: 4.7,
    badge: "TRENDING",
    image: "/kids/pinkpeplumgirl.jpg",
  },
  {
    id: "girl012",
    name: "Purple Princess Dress",
    gender: "Girls",
    category: "party-dresses",
    type: "Party Dresses",
    material: "Premium",
    colour: "Purple",
    price: 1599,
    oldPrice: 2199,
    rating: 4.9,
    badge: "PREMIUM",
    image: "/kids/purplegirl.jpg",
  },
  {
    id: "girl013",
    name: "Purple Designer Frock",
    gender: "Girls",
    category: "frocks",
    type: "Frocks",
    material: "Premium",
    colour: "Purple",
    price: 1699,
    oldPrice: 2299,
    rating: 4.8,
    badge: "NEW",
    image: "/kids/purplegirlfrock.jpg",
  },
  {
    id: "girl014",
    name: "Yellow Ethnic Girls Dress",
    gender: "Girls",
    category: "ethnic-wear",
    type: "Ethnic Wear",
    material: "Cotton",
    colour: "Yellow",
    price: 1499,
    oldPrice: 1999,
    rating: 4.8,
    badge: "POPULAR",
    image: "/kids/yellowgirl.jpg",
  },

  // GIRLS FOOTWEAR & ACCESSORIES
  {
    id: "girl015",
    name: "Girls Princess Sparkling Ballet Flats",
    gender: "Girls",
    category: "footwear",
    type: "Footwear",
    material: "Synthetic",
    colour: "Pink",
    price: 999,
    oldPrice: 1499,
    rating: 4.8,
    badge: "PARTY",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "girl016",
    name: "Girls Pastel Casual Slip-On Sneakers",
    gender: "Girls",
    category: "footwear",
    type: "Footwear",
    material: "Canvas",
    colour: "Pink",
    price: 899,
    oldPrice: 1299,
    rating: 4.7,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "girl017",
    name: "Girls Cute Flower Slide Slippers",
    gender: "Girls",
    category: "footwear",
    type: "Slippers",
    material: "EVA",
    colour: "Yellow",
    price: 599,
    oldPrice: 899,
    rating: 4.6,
    badge: "COMFORT",
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "girl018",
    name: "Kids Digital Pastel LED Watch",
    gender: "Girls",
    category: "accessories",
    type: "Watches",
    material: "Silicone",
    colour: "Purple",
    price: 799,
    oldPrice: 1199,
    rating: 4.7,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "girl019",
    name: "Girls Mini Floral Shoulder Bag",
    gender: "Girls",
    category: "accessories",
    type: "Bags",
    material: "PU Leather",
    colour: "Pink",
    price: 699,
    oldPrice: 1099,
    rating: 4.6,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "girl020",
    name: "Girls Floral Hairband & Clips Set",
    gender: "Girls",
    category: "accessories",
    type: "Accessories",
    material: "Fabric",
    colour: "Pink",
    price: 499,
    oldPrice: 799,
    rating: 4.8,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "girl021",
    name: "Girls Heart Frame UV Sunglasses",
    gender: "Girls",
    category: "accessories",
    type: "Sunglasses",
    material: "Acetate",
    colour: "Pink",
    price: 599,
    oldPrice: 899,
    rating: 4.5,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85",
  },

  // =========================
  // BOYS
  // =========================

  {
    id: "boy001",
    name: "Traditional Bhangra Boy Outfit",
    gender: "Boys",
    category: "ethnic-wear",
    type: "Ethnic Wear",
    material: "Cotton",
    colour: "Yellow",
    price: 1499,
    oldPrice: 1999,
    rating: 4.8,
    badge: "PREMIUM",
    image: "/kids/bhangraboy.jpg",
  },
  {
    id: "boy002",
    name: "Casual Boy Outfit",
    gender: "Boys",
    category: "casual-wear",
    type: "Casual Wear",
    material: "Cotton",
    colour: "White",
    price: 899,
    oldPrice: 1199,
    rating: 4.6,
    badge: "POPULAR",
    image: "/kids/casualboy.jpg",
  },
  {
    id: "boy003",
    name: "Casual Summer Set",
    gender: "Boys",
    category: "casual-wear",
    type: "Casual Wear",
    material: "Cotton",
    colour: "Blue",
    price: 999,
    oldPrice: 1399,
    rating: 4.7,
    badge: "TRENDING",
    image: "/kids/casualwearboy.jpg",
  },
  {
    id: "boy004",
    name: "Traditional Dhoti Set",
    gender: "Boys",
    category: "dhoti",
    type: "Dhoti",
    material: "Cotton",
    colour: "White",
    price: 1299,
    oldPrice: 1699,
    rating: 4.8,
    badge: "POPULAR",
    image: "/kids/dhoti.jpg",
  },
  {
    id: "boy005",
    name: "Kids Traditional Dhoti",
    gender: "Boys",
    category: "dhoti",
    type: "Dhoti",
    material: "Cotton",
    colour: "White",
    price: 1199,
    oldPrice: 1599,
    rating: 4.7,
    badge: "NEW",
    image: "/kids/dhotiboy.jpg",
  },
  {
    id: "boy006",
    name: "Green Casual Shirt",
    gender: "Boys",
    category: "shirts",
    type: "Shirts",
    material: "Cotton",
    colour: "Green",
    price: 699,
    oldPrice: 999,
    rating: 4.6,
    badge: "SALE",
    image: "/kids/greenshirt.jpg",
  },
  {
    id: "boy007",
    name: "Classic Boys Kurta",
    gender: "Boys",
    category: "kurta",
    type: "Kurta",
    material: "Cotton",
    colour: "Red",
    price: 1099,
    oldPrice: 1499,
    rating: 4.8,
    badge: "NEW",
    image: "/kids/kurtaboy.jpg",
  },
  {
    id: "boy008",
    name: "Boys Nightwear Set",
    gender: "Boys",
    category: "nightwear",
    type: "Nightwear",
    material: "Cotton",
    colour: "Blue",
    price: 799,
    oldPrice: 1099,
    rating: 4.5,
    badge: "COMFORT",
    image: "/kids/ni8wear.jpg",
  },
  {
    id: "boy009",
    name: "Boys Printed Nightwear",
    gender: "Boys",
    category: "nightwear",
    type: "Nightwear",
    material: "Cotton",
    colour: "Blue",
    price: 849,
    oldPrice: 1199,
    rating: 4.6,
    badge: "POPULAR",
    image: "/kids/ni8wearboy.jpg",
  },
  {
    id: "boy010",
    name: "Royal Boys Ethnic Set",
    gender: "Boys",
    category: "ethnic-wear",
    type: "Ethnic Wear",
    material: "Premium",
    colour: "Blue",
    price: 1399,
    oldPrice: 1899,
    rating: 4.8,
    badge: "TRENDING",
    image: "/kids/royalboy.jpg",
  },
  {
    id: "boy011",
    name: "Printed Boys Shirt",
    gender: "Boys",
    category: "shirts",
    type: "Shirts",
    material: "Cotton",
    colour: "Blue",
    price: 749,
    oldPrice: 999,
    rating: 4.6,
    badge: "NEW",
    image: "/kids/shirt.jpg",
  },
  {
    id: "boy012",
    name: "Classic Boys Suit",
    gender: "Boys",
    category: "formal-wear",
    type: "Formal Wear",
    material: "Premium",
    colour: "Black",
    price: 1999,
    oldPrice: 2699,
    rating: 4.9,
    badge: "PREMIUM",
    image: "/kids/suitboy.jpg",
  },
  {
    id: "boy013",
    name: "Boys Casual T-Shirt",
    gender: "Boys",
    category: "tshirts",
    type: "T-Shirts",
    material: "Cotton",
    colour: "Grey",
    price: 599,
    oldPrice: 899,
    rating: 4.5,
    badge: "SALE",
    image: "/kids/tshirtboy.jpg",
  },
  {
    id: "boy014",
    name: "Yellow Boys Kurta Set",
    gender: "Boys",
    category: "kurta",
    type: "Kurta",
    material: "Cotton",
    colour: "Yellow",
    price: 1199,
    oldPrice: 1599,
    rating: 4.7,
    badge: "POPULAR",
    image: "/kids/yeelowboy.jpg",
  },

  // BOYS FOOTWEAR & ACCESSORIES
  {
    id: "boy015",
    name: "Boys Active Sports Running Sneakers",
    gender: "Boys",
    category: "footwear",
    type: "Footwear",
    material: "Mesh",
    colour: "Blue",
    price: 999,
    oldPrice: 1499,
    rating: 4.8,
    badge: "ACTIVE",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "boy016",
    name: "Boys Casual Canvas Slip-on Shoes",
    gender: "Boys",
    category: "footwear",
    type: "Footwear",
    material: "Canvas",
    colour: "Black",
    price: 899,
    oldPrice: 1299,
    rating: 4.6,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "boy017",
    name: "Boys Dinosaur Comfort Slide Slippers",
    gender: "Boys",
    category: "footwear",
    type: "Slippers",
    material: "EVA",
    colour: "Green",
    price: 599,
    oldPrice: 899,
    rating: 4.7,
    badge: "COMFORT",
    image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "boy018",
    name: "Boys Traditional Ethnic Jutti / Slippers",
    gender: "Boys",
    category: "footwear",
    type: "Slippers",
    material: "Silk Blend",
    colour: "Gold",
    price: 799,
    oldPrice: 1199,
    rating: 4.7,
    badge: "TRADITIONAL",
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "boy019",
    name: "Boys Adventure Digital Sports Watch",
    gender: "Boys",
    category: "accessories",
    type: "Watches",
    material: "Silicone",
    colour: "Black",
    price: 799,
    oldPrice: 1199,
    rating: 4.6,
    badge: "TRENDING",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "boy020",
    name: "Kids School & Travel Backpack",
    gender: "Boys",
    category: "accessories",
    type: "Bags",
    material: "Polyester",
    colour: "Blue",
    price: 1199,
    oldPrice: 1699,
    rating: 4.8,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "boy021",
    name: "Boys Embroidered Cotton Baseball Cap",
    gender: "Boys",
    category: "accessories",
    type: "Caps",
    material: "Cotton",
    colour: "Black",
    price: 499,
    oldPrice: 799,
    rating: 4.5,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "boy022",
    name: "Boys Cool Aviator Sunglasses",
    gender: "Boys",
    category: "accessories",
    type: "Sunglasses",
    material: "Metal",
    colour: "Silver",
    price: 599,
    oldPrice: 899,
    rating: 4.6,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=700&q=85",
  },
];

const genderCategories = {
  Girls: [
    ["all", "All Girls"],
    ["frocks", "Frocks"],
    ["party-dresses", "Party Dresses"],
    ["casual-dresses", "Casual Dresses"],
    ["jeans", "Jeans"],
    ["ethnic-wear", "Ethnic Wear"],
    ["footwear", "Footwear & Slippers"],
    ["accessories", "Accessories & Bags"],
  ],

  Boys: [
    ["all", "All Boys"],
    ["tshirts", "T-Shirts"],
    ["shirts", "Shirts"],
    ["casual-wear", "Casual Wear"],
    ["dhoti", "Dhoti"],
    ["kurta", "Kurta"],
    ["ethnic-wear", "Ethnic Wear"],
    ["nightwear", "Nightwear"],
    ["formal-wear", "Formal Wear"],
    ["footwear", "Footwear & Slippers"],
    ["accessories", "Accessories & Bags"],
  ],
};

function KidsCategory() {
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(3000);

  // Virtual Try-On
  const [tryOnProduct, setTryOnProduct] = useState(null);
  const [tryOnImage, setTryOnImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("veyraaCart")) || [];
    } catch {
      return [];
    }
  });

  const closeTryOn = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    setCameraOpen(false);
    setCameraStream(null);
    setTryOnProduct(null);
    setTryOnImage(null);
  };

  const openTryOn = (product) => {
    setTryOnProduct(product);
    setTryOnImage(null);
    setCameraOpen(false);
  };

  const startCamera = async () => {
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
    const video = document.getElementById("kids-tryon-camera");

    if (!video || !cameraStream) return;

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

    cameraStream.getTracks().forEach((track) => track.stop());

    setCameraOpen(false);
    setCameraStream(null);
  };

  const handleTryOnUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      setTryOnImage(e.target.result);
      setCameraOpen(false);
    };

    reader.readAsDataURL(file);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setSelectedCategory("all");
  };

  const filteredProducts = useMemo(() => {
    let result = [...kidsProducts];

    // Gender filter
    if (selectedGender !== "All") {
      result = result.filter(
        (product) => product.gender === selectedGender
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price filter
    result = result.filter(
      (product) => product.price <= maxPrice
    );

    // Sorting
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
  }, [
    selectedGender,
    selectedCategory,
    maxPrice,
    sort,
  ]);

  const toggleWishlist = (product) => {
    const exists = wishlist.some(
      (item) => item.id === product.id
    );

    const updated = exists
      ? wishlist.filter((item) => item.id !== product.id)
      : [...wishlist, product];

    setWishlist(updated);
    localStorage.setItem(
      "veyraaWishlist",
      JSON.stringify(updated)
    );
  };

  const addToCart = (product) => {
    const exists = cart.some(
      (item) => item.id === product.id
    );

    if (exists) {
      alert("Product is already in your cart.");
      return;
    }

    const updated = [...cart, product];

    setCart(updated);

    localStorage.setItem(
      "veyraaCart",
      JSON.stringify(updated)
    );

    alert(`${product.name} added to cart!`);
  };

  const categories =
    selectedGender === "All"
      ? [
          ["all", "All Kids"],
          ["frocks", "Frocks"],
          ["party-dresses", "Party Dresses"],
          ["casual-dresses", "Casual Dresses"],
          ["tshirts", "T-Shirts"],
          ["shirts", "Shirts"],
          ["jeans", "Jeans"],
          ["dhoti", "Dhoti"],
          ["kurta", "Kurta"],
          ["ethnic-wear", "Ethnic Wear"],
          ["nightwear", "Nightwear"],
          ["formal-wear", "Formal Wear"],
        ]
      : genderCategories[selectedGender];

  return (
    <>
      <Navbar />

      <main className="kids-page">

        {/* ================= HERO ================= */}
        <section
          className="kids-hero"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(45, 31, 31, 0.92), rgba(45, 31, 31, 0.58), rgba(45, 31, 31, 0.12)), url("/kids/frock2.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="kids-hero-overlay">
            <span className="kids-label">
              VEYRAA KIDS COLLECTION
            </span>

            <h1>
              Little Looks.
              <br />
              Big Personalities.
            </h1>

            <p>
              Discover playful, stylish and comfortable
              fashion for every little trendsetter.
            </p>

            <button
              onClick={() => {
                document
                  .getElementById("kids-products")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              SHOP KIDS →
            </button>
          </div>
        </section>

        {/* ================= PRODUCTS ================= */}
        <section
          className="kids-products-section"
          id="kids-products"
        >

          {/* CATEGORY PILLS */}
          <div className="kids-category-pills">

            {categories.map(([value, label]) => (
              <button
                key={value}
                className={
                  selectedCategory === value
                    ? "kids-category-pill active"
                    : "kids-category-pill"
                }
                onClick={() =>
                  setSelectedCategory(value)
                }
              >
                {label}
              </button>
            ))}

          </div>

          <div className="kids-shop-layout">

            {/* ================= FILTER SIDEBAR ================= */}
            <aside className="kids-sidebar">

              <div className="sidebar-title">
                <h3>FILTERS</h3>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setMaxPrice(3000);
                  }}
                >
                  Reset
                </button>
              </div>

              <div className="filter-group">

                <h4>COLLECTION</h4>

                <label>
                  <input
                    type="radio"
                    checked={selectedGender === "All"}
                    onChange={() =>
                      handleGenderChange("All")
                    }
                  />
                  All Kids
                </label>

                <label>
                  <input
                    type="radio"
                    checked={selectedGender === "Girls"}
                    onChange={() =>
                      handleGenderChange("Girls")
                    }
                  />
                  Girls
                </label>

                <label>
                  <input
                    type="radio"
                    checked={selectedGender === "Boys"}
                    onChange={() =>
                      handleGenderChange("Boys")
                    }
                  />
                  Boys
                </label>

              </div>

              <div className="filter-group">

                <h4>PRICE</h4>

                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Number(e.target.value))
                  }
                />

                <div className="price-range">
                  <span>₹300</span>
                  <span>₹{maxPrice}</span>
                </div>

              </div>

            </aside>

            {/* ================= PRODUCT AREA ================= */}
            <div className="kids-product-area">
<div className="sort-box">
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
                    <option value="rating">
                      Highest Rated
                    </option>
                  </select>
                </div>

              {/* PRODUCTS */}
              <div className="kids-product-grid">

                {filteredProducts.length === 0 ? (
                  <div className="no-products">
                    <h3>No products found</h3>
                    <p>
                      Try changing your filters.
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((product) => {

                    const isWishlisted =
                      wishlist.some(
                        (item) =>
                          item.id === product.id
                      );

                    return (
                      <article
                        className="kids-product-card"
                        key={product.id}
                      >

                        <div
                          className="kids-product-image"
                          onClick={() => {
                            window.location.href = `/products/${encodeURIComponent(product.id)}?catalog=Kids`;
                          }}
                          style={{ cursor: "pointer" }}
                        >

                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = product.gender === "Boys" ? "/kids/casualboy.jpg" : "/kids/frock2.jpg";
                            }}
                          />

                          {product.badge && (
                            <span className="product-badge">
                              {product.badge}
                            </span>
                          )}

                          <button
                            className={
                              isWishlisted
                                ? "kids-wishlist active"
                                : "kids-wishlist"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product);
                            }}
                          >
                            {isWishlisted
                              ? "♥"
                              : "♡"}
                          </button>

                        </div>

                        <div className="kids-product-info">

                          <span className="product-gender">
                            {product.gender}
                          </span>

                          <h3
                            onClick={() => {
                              window.location.href = `/products/${encodeURIComponent(product.id)}?catalog=Kids`;
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {product.name}
                          </h3>

                          <div className="rating">
                            ★ {product.rating}
                          </div>

                          <div className="price-row">

                            <strong>
                              ₹{product.price}
                            </strong>

                            <span>
                              ₹{product.oldPrice}
                            </span>

                          </div>

                          <button
                            className="add-cart-btn"
                            onClick={() =>
                              addToCart(product)
                            }
                          >
                            ADD TO CART
                          </button>

                          <a
                            className="add-cart-btn"
                            href={`/products/${encodeURIComponent(product.id)}?catalog=Kids`}
                            style={{
                              display: "block",
                              textAlign: "center",
                              textDecoration: "none",
                              marginTop: "6px",
                              background: "#f0f5f2",
                              color: "#1e3a2f",
                              border: "1px solid #c9dcd2",
                            }}
                          >
                            VIEW PRODUCT →
                          </a>

                          {!["accessories", "footwear"].includes(product.category) && !["Watches", "Caps", "Bags", "Sunglasses", "Slippers"].includes(product.type) && (
                            <button
                              className="kids-tryon-btn"
                              onClick={() => openTryOn(product)}
                            >
                              ✦ VIRTUAL TRY-ON
                            </button>
                          )}

                        </div>

                      </article>
                    );
                  })
                )}

              </div>

            </div>

          </div>

        </section>

        {/* ================= VIRTUAL TRY-ON MODAL ================= */}
        {tryOnProduct && (
          <div
            className="kids-tryon-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeTryOn();
              }
            }}
          >
            <div className="kids-tryon-modal">

              <button
                className="kids-tryon-close"
                onClick={closeTryOn}
                aria-label="Close Virtual Try-On"
              >
                ×
              </button>

              <div className="kids-tryon-header">
                <span>VEYRAA KIDS AI STUDIO</span>
                <h2>Virtual Try-On</h2>
                <p>
                  Preview your look with
                  <strong> {tryOnProduct.name}</strong>
                </p>
              </div>

              {!tryOnImage && !cameraOpen && (
                <div className="kids-tryon-start">

                  <div className="kids-tryon-product-preview">
                    <img
                      src={tryOnProduct.image}
                      alt={tryOnProduct.name}
                    />
                  </div>

                  <div className="kids-tryon-actions">

                    <button
                      className="kids-camera-btn"
                      onClick={startCamera}
                    >
                      📷 USE CAMERA
                    </button>

                    <label className="kids-upload-btn">
                      ↑ CHOOSE PHOTO
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleTryOnUpload}
                      />
                    </label>

                  </div>

                  <p className="kids-tryon-note">
                    Take a photo or upload a child's photo to
                    preview the selected style.
                  </p>

                </div>
              )}

              {cameraOpen && cameraStream && (
                <div className="kids-camera-area">

                  <video
                    id="kids-tryon-camera"
                    autoPlay
                    playsInline
                    muted
                    ref={(video) => {
                      if (video && cameraStream) {
                        video.srcObject = cameraStream;
                      }
                    }}
                  />

                  <div className="kids-camera-controls">

                    <button
                      className="kids-camera-capture"
                      onClick={captureCameraPhoto}
                    >
                      ● CAPTURE PHOTO
                    </button>

                    <button
                      className="kids-camera-cancel"
                      onClick={closeTryOn}
                    >
                      CANCEL
                    </button>

                  </div>

                </div>
              )}

              {tryOnImage && !cameraOpen && (
                <div className="kids-tryon-result">

                  <div className="kids-tryon-photo">
                    <img
                      src={tryOnImage}
                      alt="Try-on preview"
                    />
                  </div>

                  <div className="kids-tryon-product">

                    <span>SELECTED STYLE</span>

                    <img
                      src={tryOnProduct.image}
                      alt={tryOnProduct.name}
                    />

                    <h3>{tryOnProduct.name}</h3>

                    <strong>
                      ₹{tryOnProduct.price}
                    </strong>

                  </div>

                  <div className="kids-tryon-result-actions">

                    <button
                      onClick={() => {
                        setTryOnImage(null);
                        setCameraOpen(false);
                      }}
                    >
                      TRY ANOTHER PHOTO
                    </button>

                    <button
                      onClick={() => addToCart(tryOnProduct)}
                    >
                      ADD TO CART
                    </button>

                  </div>

                  <p className="kids-tryon-disclaimer">
                    Virtual Try-On is a visual preview.
                    Actual fit and appearance may vary.
                  </p>

                </div>
              )}

            </div>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}

export default KidsCategory;
