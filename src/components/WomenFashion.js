import React, { useEffect, useRef, useState } from "react";
import "./WomenCategory.css";
import Navbar from "./Navbar";
export const products = [


  {
    id: 101,
    name: "Royal Purple Silk Saree",
    category: "sarees",
    type: "Sarees",
    material: "Silk",
    colour: "Purple",
    price: 2499,
    oldPrice: 3999,
    rating: 4.8,
    badge: "BESTSELLER",
    image: "/women/saree-01.jpg",
  },
  {
    id: 102,
    name: "Classic Red Designer Saree",
    category: "sarees",
    type: "Sarees",
    material: "Silk",
    colour: "Red",
    price: 2899,
    oldPrice: 4499,
    rating: 4.7,
    badge: "TRENDING",
    image: "/women/saree-02.jpg",
  },
  {
    id: 103,
    name: "Orange-Pink Festive Saree",
    category: "sarees",
    type: "Sarees",
    material: "Georgette",
    colour: "Pink",
    price: 2199,
    oldPrice: 3299,
    rating: 4.6,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 104,
    name: "Elegant Green Occasion Saree",
    category: "sarees",
    type: "Sarees",
    material: "Silk",
    colour: "Green",
    price: 3199,
    oldPrice: 4999,
    rating: 4.8,
    badge: "PREMIUM",
    image: "/women/saree-03.jpg"
  },



  {
    id: 201,
    name: "Elegant Printed Cotton Kurti",
    category: "kurtis",
    type: "Kurtis",
    material: "Cotton",
    colour: "Blue",
    price: 899,
    oldPrice: 1499,
    rating: 4.5,
    badge: "NEW",
    image:
      "/women/kurti-01.jpg",
  },
  {
    id: 202,
    name: "Pink Embroidered Kurti",
    category: "kurtis",
    type: "Kurtis",
    material: "Cotton",
    colour: "Pink",
    price: 1199,
    oldPrice: 1899,
    rating: 4.7,
    badge: "TRENDING",
    image:
      "/women/kurti-02.jpg",
  },
  {
    id: 203,
    name: "Floral A-Line Women's Kurti",
    category: "kurtis",
    type: "Kurtis",
    material: "Rayon",
    colour: "White",
    price: 999,
    oldPrice: 1599,
    rating: 4.6,
    badge: "POPULAR",
    image:
      "/women/kurti-03.jpg",
  },


  {
    id: 301,
    name: "Red Designer Chudidar Set",
    category: "chudidars",
    type: "Chudidars",
    material: "Cotton",
    colour: "Red",
    price: 1399,
    oldPrice: 2199,
    rating: 4.6,
    badge: "POPULAR",
    image:
      "/women/kurti-04.jpg",
  },
  {
    id: 302,
    name: "Pastel Women's Chudidar Set",
    category: "chudidars",
    type: "Chudidars",
    material: "Cotton",
    colour: "Pink",
    price: 1499,
    oldPrice: 2299,
    rating: 4.7,
    badge: "NEW",
    image:
      "/women/kurti-05.jpg",
  },
  {
    id: 303,
    name: "Festive Blue Chudidar Suit",
    category: "chudidars",
    type: "Chudidars",
    material: "Georgette",
    colour: "Blue",
    price: 1699,
    oldPrice: 2599,
    rating: 4.8,
    badge: "FESTIVE",
    image:
      "/women/kurti-06.jpg",
  },



  {
    id: 401,
    name: "Floral Cotton Salwar Suit",
    category: "salwar",
    type: "Salwar Suits",
    material: "Cotton",
    colour: "Pink",
    price: 1599,
    oldPrice: 2499,
    rating: 4.6,
    badge: "NEW",
    image:
      "/women/kurti-07.jpg",
  },
  {
    id: 402,
    name: "Embroidered Festive Salwar Suit",
    category: "salwar",
    type: "Salwar Suits",
    material: "Silk",
    colour: "Red",
    price: 2299,
    oldPrice: 3499,
    rating: 4.8,
    badge: "BESTSELLER",
    image:
      "/women/kurti-08.jpg",
  },
  {
    id: 403,
    name: "Pastel Punjabi Salwar Set",
    category: "salwar",
    type: "Salwar Suits",
    material: "Cotton",
    colour: "Blue",
    price: 1799,
    oldPrice: 2799,
    rating: 4.7,
    badge: "TRENDING",
    image:
      "/women/kurti-09.jpg",
  },

  {
    id: 501,
    name: "Rose Pink Bridal Lehenga",
    category: "lehengas",
    type: "Lehengas",
    material: "Georgette",
    colour: "Pink",
    price: 5499,
    oldPrice: 7999,
    rating: 4.9,
    badge: "PREMIUM",
    image:
      "/women/lehenga-01.jpg",
  },
  {
    id: 502,
    name: "Maroon Wedding Lehenga",
    category: "lehengas",
    type: "Lehengas",
    material: "Silk",
    colour: "Red",
    price: 6499,
    oldPrice: 8999,
    rating: 4.9,
    badge: "BESTSELLER",
    image:
      "/women/lehenga-02.jpg",
  },
  {
    id: 503,
    name: "Pastel Party Lehenga Set",
    category: "lehengas",
    type: "Lehengas",
    material: "Georgette",
    colour: "Pink",
    price: 4499,
    oldPrice: 6999,
    rating: 4.8,
    badge: "TRENDING",
    image:
      "/women/lehenga-03.jpg",
  },
  {
    id: 504,
    name: "Emerald Green Designer Lehenga",
    category: "lehengas",
    type: "Lehengas",
    material: "Silk",
    colour: "Green",
    price: 5999,
    oldPrice: 8499,
    rating: 4.9,
    badge: "LUXURY",
    image:
      "/women/lehenga-04.jpg",
  },



  {
    id: 601,
    name: "Floral Summer Dress",
    category: "dresses",
    type: "Dresses",
    material: "Cotton",
    colour: "White",
    price: 1299,
    oldPrice: 1999,
    rating: 4.5,
    badge: "NEW",
    image:
      "floral-01.jpg",
  },
  {
    id: 602,
    name: "Elegant Black Evening Dress",
    category: "dresses",
    type: "Dresses",
    material: "Chiffon",
    colour: "Black",
    price: 1899,
    oldPrice: 2999,
    rating: 4.7,
    badge: "TRENDING",
    image:
      "black dress-01.jpg",
  },
  {
    id: 603,
    name: "Pastel Women's Midi Dress",
    category: "dresses",
    type: "Dresses",
    material: "Polyester",
    colour: "Pink",
    price: 1499,
    oldPrice: 2299,
    rating: 4.6,
    badge: "POPULAR",
    image:
      "pastel-01.jpg",
  },


  {
    id: 701,
    name: "Floral Printed Women's Frock",
    category: "frocks",
    type: "Frocks",
    material: "Cotton",
    colour: "Pink",
    price: 1199,
    oldPrice: 1799,
    rating: 4.5,
    badge: "NEW",
    image:
      "new img-01.jpg",
  },
  {
    id: 702,
    name: "Elegant Party Frock",
    category: "frocks",
    type: "Frocks",
    material: "Chiffon",
    colour: "Black",
    price: 1499,
    oldPrice: 2299,
    rating: 4.7,
    badge: "PARTY",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85",
  },



  {
    id: 801,
    name: "Women's White Casual Top",
    category: "tops",
    type: "Tops",
    material: "Cotton",
    colour: "White",
    price: 699,
    oldPrice: 999,
    rating: 4.4,
    badge: "POPULAR",
    image:
      "whitedress-01.jpg"
  },
  {
    id: 802,
    name: "Women's Black Ribbed Top",
    category: "tops",
    type: "Tops",
    material: "Polyester",
    colour: "Black",
    price: 799,
    oldPrice: 1299,
    rating: 4.5,
    badge: "NEW",
    image:
      "black ribbed-01.jpg",
  },
  {
    id: 803,
    name: "Women's Pink Fashion Top",
    category: "tops",
    type: "Tops",
    material: "Cotton",
    colour: "Pink",
    price: 749,
    oldPrice: 1199,
    rating: 4.6,
    badge: "TRENDING",
    image:
      "pink-01.jpg",
  },



  {
    id: 901,
    name: "Women's Relaxed Fit T-Shirt",
    category: "tshirts",
    type: "T-Shirts",
    material: "Cotton",
    colour: "White",
    price: 599,
    oldPrice: 899,
    rating: 4.3,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 902,
    name: "Women's Pink Oversized T-Shirt",
    category: "tshirts",
    type: "T-Shirts",
    material: "Cotton",
    colour: "Pink",
    price: 649,
    oldPrice: 999,
    rating: 4.5,
    badge: "TRENDING",
    image:
      "pinkos-01.jpg",
  },
  {
    id: 903,
    name: "Women's Black Casual T-Shirt",
    category: "tshirts",
    type: "T-Shirts",
    material: "Cotton",
    colour: "Black",
    price: 699,
    oldPrice: 1099,
    rating: 4.6,
    badge: "BESTSELLER",
    image:
      "blackcas-01.jpg",
  },


  {
    id: 1001,
    name: "Women's Classic Blue Denim Jeans",
    category: "jeans",
    type: "Jeans",
    material: "Denim",
    colour: "Blue",
    price: 1499,
    oldPrice: 2499,
    rating: 4.6,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 1002,
    name: "Women's High Waist Denim Jeans",
    category: "jeans",
    type: "Jeans",
    material: "Denim",
    colour: "Blue",
    price: 1699,
    oldPrice: 2699,
    rating: 4.5,
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 1003,
    name: "Women's  skinny fit Jeans",
    category: "jeans",
    type: "Jeans",
    material: "Denim",
    colour: "Blue",
    price: 1799,
    oldPrice: 2899,
    rating: 4.7,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=700&q=85",
  },



  {
    id: 1101,
    name: "Women's Beige Wide Leg Trousers",
    category: "trousers",
    type: "Trousers",
    material: "Polyester",
    colour: "Brown",
    price: 1299,
    oldPrice: 1999,
    rating: 4.5,
    badge: "NEW",
    image:
      "wide-01.jpg",
  },
  {
    id: 1102,
    name: "Women's Black Formal Trousers",
    category: "trousers",
    type: "Trousers",
    material: "Polyester",
    colour: "Black",
    price: 1399,
    oldPrice: 2199,
    rating: 4.7,
    badge: "OFFICE",
    image:
      "blacktrouser-01.jpg",
  },
  {
    id: 1103,
    name: "Women's Cream Straight Trousers",
    category: "trousers",
    type: "Trousers",
    material: "Cotton",
    colour: "White",
    price: 1199,
    oldPrice: 1799,
    rating: 4.5,
    badge: "POPULAR",
    image:
      "creamwhite-01.jpg",
  },



  {
    id: 1201,
    name: "Women's Pleated Midi Skirt",
    category: "skirts",
    type: "Skirts",
    material: "Polyester",
    colour: "Black",
    price: 999,
    oldPrice: 1599,
    rating: 4.5,
    badge: "TRENDING",
    image:
      "pleatedskirt.jpg",
  },
  {
    id: 1202,
    name: "Women's Floral Maxi Skirt",
    category: "skirts",
    type: "Skirts",
    material: "Cotton",
    colour: "Pink",
    price: 1099,
    oldPrice: 1699,
    rating: 4.6,
    badge: "NEW",
    image:
      "floraldress.jpg",
  },
  {
    id: 1203,
    name: "Women's Denim Mini Skirt",
    category: "skirts",
    type: "Skirts",
    material: "Denim",
    colour: "Blue",
    price: 899,
    oldPrice: 1399,
    rating: 4.4,
    badge: "CASUAL",
    image:
      "denimskirt.jpg",
  },



  {
    id: 1301,
    name: "Women's Casual Denim Jacket",
    category: "jackets",
    type: "Jackets",
    material: "Denim",
    colour: "Blue",
    price: 1799,
    oldPrice: 2799,
    rating: 4.6,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 1302,
    name: "Women's Beige Casual Jacket",
    category: "jackets",
    type: "Jackets",
    material: "Polyester",
    colour: "Brown",
    price: 1899,
    oldPrice: 2999,
    rating: 4.7,
    badge: "TRENDING",
    image:
      "beige.jpg",
  },


  {
    id: 1401,
    name: "Women's Activewear Set",
    category: "sportswear",
    type: "Sportswear",
    material: "Polyester",
    colour: "Black",
    price: 1299,
    oldPrice: 1999,
    rating: 4.6,
    badge: "TRENDING",
    image:
      "grey.jpg",
  },
  {
    id: 1402,
    name: "Women's Pink Fitness Set",
    category: "sportswear",
    type: "Sportswear",
    material: "Polyester",
    colour: "Pink",
    price: 1399,
    oldPrice: 2199,
    rating: 4.7,
    badge: "NEW",
    image:
      "pinkfit.jpg",
  },



  {
    id: 1501,
    name: "Women's Pink Cotton Night Suit",
    category: "nightwear",
    type: "Nightwear",
    material: "Cotton",
    colour: "Pink",
    price: 899,
    oldPrice: 1299,
    rating: 4.5,
    badge: "COMFORT",
    image:
      "night.jpg",
  },
  {
    id: 1502,
    name: "Women's Floral Sleepwear Set",
    category: "nightwear",
    type: "Nightwear",
    material: "Cotton",
    colour: "Blue",
    price: 999,
    oldPrice: 1499,
    rating: 4.6,
    badge: "NEW",
    image:
      "floralnightwear.jpg",
  },
  {
    id: 1503,
    name: "Women's Satin Lounge Set",
    category: "nightwear",
    type: "Nightwear",
    material: "Polyester",
    colour: "Black",
    price: 1299,
    oldPrice: 1999,
    rating: 4.7,
    badge: "PREMIUM",
    image:
      "satin.jpg",
  },



  {
    id: 1601,
    name: "Women's White Casual Sneakers",
    category: "footwear",
    type: "Footwear",
    material: "Synthetic",
    colour: "White",
    price: 1499,
    oldPrice: 2499,
    rating: 4.6,
    badge: "BESTSELLER",
    image:
      "sneaker.jpg",
  },
  {
    id: 1602,
    name: "Women's Beige Fashion Heels",
    category: "footwear",
    type: "Footwear",
    material: "Synthetic",
    colour: "Brown",
    price: 1399,
    oldPrice: 2199,
    rating: 4.5,
    badge: "PARTY",
    image:
      "beigeheel.jpg",
  },
  {
    id: 1603,
    name: "Women's Everyday Sandals",
    category: "footwear",
    type: "Footwear",
    material: "Synthetic",
    colour: "Brown",
    price: 799,
    oldPrice: 1199,
    rating: 4.4,
    badge: "CASUAL",
    image:
      "/women/everyday.jpg",
  },
  {
    id: 1604,
    name: "Women's Ortho Comfort Daily Slippers",
    category: "footwear",
    type: "Slippers",
    material: "EVA",
    colour: "Brown",
    price: 699,
    oldPrice: 1099,
    rating: 4.6,
    badge: "COMFORT",
    image:
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 1605,
    name: "Women's Velvet Ethnic Embroidered Slippers",
    category: "footwear",
    type: "Slippers",
    material: "Velvet",
    colour: "Red",
    price: 999,
    oldPrice: 1499,
    rating: 4.7,
    badge: "ETHNIC",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85",
  },

  /* ===================== HANDBAGS ===================== */

  {
    id: 1701,
    name: "Elegant Brown Women's Handbag",
    category: "handbags",
    type: "Handbags",
    material: "Leather",
    colour: "Brown",
    price: 1799,
    oldPrice: 2999,
    rating: 4.7,
    badge: "TRENDING",
    image:
      "brownbag.jpg",
  },
  {
    id: 1702,
    name: "Classic Black Party Handbag",
    category: "handbags",
    type: "Handbags",
    material: "Leather",
    colour: "Black",
    price: 1999,
    oldPrice: 3499,
    rating: 4.6,
    badge: "PREMIUM",
    image:
      "blackhand.jpg",
  },
  {
    id: 1703,
    name: "Pink Mini Women's Bag",
    category: "handbags",
    type: "Handbags",
    material: "Leather",
    colour: "Pink",
    price: 1599,
    oldPrice: 2499,
    rating: 4.5,
    badge: "NEW",
    image:
      "pinkhandbag.jpg",
  },

  /* ===================== JEWELLERY ===================== */

  {
    id: 1801,
    name: "Pearl Fashion Necklace",
    category: "jewellery",
    type: "Jewellery",
    material: "Metal",
    colour: "Pearl",
    price: 999,
    oldPrice: 1599,
    rating: 4.8,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 1802,
    name: "Elegant Diamond Earrings",
    category: "jewellery",
    type: "Jewellery",
    material: "Metal",
    colour: "royal blue",
    price: 699,
    oldPrice: 1199,
    rating: 4.7,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85",
  },

  /* ===================== WATCHES ===================== */

  {
    id: 1901,
    name: "Classic Women's Gold Watch",
    category: "watches",
    type: "Watches",
    material: "Metal",
    colour: "Gold",
    price: 1299,
    oldPrice: 1999,
    rating: 4.5,
    badge: "NEW",
    image:
      "goldwatch.jpg",
  },
  {
    id: 1902,
    name: "Women's Minimal Gold Watch",
    category: "watches",
    type: "Watches",
    material: "Metal",
    colour: "Gold",
    price: 1499,
    oldPrice: 2299,
    rating: 4.6,
    badge: "Women's Minimal Gold Watch",
    image:
      "goldwatchh.jpg",
  },

  /* ===================== SUNGLASSES ===================== */

  {
    id: 2001,
    name: "Women's Premium Black Sunglasses",
    category: "sunglasses",
    type: "Sunglasses",
    material: "Acetate",
    colour: "Black",
    price: 899,
    oldPrice: 1499,
    rating: 4.4,
    badge: "TRENDING",
    image:
      "blackcooler.jpg",
  },
  {
    id: 2002,
    name: "Women's Brown Fashion Sunglasses",
    category: "sunglasses",
    type: "Sunglasses",
    material: "Acetate",
    colour: "Brown",
    price: 999,
    oldPrice: 1599,
    rating: 4.5,
    badge: "NEW",
    image:
      "browncooler.jpg",
  },

  /* ===================== BELTS ===================== */

  {
    id: 2101,
    name: "Women's Classic Brown Belt",
    category: "belts",
    type: "Belts",
    material: "Leather",
    colour: "Brown",
    price: 599,
    oldPrice: 899,
    rating: 4.4,
    badge: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2102,
    name: "Women's Black Fashion Belt",
    category: "belts",
    type: "Belts",
    material: "Leather",
    colour: "Black",
    price: 699,
    oldPrice: 999,
    rating: 4.5,
    badge: "NEW",
    image:
      "blackbelt.jpg",
  },

  /* ===================== BEAUTY & MAKEUP ===================== */

  {
    id: 2201,
    name: "Minimal Beauty Makeup Edit",
    category: "beauty",
    type: "Beauty & Makeup",
    material: "Beauty Essentials",
    colour: "Neutral",
    price: 1299,
    oldPrice: 1899,
    rating: 4.7,
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=85",
  },
];

