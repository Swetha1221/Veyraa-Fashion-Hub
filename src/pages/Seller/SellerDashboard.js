import React, { useMemo, useState } from "react";
import "./seller.css";

/* =========================================================
   IMPORTANT
   These products are imported directly from the existing
   customer catalogue. Seller images therefore stay identical
   to the Customer Portal images.
   ========================================================= */
import { products as womenProducts } from "../../components/WomenFashion";
import { products as menProducts } from "../../components/MenCategory";
import { kidsProducts } from "../../components/KidsCategory";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const discount = (p) => {
  const oldPrice = Number(p.oldPrice || 0);
  const price = Number(p.price || 0);
  return oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
};

const stockSeed = [34, 21, 12, 42, 28, 16, 8, 34, 24, 18, 14, 7, 6, 5, 31, 9, 42, 19, 26, 31, 18, 22, 28, 17, 12, 24];
const soldSeed = [86, 74, 63, 58, 91, 103, 118, 72, 65, 83, 51, 97, 39, 44, 112, 106, 129, 88, 64, 78, 52, 47, 55, 68, 41, 59];

const catalog = [
  ...womenProducts.map((p) => ({ ...p, audience: "Women" })),
  ...menProducts.map((p) => ({ ...p, audience: "Men" })),
  ...kidsProducts.map((p) => ({
    ...p,
    audience: p.gender === "Women" || p.gender === "Men" ? p.gender : "Kids",
  })),
].map((p, index) => ({
  ...p,
  // Explicitly keep one real customer-catalogue item out of stock.
  stock: /royal purple silk saree/i.test(p.name || "")
    ? 0
    : stockSeed[index % stockSeed.length],
  sold: soldSeed[index % soldSeed.length],
}));

const orders = [
  ["#VY10284", "Priya Sharma", catalog.find((p) => /saree/i.test(p.name)) || catalog[0], 1, 2499, "New"],
  ["#VY10285", "Ananya Rao", catalog.find((p) => /kurti/i.test(p.name)) || catalog[1], 2, 2398, "Processing"],
  ["#VY10286", "Meera Krishnan", catalog.find((p) => /lehenga/i.test(p.name)) || catalog[2], 1, 5499, "Ready to Ship"],
  ["#VY10290", "Sneha R", catalog.find((p) => /saree/i.test(p.name)) || catalog[3], 1, 2199, "Processing"],
  ["#VY10291", "Ishita", catalog.find((p) => /dress|kurti/i.test(p.name)) || catalog[4], 2, 6398, "New"],
  ["#VY10294", "Kavya Menon", catalog.find((p) => /jean/i.test(`${p.name} ${p.category}`)) || catalog[5], 1, 1499, "Shipped"],
  ["#VY10297", "Rahul Verma", menProducts.find((p) => /kurta/i.test(p.name)) || menProducts[0], 1, 899, "Delivered"],
  ["#VY10301", "Aditi Rao", kidsProducts.find((p) => /dress|set/i.test(p.name)) || catalog[6], 1, 1299, "Delivered"],
].map(([id, customer, product, qty, amount, status]) => ({ id, customer, product, qty, amount, status }));

const nav = [
  ["", "⌂", "Home", "home"],
  ["ORDERS", "▣", "All Orders", "orders"],
  ["", "◷", "Pending Orders", "pending"],
  ["PRODUCTS", "◇", "All Products", "products"],
  ["", "▤", "Inventory", "inventory"],
  ["", "₹", "Pricing & Offers", "pricing"],
  ["BUSINESS", "◈", "Payments", "payments"],
  ["", "⌁", "Sales Analytics", "analytics"],
  ["", "↗", "Demand Intelligence", "demand"],
  ["", "!", "Restock Nudge", "restock"],
  ["ACCOUNT", "◎", "Seller Performance", "performance"],
  ["", "⚙", "Settings", "settings"],
];

