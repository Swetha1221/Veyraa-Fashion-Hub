import React, { useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import VirtualTryOn from "../components/VirtualTryOn";

import { products as homeProducts } from "../data/homeData";
import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";

const normalize = (value) => String(value || "").toLowerCase().trim();

const catalogProducts = [
  ...homeProducts.map((item) => ({ ...item, audience: item.audience || "Women" })),
  ...womenProducts.map((item) => ({ ...item, audience: "Women" })),
  ...menProducts.map((item) => ({ ...item, audience: "Men" })),
  ...kidsProducts.map((item) => ({
    ...item,
    audience: item.audience || item.gender || "Kids",
  })),
];

function resolveImage(product) {
  const raw = String(product?.image || "").trim();
  if (!raw) return "";
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  if (/^\/(women|men|kids)\//i.test(raw)) return raw;

  const audience = normalize(product?.audience || product?.gender);
  if (["women", "men", "kids"].includes(audience)) {
    return `/${audience}/${raw.replace(/^\/+/, "")}`;
  }
  return raw;
}

function getCatalogFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const catalog = params.get("catalog");
  if (!catalog) return "";
  const value = normalize(catalog);
  if (value.includes("women")) return "Women";
  if (value.includes("men")) return "Men";
  if (value.includes("boy") || value.includes("girl") || value.includes("kid")) return "Kids";
  return catalog;
}

function getSourceLabel() {
  const source = normalize(new URLSearchParams(window.location.search).get("source"));
  if (source === "search") return "SEARCH RESULT";
  if (source === "new-arrivals") return "NEW ARRIVALS";
  if (source === "trending") return "TRENDING NOW";
  return "VEYRAA PRODUCT";
}

function productText(product) {
  return normalize([
    product?.name,
    product?.category,
    product?.type,
    product?.material,
  ].filter(Boolean).join(" "));
}

function isOneSize(product) {
  return /saree|dupatta|scarf|bag|handbag|purse|jewellery|jewelry|earring|necklace|bracelet|watch|wallet|belt|accessor|sunglass|sunglasses/.test(productText(product));
}

function getSizes(product) {
  const text = productText(product);

  if (isOneSize(product)) return [];
  if (/shoe|footwear|sandal|sneaker|slipper|heel|loafer|boot|juti|jutti/.test(text)) {
    return ["5", "6", "7", "8", "9", "10"];
  }
  if (/jean|trouser|pant|short|legging|palazzo|skirt/.test(text)) {
    return ["28", "30", "32", "34", "36", "38"];
  }
  if (/kids|boy|girl|child|frock|romper/.test(text) || normalize(product?.audience) === "kids") {
    return ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];
  }
  return ["XS", "S", "M", "L", "XL", "XXL"];
}

function getProductDescription(product) {
  if (product?.description) return product.description;
  const name = product?.name || "This Veyraa fashion product";
  const material = product?.material || "premium material";
  const type = product?.type || product?.category || "fashion piece";
  const colour = product?.colour || product?.color;
  return `${name} is a ${type.toLowerCase()} designed in ${material.toLowerCase()} for comfortable, versatile styling${colour ? ` in ${String(colour).toLowerCase()}` : ""}.`;
}

function getDetailItems(product) {
  const text = productText(product);
  const material = product?.material || "Premium fashion material";
  const colour = product?.colour || product?.color || "As shown";
  const category = product?.category || product?.type || "Fashion";
  const type = product?.type || category;

  let construction = `${material} construction with a comfortable finish.`;
  let usage = "Designed for easy everyday styling.";

  if (/handbag|bag|purse|wallet/.test(text)) {
    construction = `Made with ${material} for a structured, durable finish.`;
    usage = "Practical storage with an easy-to-style silhouette.";
  } else if (/shoe|footwear|sandal|sneaker|slipper|heel|loafer|boot/.test(text)) {
    construction = `${material} upper with a comfortable everyday sole/finish.`;
    usage = "Designed for comfortable movement and everyday wear.";
  } else if (/saree|kurti|dress|shirt|top|tshirt|t-shirt|kurta|lehenga|chudidar|frock/.test(text)) {
    construction = `${material} fabric with a comfortable fashion fit.`;
    usage = "Suitable for styling across everyday and occasion looks.";
  } else if (/jewellery|jewelry|earring|necklace|bracelet|watch|belt|sunglass/.test(text)) {
    construction = `${material} finish selected to complement the product design.`;
    usage = "An easy accessory for completing your outfit.";
  }

  return [
    ["CATEGORY", category],
    ["TYPE", type],
    ["MATERIAL", material],
    ["COLOUR", colour],
    ["DETAILING", construction],
    ["STYLE USE", usage],
  ];
}

