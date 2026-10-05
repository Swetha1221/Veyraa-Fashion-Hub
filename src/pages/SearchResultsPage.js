import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { products as womenProducts } from "../components/WomenFashion";
import { products as menProducts } from "../components/MenCategory";
import { kidsProducts } from "../components/KidsCategory";

const allProducts = [
  ...womenProducts.map(p => ({ ...p, gender: "Women", audience: "Women" })),
  ...menProducts.map(p => ({ ...p, gender: "Men", audience: "Men" })),
  ...kidsProducts.map(p => ({ ...p, gender: "Kids", audience: p.gender || "Kids" }))
];

function imageFor(product) {
  const raw = String(product?.image || "").trim();
  if (!raw) return "";
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  if (/^\/(women|men|kids)\//i.test(raw)) return raw;
  const a = String(product?.audience || product?.gender || "").toLowerCase();
  const folder = a === "women" ? "women" : a === "men" ? "men" : ["kids", "boys", "girls"].includes(a) ? "kids" : "";
  return folder ? encodeURI(`/${folder}/${raw.replace(/^\/+/, "")}`) : raw;
}

function textFor(product) {
  return [
    product?.name, product?.category, product?.type, product?.material,
    product?.colour, product?.color, product?.style, product?.fit, product?.badge
  ].filter(Boolean).join(" ").toLowerCase();
}

function discountFor(product) {
  const price = Number(product?.price) || 0;
  const old = Number(product?.oldPrice || product?.originalPrice || price) || price;
  return old > price ? Math.round(((old - price) / old) * 100) : 0;
}

function openProduct(product) {
  if (product?.id === undefined) return;
  const catalog = product.audience || product.gender || "Women";
  window.location.href =
    `/products/${encodeURIComponent(product.id)}?catalog=${encodeURIComponent(catalog)}&source=search`;
}

function SearchResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  const results = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // Do not expose the complete catalog when the Search page first opens.
    // Products appear only after the customer searches or selects a category.
    if (!term && category === "All") return [];

    let list = term
      ? allProducts.filter((product) => textFor(product).includes(term))
      : [...allProducts];

    if (category !== "All") {
      list = list.filter((product) => {
        const audience = String(product.audience || product.gender || "").toLowerCase();
        if (category === "Kids") return ["kids", "boys", "girls"].includes(audience);
        return audience === category.toLowerCase();
      });
    }

    list = [...list];

    // When searching, put the most relevant matches first instead of simply
    // exposing the catalog order.
    if (term && sort === "featured") {
      list.sort((a, b) => {
        const score = (product) => {
          const name = String(product.name || "").toLowerCase();
          const type = String(product.type || "").toLowerCase();
          const cat = String(product.category || "").toLowerCase();
          const badge = String(product.badge || "").toLowerCase();
          return (name === term ? 100 : 0)
            + (name.startsWith(term) ? 45 : 0)
            + (name.includes(term) ? 25 : 0)
            + (type.includes(term) ? 18 : 0)
            + (cat.includes(term) ? 12 : 0)
            + (badge.includes(term) ? 5 : 0);
        };
        return score(b) - score(a);
      });
    }

    if (sort === "low") list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    if (sort === "high") list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    if (sort === "discount") list.sort((a, b) => discountFor(b) - discountFor(a));

    return list;
  }, [searchTerm, category, sort]);

  return (
    <div className="veyraa-search-page">
      <Navbar />

      <main className="search-page-main">
        <section className="search-page-header">
          <span className="search-eyebrow">VEYRAA SEARCH</span>
          <h1>Find Your Next Look</h1>
          <p>Search across Veyraa fashion, clothing and accessories.</p>
        </section>

        <section className="search-controls">
          <div className="search-input-wrap">
            <span>⌕</span>
            <input
              autoFocus
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search kurti, saree, jeans, dress, shoes, bag..."
            />
            {searchTerm && (
              <button type="button" className="clear-search" onClick={() => setSearchTerm("")}>×</button>
            )}
          </div>

          <div className="search-filter-row">
            <div className="search-categories">
              {["All", "Women", "Men", "Kids"].map(item => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </section>

        <section className="search-results-section">
          <div className="search-results-heading">
            <div>
              <span>SEARCH RESULTS</span>
              <h2>{searchTerm.trim() ? `Results for "${searchTerm.trim()}"` : "Explore Veyraa"}</h2>
            </div>
            <strong>{results.length} products</strong>
          </div>

          {!results.length ? (
            <div className="search-empty">
              <div className="search-empty-icon">⌕</div>
              {!searchTerm.trim() && category === "All" ? (
                <>
                  <h2>Start your search</h2>
                  <p>Search for a product, category, material, colour or style to see matching Veyraa products.</p>
                </>
              ) : (
                <>
                  <h2>No products found</h2>
                  <p>Try another product name, category, colour or style.</p>
                  <button type="button" onClick={() => { setSearchTerm(""); setCategory("All"); }}>
                    Clear Search
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="search-product-grid">
              {results.map((product, index) => {
                const price = Number(product.price) || 0;
                const old = Number(product.oldPrice || product.originalPrice || price) || price;
                const discount = discountFor(product);

                return (
                  <article className="search-product-card" key={`${product.audience}-${product.id}-${index}`}>
                    <button
                      type="button"
                      className="search-product-image"
                      onClick={() => openProduct(product)}
                      aria-label={`View ${product.name}`}
                    >
                      <img src={imageFor(product)} alt={product.name} />
                      {product.badge && <span className="search-product-badge">{product.badge}</span>}
                    </button>

                    <div className="search-product-info">
                      <span className="search-product-category">
                        {product.audience} • {product.category || product.type || "Fashion"}
                      </span>

                      <button type="button" className="search-product-name" onClick={() => openProduct(product)}>
                        {product.name}
                      </button>

                      <div className="search-product-rating">
                        ★ {Number(product.rating || 4.5).toFixed(1)}
                      </div>

                      <div className="search-price-row">
                        <strong>₹{price.toLocaleString("en-IN")}</strong>
                        {old > price && <del>₹{old.toLocaleString("en-IN")}</del>}
                        {discount > 0 && <span>{discount}% OFF</span>}
                      </div>

                      <button type="button" className="search-view-product" onClick={() => openProduct(product)}>
                        View Product →
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />

      <style>{`
        .veyraa-search-page{min-height:100vh;background:#fbf8f7;color:#292326}
        .search-page-main{width:min(1400px,92%);margin:0 auto;padding:58px 0 80px}
        .search-page-header{padding:20px 0 30px}
        .search-eyebrow{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.16em;color:#92264b}
        .search-page-header h1{margin:8px 0;font-size:clamp(32px,5vw,56px);line-height:1.05}
        .search-page-header p{margin:0;color:#75676c;font-size:16px}
        .search-controls{background:#fff;border:1px solid #eadfdd;border-radius:22px;padding:20px;box-shadow:0 10px 35px rgba(45,25,30,.06)}
        .search-input-wrap{display:flex;align-items:center;gap:12px;min-height:58px;border:1px solid #d9cdd0;border-radius:16px;padding:0 16px;background:#fff}
        .search-input-wrap>span{font-size:25px;color:#92264b}
        .search-input-wrap input{flex:1;border:0;outline:0;background:transparent;font-size:16px;min-width:0}
        .clear-search{width:32px;height:32px;border:0;border-radius:50%;background:#f3e9ec;cursor:pointer;font-size:20px}
        .search-filter-row{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:16px;flex-wrap:wrap}
        .search-categories{display:flex;gap:8px;flex-wrap:wrap}
        .search-categories button{border:1px solid #e2d5d9;background:#fff;border-radius:999px;padding:9px 18px;cursor:pointer;font-weight:700}
        .search-categories button.active{background:#92264b;color:#fff;border-color:#92264b}
        .search-filter-row select{min-height:40px;border:1px solid #e2d5d9;border-radius:10px;padding:0 12px;background:#fff}
        .search-results-section{padding-top:45px}
        .search-results-heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}
        .search-results-heading span{font-size:11px;letter-spacing:.15em;font-weight:800;color:#92264b}
        .search-results-heading h2{margin:7px 0 0;font-size:28px}
        .search-results-heading>strong{color:#75676c;font-size:14px}
        .search-product-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:22px}
        .search-product-card{position:relative;background:#fff;border:1px solid #eadfdd;border-radius:18px;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease}
        .search-product-card:hover{transform:translateY(-4px);box-shadow:0 16px 38px rgba(45,25,30,.1)}
        .search-product-image{display:block;position:relative;width:100%;height:360px;padding:0;border:0;background:#f4efee;cursor:pointer;overflow:hidden}
        .search-product-image img{display:block;width:100%;height:100%;object-fit:cover}
        .search-product-badge{position:absolute;left:12px;top:12px;padding:6px 10px;border-radius:999px;background:#fff;font-size:11px;font-weight:800}
        .search-product-info{padding:16px}
        .search-product-category{display:block;font-size:11px;color:#8b7d82;text-transform:uppercase;letter-spacing:.05em}
        .search-product-name{display:block;width:100%;border:0;background:none;padding:0;margin:8px 0;text-align:left;font-size:16px;font-weight:800;color:#292326;cursor:pointer}
        .search-product-rating{font-size:13px;color:#725d65}
        .search-price-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px}
        .search-price-row strong{font-size:18px}
        .search-price-row del{color:#9a8c91;font-size:13px}
        .search-price-row span{color:#198754;font-size:12px;font-weight:800}
        .search-view-product{width:100%;margin-top:14px;border:1px solid #92264b;border-radius:10px;background:#92264b;color:#fff;min-height:42px;font-weight:800;cursor:pointer}
        .search-empty{min-height:360px;display:grid;place-items:center;align-content:center;text-align:center;background:#fff;border:1px solid #eadfdd;border-radius:22px;padding:40px}
        .search-empty-icon{font-size:42px;color:#92264b}
        .search-empty h2{margin:10px 0 6px}
        .search-empty p{color:#75676c;margin:0 0 20px}
        .search-empty button{border:0;border-radius:10px;background:#92264b;color:#fff;padding:12px 20px;font-weight:800;cursor:pointer}
        @media(max-width:1100px){.search-product-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:760px){.search-page-main{width:94%;padding-top:30px}.search-product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.search-product-image{height:260px}.search-product-info{padding:12px}.search-results-heading{align-items:start;flex-direction:column}}
        @media(max-width:480px){.search-product-grid{grid-template-columns:1fr}.search-product-image{height:380px}}
      `}</style>
    </div>
  );
}

export default SearchResultsPage;