/* =========================================================
   CATEGORY LIST
   ========================================================= */

const categories = [
  ["all", "All Women"],
  ["tshirts", "T-Shirts"],
  ["tops", "Tops"],
  ["dresses", "Dresses"],
  ["frocks", "Frocks"],
  ["jeans", "Jeans"],
  ["trousers", "Trousers"],
  ["skirts", "Skirts"],
  ["kurtis", "Kurtis"],
  ["chudidars", "Chudidars"],
  ["salwar", "Salwar Suits"],
  ["sarees", "Sarees"],
  ["lehengas", "Lehengas"],
  ["jackets", "Jackets"],
  ["sportswear", "Sportswear"],
  ["nightwear", "Nightwear"],
  ["footwear", "Footwear"],
  ["handbags", "Handbags"],
  ["jewellery", "Jewellery"],
  ["watches", "Watches"],
  ["sunglasses", "Sunglasses"],
  ["belts", "Belts"],
  ["beauty", "Beauty & Makeup"],
];

/* =========================================================
   WOMEN CATEGORY
   ========================================================= */

function WomenCategory() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [material, setMaterial] = useState("All");
  const [colour, setColour] = useState("All");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(10000);

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  /* ================= TRY ON ================= */

  const [tryOnProduct, setTryOnProduct] = useState(null);
  const [tryOnImage, setTryOnImage] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const [quickProduct, setQuickProduct] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => {
    if (!cameraOpen) return;
    if (!videoRef.current) return;
    if (!streamRef.current) return;

    const video = videoRef.current;

    video.srcObject = streamRef.current;

    const playVideo = async () => {
      try {
        await video.play();
        setCameraReady(true);
      } catch (error) {
        // Ignore browser interruption errors
        if (error.name !== "AbortError") {
          console.error("Camera playback error:", error);
        }
      }
    };

    playVideo();
  }, [cameraOpen]);
  /* =====================================================
     READ CATEGORY FROM URL
     ===================================================== */

  useEffect(() => {
    const path = window.location.pathname;

    const slug = path
      .split("/")
      .filter(Boolean)
      .pop();

    const valid = categories.some(
      ([id]) => id === slug
    );

    if (valid) {
      setSelectedCategory(slug);
    }
  }, []);

  /* =====================================================
     FILTER + SORT
     ===================================================== */

  const filteredProducts = products
    .filter((product) => {
      const categoryMatch =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const materialMatch =
        material === "All" ||
        product.material === material;

      const colourMatch =
        colour === "All" ||
        product.colour === colour;

      const priceMatch =
        product.price <= maxPrice;

      return (
        categoryMatch &&
        materialMatch &&
        colourMatch &&
        priceMatch
      );
    })
    .sort((a, b) => {
      if (sort === "low") {
        return a.price - b.price;
      }

      if (sort === "high") {
        return b.price - a.price;
      }

      if (sort === "rating") {
        return b.rating - a.rating;
      }

      if (sort === "new") {
        return b.id - a.id;
      }

      return 0;
    });

  /* =====================================================
     CATEGORY CHANGE
     ===================================================== */

  const changeCategory = (category) => {
    setSelectedCategory(category);

    if (category === "all") {
      window.history.pushState(
        {},
        "",
        "/women"
      );
    } else {
      window.history.pushState(
        {},
        "",
        `/women/${category}`
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     RESET FILTERS
     ===================================================== */

  const clearFilters = () => {
    setMaterial("All");
    setColour("All");
    setMaxPrice(10000);
    setSort("featured");
  };

  /* =====================================================
     WISHLIST
     ===================================================== */

  const toggleWishlist = (id) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter(
          (item) => item !== id
        )
        : [...current, id]
    );
  };

  /* =====================================================
     ADD TO CART
     ===================================================== */

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

    alert(`${product.name} added to cart.`);
  };

  /* =====================================================
     BUY NOW
     ===================================================== */

  const buyNow = (product) => {
    const checkoutItem = {
      ...product,
      quantity: 1,
    };

    sessionStorage.setItem(
      "veyraaCheckoutItem",
      JSON.stringify(checkoutItem)
    );

    alert(
      `Proceeding to checkout for ${product.name}`
    );
  };

  /* =====================================================
     QUICK VIEW
     ===================================================== */

  const openQuickView = (product) => {
    setQuickProduct(product);
  };

  const closeQuickView = () => {
    setQuickProduct(null);
  };

  /* =====================================================
     VIRTUAL TRY-ON OPEN
     ===================================================== */

  const openTryOn = (product) => {
    setTryOnProduct(product);
    setTryOnImage(null);
    setCameraOpen(false);
    setCameraReady(false);
  };

  /* =====================================================
     CLOSE TRY-ON
     ===================================================== */

  const closeTryOn = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    streamRef.current = null;

    setCameraOpen(false);
    setCameraReady(false);
    setTryOnProduct(null);
    setTryOnImage(null);
  };

  /* =====================================================
     CAMERA
     ===================================================== */

  const startCamera = async () => {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Camera is not supported. Please upload your photo."
        );
        return;
      }

      // Stop any previous camera stream
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      // First render the video element
      setCameraReady(false);
      setCameraOpen(true);

    } catch (error) {
      console.error("Camera error:", error);

      alert(
        "Camera permission was not available. Please use Upload Your Photo."
      );

      setCameraOpen(false);
      setCameraReady(false);
    }
  };

  /* =====================================================
     CAPTURE PHOTO
     ===================================================== */

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video =
      videoRef.current;

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      alert(
        "Camera is still loading. Please try again."
      );

      return;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const image =
      canvas.toDataURL(
        "image/png"
      );

    setTryOnImage(image);

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    }

    streamRef.current = null;

    setCameraOpen(false);
    setCameraReady(false);
  };

  /* =====================================================
     UPLOAD PHOTO
     ===================================================== */

  const uploadPhoto = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image file."
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setTryOnImage(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     CURRENT TITLE
     ===================================================== */

  const currentTitle =
    selectedCategory === "all"
      ? "Women's Fashion"
      : categories.find(
        ([id]) =>
          id === selectedCategory
      )?.[1];

  /* =====================================================
     JSX
     ===================================================== */

  return (
    <>
      <Navbar />

      <div className="women-category-page">

        {/* =================================================
            WOMEN HERO — SAME PREMIUM CATALOG STYLE AS MEN
        ================================================= */}

        <section
          className="women-fashion-hero"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(45, 28, 32, 0.94), rgba(45, 28, 32, 0.62), rgba(45, 28, 32, 0.12)), url("/women/saree-01.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="women-hero-content">
            <span className="women-hero-label">
              VEYRAA WOMEN'S COLLECTION
            </span>

            <h1>
              Modern Style.
              <br />
              <em>Made for Her.</em>
            </h1>

            <p>
              Discover elegant ethnic wear, modern western styles,
              everyday essentials and occasion-ready fashion.
            </p>

            <button
              className="women-hero-button"
              onClick={() =>
                document
                  .querySelector(".women-shop-layout")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Collection →
            </button>

            <div className="women-hero-count">
              <strong>{products.length}</strong>
              <span>CURATED<br />STYLES</span>
            </div>
          </div>
        </section>

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="women-catalog-header">

          {/* CATEGORY PILLS */}

          <div className="women-category-pills">

            {categories.map(
              ([id, name]) => (
                <button
                  key={id}
                  className={
                    selectedCategory === id
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    changeCategory(id)
                  }
                >
                  {name}
                </button>
              )
            )}

          </div>

        </section>

        {/* =================================================
          SHOP AREA
      ================================================= */}

        <section className="women-shop-layout">

          {/* =================================================
            FILTER SIDEBAR
        ================================================= */}

          <aside className="women-filters">

            <div className="filter-title">

              <h2>
                Filters
              </h2>

              <button
                onClick={
                  clearFilters
                }
              >
                Clear
              </button>

            </div>

            {/* PRICE */}

            <div className="filter-block">

              <h3>
                Price
              </h3>

              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <div className="price-range">

                <span>
                  ₹500
                </span>

                <strong>
                  ₹{maxPrice}
                </strong>

              </div>

            </div>

            {/* MATERIAL */}

            <div className="filter-block">

              <h3>
                Material
              </h3>

              {[
                "All",
                "Cotton",
                "Silk",
                "Georgette",
                "Denim",
                "Chiffon",
                "Polyester",
                "Rayon",
                "Leather",
                "Metal",
                "Acetate",
                "Synthetic",
              ].map(
                (item) => (
                  <label
                    key={item}
                  >
                    <input
                      type="radio"
                      name="material"
                      checked={
                        material ===
                        item
                      }
                      onChange={() =>
                        setMaterial(
                          item
                        )
                      }
                    />

                    {item}
                  </label>
                )
              )}

            </div>

            {/* COLOUR */}

            <div className="filter-block">

              <h3>
                Colour
              </h3>

              <select
                value={colour}
                onChange={(e) =>
                  setColour(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Colours
                </option>

                <option>
                  Black
                </option>

                <option>
                  White
                </option>

                <option>
                  Red
                </option>

                <option>
                  Pink
                </option>

                <option>
                  Blue
                </option>

                <option>
                  Purple
                </option>

                <option>
                  Brown
                </option>

                <option>
                  Gold
                </option>

                <option>
                  Green
                </option>

              </select>

            </div>

            {/* DISCOVERY */}

            <div className="filter-block">

              <h3>
                Fashion Discovery
              </h3>

              <button
                className="filter-link"
                onClick={() =>
                  setSort("new")
                }
              >
                New Arrivals
              </button>

              <button
                className="filter-link"
                onClick={() =>
                  setSort("rating")
                }
              >
                Trending Now
              </button>

              <button
                className="filter-link"
                onClick={() =>
                  setSort("rating")
                }
              >
                Best Sellers
              </button>

              <button
                className="filter-link"
                onClick={() =>
                  setMaxPrice(2000)
                }
              >
                Deals & Offers
              </button>

              <button
                className="filter-link"
                onClick={() =>
                  setSort("rating")
                }
              >
                Recommended For You
              </button>

            </div>

            {/* OCCASION */}

            <div className="filter-block">

              <h3>
                Occasion
              </h3>

              <label>
                <input type="checkbox" />
                Casual
              </label>

              <label>
                <input type="checkbox" />
                Office
              </label>

              <label>
                <input type="checkbox" />
                Party
              </label>

              <label>
                <input type="checkbox" />
                Wedding
              </label>

              <label>
                <input type="checkbox" />
                Festival
              </label>

            </div>

          </aside>

          {/* =================================================
            PRODUCTS
        ================================================= */}

          <main className="women-products-area">

            {/* TOOLBAR */}

            <div className="products-toolbar">

              <div>

                <strong>
                  {
                    filteredProducts.length
                  }
                </strong>{" "}

                Products

              </div>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(
                    e.target.value
                  )
                }
              >

                <option value="featured">
                  Sort by: Featured
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

                <option value="new">
                  New Arrivals
                </option>

              </select>

            </div>

            {/* PRODUCT GRID */}

            <div className="women-products-grid">

              {filteredProducts.map(
                (product) => (

                  <article
                    className="women-product-card"
                    key={product.id}
                  >

                    {/* PRODUCT IMAGE */}

                    <div
                      className="product-image-box"
                      onClick={() => {
                        window.location.href = `/products/${encodeURIComponent(product.id)}?catalog=Women`;
                      }}
                      style={{ cursor: "pointer" }}
                    >

                      <img
                        src={
                          product.image.startsWith("/") || product.image.startsWith("http")
                            ? encodeURI(product.image)
                            : encodeURI(`/women/${product.image}`)
                        }
                        alt={
                          product.name
                        }
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/women/saree-01.jpg";
                        }}
                      />

                      <span className="product-badge">
                        {
                          product.badge
                        }
                      </span>

                      {/* WISHLIST */}

                      <button
                        className="wishlist-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(
                            product.id
                          );
                        }}
                      >
                        {
                          wishlist.includes(
                            product.id
                          )
                            ? "♥"
                            : "♡"
                        }
                      </button>

                      {/* TRY ON */}

                      <button
                        type="button"
                        className="try-on-button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openTryOn(product);
                        }}
                      >
                        ✦ Virtual Try-On
                      </button>

                    </div>

                    {/* PRODUCT INFORMATION */}

                    <div className="product-information">

                      <div className="product-rating">
                        ★{" "}
                        {
                          product.rating
                        }
                      </div>

                      <span className="product-category">

                        WOMEN ·{" "}
                        {product.type.toUpperCase()}

                      </span>

                      <h2
                        onClick={() => {
                          window.location.href = `/products/${encodeURIComponent(product.id)}?catalog=Women`;
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {
                          product.name
                        }
                      </h2>

                      <p>
                        {
                          product.material
                        }{" "}
                        ·{" "}
                        {
                          product.colour
                        }
                      </p>

                      <div className="product-price">

                        ₹
                        {
                          product.price
                        }

                        <del>
                          ₹
                          {
                            product.oldPrice
                          }
                        </del>

                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="product-actions">

                        <button
                          className="cart-button"
                          onClick={() =>
                            addToCart(
                              product
                            )
                          }
                        >
                          🛒 Add to Cart
                        </button>

                        <button
                          className="buy-button"
                          onClick={() =>
                            buyNow(
                              product
                            )
                          }
                        >
                          Buy Now
                        </button>

                      </div>

                      {/* VIEW PRODUCT BUTTON */}

                      <a
                        className="quick-view-button"
                        href={`/products/${encodeURIComponent(product.id)}?catalog=Women`}
                        style={{ textDecoration: "none", display: "block", textAlign: "center" }}
                      >
                        View Product →
                      </a>

                    </div>

                  </article>

                )
              )}

            </div>

            {/* NO PRODUCTS */}

            {filteredProducts.length ===
              0 && (

                <div className="no-products">

                  <h2>
                    No products found
                  </h2>

                  <p>
                    Try changing your
                    filters or category.
                  </p>

                </div>

              )}

          </main>

        </section>

        {/* =================================================
          CART SUMMARY
      ================================================= */}

        {cart.length > 0 && (

          <div className="veyraa-cart-floating">

            🛒{" "}
            {cart.reduce(
              (total, item) =>
                total +
                (item.quantity ||
                  1),
              0
            )}{" "}
            items in cart

          </div>

        )}

        {/* =================================================
          QUICK VIEW MODAL
      ================================================= */}

        {quickProduct && (

          <div className="tryon-overlay">

            <div className="tryon-modal">

              <button
                className="tryon-close"
                onClick={
                  closeQuickView
                }
              >
                ×
              </button>

              <span className="tryon-eyebrow">
                VEYRAA QUICK VIEW
              </span>

              <h2>
                {
                  quickProduct.name
                }
              </h2>

              <div className="tryon-result">

                <div className="tryon-preview">

                  <img
                    src={
                      quickProduct.image
                    }
                    alt={
                      quickProduct.name
                    }
                  />

                </div>

                <div className="tryon-result-info">

                  <h3>
                    ₹
                    {
                      quickProduct.price
                    }
                  </h3>

                  <p>
                    {
                      quickProduct.material
                    }{" "}
                    ·{" "}
                    {
                      quickProduct.colour
                    }
                  </p>

                  <p>
                    ★{" "}
                    {
                      quickProduct.rating
                    }
                  </p>

                  <button
                    className="tryon-cart-button"
                    onClick={() => {
                      addToCart(
                        quickProduct
                      );

                      closeQuickView();
                    }}
                  >
                    🛒 Add to Cart
                  </button>

                  <button
                    className="tryon-cart-button"
                    onClick={() =>
                      buyNow(
                        quickProduct
                      )
                    }
                  >
                    Buy Now
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
          VIRTUAL TRY-ON
      ================================================= */}

        {tryOnProduct && (

          <div className="tryon-overlay">

            <div className="tryon-modal">

              <button
                className="tryon-close"
                onClick={
                  closeTryOn
                }
              >
                ×
              </button>

              <span className="tryon-eyebrow">
                VEYRAA SMART FIT
              </span>

              <h2>
                Virtual Try-On
              </h2>

              <p>
                See how{" "}
                <strong>
                  {
                    tryOnProduct.name
                  }
                </strong>{" "}
                could look with your
                photo.
              </p>

              {/* PHOTO INPUT */}

              {/* =====================================================
    VEYRAA VIRTUAL TRY-ON
===================================================== */}

              {tryOnProduct && (
                <div
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(20, 15, 18, 0.72)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    zIndex: 99999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                  }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      closeTryOn();
                    }
                  }}
                >

                  <div
                    style={{
                      width: "min(900px, 96vw)",
                      maxHeight: "90vh",
                      overflowY: "auto",
                      background: "#fff",
                      borderRadius: "24px",
                      padding: "30px",
                      position: "relative",
                      boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
                    }}
                  >

                    {/* CLOSE */}

                    <button
                      type="button"
                      onClick={closeTryOn}
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        border: "1px solid #eadfe2",
                        background: "#fff",
                        fontSize: "24px",
                        cursor: "pointer",
                        zIndex: 5,
                      }}
                    >
                      ×
                    </button>

                    {/* HEADER */}

                    <div
                      style={{
                        textAlign: "center",
                        marginBottom: "25px",
                      }}
                    >

                      <span
                        style={{
                          display: "block",
                          fontSize: "11px",
                          fontWeight: 800,
                          letterSpacing: "3px",
                          color: "#c22d61",
                          marginBottom: "8px",
                        }}
                      >
                        VEYRAA SMART FIT
                      </span>

                      <h2
                        style={{
                          margin: 0,
                          fontFamily: "Georgia, serif",
                          fontSize: "34px",
                          color: "#211d1e",
                        }}
                      >
                        Virtual Try-On
                      </h2>

                      <p
                        style={{
                          marginTop: "10px",
                          color: "#71666a",
                        }}
                      >
                        See how{" "}
                        <strong>{tryOnProduct.name}</strong>{" "}
                        could look with your photo.
                      </p>

                    </div>

                    {/* PHOTO SELECTION */}

                    {!tryOnImage && !cameraOpen && (

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(2, minmax(0, 1fr))",
                          gap: "18px",
                          marginTop: "20px",
                        }}
                      >

                        {/* CAMERA */}

                        <button
                          type="button"
                          onClick={startCamera}
                          style={{
                            minHeight: "150px",
                            borderRadius: "18px",
                            border: "1px solid #eadfe2",
                            background: "#fff7fa",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#c22d61",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "32px",
                              marginBottom: "10px",
                            }}
                          >
                            📷
                          </div>

                          Use Camera

                          <small
                            style={{
                              display: "block",
                              marginTop: "8px",
                              color: "#777",
                              fontWeight: 400,
                            }}
                          >
                            Take a photo instantly
                          </small>
                        </button>

                        {/* UPLOAD */}

                        <label
                          style={{
                            minHeight: "150px",
                            borderRadius: "18px",
                            border: "1px solid #eadfe2",
                            background: "#fff",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#c22d61",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                          }}
                        >

                          <div
                            style={{
                              fontSize: "32px",
                              marginBottom: "10px",
                            }}
                          >
                            🖼
                          </div>

                          Upload Your Photo

                          <small
                            style={{
                              display: "block",
                              marginTop: "8px",
                              color: "#777",
                              fontWeight: 400,
                            }}
                          >
                            Choose a photo from your device
                          </small>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={uploadPhoto}
                            style={{ display: "none" }}
                          />

                        </label>

                      </div>
                    )}

                    {/* CAMERA */}

                    {cameraOpen && (

                      <div
                        style={{
                          textAlign: "center",
                        }}
                      >

                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          style={{
                            width: "100%",
                            maxHeight: "500px",
                            objectFit: "cover",
                            borderRadius: "18px",
                            background: "#111",
                          }}
                        />

                        {cameraReady && (

                          <button
                            type="button"
                            onClick={capturePhoto}
                            style={{
                              marginTop: "18px",
                              padding: "14px 28px",
                              border: "none",
                              borderRadius: "12px",
                              background: "#c22d61",
                              color: "#fff",
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            📸 Capture Photo
                          </button>

                        )}

                      </div>

                    )}

                    {/* PHOTO RESULT */}

                    {tryOnImage && (

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap: "28px",
                          alignItems: "center",
                        }}
                      >

                        {/* USER PHOTO */}

                        <div>

                          <img
                            src={tryOnImage}
                            alt="Customer"
                            style={{
                              width: "100%",
                              maxHeight: "500px",
                              objectFit: "cover",
                              borderRadius: "18px",
                              display: "block",
                            }}
                          />

                        </div>

                        {/* PRODUCT INFO */}

                        <div>

                          <span
                            style={{
                              color: "#c22d61",
                              fontSize: "11px",
                              fontWeight: 800,
                              letterSpacing: "2px",
                            }}
                          >
                            YOUR LOOK
                          </span>

                          <h3
                            style={{
                              fontSize: "25px",
                              margin: "10px 0",
                              color: "#211d1e",
                            }}
                          >
                            {tryOnProduct.name}
                          </h3>

                          <p
                            style={{
                              color: "#777",
                            }}
                          >
                            {tryOnProduct.material} ·{" "}
                            {tryOnProduct.colour}
                          </p>

                          <h3
                            style={{
                              fontSize: "24px",
                              margin: "18px 0",
                            }}
                          >
                            ₹{tryOnProduct.price}
                          </h3>

                          <p
                            style={{
                              color: "#71666a",
                              lineHeight: 1.6,
                            }}
                          >
                            Your photo is ready for the
                            Veyraa Smart Fit preview.
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              addToCart(tryOnProduct);
                              closeTryOn();
                            }}
                            style={{
                              width: "100%",
                              padding: "14px",
                              border: "none",
                              borderRadius: "12px",
                              background: "#c22d61",
                              color: "#fff",
                              fontWeight: 700,
                              cursor: "pointer",
                              marginTop: "12px",
                            }}
                          >
                            🛒 Add This Look to Cart
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTryOnImage(null);
                            }}
                            style={{
                              width: "100%",
                              padding: "13px",
                              border: "1px solid #c22d61",
                              borderRadius: "12px",
                              background: "#fff",
                              color: "#c22d61",
                              fontWeight: 700,
                              cursor: "pointer",
                              marginTop: "10px",
                            }}
                          >
                            ← Change Photo
                          </button>

                        </div>

                      </div>

                    )}

                  </div>

                </div>
              )}

              {/* TRY-ON RESULT */}

              {tryOnImage && (

                <div className="tryon-result">

                  <div className="tryon-preview">

                    {/* USER IMAGE */}

                    <img
                      src={tryOnImage}
                      alt="Customer"
                    />

                  </div>

                  <div className="tryon-result-info">

                    <h3>
                      Virtual Try-On
                      Preview
                    </h3>

                    <p>
                      {
                        tryOnProduct.name
                      }
                    </p>

                    <p>
                      ₹
                      {
                        tryOnProduct.price
                      }
                    </p>

                    <small>
                      Your uploaded photo
                      is ready for the
                      Veyraa Smart Fit
                      experience.
                    </small>

                    {/* ADD LOOK */}

                    <button
                      className="tryon-cart-button"
                      onClick={() => {
                        addToCart(
                          tryOnProduct
                        );

                        closeTryOn();
                      }}
                    >
                      🛒 Add This Look
                      to Cart
                    </button>

                    {/* BUY NOW */}

                    <button
                      className="tryon-cart-button"
                      onClick={() =>
                        buyNow(
                          tryOnProduct
                        )
                      }
                    >
                      Buy This Look
                    </button>

                    {/* CHANGE PHOTO */}

                    <button
                      className="quick-view-button"
                      onClick={() =>
                        setTryOnImage(
                          null
                        )
                      }
                    >
                      ← Change Photo
                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        )}

      </div>
    </>
  );
}

export default WomenCategory;