import React, { useMemo, useState } from "react";
import "./seller.css";
import { usePortalPage } from "../../routing";

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
const productKey = (product) => `${product.audience}-${product.id}-${product.name}`;
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

const returnRequests = [
  {
    id: "#VY10278",
    orderId: "#VY10278",
    customer: "Divya Krishnan",
    product: catalog.find((p) => /saree/i.test(p.name)) || catalog[0],
    qty: 1,
    amount: 2499,
    reason: "Product size does not fit",
    requestedOn: "28 Sep 2026",
    status: "Pending",
  },
  {
    id: "#VY10281",
    orderId: "#VY10281",
    customer: "Nandhini S",
    product: catalog.find((p) => /kurti/i.test(p.name)) || catalog[1],
    qty: 1,
    amount: 1199,
    reason: "Received a different product",
    requestedOn: "27 Sep 2026",
    status: "Approved",
  },
  {
    id: "#VY10283",
    orderId: "#VY10283",
    customer: "Riya Menon",
    product: catalog.find((p) => /lehenga/i.test(p.name)) || catalog[2],
    qty: 1,
    amount: 5499,
    reason: "Product damaged on delivery",
    requestedOn: "26 Sep 2026",
    status: "Pending",
  },
];

const nav = [
  ["", "⌂", "Home", "home"],
  ["ORDERS", "▣", "All Orders", "orders"],
  ["", "◷", "Pending Orders", "pending"],
  ["", "↩", "Returns", "returns"],
  ["PRODUCTS", "◇", "All Products", "products"],
  ["", "▤", "Inventory", "inventory"],
  ["", "₹", "Pricing & Offers", "pricing"],
  ["BUSINESS", "◈", "Payments", "payments"],
  ["", "⌁", "Sales Analytics", "analytics"],
  ["", "↗", "Demand Intelligence", "demand"],
  ["", "!", "Restock Nudge", "restock"],
  ["ACCOUNT", "◎", "Seller Performance", "performance"],
  ["", "⚙", "Settings", "settings"],
  ["", "◆", "Seller Plans", "seller-plans"],
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

function ReturnCasePreview({ request, close, onStatusChange }) {
  if (!request) return null;
  const isPending = request.status === "Pending";
  const isApproved = request.status === "Approved";

  return (
    <div className="sv-modal-bg sv-return-modal-bg" onClick={close}>
      <div className="sv-return-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sv-x" onClick={close}>×</button>

        <div className="sv-return-modal-head">
          <div>
            <small className="sv-kicker">RETURN CASE PREVIEW</small>
            <h2>{request.id}</h2>
            <p>Review customer return details, product information and seller resolution status.</p>
          </div>
          <span className={`sv-return-pill ${request.status.toLowerCase()}`}>{request.status}</span>
        </div>

        <div className="sv-return-customer">
          <div className="sv-return-avatar">{request.customer.charAt(0)}</div>
          <div>
            <strong>{request.customer}</strong>
            <small>Customer return request · Order {request.orderId}</small>
          </div>
          <div className="sv-return-customer-value">
            <small>RETURN VALUE</small>
            <b>{money(request.amount)}</b>
          </div>
        </div>

        <div className="sv-return-product-card">
          <img src={request.product?.image} alt={request.product?.name || "Product"} />
          <div>
            <small>RETURNED PRODUCT</small>
            <h3>{request.product?.name}</h3>
            <p>{request.product?.audience || "Fashion"} · {request.product?.type || request.product?.category || "Product"}</p>
          </div>
          <span>Qty {request.qty}</span>
        </div>

        <div className="sv-return-detail-grid">
          <div><small>RETURN ID</small><b>{request.id}</b></div>
          <div><small>ORDER ID</small><b>{request.orderId}</b></div>
          <div><small>REQUESTED ON</small><b>{request.requestedOn}</b></div>
          <div><small>CASE TYPE</small><b>Customer Return</b></div>
          <div className="wide"><small>RETURN REASON</small><b>{request.reason}</b></div>
          <div><small>CURRENT STATUS</small><b>{request.status}</b></div>
        </div>

        <div className="sv-return-resolution">
          <small className="sv-kicker">RETURN RESOLUTION</small>
          <h3>Case handling</h3>
          <p>Review the return information before taking the next seller-side operational action.</p>
          <div className="sv-return-actions">
            {isPending && <>
              <button className="sv-primary" onClick={() => onStatusChange(request.id, "Approved")}>Approve Return</button>
              <button className="sv-return-secondary" onClick={() => onStatusChange(request.id, "Reviewed")}>Mark Reviewed</button>
            </>}
            {isApproved && <span className="sv-return-success">✓ Return approved for processing</span>}
            {request.status === "Reviewed" && <span className="sv-return-reviewed">✓ Seller review completed</span>}
            <button className="sv-outline" onClick={close}>Close Preview</button>
          </div>
        </div>
      </div>
    </div>
  );
}


const SELLER_FEATURES = {
  sellerCommission: "Seller Commission",
  sellerSubscription: "Seller Subscription Plans",
  sponsoredProducts: "Sponsored Products",
  featuredPlacement: "Featured Placement",
  sponsoredSearch: "Sponsored Search",
  marketingCampaigns: "Marketing Campaigns",
  catalogueService: "Professional Catalogue Service",
  fulfilment: "Veyraa Fulfilment & Delivery",
  advancedAnalytics: "Advanced Seller Analytics",
  verifiedBadge: "Veyraa Verified Seller Badge",
  promotionalEngine: "Seller Promotional Engine",
  brandPartnerships: "Brand Partnership Campaigns",
  creatorCommerce: "Creator & Influencer Commerce",
  miniStorefront: "Seller Mini-Storefront",
  marketIntelligence: "Veyraa Market Intelligence",
  inventoryDemand: "Inventory & Demand Intelligence",
  preOrder: "Pre-Order & Demand Reservation",
  deadStock: "Dead-Stock Recovery Marketplace",
  premiumSupport: "Premium Seller Support",
  giftRegistry: "Seer Varisai & Function Gift Registry",
  sareeServices: "Saree Ready-to-Wear Services",
  buyback: "Pattu Buyback & Restoration",
  rental: "Function Saree & Jewellery Rental",
};

/*
 * Subscription mapping is intentionally derived from the seller-applicable
 * items in the user's 26-feature revenue model.
 *
 * #13 Veyraa Plus is customer-side, so it is not a Seller Plan entitlement.
 * #23 and #24 were not defined in the supplied feature list, so they are
 * intentionally not invented here.
 */
const SELLER_PLANS = {
  basic: {
    key: "basic",
    name: "Basic",
    price: 299,
    subtitle: "Essential seller tools for starting and managing your Veyraa store.",
    featureKeys: ["miniStorefront", "preOrder", "deadStock"],
  },
  business: {
    key: "business",
    name: "Business",
    price: 599,
    subtitle: "Advanced seller tools for growth, operations and customer reach.",
    featureKeys: [
      "miniStorefront", "preOrder", "deadStock",
      "marketingCampaigns", "catalogueService", "fulfilment",
      "advancedAnalytics", "promotionalEngine", "marketIntelligence",
      "inventoryDemand",
    ],
  },
  premium: {
    key: "premium",
    name: "Premium",
    price: 999,
    subtitle: "Premium seller visibility, trust, partnerships and support.",
    featureKeys: [
      "miniStorefront", "preOrder", "deadStock",
      "marketingCampaigns", "catalogueService", "fulfilment",
      "advancedAnalytics", "promotionalEngine", "marketIntelligence",
      "inventoryDemand",
      "sponsoredProducts", "featuredPlacement", "sponsoredSearch",
      "verifiedBadge", "creatorCommerce", "brandPartnerships",
      "premiumSupport",
    ],
  },
};

Object.values(SELLER_PLANS).forEach((plan) => {
  plan.features = plan.featureKeys.map((key) => SELLER_FEATURES[key]);
});

function SellerPlanPreview({ plan, close, onChoose }) {
  if (!plan) return null;

  return (
    <div className="sv-plan-modal-bg" onClick={close}>
      <div className="sv-plan-preview" onClick={(e) => e.stopPropagation()}>
        <button className="sv-plan-x" onClick={close}>×</button>
        <div className="sv-plan-preview-top">
          <small className="sv-kicker">SELLER PLAN PREVIEW</small>
          <span className={`sv-plan-badge ${plan.key}`}>{plan.name}</span>
          <h2>{plan.name} Plan</h2>
          <p>{plan.subtitle}</p>
          <div className="sv-plan-preview-price">
            <strong>{money(plan.price)}</strong><span>/ month</span>
          </div>
        </div>
        <div className="sv-plan-feature-list">
          <div className="sv-plan-feature-head">
            <strong>Included seller features</strong>
            <span>{plan.features.length} features</span>
          </div>
          {plan.features.map((feature) => (
            <div className="sv-plan-feature-row" key={feature}>
              <b>✓</b><span>{feature}</span>
            </div>
          ))}
        </div>
        <button className="sv-primary sv-plan-choose" onClick={() => onChoose(plan)}>
          Choose {plan.name} Plan
        </button>
      </div>
    </div>
  );
}

function SellerPlanPayment({ plan, close, onSuccess }) {
  const [method, setMethod] = useState("Google Pay");
  const [payingNumber, setPayingNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [demoPin, setDemoPin] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [verificationId, setVerificationId] = useState("");

  if (!plan) return null;

  const createReference = () => {
    const stamp = Date.now().toString().slice(-8);
    const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `VYRA${stamp}${suffix}`;
  };

  const pay = () => {
    const validNumber = /^\d{10}$/.test(payingNumber);
    const validUpi = /^[^\s@]+@[^\s@]+$/.test(upiId.trim());
    if (!validNumber || !validUpi || demoPin.trim().length < 4 || processing) return;

    setProcessing(true);
    window.setTimeout(() => {
      setPaymentRef(createReference());
      setVerificationId(`VY-${plan.key.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`);
      setProcessing(false);
      setSuccess(true);
    }, 1200);
  };

  const finish = () => {
    onSuccess(plan, {
      paymentRef,
      verificationId,
      method,
      payingNumber,
      upiId,
      paidAt: new Date().toLocaleString("en-IN"),
    });
    setSuccess(false);
  };

  return (
    <div className="sv-plan-modal-bg" onClick={close}>
      <div className="sv-plan-payment" onClick={(e) => e.stopPropagation()}>
        <button className="sv-plan-x" onClick={close}>×</button>

        {!success ? (
          <>
            <div className="sv-plan-payment-head">
              <div className="sv-plan-payment-brand">
                <span className="sv-plan-payment-brand-mark">V</span>
                <div><b>Veyraa Secure Pay</b><small>Seller subscription checkout</small></div>
              </div>
              <div className="sv-plan-stepper">
                <span className="done"><b>1</b> Plan</span><i></i>
                <span className="current"><b>2</b> Pay</span><i></i>
                <span><b>3</b> Activate</span>
              </div>
              <small className="sv-kicker">SECURE UPI CHECKOUT</small>
              <h2>Pay & Activate {plan.name}</h2>
              <p>Complete the payment details below. After successful confirmation, this seller session receives the selected plan entitlements.</p>
            </div>

            <div className="sv-plan-order-summary">
              <div><span>{plan.name} Plan</span><small>Seller subscription · Monthly access</small></div>
              <strong>{money(plan.price)}</strong>
            </div>

            <div className="sv-plan-checkout-section">
              <div className="sv-plan-section-title"><span>01</span><div><b>Choose payment app</b><small>Select the UPI app you want to use</small></div></div>
              <div className="sv-plan-methods">
                {[["Google Pay", "G"], ["PhonePe", "P"], ["Paytm", "Pay"]].map(([item, mark]) => (
                  <button key={item} className={method === item ? "active" : ""} onClick={() => setMethod(item)} type="button">
                    <b>{mark}</b><span>{item}</span>{method === item && <em>✓</em>}
                  </button>
                ))}
              </div>
            </div>

            <div className="sv-plan-checkout-section">
              <div className="sv-plan-section-title"><span>02</span><div><b>Enter paying number</b><small>10-digit mobile number linked to the payment account</small></div></div>
              <label className="sv-plan-field">
                <span>Paying mobile number</span>
                <div className="sv-plan-input-wrap"><input value={payingNumber} onChange={(e) => setPayingNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" inputMode="numeric" autoComplete="tel" maxLength="10" /><b>+91</b></div>
              </label>
            </div>

            <div className="sv-plan-checkout-section">
              <div className="sv-plan-section-title"><span>03</span><div><b>Enter UPI details</b><small>Enter the UPI ID used for this seller-plan checkout</small></div></div>
              <label className="sv-plan-field">
                <span>{method} · UPI ID</span>
                <div className="sv-plan-input-wrap"><input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" autoComplete="off" /><b>UPI</b></div>
              </label>
            </div>

            <div className="sv-plan-checkout-section">
              <div className="sv-plan-section-title"><span>04</span><div><b>Confirm payment PIN</b><small>Enter a 4–6 digit demo PIN to confirm this front-end checkout</small></div></div>
              <label className="sv-plan-field">
                <span>Demo payment PIN</span>
                <div className="sv-plan-input-wrap"><input type="password" value={demoPin} onChange={(e) => setDemoPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••" inputMode="numeric" autoComplete="off" maxLength="6" /><b>PIN</b></div>
              </label>
            </div>

            <div className="sv-plan-security-row"><span>🔒 Secure checkout</span><span>UPI details validated</span><span>✓ Instant activation</span></div>
            <button className="sv-primary sv-plan-pay" onClick={pay} disabled={processing || !/^\d{10}$/.test(payingNumber) || !/^[^\s@]+@[^\s@]+$/.test(upiId.trim()) || demoPin.trim().length < 4}>
              {processing ? <><span className="sv-plan-spinner"></span> Verifying payment...</> : <><span>Pay {money(plan.price)}</span><span>→</span></>}
            </button>
            <small className="sv-plan-payment-footnote">Demo transaction environment · no real funds are transferred.</small>
          </>
        ) : (
          <div className="sv-plan-success">
            <div className="sv-plan-success-top"><div className="sv-plan-success-icon">✓</div><span>PAYMENT SUCCESSFUL</span></div>
            <h2>{plan.name} Plan is now active</h2>
            <p>The selected seller subscription has been activated for this current seller session.</p>
            <div className="sv-plan-success-amount"><small>AMOUNT PAID</small><strong>{money(plan.price)}</strong><span>{method} · +91 {payingNumber}</span></div>
            <div className="sv-plan-success-grid">
              <div><small>Transaction ID</small><b>{paymentRef}</b></div>
              <div><small>Verification ID</small><b>{verificationId}</b></div>
              <div><small>Plan status</small><b>✓ ACTIVE</b></div>
              <div><small>Features enabled</small><b>{plan.features.length} / {plan.features.length}</b></div>
            </div>
            <div className="sv-plan-activation-note"><b>✓ Seller access updated</b><span>Plan-controlled functionality is now active inside the existing Seller Portal wherever the selected entitlement applies.</span></div>
            <button className="sv-primary sv-plan-pay" onClick={finish}>Open Current Plan →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SellerDashboard() {
  const [page, setPage] = usePortalPage("seller");
  const [preview, setPreview] = useState(null);
  const [orderPreview, setOrderPreview] = useState(null);
  const [filter, setFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [orderFilter, setOrderFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [brokenImages, setBrokenImages] = useState(() => new Set());
  const [sellerReturns, setSellerReturns] = useState(returnRequests);
  const [returnFilter, setReturnFilter] = useState("All");
  const [returnPreview, setReturnPreview] = useState(null);
  const [activeSellerPlan, setActiveSellerPlan] = useState(null);
  const [planPaymentDetails, setPlanPaymentDetails] = useState(null);
  const [planPreview, setPlanPreview] = useState(null);
  const [planPayment, setPlanPayment] = useState(null);
  const [planServiceState, setPlanServiceState] = useState({});
  const hasSellerFeature = (featureKey) => Boolean(activeSellerPlan?.featureKeys?.includes(featureKey));
  const activatePlanService = (serviceKey) => {
    setPlanServiceState((current) => ({ ...current, [serviceKey]: true }));
  };
  const isPlanServiceActive = (serviceKey) => Boolean(planServiceState[serviceKey]);

  const markImageBroken = (p) => {
    if (!p) return;
    setBrokenImages((previous) => {
      const next = new Set(previous);
      next.add(productKey(p));
      return next;
    });
  };
  const displayCatalog = useMemo(
    () => catalog.filter((product) => product.image && !brokenImages.has(productKey(product))),
    [brokenImages]
  );

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
  }, [filter, genderFilter, query, displayCatalog]);

  const go = (next) => {
    setPage(next);
    setQuery("");
    window.scrollTo(0, 0);
  };

  const meta = {
    home: ["SELLER HOME", "Seller Command Center"],
    orders: ["SELLER OPERATIONS", "All Orders"],
    pending: ["SELLER OPERATIONS", "Pending Orders"],
    returns: ["CUSTOMER RETURNS", "Returns & Refunds"],
    products: ["CATALOGUE", "Product Catalogue"],
    inventory: ["INVENTORY CONTROL", "Inventory Intelligence"],
    pricing: ["COMMERCIAL CONTROL", "Pricing & Offers"],
    payments: ["FINANCIAL OPERATIONS", "Payments & Settlements"],
    analytics: ["BUSINESS INTELLIGENCE", "Sales Analytics"],
    demand: ["VEYRAA INTELLIGENCE", "Demand Intelligence"],
    restock: ["ACTIONABLE INTELLIGENCE", "Restock Nudge"],
    performance: ["SELLER PERFORMANCE", "Seller Performance"],
    settings: ["ACCOUNT", "Seller Settings"],
    "seller-plans": ["SELLER SUBSCRIPTION", "Seller Plans"],
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

  const filteredReturns = sellerReturns.filter((request) => {
    if (returnFilter === "All") return true;
    return request.status === returnFilter;
  });

  const returnValue = sellerReturns.reduce((sum, request) => sum + Number(request.amount || 0), 0);

  const updateReturnStatus = (id, status) => {
    setSellerReturns((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    setReturnPreview((current) => current ? { ...current, status } : current);
  };

  const returnsPage = (
    <section className="sv-return-page">
      <div className="sv-return-intro">
        <div>
          <small className="sv-kicker">RETURN MANAGEMENT</small>
          <h2>Customer Returns</h2>
          <p>Review return requests, verify product details and manage seller-side resolution.</p>
        </div>
        <div className="sv-return-intro-badge"><span>●</span> Seller return desk</div>
      </div>

      <div className="sv-return-kpis">
        <div className="sv-return-kpi">
          <div className="sv-return-kpi-icon">↩</div>
          <div><small>OPEN RETURNS</small><b>{sellerReturns.filter((r) => r.status === "Pending").length}</b><span>Awaiting seller action</span></div>
        </div>
        <div className="sv-return-kpi">
          <div className="sv-return-kpi-icon amber">◷</div>
          <div><small>PENDING REVIEW</small><b>{sellerReturns.filter((r) => r.status === "Pending").length}</b><span>Cases requiring review</span></div>
        </div>
        <div className="sv-return-kpi">
          <div className="sv-return-kpi-icon green">✓</div>
          <div><small>APPROVED</small><b>{sellerReturns.filter((r) => r.status === "Approved").length}</b><span>Approved return cases</span></div>
        </div>
        <div className="sv-return-kpi">
          <div className="sv-return-kpi-icon rose">₹</div>
          <div><small>RETURN VALUE</small><b>{money(returnValue)}</b><span>Total requested value</span></div>
        </div>
      </div>

      <section className="sv-return-card">
        <div className="sv-return-card-head">
          <div>
            <small className="sv-kicker">RETURN MANAGEMENT</small>
            <h3>Recent Return Cases</h3>
            <p>Customer return requests associated with your store.</p>
          </div>
          <div className="sv-return-head-meta"><span>{filteredReturns.length} cases</span><span className="sv-return-live"><i /> Live seller view</span></div>
        </div>

        <div className="sv-return-toolbar">
          <div className="sv-return-tabs">
            {["All", "Pending", "Approved", "Reviewed"].map((status) => (
              <button key={status} className={returnFilter === status ? "active" : ""} onClick={() => setReturnFilter(status)}>{status}{status === "Pending" && <b>{sellerReturns.filter((r) => r.status === "Pending").length}</b>}</button>
            ))}
          </div>
          <div className="sv-return-search">⌕ <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search return, order or customer..." /></div>
        </div>

        <div className="sv-return-list">
          {filteredReturns.filter((request) => !query || `${request.id} ${request.orderId} ${request.customer} ${request.product?.name || ""} ${request.reason}`.toLowerCase().includes(query.toLowerCase())).map((request) => (
            <div className="sv-return-row" key={request.id}>
              <div className="sv-return-row-id"><strong>{request.id}</strong><small>Order {request.orderId}</small></div>
              <div className="sv-return-row-customer"><div className="sv-return-avatar mini">{request.customer.charAt(0)}</div><span><strong>{request.customer}</strong><small>Customer return</small></span></div>
              <div className="sv-return-row-product"><img src={request.product?.image} alt={request.product?.name || "Product"}/><span><strong>{request.product?.name}</strong><small>{request.product?.audience || "Fashion"} · Qty {request.qty}</small></span></div>
              <div className="sv-return-row-reason"><small>REASON</small><strong>{request.reason}</strong></div>
              <div className="sv-return-row-value"><small>VALUE</small><strong>{money(request.amount)}</strong><span>{request.requestedOn}</span></div>
              <div className="sv-return-row-status"><span className={`sv-return-pill ${request.status.toLowerCase()}`}>{request.status}</span><button onClick={() => setReturnPreview(request)}>Open</button></div>
            </div>
          ))}
          {!filteredReturns.length && <div className="sv-return-empty"><b>No return cases</b><span>There are no return requests in this status.</span></div>}
        </div>
      </section>

      <div className="sv-return-note"><span>✓</span><div><strong>Seller action</strong><small>Return requests are isolated to this Seller Return Management page. Existing seller modules remain unchanged.</small></div></div>

      <ReturnCasePreview request={returnPreview} close={() => setReturnPreview(null)} onStatusChange={updateReturnStatus} />
    </section>
  );

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
        <img src={p.image} alt={p.name} onError={() => markImageBroken(p)} /><div><small>{p.audience} · {p.type || p.category}</small><h3>{p.name}</h3><span>★ {p.rating || "4.5"} · {p.sold} sold</span></div><div><small>MRP</small><b>{money(p.oldPrice)}</b></div><div><small>SELLING PRICE</small><b>{money(p.price)}</b></div><div><small>DISCOUNT</small><strong>{discount(p)}% OFF</strong></div><div><span className="active-offer">● ACTIVE</span><small>Customer-facing offer</small></div>
        <button onClick={() => setPreview(p)}>View Product</button>
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
    <section className="sv-panel"><div className="sv-panelhead"><div><small className="sv-kicker">VEYRAA INTELLIGENCE</small><p>Products with stronger recent sales activity are surfaced using the same customer catalogue.</p></div></div>
      <div className="sv-demand">{displayCatalog.slice(0,10).map((p,i)=><div key={`${p.audience}-${p.id}`}><b>0{i+1}</b><img src={p.image} alt={p.name} onError={() => markImageBroken(p)}/><span><strong>{p.name}</strong><small>{p.audience} · {p.type || p.category}</small></span><div className="spark">{[30,45,40,58,52,72,66,88].map((h,n)=><i key={n} style={{height:`${h + ((i*3)%10)}%`}}/>)}</div><em>+{18+i*3}%</em><button onClick={() => setPreview(p)}>View</button></div>)}</div></section>
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


  const sellerPlanWorkspace = activeSellerPlan ? (
    <div className="sv-plan-workspace">
      <div className="sv-plan-workspace-head">
        <div>
          <small className="sv-kicker">ACTIVE PLAN ADD-ON</small>
          <h3>{activeSellerPlan.name} Seller Services</h3>
          <p>Only the services included in the paid plan are available here. Existing Seller Portal pages remain unchanged.</p>
        </div>
        <span>✓ {activeSellerPlan.name.toUpperCase()} ACTIVE</span>
      </div>

      <div className="sv-plan-service-grid">
        {hasSellerFeature("miniStorefront") && (
          <div className="sv-plan-service-card">
            <small>SELLER MINI-STOREFRONT</small><h4>Dedicated seller storefront</h4>
            <p>Storefront entitlement is active for your seller account.</p>
            <button className="sv-outline" type="button" onClick={() => activatePlanService("miniStorefront")}>{isPlanServiceActive("miniStorefront") ? "Storefront Ready ✓" : "Storefront Active ✓"}</button>
          </div>
        )}

        {hasSellerFeature("advancedAnalytics") && (
          <div className="sv-plan-service-card">
            <small>ADVANCED SELLER ANALYTICS</small><h4>Growth performance</h4>
            <div className="sv-plan-mini-metrics"><b>{displayCatalog.reduce((n,p) => n + Number(p.sold || 0), 0)}<small>Units sold</small></b><b>{displayCatalog.length}<small>Products</small></b><b>4.8%<small>Conversion</small></b></div>
            <button className="sv-outline" type="button" onClick={() => activatePlanService("advancedAnalytics")}>{isPlanServiceActive("advancedAnalytics") ? "Analytics Ready ✓" : "Analytics Enabled ✓"}</button>
          </div>
        )}

        {hasSellerFeature("marketingCampaigns") && (
          <div className="sv-plan-service-card">
            <small>MARKETING CAMPAIGNS</small><h4>Campaign participation</h4>
            <div className="sv-plan-chip-row">{["Festival Fashion", "New Arrivals", "Wedding Season"].map((x) => <button key={x} type="button" className="sv-plan-chip">{x}</button>)}</div>
            <button className="sv-primary" type="button" onClick={() => activatePlanService("marketingCampaigns")}>{isPlanServiceActive("marketingCampaigns") ? "Campaign Joined ✓" : "Join Campaign"}</button>
          </div>
        )}

        {hasSellerFeature("catalogueService") && (
          <div className="sv-plan-service-card">
            <small>PROFESSIONAL CATALOGUE SERVICE</small><h4>Catalogue assistance</h4>
            <p>Request image editing, background cleanup, descriptions or size-chart preparation.</p>
            <button className="sv-primary" type="button" onClick={() => activatePlanService("catalogueService")}>{isPlanServiceActive("catalogueService") ? "Service Requested ✓" : "Request Catalogue Service"}</button>
          </div>
        )}

        {hasSellerFeature("fulfilment") && (
          <div className="sv-plan-service-card">
            <small>VEYRAA FULFILMENT & DELIVERY</small><h4>Fulfilment support</h4>
            <p>Seller fulfilment service entitlement is available for activation.</p>
            <button className="sv-outline" type="button" onClick={() => activatePlanService("fulfilment")}>{isPlanServiceActive("fulfilment") ? "Fulfilment Opted In ✓" : "Fulfilment Available ✓"}</button>
          </div>
        )}

        {hasSellerFeature("promotionalEngine") && (
          <div className="sv-plan-service-card">
            <small>SELLER PROMOTIONAL ENGINE</small><h4>Offers & coupons</h4>
            <div className="sv-plan-inline-form"><input placeholder="Coupon code" defaultValue="STYLE15" /><input placeholder="Discount %" defaultValue="15" /><button className="sv-primary" type="button" onClick={() => activatePlanService("promotionalEngine")}>{isPlanServiceActive("promotionalEngine") ? "Offer Draft Saved ✓" : "Create Offer"}</button></div>
          </div>
        )}

        {hasSellerFeature("marketIntelligence") && (
          <div className="sv-plan-service-card">
            <small>VEYRAA MARKET INTELLIGENCE</small><h4>Market signals</h4>
            <div className="sv-plan-signal"><span>Wedding wear demand</span><b>Rising</b></div>
            <div className="sv-plan-signal"><span>Festive fashion</span><b>High interest</b></div>
            <button className="sv-outline" type="button" onClick={() => activatePlanService("marketIntelligence")}>{isPlanServiceActive("marketIntelligence") ? "Signal Reviewed ✓" : "Intelligence Active ✓"}</button>
          </div>
        )}

        {hasSellerFeature("inventoryDemand") && (
          <div className="sv-plan-service-card">
            <small>INVENTORY & DEMAND INTELLIGENCE</small><h4>Replenishment signals</h4>
            <div className="sv-plan-signal"><span>Low-stock products</span><b>{lowStock.length}</b></div>
            <div className="sv-plan-signal"><span>Demand signal</span><b>Rising</b></div>
            <button className="sv-outline" type="button" onClick={() => activatePlanService("inventoryDemand")}>{isPlanServiceActive("inventoryDemand") ? "Replenishment Reviewed ✓" : "Demand Intelligence Active ✓"}</button>
          </div>
        )}

        {hasSellerFeature("sponsoredProducts") && (
          <div className="sv-plan-service-card">
            <small>SPONSORED PRODUCTS</small><h4>Product promotion</h4>
            <p>Select a catalogue product to use for a sponsored placement.</p>
            <select defaultValue=""><option value="" disabled>Select product</option>{displayCatalog.slice(0,12).map((p) => <option key={`${p.audience}-${p.id}`} value={p.id}>{p.name}</option>)}</select>
            <button className="sv-primary" type="button" onClick={() => activatePlanService("sponsoredProducts")}>{isPlanServiceActive("sponsoredProducts") ? "Sponsored Product Active ✓" : "Activate Sponsored Product"}</button>
          </div>
        )}

        {hasSellerFeature("featuredPlacement") && (
          <div className="sv-plan-service-card">
            <small>FEATURED PLACEMENT</small><h4>Premium marketplace visibility</h4>
            <p>Your premium plan includes eligibility for featured seller/product placements.</p>
            <button className="sv-primary" type="button" onClick={() => activatePlanService("featuredPlacement")}>{isPlanServiceActive("featuredPlacement") ? "Placement Requested ✓" : "Request Featured Placement"}</button>
          </div>
        )}

        {hasSellerFeature("sponsoredSearch") && (
          <div className="sv-plan-service-card">
            <small>SPONSORED SEARCH</small><h4>Search visibility</h4>
            <div className="sv-plan-inline-form"><input placeholder="Search keyword" defaultValue="silk saree" /><button className="sv-primary" type="button" onClick={() => activatePlanService("sponsoredSearch")}>{isPlanServiceActive("sponsoredSearch") ? "Search Promotion Active ✓" : "Promote Search"}</button></div>
          </div>
        )}

        {hasSellerFeature("verifiedBadge") && (
          <div className="sv-plan-service-card sv-plan-verified-card">
            <small>VEYRAA VERIFIED SELLER BADGE</small><h4>Seller verification entitlement</h4>
            <div className="sv-plan-verified-status"><b>✓</b><span><strong>Verified Badge Active</strong><small>Verification ID: {planPaymentDetails?.verificationId || "Session verified"}</small></span></div>
            <p>The paid Premium subscription has enabled the seller verification badge entitlement for this session.</p>
          </div>
        )}

        {hasSellerFeature("creatorCommerce") && (
          <div className="sv-plan-service-card"><small>CREATOR & INFLUENCER COMMERCE</small><h4>Creator campaign access</h4><p>Seller is eligible to request creator/influencer promotion campaigns.</p><button className="sv-primary" type="button" onClick={() => activatePlanService("creatorCommerce")}>{isPlanServiceActive("creatorCommerce") ? "Creator Request Sent ✓" : "Request Creator Campaign"}</button></div>
        )}

        {hasSellerFeature("brandPartnerships") && (
          <div className="sv-plan-service-card"><small>BRAND PARTNERSHIP CAMPAIGNS</small><h4>Partnership access</h4><p>Premium sellers can submit interest for relevant fashion and lifestyle partnership campaigns.</p><button className="sv-outline" type="button" onClick={() => activatePlanService("brandPartnerships")}>{isPlanServiceActive("brandPartnerships") ? "Interest Submitted ✓" : "Submit Interest"}</button></div>
        )}

        {hasSellerFeature("premiumSupport") && (
          <div className="sv-plan-service-card"><small>PREMIUM SELLER SUPPORT</small><h4>Priority assistance</h4><p>Priority onboarding, catalogue, campaign and operational support is available.</p><button className="sv-primary" type="button" onClick={() => activatePlanService("premiumSupport")}>{isPlanServiceActive("premiumSupport") ? "Priority Request Open ✓" : "Open Priority Support"}</button></div>
        )}

        {hasSellerFeature("preOrder") && (
          <div className="sv-plan-service-card"><small>PRE-ORDER & DEMAND RESERVATION</small><h4>Pre-order access</h4><p>Upcoming products can be prepared for demand reservation through the seller plan.</p><button className="sv-outline" type="button" onClick={() => activatePlanService("preOrder")}>{isPlanServiceActive("preOrder") ? "Pre-order Workspace Ready ✓" : "Pre-order Access Active ✓"}</button></div>
        )}

        {hasSellerFeature("deadStock") && (
          <div className="sv-plan-service-card"><small>DEAD-STOCK RECOVERY MARKETPLACE</small><h4>Slow-stock recovery</h4><p>Eligible slow-moving inventory can be submitted for recovery marketplace participation.</p><button className="sv-outline" type="button" onClick={() => activatePlanService("deadStock")}>{isPlanServiceActive("deadStock") ? "Recovery Submission Ready ✓" : "Recovery Access Active ✓"}</button></div>
        )}
      </div>
    </div>
  ) : null;

  const sellerPlansPage = (
    <section className="sv-plan-page">
      <div className="sv-plan-hero">
        <div className="sv-plan-hero-content">
          <small className="sv-kicker">SELLER SUBSCRIPTION</small>
          <h2>Choose the plan that grows with your store.</h2>
          <p>Compare seller capabilities, review every included feature and activate the plan you need through a secure UPI-style checkout.</p>
          <div className="sv-plan-hero-points"><span>✓ Instant plan activation</span><span>✓ Feature access status</span><span>✓ Seller verification ID</span></div>
        </div>
        {activeSellerPlan ? (
          <div className="sv-plan-active-mini">
            <span>CURRENT PLAN</span>
            <strong>{activeSellerPlan.name}</strong>
            <small>{money(activeSellerPlan.price)} / month</small>
            <b>✓ ACTIVE</b>
          </div>
        ) : (
          <div className="sv-plan-hero-badge"><span>SELLER ACCESS</span><strong>3 plans</strong><small>Basic · Business · Premium</small></div>
        )}
      </div>

      {activeSellerPlan && planPaymentDetails && (
        <div className="sv-plan-current-panel">
          <div className="sv-plan-current-panel-main">
            <div className="sv-plan-current-icon">✓</div>
            <div><small>YOUR CURRENT PLAN</small><h3>{activeSellerPlan.name} Seller Plan</h3><p>Payment confirmed · {planPaymentDetails.method} · {planPaymentDetails.upiId}</p></div>
          </div>
          <div className="sv-plan-current-meta"><div><small>VERIFICATION ID</small><b>{planPaymentDetails.verificationId}</b></div><div><small>TRANSACTION ID</small><b>{planPaymentDetails.paymentRef}</b></div><div><small>STATUS</small><b>● ACTIVE</b></div></div>
        </div>
      )}

      <div className="sv-plan-grid">
        {Object.values(SELLER_PLANS).map((plan) => {
          const isActive = activeSellerPlan?.key === plan.key;
          return (
            <article className={`sv-plan-card ${plan.key} ${isActive ? "active" : ""}`} key={plan.key}>
              {isActive && <div className="sv-plan-current">CURRENT PLAN · ACTIVE</div>}
              <div className="sv-plan-card-top">
                <div><span className={`sv-plan-badge ${plan.key}`}>{plan.name}</span><span className="sv-plan-monthly">MONTHLY SUBSCRIPTION</span></div>
                <div className="sv-plan-price"><strong>{money(plan.price)}</strong><small>/ month</small></div>
              </div>
              <p>{plan.subtitle}</p>
              <div className="sv-plan-count"><b>{plan.features.length}</b> seller features included</div>
              <div className="sv-plan-card-features">
                {plan.features.map((feature) => <span key={feature}>✓ <b>{feature}</b></span>)}
              </div>
              <button className={isActive ? "sv-outline sv-plan-card-btn" : "sv-primary sv-plan-card-btn"} onClick={() => setPlanPreview(plan)}>
                {isActive ? "View Current Plan" : `Review ${plan.name} Plan`}
              </button>
            </article>
          );
        })}
      </div>

      {activeSellerPlan ? (
        <div className="sv-plan-access">
          <div className="sv-plan-access-head">
            <div><small className="sv-kicker">ACTIVE FEATURE ACCESS</small><h3>{activeSellerPlan.name} Plan · All Features Enabled</h3><p>Every feature included in your current plan is shown below with an active status.</p></div>
            <span>✓ ACTIVE ACCESS</span>
          </div>
          <div className="sv-plan-access-grid">
            {activeSellerPlan.features.map((feature) => <div key={feature}><b>✓</b><span>{feature}</span><em>Enabled</em></div>)}
          </div>
        </div>
      ) : (
        <div className="sv-plan-empty"><div className="sv-plan-empty-icon">◆</div><b>No seller plan is active yet.</b><span>Select a plan above, review all features and complete the UPI-style checkout to activate your seller access.</span></div>
      )}

      {sellerPlanWorkspace}

      <SellerPlanPreview plan={planPreview} close={() => setPlanPreview(null)} onChoose={(plan) => { setPlanPreview(null); setPlanPayment(plan); }} />
      <SellerPlanPayment plan={planPayment} close={() => setPlanPayment(null)} onSuccess={(plan, payment) => {
        setActiveSellerPlan(plan);
        setPlanPaymentDetails(payment);
        setPlanPayment(null);
        setPlanServiceState({});
        window.__VEYRAA_SELLER_PLAN__ = { key: plan.key, name: plan.name, featureKeys: plan.featureKeys, payment };
        window.dispatchEvent(new CustomEvent("veyraa:seller-plan-updated", { detail: { plan, payment } }));
      }} />
    </section>
  );

    const renderBody = page === "home" ? home : page === "orders" ? ordersPage(false) : page === "pending" ? ordersPage(true) : page === "returns" ? returnsPage : page === "products" ? productsPage : page === "inventory" ? inventory : page === "pricing" ? pricing : page === "payments" ? payments : page === "analytics" ? analytics : page === "demand" ? demand : page === "restock" ? restock : page === "performance" ? performance : page === "seller-plans" ? sellerPlansPage : settings;

  return <div className="seller-app">
    <aside className="seller-sidebar"><div className="sv-brand"><b>V</b><span>VEYRAA<small>SELLER CENTER</small></span></div><div className="sv-store"><b>VF</b><span><strong>Veyraa Fashion Store</strong><small>Verified Seller</small></span><i>●</i></div><nav>{nav.map(([section,icon,label,key]) => <React.Fragment key={key}>{section && <label>{section}</label>}<button className={page === key ? "active" : ""} onClick={() => go(key)}><span>{icon}</span><em>{label}</em>{label.includes("Orders") && <b>{key === "orders" ? 8 : 5}</b>}</button></React.Fragment>)}</nav><div className="sv-health"><span>Account Health <b>92 / 100</b></span><i /></div></aside>
    <main className="seller-main">{header}<div className="sv-content">{renderBody}</div></main>
    <ProductPreview product={preview} close={() => setPreview(null)} onImageError={(product) => { markImageBroken(product); setPreview(null); }} />
    <OrderPreview order={orderPreview} close={() => setOrderPreview(null)} />
    <button className="sv-logout" onClick={() => {
      setActiveSellerPlan(null);
      setPlanPaymentDetails(null);
      setPlanPreview(null);
      setPlanPayment(null);
      setPlanServiceState({});
      delete window.__VEYRAA_SELLER_PLAN__;
      window.dispatchEvent(new CustomEvent("veyraa:seller-plan-updated", { detail: null }));
      setPage("home");
      window.dispatchEvent(new CustomEvent("veyraa:portal-logout", { detail: "seller" }));
    }}>↪ Logout</button>
  </div>;
}

export default SellerDashboard;