function ProductPreview({ product, close, onImageError }) {
  if (!product) return null;
  return (
    <div className="sv-modal-bg" onClick={close}>
      <div className="sv-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sv-x" onClick={close}>×</button>
        <div className="sv-modal-img">
          <img src={product.image} alt={product.name} onError={() => onImageError?.(product)} />
          <b>{product.badge || "ACTIVE"}</b>
        </div>
        <div className="sv-modal-info">
          <small className="sv-kicker">{product.audience} · CUSTOMER-FACING PREVIEW</small>
          <h2>{product.name}</h2>
          <div className="sv-rating">★ {product.rating || "4.5"} <span>Customer rating</span></div>
          <div className="sv-price">
            <strong>{money(product.price)}</strong>
            <del>{money(product.oldPrice)}</del>
            <b>{discount(product)}% OFF</b>
          </div>
          <div className="sv-detail-grid">
            <div><small>Category</small><b>{product.type || product.category}</b></div>
            <div><small>Material</small><b>{product.material || "Fashion fabric"}</b></div>
            <div><small>Colour</small><b>{product.colour || "As shown"}</b></div>
            <div><small>MRP</small><b>{money(product.oldPrice)}</b></div>
            <div><small>Stock</small><b>{product.stock} units</b></div>
            <div><small>Units Sold</small><b>{product.sold}</b></div>
          </div>
          <div className="sv-offer">
            <small>CUSTOMER-FACING OFFER</small>
            <b>{discount(product)}% marketplace discount</b>
            <p>The seller preview uses the same product name, image and category that customers see in the Veyraa catalogue.</p>
          </div>
          <button className="sv-primary full-btn" onClick={close}>Close Preview</button>
        </div>
      </div>
    </div>
  );
}

function OrderPreview({ order, close }) {
  if (!order) return null;
  const product = catalog.find((p) => p.id === order.product?.id) || order.product;
  const states = ["New", "Processing", "Ready to Ship", "Shipped", "Delivered"];
  const current = states.indexOf(order.status);
  return (
    <div className="sv-modal-bg" onClick={close}>
      <div className="sv-order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sv-x" onClick={close}>×</button>
        <div className="sv-order-hero">
          <div className="sv-order-image">
            <img src={product?.image} alt={product?.name} />
            <span>{order.status}</span>
          </div>
          <div>
            <small className="sv-kicker">ORDER MANAGEMENT · CUSTOMER ORDER</small>
            <h2>{order.id}</h2>
            <p>Placed by <b>{order.customer}</b> · Quantity <b>{order.qty}</b></p>
            <div className="sv-order-price">{money(order.amount)} <span className={`sv-status ${order.status.toLowerCase().replaceAll(" ", "-")}`}>{order.status}</span></div>
          </div>
        </div>
        <div className="sv-order-detail-grid">
          <div><small>Customer</small><b>{order.customer}</b></div>
          <div><small>Product</small><b>{product?.name}</b></div>
          <div><small>Quantity</small><b>{order.qty}</b></div>
          <div><small>Order Value</small><b>{money(order.amount)}</b></div>
          <div><small>Payment</small><b>Confirmed</b></div>
          <div><small>Current Status</small><b>{order.status}</b></div>
        </div>
        <div className="sv-offer">
          <small>FULFILMENT TIMELINE</small>
          {states.map((step, index) => (
            <p key={step} className={index < current ? "timeline-done" : index === current ? "timeline-current" : "timeline-pending"}>
              {index < current ? "✓" : index === current ? "●" : "○"} {step}
            </p>
          ))}
        </div>
        <button className="sv-outline" onClick={close}>Close Preview</button>
      </div>
    </div>
  );
}