function ProductDetail() {
  const productId = decodeURIComponent(window.location.pathname.split("/").filter(Boolean).pop() || "");
  const requestedCatalog = getCatalogFromUrl();
  const sourceLabel = getSourceLabel();

  const product = useMemo(() => {
    const sameId = catalogProducts.filter((item) => String(item?.id) === String(productId));

    if (requestedCatalog) {
      const wanted = normalize(requestedCatalog);
      const match = sameId.find((item) => {
        const audience = normalize(item?.audience || item?.gender);
        if (wanted === "kids") return ["kids", "boys", "girls"].includes(audience);
        return audience === wanted;
      });
      if (match) return match;
    }
    return sameId[0];
  }, [productId, requestedCatalog]);

  const sizes = useMemo(() => getSizes(product), [product]);
  const showSize = sizes.length > 0;
  const oneSizeLabel = isOneSize(product) ? "One Size" : "One Size / Standard";
  const image = resolveImage(product);
  const price = Number(product?.price) || 0;
  const oldPrice = Number(product?.oldPrice || product?.originalPrice || price) || price;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [wishlistActive, setWishlistActive] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
      return saved.some((item) =>
        String(item.id ?? item.name) === String(productId) &&
        (!requestedCatalog || normalize(item.audience || item.gender) === normalize(requestedCatalog))
      );
    } catch {
      return false;
    }
  });

  if (!product) {
    return (
      <div className="pd-page">
        <Navbar />
        <main className="pd-empty"><div className="pd-empty-card">
          <span>VEYRAA PRODUCT</span>
          <h1>Product Not Found</h1>
          <p>The selected product could not be found in the current Veyraa catalog.</p>
          <button type="button" onClick={() => window.history.back()}>← Go Back</button>
        </div></main>
        <Footer />
        <style>{styles}</style>
      </div>
    );
  }

  const addToCart = () => {
    if (showSize && !selectedSize) {
      setSizeError("Please select a size first.");
      return false;
    }

    try {
      const saved = JSON.parse(localStorage.getItem("veyraaCart")) || [];
      const productKey = String(product.id ?? product.name);
      const audience = String(product.audience || product.gender || "");
      const size = showSize ? selectedSize : "ONE-SIZE";
      const exists = saved.find((item) =>
        String(item.id ?? item.name) === productKey &&
        String(item.audience || item.gender || "") === audience &&
        String(item.selectedSize || "ONE-SIZE") === size
      );

      const item = {
        ...product,
        image,
        audience: product.audience || product.gender,
        selectedSize: size,
        quantity: 1,
      };

      const updated = exists
        ? saved.map((cartItem) =>
          String(cartItem.id ?? cartItem.name) === productKey &&
            String(cartItem.audience || cartItem.gender || "") === audience &&
            String(cartItem.selectedSize || "ONE-SIZE") === size
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        )
        : [...saved, item];

      localStorage.setItem("veyraaCart", JSON.stringify(updated));
      window.dispatchEvent(new Event("veyraa:cart-updated"));
      setSizeError("");
      setCartMessage(`${product.name} added to cart`);
      setTimeout(() => setCartMessage(""), 2200);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const buyNow = () => {
    if (addToCart()) window.location.href = "/billing";
  };

  const toggleWishlist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
      const key = String(product.id ?? product.name);
      const audience = String(product.audience || product.gender || "");
      const exists = saved.some((item) => String(item.id ?? item.name) === key && String(item.audience || item.gender || "") === audience);
      const updated = exists
        ? saved.filter((item) => !(String(item.id ?? item.name) === key && String(item.audience || item.gender || "") === audience))
        : [...saved, { ...product, image, audience }];
      localStorage.setItem("veyraaWishlist", JSON.stringify(updated));
      setWishlistActive(!exists);
    } catch (error) {
      console.error(error);
    }
  };

  const details = getDetailItems(product);

  return (
    <div className="pd-page">
      <Navbar />
      <main className="pd-main">
        <button className="pd-back" type="button" onClick={() => window.history.back()}>← Back to collection</button>
        <div className="pd-breadcrumb"><span>{sourceLabel}</span><b>•</b><span>{product.audience || product.gender || "Fashion"}</span><b>•</b><span>{product.type || product.category || "Product"}</span></div>

        <section className="pd-layout">
          <div className="pd-gallery">
            <div className="pd-image-wrap">
              {product.badge && <span className="pd-badge">{product.badge}</span>}
              {discount > 0 && <span className="pd-discount">{discount}% OFF</span>}
              <img src={image} alt={product.name} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
            <div className="pd-trust"><span>✓ Genuine Product</span><span>✓ Secure Payment</span><span>✓ Easy Returns</span></div>
          </div>

          <div className="pd-info">
            <div className="pd-category">{String(product.audience || product.gender || "VEYRAA").toUpperCase()} · {String(product.type || product.category || "FASHION").toUpperCase()}</div>
            <h1>{product.name}</h1>
            <div className="pd-rating">★ {Number(product.rating || 4.5).toFixed(1)} <span>{product.reviews ? `(${product.reviews} reviews)` : "Customer rating"}</span></div>
            <p className="pd-description">{getProductDescription(product)}</p>

            <div className="pd-price"><strong>₹{price.toLocaleString("en-IN")}</strong>{oldPrice > price && <del>₹{oldPrice.toLocaleString("en-IN")}</del>}{discount > 0 && <em>{discount}% OFF</em>}</div>

            <div className="pd-detail-grid">
              {details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </div>

            <div className="pd-size-section">
              <div className="pd-size-heading"><strong>{showSize ? "SELECT SIZE" : "SIZE"}</strong><span>{showSize ? "Choose before adding to cart" : "Standard / One Size"}</span></div>
              {showSize ? (
                <div className="pd-sizes">{sizes.map((size) => <button key={size} type="button" className={selectedSize === size ? "pd-size active" : "pd-size"} onClick={() => { setSelectedSize(size); setSizeError(""); }}>{size}</button>)}</div>
              ) : <div className="pd-one-size">ONE SIZE <small>Standard fit</small></div>}
              {sizeError && <p className="pd-error">{sizeError}</p>}
            </div>

            <div className="pd-actions">
              <button type="button" className={wishlistActive ? "pd-wishlist active" : "pd-wishlist"} onClick={toggleWishlist}>{wishlistActive ? "♥ Wishlisted" : "♡ Wishlist"}</button>
              <button type="button" className="pd-cart" onClick={addToCart}>Add to Cart</button>
              <button type="button" className="pd-buy" onClick={buyNow}>Buy Now</button>
            </div>
            {cartMessage && <div className="pd-success">✓ {cartMessage}</div>}

            <div className="pd-tryon"><VirtualTryOn product={{ ...product, image }} /></div>
          </div>
        </section>
      </main>
      <Footer />
      <style>{styles}</style>
    </div>
  );
}

const styles = `
*{box-sizing:border-box}.pd-page{min-height:100vh;background:#fbf8f7;color:#292326}.pd-main{max-width:1180px;margin:0 auto;padding:28px 24px 70px}.pd-back{border:0;background:transparent;color:#7e5260;font-weight:800;cursor:pointer;padding:8px 0;margin-bottom:8px}.pd-breadcrumb{display:flex;gap:9px;align-items:center;color:#8d7d81;font-size:11px;letter-spacing:1.1px;font-weight:800;margin-bottom:22px}.pd-breadcrumb span:first-child{color:#9a2e54}.pd-layout{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(420px,.98fr);gap:48px;align-items:start}.pd-gallery{position:sticky;top:20px}.pd-image-wrap{position:relative;border-radius:24px;overflow:hidden;background:#f0e9e6;min-height:620px;box-shadow:0 20px 55px rgba(45,25,30,.08)}.pd-image-wrap img{width:100%;height:620px;object-fit:cover;display:block}.pd-badge,.pd-discount{position:absolute;z-index:2;top:18px;padding:8px 12px;border-radius:999px;background:#fff;font-size:11px;font-weight:900;letter-spacing:.7px;box-shadow:0 8px 20px rgba(0,0,0,.08)}.pd-badge{left:18px}.pd-discount{right:18px;background:#8f2448;color:#fff}.pd-trust{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.pd-trust span{background:#fff;border:1px solid #eee1df;border-radius:999px;padding:9px 12px;font-size:11px;font-weight:800;color:#6c5c61}.pd-info{padding:6px 0}.pd-category{font-size:11px;letter-spacing:1.6px;font-weight:900;color:#9b3157;margin-bottom:12px}.pd-info h1{font-size:39px;line-height:1.06;margin:0 0 12px;letter-spacing:-1.2px}.pd-rating{font-size:14px;font-weight:900;margin-bottom:18px}.pd-rating span{color:#8b7d81;font-weight:600;margin-left:7px}.pd-description{font-size:15px;line-height:1.7;color:#6f6367;margin:0 0 20px}.pd-price{display:flex;align-items:center;gap:12px;padding:17px 0;border-top:1px solid #eadedc;border-bottom:1px solid #eadedc}.pd-price strong{font-size:29px}.pd-price del{color:#a3979a}.pd-price em{font-style:normal;color:#9a2c53;font-size:12px;font-weight:900}.pd-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:20px 0}.pd-detail-grid div{padding:14px;border:1px solid #eadfdd;border-radius:13px;background:#fff}.pd-detail-grid span{display:block;color:#98898e;font-size:9px;font-weight:900;letter-spacing:1.2px;margin-bottom:6px}.pd-detail-grid strong{display:block;font-size:13px;line-height:1.45}.pd-size-section{margin:20px 0}.pd-size-heading{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:12px}.pd-size-heading strong{font-size:12px;letter-spacing:1px}.pd-size-heading span{font-size:11px;color:#918388}.pd-sizes{display:flex;gap:9px;flex-wrap:wrap}.pd-size{min-width:52px;height:45px;padding:0 14px;border-radius:10px;border:1px solid #d9cccf;background:#fff;color:#40363a;font-weight:800;cursor:pointer}.pd-size:hover{border-color:#9d2d54}.pd-size.active{background:#92264b;color:#fff;border-color:#92264b;box-shadow:0 8px 18px rgba(146,38,75,.2)}.pd-one-size{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border:1px solid #d9cccf;border-radius:11px;background:#fff;font-size:12px;font-weight:900}.pd-one-size small{font-weight:600;color:#93868a}.pd-error{margin:9px 0 0;color:#b3264f;font-size:12px;font-weight:800}.pd-actions{display:grid;grid-template-columns:1fr 1.2fr 1.2fr;gap:10px;margin-top:22px}.pd-actions button{height:50px;border-radius:11px;font-weight:900;cursor:pointer}.pd-wishlist{border:1px solid #d9cccf;background:#fff;color:#4d4145}.pd-wishlist.active{color:#9d244d;border-color:#c98da2}.pd-cart{border:1px solid #92264b;background:#fff;color:#92264b}.pd-buy{border:1px solid #92264b;background:#92264b;color:#fff}.pd-success{margin-top:10px;padding:11px 13px;border-radius:10px;background:#edf8f1;color:#27734a;font-size:12px;font-weight:800}.pd-tryon{margin-top:18px}.pd-empty{min-height:60vh;display:grid;place-items:center;padding:40px}.pd-empty-card{max-width:520px;text-align:center;background:#fff;border:1px solid #eadfdd;border-radius:22px;padding:45px;box-shadow:0 20px 55px rgba(45,25,30,.08)}.pd-empty-card span{font-size:11px;font-weight:900;letter-spacing:1.4px;color:#9a2e54}.pd-empty-card h1{margin:12px 0}.pd-empty-card p{color:#766a6e;line-height:1.6}.pd-empty-card button{border:0;border-radius:10px;background:#92264b;color:#fff;padding:12px 18px;font-weight:800;cursor:pointer}@media(max-width:850px){.pd-main{padding:20px 15px 45px}.pd-layout{grid-template-columns:1fr;gap:25px}.pd-gallery{position:static}.pd-image-wrap,.pd-image-wrap img{min-height:420px;height:420px}.pd-info h1{font-size:31px}.pd-detail-grid{grid-template-columns:1fr}.pd-actions{grid-template-columns:1fr}.pd-trust span{font-size:10px}}
`;

export default ProductDetail;