function SellerDashboard() {
  const [page, setPage] = useState("home");
  const [preview, setPreview] = useState(null);
  const [orderPreview, setOrderPreview] = useState(null);
  const [filter, setFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [orderFilter, setOrderFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [brokenImages, setBrokenImages] = useState(() => new Set());

  const productKey = (p) => `${p.audience}-${p.id}-${p.name}`;
  const markImageBroken = (p) => {
    if (!p) return;
    setBrokenImages((previous) => {
      const next = new Set(previous);
      next.add(productKey(p));
      return next;
    });
  };
  const displayCatalog = catalog.filter((p) => p.image && !brokenImages.has(productKey(p)));

  const lowStock = displayCatalog.filter((p) => p.stock <= 10);
  const outOfStock = displayCatalog.filter((p) => p.stock === 0);

  const visibleProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return displayCatalog.filter((p) => {
      const stockMatch =
        filter === "All" ||
        (filter === "Active" && p.stock > 0) ||
        (filter === "Low Stock" && p.stock <= 10) ||
        (filter === "Out of Stock" && p.stock === 0);
      const genderMatch = genderFilter === "All" || p.audience === genderFilter;
      const searchMatch = !q || `${p.name} ${p.type || ""} ${p.category || ""} ${p.audience}`.toLowerCase().includes(q);
      return stockMatch && genderMatch && searchMatch;
    });
  }, [filter, genderFilter, query, brokenImages]);

  const go = (next) => {
    setPage(next);
    setQuery("");
    window.scrollTo(0, 0);
  };

  const meta = {
    home: ["SELLER HOME", "Seller Command Center"],
    orders: ["SELLER OPERATIONS", "All Orders"],
    pending: ["SELLER OPERATIONS", "Pending Orders"],
    products: ["CATALOGUE", "Product Catalogue"],
    inventory: ["INVENTORY CONTROL", "Inventory Intelligence"],
    pricing: ["COMMERCIAL CONTROL", "Pricing & Offers"],
    payments: ["FINANCIAL OPERATIONS", "Payments & Settlements"],
    analytics: ["BUSINESS INTELLIGENCE", "Sales Analytics"],
    demand: ["VEYRAA INTELLIGENCE", "Demand Intelligence"],
    restock: ["ACTIONABLE INTELLIGENCE", "Restock Nudge"],
    performance: ["SELLER PERFORMANCE", "Seller Performance"],
    settings: ["ACCOUNT", "Seller Settings"],
  }[page];

  const header = (
    <header className="sv-head">
      <div>
        <small className="sv-kicker">{meta[0]}</small>
        <h1>{meta[1]}</h1>
      </div>
      <div className="sv-actions">
        <div className="sv-search">⌕<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, orders..." /></div>
        <button aria-label="Notifications">♢</button>
        <button aria-label="Help">?</button>
        <div className="sv-user"><b>VF</b><span>Veyraa Store<small>Seller</small></span>⌄</div>
      </div>
    </header>
  );

  const stats = (
    <div className="sv-stats">
      {[
        ["Today's Orders", "28", "↑ 12.4%"],
        ["Today's Sales", "₹18,420", "↑ 16.8%"],
        ["Pending Shipment", "12", "Needs fulfilment"],
        ["Low Stock", lowStock.length, "Review today"],
        ["Available Balance", "₹30,985", "Next settlement"],
      ].map(([label, value, note], index) => (
        <div key={label}>
          <small>{label}</small><strong>{value}</strong><span className={index < 2 ? "green" : ""}>{note}</span>
        </div>
      ))}
    </div>
  );

  const productCard = (p) => (
    <article className="sv-product" key={`${p.audience}-${p.id}`}>
      <div className="sv-pimg">
        <img src={p.image} alt={p.name} onError={() => markImageBroken(p)} />
        <b>{p.badge || "ACTIVE"}</b>
      </div>
      <div className="sv-pbody">
        <small>{p.audience} · {p.type || p.category}</small>
        <h3>{p.name}</h3>
        <div className="sv-pprice"><b>{money(p.price)}</b><del>{money(p.oldPrice)}</del><span>{discount(p)}% OFF</span></div>
        <div className="sv-pmeta"><span>Stock <b>{p.stock}</b></span><span>★ {p.rating || "4.5"}</span></div>
        <div className="sv-pbuttons"><button onClick={() => setPreview(p)}>Preview</button><button onClick={() => go("inventory")}>Manage</button></div>
      </div>
    </article>
  );

  const ordersPage = (pendingOnly = false) => {
    const tabs = pendingOnly
      ? ["All", "New", "Processing", "Ready to Ship"]
      : ["All", "New", "Processing", "Ready to Ship", "Shipped", "Delivered"];

    const effectiveFilter = tabs.includes(orderFilter) ? orderFilter : "All";
    const filtered = orders.filter((o) => {
      const pendingMatch = !pendingOnly || ["New", "Processing", "Ready to Ship"].includes(o.status);
      const statusMatch = effectiveFilter === "All" || o.status === effectiveFilter;
      const searchMatch = !query || `${o.id} ${o.customer} ${o.product?.name || ""}`.toLowerCase().includes(query.toLowerCase());
      return pendingMatch && statusMatch && searchMatch;
    });

    return (
      <section className="sv-panel">
        <div className="sv-panelhead">
          <div>
            <small className="sv-kicker">ORDER MANAGEMENT</small>
            <p>{pendingOnly ? "Orders requiring fulfilment attention are shown here." : "Review customer orders and monitor fulfilment progress."}</p>
          </div>
          <button className="sv-outline">↓ Export</button>
        </div>
        <div className="sv-order-summary">
          <div><small>VISIBLE ORDERS</small><b>{filtered.length}</b><span>{pendingOnly ? "Pending fulfilment" : "Current view"}</span></div>
          <div><small>ORDER VALUE</small><b>{money(filtered.reduce((sum, o) => sum + o.amount, 0))}</b><span>Customer order value</span></div>
          <div><small>PRODUCTS</small><b>{filtered.filter((o) => o.product?.image).length}</b><span>With catalogue imagery</span></div>
        </div>
        <div className="sv-tabs">
          {tabs.map((tab) => <button key={tab} className={effectiveFilter === tab ? "active" : ""} onClick={() => setOrderFilter(tab)}>{tab}</button>)}
        </div>
        <div className="sv-tablewrap">
          <table>
            <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>PRODUCT</th><th>QTY</th><th>AMOUNT</th><th>STATUS</th><th>ACTION</th></tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td><b>{o.id}</b></td>
                  <td>{o.customer}</td>
                  <td><div className="sv-table-product"><img src={o.product?.image} alt={o.product?.name || "Product"} /><span>{o.product?.name}</span></div></td>
                  <td>{o.qty}</td>
                  <td><b>{money(o.amount)}</b></td>
                  <td><span className={`sv-status ${o.status.toLowerCase().replaceAll(" ", "-")}`}>{o.status}</span></td>
                  <td><button className="sv-mini" onClick={() => setOrderPreview(o)}>Preview</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="sv-empty"><b>No orders in this view</b><span>Choose another status to view available customer orders.</span></div>}
        </div>
        <div className="sv-note">✓ Product images and product names are taken from the same Customer Portal catalogue.</div>
      </section>
    );
  };

  const productsPage = (
    <section className="sv-panel">
      <div className="sv-panelhead"><div><p>Manage the same Women, Men and Kids products that customers see.</p></div><button className="sv-primary">＋ Add Product</button></div>
      <div className="sv-toolbar"><div className="sv-tabs">{["All", "Women", "Men", "Kids"].map((g) => <button key={g} className={genderFilter === g ? "active" : ""} onClick={() => setGenderFilter(g)}>{g}</button>)}</div><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search catalogue..." /></div>
      <div className="sv-tabs">{["All", "Active", "Low Stock", "Out of Stock"].map((x) => <button key={x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)}>{x}</button>)}</div>
      <div className="sv-product-grid">{visibleProducts.map(productCard)}</div>
    </section>
  );

  const inventory = (
    <section className="sv-panel">
      <div className="sv-panelhead sv-panelhead-clean"><div><p>Monitor stock availability, sales velocity and estimated inventory coverage.</p></div><span className="sv-attention">{lowStock.length} products need attention</span></div>
      <div className="sv-stats four">{[["Total Catalogue", displayCatalog.length, "Customer-visible products"], ["Healthy Stock", Math.max(0, displayCatalog.length - lowStock.length), "Comfortable inventory"], ["Low Stock", lowStock.length, "Needs attention"], ["Out of Stock", outOfStock.length, "Inactive listings"]].map(([a,b,c]) => <div key={a}><small>{a}</small><strong>{b}</strong><span>{c}</span></div>)}</div>
      <div className="sv-invgrid">{displayCatalog.map((p) => {
        const coverage = Math.max(2, Math.round(p.stock / Math.max(1, p.sold / 14)));
        return <div className="sv-invcard" key={`${p.audience}-${p.id}`}>
          <img src={p.image} alt={p.name} onError={() => markImageBroken(p)} />
          <div><div className="sv-invtitle"><div><h3>{p.name}</h3><small>{p.audience} · {p.type || p.category}</small></div><button onClick={() => setPreview(p)}>Preview</button></div>
            <div className="sv-invn"><span><small>Available</small><b>{p.stock}</b></span><span><small>Sold</small><b>{p.sold}</b></span><span><small>Coverage</small><b>{coverage} days</b></span></div>
            <div className="sv-track"><i style={{ width: `${Math.min(100, p.stock * 2.2)}%` }} /></div>
            <small className={p.stock <= 10 ? "warn" : "stable"}>{p.stock <= 10 ? "Restock soon" : "Inventory stable"}</small>
          </div>
        </div>;
      })}</div>
    </section>
  );

  const pricing = (
    <section className="sv-panel">
      <div className="sv-panelhead sv-panelhead-clean"><div><p>Manage customer-facing MRP, selling price, discount and active offers.</p></div></div>
      <div className="sv-price-summary"><div><small>Average Discount</small><b>31%</b><span>Across catalogue</span></div><div><small>Active Offers</small><b>{displayCatalog.length}</b><span>Customer-visible offers</span></div><div><small>Highest Discount</small><b>{Math.max(0, ...displayCatalog.map(discount))}%</b><span>Current catalogue</span></div></div>
      <div className="sv-tabs">{["All", "Women", "Men", "Kids"].map((g) => <button key={g} className={genderFilter === g ? "active" : ""} onClick={() => setGenderFilter(g)}>{g}</button>)}</div>
      <div className="sv-pricing-list">{displayCatalog.filter((p) => genderFilter === "All" || p.audience === genderFilter).map((p) => <div className="sv-pricing" key={`${p.audience}-${p.id}`}>
        <img src={p.image} alt={p.name} onError={() => markImageBroken(p)} /><div><small>{p.audience} · {p.type || p.category}</small><h3>{p.name}</h3><span>★ {p.rating || "4.5"} · {p.sold} sold</span></div><div><small>MRP</small><b>{money(p.oldPrice)}</b></div><div><small>SELLING PRICE</small><b>{money(p.price)}</b></div><div><small>DISCOUNT</small><strong>{discount(p)}% OFF</strong></div><div><span className="active-offer">● ACTIVE</span><small>Customer-facing offer</small></div><button onClick={() => setPreview(p)}>View Product</button>
      </div>)}</div>
    </section>
  );

  const payments = (
    <section className="sv-panel"><div className="sv-panelhead"><div><small className="sv-kicker">FINANCIAL OPERATIONS</small><p>Track earnings, settlements, platform fees and refunds.</p></div><button className="sv-outline">↓ Export Report</button></div>
      <div className="sv-stats four">{[["Total Sales", "₹37,786", "Gross order value"], ["Available Settlement", "₹30,985", "After adjustments"], ["Platform Fees", "₹3,022", "Estimated"], ["Refunds", "₹756", "Estimated"]].map(([a,b,c]) => <div key={a}><small>{a}</small><strong>{b}</strong><span>{c}</span></div>)}</div>
      <div className="sv-finance"><div className="sv-chartcard"><div className="sv-title"><div><small>INCOME MIX</small><h3>Previous Month Income</h3></div><b>₹42,580</b></div><div className="sv-donutrow"><div className="sv-donut"><div><b>₹42.6K</b><small>Total</small></div></div><div className="sv-legend"><p><i className="dot-one" /> Product Sales <b>72%</b></p><p><i className="dot-two" /> Promotional Sales <b>18%</b></p><p><i className="dot-three" /> Other Earnings <b>10%</b></p></div></div></div><div className="sv-chartcard"><div className="sv-title"><div><small>SETTLEMENT TREND</small><h3>Monthly Income</h3></div><b className="green">+18.4%</b></div><div className="sv-bars finance">{[42,56,48,67,61,74,88,76,93].map((v,i)=><i key={i} style={{height:`${v}%`}} />)}</div><div className="sv-axis"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span></div></div></div>
    </section>
  );

  const analytics = (
    <section className="sv-panel">
      <div className="sv-panelhead"><div><small className="sv-kicker">BUSINESS INTELLIGENCE</small><p>Understand revenue movement, order mix and product category performance.</p></div><select><option>Last 30 days</option><option>Last 90 days</option><option>This year</option></select></div>
      <div className="sv-akpis">{[["Revenue","₹37,786","+18.4%"],["Orders","482","+12.8%"],["Units Sold","1,284","+21.2%"],["Conversion","4.8%","+0.6%"]].map(([a,b,c]) => <div key={a}><small>{a}</small><b>{b}</b><strong>{c}</strong><span>vs previous period</span></div>)}</div>
      <div className="sv-analytics"><div className="sv-chartcard"><div className="sv-title"><div><small>SALES PERFORMANCE</small><h3>Revenue by Week</h3></div><b>₹37,786</b></div><svg className="sv-linechart" viewBox="0 0 700 250" preserveAspectRatio="none" role="img" aria-label="Revenue trend graph"><defs><linearGradient id="sellerArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopOpacity=".22"/><stop offset="100%" stopOpacity="0"/></linearGradient></defs><path className="sv-area" d="M20 205 L80 160 L140 178 L200 125 L260 145 L320 92 L380 112 L440 66 L500 88 L560 45 L620 72 L680 30 L680 230 L20 230 Z"/><polyline className="sv-line" points="20,205 80,160 140,178 200,125 260,145 320,92 380,112 440,66 500,88 560,45 620,72 680,30" />{[[20,205],[80,160],[140,178],[200,125],[260,145],[320,92],[380,112],[440,66],[500,88],[560,45],[620,72],[680,30]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" className="sv-point" />)}</svg><div className="sv-axis"><span>W1</span><span>W3</span><span>W5</span><span>W7</span><span>W9</span><span>W12</span></div></div>
        <div className="sv-chartcard"><div className="sv-title"><div><small>SALES MIX</small><h3>Category Sales Share</h3></div></div><div className="sv-pie-row"><div className="sv-pie"><div><b>100%</b><small>Sales mix</small></div></div><div className="sv-legend"><p><i className="dot-one" /> Women <b>58%</b></p><p><i className="dot-two" /> Men <b>27%</b></p><p><i className="dot-three" /> Kids <b>15%</b></p></div></div><div className="sv-category-mini"><span>Women <b>58%</b></span><i><em style={{width:"58%"}}/></i><span>Men <b>27%</b></span><i><em style={{width:"27%"}}/></i><span>Kids <b>15%</b></span><i><em style={{width:"15%"}}/></i></div></div></div>
      <div className="sv-analytics-bottom"><div className="sv-chartcard"><div className="sv-title"><div><small>TOP PRODUCTS</small><h3>Best Performing Products</h3></div></div>{displayCatalog.slice(0,5).map((p,i)=><div className="sv-rank" key={`${p.audience}-${p.id}`}><b>0{i+1}</b><img src={p.image} alt="" onError={() => markImageBroken(p)}/><span><strong>{p.name}</strong><small>{p.sold} units sold</small></span><em>{money(p.price * p.sold)}</em></div>)}</div><div className="sv-chartcard"><div className="sv-title"><div><small>TRAFFIC & ENGAGEMENT</small><h3>Store Activity</h3></div></div>{[["Product Views","18,420","+22%"],["Wishlist Adds","3,286","+17%"],["Cart Adds","2,914","+13%"],["Repeat Customers","1,184","+9%"]].map(([a,b,c])=><div className="sv-activity" key={a}><span>{a}</span><b>{b}</b><em>{c}</em></div>)}</div></div>
    </section>
  );

  const demand = (
    <section className="sv-panel"><div className="sv-panelhead"><div><small className="sv-kicker">VEYRAA INTELLIGENCE</small><p>Products with stronger recent sales activity are surfaced using the same customer catalogue.</p></div></div><div className="sv-demand">{displayCatalog.slice(0,10).map((p,i)=><div key={`${p.audience}-${p.id}`}><b>0{i+1}</b><img src={p.image} alt={p.name} onError={() => markImageBroken(p)}/><span><strong>{p.name}</strong><small>{p.audience} · {p.type || p.category}</small></span><div className="spark">{[30,45,40,58,52,72,66,88].map((h,n)=><i key={n} style={{height:`${h + ((i*3)%10)}%`}}/>)}</div><em>+{18+i*3}%</em><button onClick={() => setPreview(p)}>View</button></div>)}</div></section>
  );

  const restock = (
    <section className="sv-panel"><div className="sv-panelhead"><div><small className="sv-kicker">ACTIONABLE INTELLIGENCE</small><p>Prioritise products where available stock and sales activity suggest replenishment attention.</p></div></div><div className="sv-restock-summary">{[["Products to Review",lowStock.length],["Recommended Units",146],["Highest Risk","2 days"],["Demand Signal","Rising"]].map(([a,b])=><div key={a}><small>{a}</small><b>{b}</b></div>)}</div><div className="sv-restock">{lowStock.map((p,i)=><div key={`${p.audience}-${p.id}`}><img src={p.image} alt={p.name} onError={() => markImageBroken(p)}/><span><strong>{p.name}</strong><small>{p.audience} · Current stock: {p.stock}</small><i><em style={{width:`${Math.min(100,p.stock*4)}%`}}/></i></span><label><small>Coverage</small><b>{Math.max(2,Math.round(p.stock/3))} days</b></label><label><small>Suggested quantity</small><b>{20+(i%3)*8} units</b></label><button className="sv-primary" onClick={() => setPreview(p)}>Preview & Restock</button></div>)}</div></section>
  );

  const performance = (
    <section className="sv-panel"><div className="sv-panelhead"><div><small className="sv-kicker">SELLER PERFORMANCE</small><p>Fulfilment, customer experience and operational performance.</p></div></div><div className="sv-healthhero"><div className="sv-healthring"><b>92</b><small>/100</small></div><div><small>CURRENT ACCOUNT STATUS</small><h3>Healthy</h3><p>Review the indicators below to keep your marketplace operations consistent.</p></div></div><div className="sv-healthgrid">{[["Order Fulfilment","96%"],["Cancellation Rate","1.2%"],["Return Rate","3.4%"],["Customer Rating","4.6 / 5"],["Complaint Rate","0.8%"],["On-time Dispatch","94%"]].map(([a,b])=><div key={a}><small>{a}</small><b>{b}</b><span>Current period</span></div>)}</div></section>
  );

  const settings = (
    <section className="sv-panel"><div className="sv-panelhead"><div><small className="sv-kicker">ACCOUNT</small><p>Manage store identity, notifications, fulfilment preferences, payout details and team access.</p></div><button className="sv-primary" onClick={() => setSaved(true)}>{saved ? "✓ Saved" : "Save Changes"}</button></div>
      <div className="sv-settingshero"><b>VF</b><div><small>VERIFIED SELLER</small><h3>Veyraa Fashion Store</h3><p>Customer-facing fashion catalogue · India</p></div><span>● Verified</span></div>
      <div className="sv-settings-grid">
        <div className="sv-setting-card"><h3>STORE PROFILE</h3><label>Store Name<input defaultValue="Veyraa Fashion Store" /></label><label>Business Email<input defaultValue="seller@veyraa.com" /></label><label>Support Phone<input defaultValue="+91 9XXXXXXXXX" /></label><label>Store Description<textarea defaultValue="Fashion clothing and accessories across Women, Men and Kids." /></label></div>
        <div className="sv-setting-card"><h3>NOTIFICATIONS</h3>{["Order notifications","Low stock alerts","Demand spike alerts","Restock Nudge","Settlement updates"].map((x)=><div className="sv-toggle" key={x}><span><b>{x}</b><small>Keep seller operations informed</small></span><i /></div>)}</div>
        <div className="sv-setting-card"><h3>FULFILMENT PREFERENCES</h3>{[["Dispatch window","24 hours"],["Packaging status","Standard"],["Return handling","Seller managed"],["Default shipping","Veyraa Logistics"]].map(([a,b])=><div className="sv-setting-row" key={a}><span>{a}</span><b>{b}</b></div>)}<button className="sv-outline full">Edit Fulfilment Preferences</button></div>
        <div className="sv-setting-card"><h3>PAYOUT & BANK</h3><div className="sv-bank"><b>✓</b><span><strong>Verified settlement account</strong><small>HDFC Bank · •••• 4821</small></span><em>Active</em></div><div className="sv-setting-row"><span>Next settlement</span><b>30 Sep 2026</b></div><div className="sv-setting-row"><span>Available balance</span><b>₹30,985</b></div><button className="sv-outline full">View Payout Details</button></div>
        <div className="sv-setting-card"><h3>TEAM ACCESS</h3>{[["VF","Store Owner","Full seller access","Admin"],["AS","Store Assistant","Orders & inventory","Member"]].map(([a,b,c,d])=><div className="sv-team" key={a}><b>{a}</b><span><strong>{b}</strong><small>{c}</small></span><em>{d}</em></div>)}<button className="sv-outline full">Manage Team</button></div>
        <div className="sv-setting-card"><h3>SECURITY</h3>{[["Two-step verification","Enabled"],["Last login","Today · 4:58 PM"],["Active sessions","2 devices"],["Password","Last changed 18 days ago"]].map(([a,b])=><div className="sv-security" key={a}><span>{a}</span><b>{b}</b></div>)}<button className="sv-outline full">Review Security</button></div>
      </div>
    </section>
  );

  const home = <>
    <section className="sv-welcome"><div><small className="sv-kicker">SELLER HOME</small><h2>Good evening, Veyraa Store.</h2><p>Here is your marketplace operating picture for today.</p></div><button className="sv-primary" onClick={() => go("products")}>＋ Add Product</button></section>
    {stats}
    <div className="sv-homegrid"><div className="sv-card"><div className="sv-title"><div><small>SALES OVERVIEW</small><h3>Marketplace revenue</h3></div><b>₹37,786</b></div><div className="sv-bars home">{[38,52,46,64,58,71,66,82,74,91,84,98].map((v,i)=><i key={i} style={{height:`${v}%`}}/>)}</div></div><div className="sv-card"><div className="sv-title"><div><small>ACTION REQUIRED</small><h3>Today's checklist</h3></div></div>{[[12,"Orders pending shipment","Prepare parcels","pending"],[lowStock.length,"Products low in stock","Review stock","restock"],[6,"Demand signals detected","Open intelligence","demand"]].map(([a,b,c,d])=><div className="sv-check" key={b}><b>{a}</b><span><strong>{b}</strong><small>{c}</small></span><button onClick={() => go(d)}>Review</button></div>)}</div></div>
    <div className="sv-card"><div className="sv-title"><div><small>TOP PRODUCTS</small><h3>Best sellers from your catalogue</h3></div><button onClick={() => go("products")}>View all</button></div>{displayCatalog.slice(0,5).map((p)=><div className="sv-row" key={`${p.audience}-${p.id}`}><img src={p.image} alt="" onError={() => markImageBroken(p)}/><span><b>{p.name}</b><small>{p.audience} · {p.sold} sold · {p.stock} stock</small></span><strong>{money(p.price)}</strong></div>)}</div>
  </>;

  const renderBody = page === "home" ? home : page === "orders" ? ordersPage(false) : page === "pending" ? ordersPage(true) : page === "products" ? productsPage : page === "inventory" ? inventory : page === "pricing" ? pricing : page === "payments" ? payments : page === "analytics" ? analytics : page === "demand" ? demand : page === "restock" ? restock : page === "performance" ? performance : settings;

  return <div className="seller-app">
    <aside className="seller-sidebar"><div className="sv-brand"><b>V</b><span>VEYRAA<small>SELLER CENTER</small></span></div><div className="sv-store"><b>VF</b><span><strong>Veyraa Fashion Store</strong><small>Verified Seller</small></span><i>●</i></div><nav>{nav.map(([section,icon,label,key]) => <React.Fragment key={key}>{section && <label>{section}</label>}<button className={page === key ? "active" : ""} onClick={() => go(key)}><span>{icon}</span><em>{label}</em>{label.includes("Orders") && <b>{key === "orders" ? 8 : 5}</b>}</button></React.Fragment>)}</nav><div className="sv-health"><span>Account Health <b>92 / 100</b></span><i /></div></aside>
    <main className="seller-main">{header}<div className="sv-content">{renderBody}</div></main>
    <ProductPreview product={preview} close={() => setPreview(null)} onImageError={(product) => { markImageBroken(product); setPreview(null); }} />
    <OrderPreview order={orderPreview} close={() => setOrderPreview(null)} />
    <button className="sv-logout">↪ Logout</button>
  </div>;
}

export default SellerDashboard;
