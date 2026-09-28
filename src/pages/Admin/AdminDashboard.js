import React, { useMemo, useState } from "react";
import "./admin.css";
import "./admin-polish.css";
import "./admin-modal-fix.css";

/* =========================================================
   VEYRAA ADMIN CONTROL CENTER
   ========================================================= */

const products = [
  {
    id: "PRD-001",
    name: "Women's White Casual Top",
    audience: "Women",
    category: "Tops",
    type: "Tops",
    material: "Cotton",
    colour: "White",
    price: 699,
    mrp: 999,
    rating: 4.4,
    stock: 48,
    status: "Approved",
    tag: "Popular",
    seller: "Veyraa Studio",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "PRD-002",
    name: "Structured Black Top",
    audience: "Women",
    category: "Women · Tops",
    type: "Women · Tops",
    material: "Premium material",
    colour: "Black",
    price: 2000,
    mrp: 2499,
    rating: 4.5,
    stock: 27,
    status: "Approved",
    tag: "Trending",
    seller: "Urban Loom",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "PRD-003",
    name: "Elegant Embroidered Kurti",
    audience: "Women",
    category: "Kurtis",
    type: "Ethnic Wear",
    material: "Rayon",
    colour: "Red",
    price: 1299,
    mrp: 1799,
    rating: 4.6,
    stock: 34,
    status: "Approved",
    tag: "Best Seller",
    seller: "Veyraa Studio",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "PRD-004",
    name: "Classic Men's Cotton Kurta",
    audience: "Men",
    category: "Kurtas",
    type: "Ethnic Wear",
    material: "Cotton",
    colour: "Blue",
    price: 1499,
    mrp: 1999,
    rating: 4.3,
    stock: 31,
    status: "Approved",
    tag: "Popular",
    seller: "Urban Loom",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "PRD-005",
    name: "Festive Floral Lehenga",
    audience: "Women",
    category: "Lehengas",
    type: "Festive Wear",
    material: "Silk Blend",
    colour: "Pink",
    price: 3499,
    mrp: 4999,
    rating: 4.7,
    stock: 18,
    status: "Pending Review",
    tag: "Festive",
    seller: "Style Studio",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "PRD-006",
    name: "Premium Silk Saree",
    audience: "Women",
    category: "Sarees",
    type: "Traditional Wear",
    material: "Silk",
    colour: "Gold",
    price: 4299,
    mrp: 5999,
    rating: 4.8,
    stock: 12,
    status: "Approved",
    tag: "Premium",
    seller: "Veyraa Studio",
    image:
      "https://images.unsplash.com/photo-1610030469668-8e9f641aafac?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "PRD-007",
    name: "Kids Festive Ethnic Set",
    audience: "Kids",
    category: "Kids Wear",
    type: "Festive Wear",
    material: "Cotton Blend",
    colour: "Yellow",
    price: 999,
    mrp: 1399,
    rating: 4.5,
    stock: 25,
    status: "Approved",
    tag: "Kids",
    seller: "Little Vogue",
    image:
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: "PRD-008",
    name: "Minimal Casual Shirt",
    audience: "Men",
    category: "Shirts",
    type: "Casual Wear",
    material: "Cotton",
    colour: "Black",
    price: 1199,
    mrp: 1699,
    rating: 4.2,
    stock: 41,
    status: "Approved",
    tag: "Everyday",
    seller: "Urban Loom",
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=85",
  },
];

const customers = [
  {
    id: "CUS-001",
    name: "Priya S",
    email: "priya@example.com",
    phone: "+91 9800000021",
    segment: "Loyal",
    orders: 18,
    spend: 42680,
    status: "Active",
  },
  {
    id: "CUS-002",
    name: "Rahul K",
    email: "rahul@example.com",
    phone: "+91 9700000032",
    segment: "Regular",
    orders: 11,
    spend: 28990,
    status: "Active",
  },
  {
    id: "CUS-003",
    name: "Sneha R",
    email: "sneha@example.com",
    phone: "+91 9600000043",
    segment: "Growing",
    orders: 7,
    spend: 16800,
    status: "Active",
  },
  {
    id: "CUS-004",
    name: "Karthik M",
    email: "karthik@example.com",
    phone: "+91 9500000054",
    segment: "Review",
    orders: 3,
    spend: 7450,
    status: "Suspended",
  },
  {
    id: "CUS-005",
    name: "Divya P",
    email: "divya@example.com",
    phone: "+91 9400000065",
    segment: "VIP",
    orders: 23,
    spend: 58420,
    status: "Active",
  },
];

const sellers = [
  {
    id: "SEL-001",
    name: "Veyraa Studio",
    company: "Veyraa Studio Pvt Ltd",
    city: "Chennai",
    sales: 482,
    rating: 4.7,
    delays: 3,
    complaints: 4,
    returns: 6,
    deliveryReliability: 96,
    status: "Verified",
    category: "Women's Fashion",
  },
  {
    id: "SEL-002",
    name: "Urban Loom",
    company: "Urban Loom Pvt Ltd",
    city: "Chennai",
    sales: 361,
    rating: 4.5,
    delays: 5,
    complaints: 7,
    returns: 9,
    deliveryReliability: 92,
    status: "Verified",
    category: "Men's Fashion",
  },
  {
    id: "SEL-003",
    name: "Style Studio",
    company: "Style Studio",
    city: "Coimbatore",
    sales: 294,
    rating: 4.3,
    delays: 8,
    complaints: 9,
    returns: 12,
    deliveryReliability: 88,
    status: "Under Review",
    category: "Women's Fashion",
  },
  {
    id: "SEL-004",
    name: "Little Vogue",
    company: "Little Vogue",
    city: "Bengaluru",
    sales: 226,
    rating: 4.6,
    delays: 2,
    complaints: 3,
    returns: 5,
    deliveryReliability: 97,
    status: "Verified",
    category: "Kids Fashion",
  },
];

const orders = [
  {
    id: "VY28491",
    date: "28 Sep 2026",
    customer: "Priya S",
    product: "Elegant Embroidered Kurti",
    productId: "PRD-003",
    seller: "Veyraa Studio",
    amount: 1299,
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "VY28492",
    date: "28 Sep 2026",
    customer: "Rahul K",
    product: "Classic Men's Cotton Kurta",
    productId: "PRD-004",
    seller: "Urban Loom",
    amount: 1499,
    payment: "Paid",
    status: "Shipped",
  },
  {
    id: "VY28493",
    date: "27 Sep 2026",
    customer: "Sneha R",
    product: "Festive Floral Lehenga",
    productId: "PRD-005",
    seller: "Style Studio",
    amount: 3499,
    payment: "Paid",
    status: "Processing",
  },
  {
    id: "VY28494",
    date: "27 Sep 2026",
    customer: "Divya P",
    product: "Premium Silk Saree",
    productId: "PRD-006",
    seller: "Veyraa Studio",
    amount: 4299,
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "VY28495",
    date: "26 Sep 2026",
    customer: "Karthik M",
    product: "Minimal Casual Shirt",
    productId: "PRD-008",
    seller: "Urban Loom",
    amount: 1199,
    payment: "Refunded",
    status: "Returned",
  },
];

const complaints = [
  {
    id: "CMP-1821",
    customer: "Priya S",
    issue: "Product quality complaint",
    priority: "High",
    order: "VY28491",
    status: "Open",
  },
  {
    id: "CMP-1817",
    customer: "Rahul K",
    issue: "Delivery delay",
    priority: "Medium",
    order: "VY28492",
    status: "Open",
  },
  {
    id: "CMP-1812",
    customer: "Sneha R",
    issue: "Wrong product received",
    priority: "High",
    order: "VY28493",
    status: "Open",
  },
  {
    id: "CMP-1806",
    customer: "Divya P",
    issue: "Refund not received",
    priority: "Medium",
    order: "VY28494",
    status: "Open",
  },
];

const anomalies = [
  {
    id: "AN-001",
    type: "Seller Activity",
    title: "Cancellation pattern detected",
    subject: "Urban Loom",
    severity: "High",
    reason: [
      "Cancellation rate increased from 3.2% to 11.8%.",
      "Increase started within the last 2 days.",
      "Multiple cancellations occurred after dispatch.",
    ],
    action: "Review seller fulfilment activity",
  },
  {
    id: "AN-002",
    type: "Order Behaviour",
    title: "Unusual order behaviour",
    subject: "VY28495",
    severity: "Medium",
    reason: [
      "Order was returned shortly after delivery.",
      "Refund activity was triggered.",
      "Pattern differs from customer's previous orders.",
    ],
    action: "Review order and return history",
  },
  {
    id: "AN-003",
    type: "Customer Activity",
    title: "Return frequency increased",
    subject: "Karthik M",
    severity: "Medium",
    reason: [
      "Recent return frequency is above account history.",
      "Three returns were recorded in the recent period.",
      "Customer account is currently under review.",
    ],
    action: "Review customer activity",
  },
];

const auditLogs = [
  {
    time: "09:18 AM",
    admin: "Admin",
    action: "Product approval reviewed",
    target: "PRD-005",
  },
  {
    time: "09:05 AM",
    admin: "Admin",
    action: "Customer profile opened",
    target: "CUS-001",
  },
  {
    time: "08:52 AM",
    admin: "Admin",
    action: "Seller verification reviewed",
    target: "SEL-002",
  },
  {
    time: "08:41 AM",
    admin: "Admin",
    action: "Complaint case opened",
    target: "CMP-1821",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

function getProduct(productId) {
  return products.find((p) => p.id === productId) || products[0];
}

/* =========================================================
   CUSTOMER CATALOGUE IMAGE RESOLUTION
   Uses the same customer-facing image paths where they are
   available in the Veyraa catalogue. Broken remote images
   are given a local catalogue fallback.
   ========================================================= */

const CUSTOMER_IMAGE_FALLBACKS = {
  "PRD-001": "/women/whitedress-01.jpg",
  "PRD-002": "/women/black%20ribbed-01.jpg",
  "PRD-003": "/women/kurti-02.jpg",
  "PRD-004": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
  "PRD-005": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
  "PRD-006": "/women/saree-01.jpg",
  "PRD-007": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=85",
  "PRD-008": "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=800&q=85",
};

function getProductImage(product) {
  if (!product) return "/women/saree-01.jpg";
  return CUSTOMER_IMAGE_FALLBACKS[product.id] || product.image;
}

function handleProductImageError(event, product) {
  const fallback = CUSTOMER_IMAGE_FALLBACKS[product?.id];
  if (!fallback || event.currentTarget.dataset.fallbackApplied) return;
  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.src = fallback;
}

function calculateTrustScore(seller) {
  const score =
    seller.deliveryReliability * 0.4 +
    seller.rating * 20 * 0.25 +
    Math.max(0, 100 - seller.complaints * 5) * 0.15 +
    Math.max(0, 100 - seller.delays * 4) * 0.1 +
    Math.max(0, 100 - seller.returns * 3) * 0.1;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function trustLabel(score) {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Healthy";
  if (score >= 55) return "Watch";
  return "Review";
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [selectedSetting, setSelectedSetting] = useState(null);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [selectedSeller, setSelectedSeller] =
    useState(null);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [selectedCase, setSelectedCase] =
    useState(null);

  const [selectedReturn, setSelectedReturn] =
    useState(null);

  const [selectedAnomaly, setSelectedAnomaly] =
    useState(null);

  const [selectedCustomerAction, setSelectedCustomerAction] =
    useState(null);

  const [selectedSellerAction, setSelectedSellerAction] =
    useState(null);

  const [selectedMarketing, setSelectedMarketing] =
    useState(null);

  const [selectedDelivery, setSelectedDelivery] =
    useState(null);

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [selectedFullReport, setSelectedFullReport] =
    useState(null);


  const [notification, setNotification] =
    useState("");

  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2200);
  };

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.seller.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(q) ||
        customer.email.toLowerCase().includes(q) ||
        customer.segment.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredSellers = useMemo(() => {
    const q = search.toLowerCase();

    return sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(q) ||
        seller.city.toLowerCase().includes(q) ||
        seller.category.toLowerCase().includes(q)
    );
  }, [search]);

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const navGroups = [
    {
      title: "CONTROL CENTER",
      items: [
        ["dashboard", "⌂", "Dashboard"],
        ["customers", "♙", "Customers"],
        ["sellers", "♙", "Sellers"],
        ["catalogue", "▦", "Catalogue"],
        ["approval", "✓", "Product Approval"],
        ["orders", "▤", "Orders"],
        ["payments", "₹", "Payments & Finance"],
        ["returns", "↩", "Returns & Refunds"],
        ["complaints", "!", "Complaints & Disputes"],
      ],
    },
    {
      title: "MARKETPLACE",
      items: [
        ["marketing", "◇", "Marketing & Promotions"],
        ["delivery", "⌁", "Delivery Management"],
        ["reports", "▥", "Reports & Analytics"],
      ],
    },
    {
      title: "ADMIN INTELLIGENCE",
      items: [
        ["trust", "♢", "Trust Score Engine"],
        ["anomaly", "◉", "AI Anomaly Detection"],
        ["audit", "▤", "Audit Logs"],
        ["settings", "⚙", "Settings"],
      ],
    },
  ];

  /* =========================================================
     DASHBOARD
     ========================================================= */

  const dashboard = (
    <PageShell
      eyebrow="ADMIN CONTROL CENTER"
      title="Marketplace Overview"
      description="Monitor customers, sellers, products, orders and marketplace operations from one control center."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="TOTAL SALES"
          value="₹18.64L"
          change="+12.4%"
          note="This month"
        />
        <StatCard
          label="TOTAL ORDERS"
          value="4,826"
          change="+8.1%"
          note="Marketplace orders"
        />
        <StatCard
          label="ACTIVE CUSTOMERS"
          value="6,284"
          change="+5.7%"
          note="Active today"
        />
        <StatCard
          label="ACTIVE SELLERS"
          value="428"
          change="+6.2%"
          note="Verified marketplace sellers"
        />
      </div>

      <div className="admin-two-column">
        <Panel
          eyebrow="RECENT ACTIVITY"
          title="Latest Orders"
          action="Manage Orders →"
          onAction={() => setPage("orders")}
        >
          <div className="admin-order-list">
            {orders.map((order) => {
              const product = getProduct(order.productId);

              return (
                <div
                  className="admin-order-row"
                  key={order.id}
                >
                  <div className="admin-order-id">
                    <strong>{order.id}</strong>
                    <small>{order.date}</small>
                  </div>

                  <div className="admin-product-mini">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      onError={(e) => handleProductImageError(e, product)}
                    />

                    <div>
                      <strong>{product.name}</strong>
                      <small>{order.customer}</small>
                    </div>
                  </div>

                  <div className="admin-order-seller">
                    {order.seller}
                  </div>

                  <strong>
                    ₹{order.amount.toLocaleString("en-IN")}
                  </strong>

                  <StatusBadge
                    type={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Returned"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {order.status}
                  </StatusBadge>

                  <button
                    className="admin-small-button"
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                  >
                    Preview
                  </button>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel
          eyebrow="MARKETPLACE HEALTH"
          title="Operational Snapshot"
        >
          <div className="admin-health-list">
            <HealthRow
              label="Order Fulfilment"
              value="94.2%"
              progress={94}
            />
            <HealthRow
              label="Seller Reliability"
              value="91.8%"
              progress={92}
            />
            <HealthRow
              label="Customer Resolution"
              value="87.4%"
              progress={87}
            />
            <HealthRow
              label="Delivery Success"
              value="96.1%"
              progress={96}
            />
          </div>

          <div className="admin-alert-box">
            <strong>3 items require attention</strong>
            <span>
              Product approvals and anomaly investigations
              are waiting for Admin review.
            </span>
            <button
              onClick={() => setPage("anomaly")}
            >
              Review Alerts →
            </button>
          </div>
        </Panel>
      </div>
    </PageShell>
  );

  /* =========================================================
     CUSTOMER PAGE
     ========================================================= */

  const customerPage = (
    <PageShell
      eyebrow="CUSTOMER GOVERNANCE"
      title="Customer Management"
      description="Manage customer accounts, segments, activity and marketplace relationships."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="REGISTERED CUSTOMERS"
          value="18,642"
          change="+12.4%"
          note="Marketplace accounts"
        />
        <StatCard
          label="ACTIVE TODAY"
          value="6,284"
          change="+8.1%"
          note="Recent activity"
        />
        <StatCard
          label="VIP CUSTOMERS"
          value="1,248"
          change="+5.7%"
          note="High-value segment"
        />
        <StatCard
          label="UNDER REVIEW"
          value="24"
          change="Requires attention"
          note="Account review"
          danger
        />
      </div>

      <Panel
        eyebrow="CUSTOMER DATABASE"
        title="Customer Accounts"
        rightText={`${filteredCustomers.length} shown`}
      >
        <div className="admin-table">
          <div className="admin-table-head customer-grid">
            <span>CUSTOMER</span>
            <span>CONTACT</span>
            <span>SEGMENT</span>
            <span>ORDERS</span>
            <span>TOTAL SPEND</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          {filteredCustomers.map((customer) => (
            <div
              className="admin-table-row customer-grid"
              key={customer.id}
            >
              <div className="admin-person">
                <Avatar name={customer.name} />
                <div>
                  <strong>{customer.name}</strong>
                  <small>{customer.id}</small>
                </div>
              </div>

              <div>
                <strong>{customer.email}</strong>
                <small>{customer.phone}</small>
              </div>

              <Badge>{customer.segment}</Badge>

              <strong>{customer.orders}</strong>

              <strong>
                ₹{customer.spend.toLocaleString("en-IN")}
              </strong>

              <StatusBadge
                type={
                  customer.status === "Active"
                    ? "success"
                    : "danger"
                }
              >
                {customer.status}
              </StatusBadge>

              <button
                className="admin-small-button"
                onClick={() =>
                  setSelectedCustomer(customer)
                }
              >
                View
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </PageShell>
  );

  /* =========================================================
     SELLER PAGE
     ========================================================= */

  const sellerPage = (
    <PageShell
      eyebrow="SELLER GOVERNANCE"
      title="Seller Management"
      description="Review seller profiles, verification, operational performance and Trust Score."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="ACTIVE SELLERS"
          value="428"
          change="+6.2%"
          note="Verified marketplace"
        />
        <StatCard
          label="PENDING VERIFICATION"
          value="17"
          change="Requires review"
          note="Seller onboarding"
        />
        <StatCard
          label="HIGH TRUST"
          value="312"
          change="73%"
          note="Strong operational health"
        />
        <StatCard
          label="UNDER REVIEW"
          value="24"
          change="Requires attention"
          note="Seller governance"
          danger
        />
      </div>

      <Panel
        eyebrow="SELLER DATABASE"
        title="Marketplace Sellers"
        rightText={`${filteredSellers.length} shown`}
      >
        <div className="admin-table">
          <div className="admin-table-head seller-grid">
            <span>SELLER</span>
            <span>LOCATION</span>
            <span>SALES</span>
            <span>RATING</span>
            <span>TRUST SCORE</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          {filteredSellers.map((seller) => {
            const score = calculateTrustScore(seller);

            return (
              <div
                className="admin-table-row seller-grid"
                key={seller.id}
              >
                <div className="admin-person">
                  <Avatar name={seller.name} />
                  <div>
                    <strong>{seller.name}</strong>
                    <small>{seller.company}</small>
                  </div>
                </div>

                <div>
                  <strong>{seller.city}</strong>
                  <small>{seller.category}</small>
                </div>

                <strong>{seller.sales}</strong>

                <strong>
                  ★ {seller.rating}
                </strong>

                <div className="admin-score-small">
                  <strong>{score}</strong>
                  <small>{trustLabel(score)}</small>
                </div>

                <StatusBadge
                  type={
                    seller.status === "Verified"
                      ? "success"
                      : "warning"
                  }
                >
                  {seller.status}
                </StatusBadge>

                <button
                  className="admin-small-button"
                  onClick={() =>
                    setSelectedSeller(seller)
                  }
                >
                  View
                </button>
              </div>
            );
          })}
        </div>
      </Panel>
    </PageShell>
  );

  /* =========================================================
     CATALOGUE
     ========================================================= */

  const cataloguePage = (
    <PageShell
      eyebrow="PRODUCT GOVERNANCE"
      title="Catalogue Management"
      description="Review the marketplace catalogue, product quality, categories, attributes and seller listings."
    >
      <div className="admin-filter-bar">
        <div className="admin-search-inline">
          ⌕
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
          />
        </div>

        <button
          className="admin-outline-button"
          onClick={() => setSearch("")}
        >
          Clear
        </button>
      </div>

      <div className="admin-product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={() =>
              setSelectedProduct(product)
            }
          />
        ))}
      </div>
    </PageShell>
  );

  /* =========================================================
     APPROVAL PAGE
     ========================================================= */

  const approvalPage = (
    <PageShell
      eyebrow="CATALOGUE MODERATION"
      title="Product Approval"
      description="Review seller-submitted products before they become part of the approved marketplace catalogue."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="PENDING REVIEW"
          value="24"
          change="Today"
          note="Listings awaiting approval"
        />
        <StatCard
          label="APPROVED"
          value="8,642"
          change="+4.2%"
          note="Approved listings"
        />
        <StatCard
          label="FLAGGED"
          value="31"
          change="Requires review"
          note="Quality or policy flags"
          danger
        />
        <StatCard
          label="REVIEWED TODAY"
          value="118"
          change="+18%"
          note="Admin activity"
        />
      </div>

      <div className="admin-product-grid">
        {products
          .filter(
            (product) =>
              product.status === "Pending Review" ||
              product.id === "PRD-001" ||
              product.id === "PRD-002"
          )
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              approval
              onView={() =>
                setSelectedProduct(product)
              }
            />
          ))}
      </div>
    </PageShell>
  );

  /* =========================================================
     ORDERS
     ========================================================= */

  const ordersPage = (
    <PageShell
      eyebrow="MARKETPLACE OPERATIONS"
      title="Order Management"
      description="Monitor the complete marketplace order lifecycle from payment through fulfilment and returns."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="TOTAL ORDERS"
          value="4,826"
          change="+8.1%"
          note="This month"
        />
        <StatCard
          label="PROCESSING"
          value="284"
          change="Current"
          note="Awaiting fulfilment"
        />
        <StatCard
          label="SHIPPED"
          value="516"
          change="Current"
          note="In transit"
        />
        <StatCard
          label="RETURNED"
          value="73"
          change="Current"
          note="Return cases"
          danger
        />
      </div>

      <Panel
        eyebrow="ORDER DATABASE"
        title="Marketplace Orders"
      >
        <div className="admin-table">
          <div className="admin-table-head order-grid">
            <span>ORDER</span>
            <span>CUSTOMER</span>
            <span>PRODUCT</span>
            <span>SELLER</span>
            <span>AMOUNT</span>
            <span>PAYMENT</span>
            <span>STATUS</span>
            <span>ACTION</span>
          </div>

          {orders.map((order) => {
            const product = getProduct(order.productId);

            return (
              <div
                className="admin-table-row order-grid"
                key={order.id}
              >
                <div>
                  <strong>{order.id}</strong>
                  <small>{order.date}</small>
                </div>

                <strong>{order.customer}</strong>

                <div className="admin-product-mini">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    onError={(e) => handleProductImageError(e, product)}
                  />
                  <strong>{product.name}</strong>
                </div>

                <strong>{order.seller}</strong>

                <strong>
                  ₹{order.amount.toLocaleString("en-IN")}
                </strong>

                <StatusBadge type="success">
                  {order.payment}
                </StatusBadge>

                <StatusBadge
                  type={
                    order.status === "Delivered"
                      ? "success"
                      : order.status === "Returned"
                      ? "danger"
                      : "warning"
                  }
                >
                  {order.status}
                </StatusBadge>

                <button
                  className="admin-small-button"
                  onClick={() =>
                    setSelectedOrder(order)
                  }
                >
                  Preview
                </button>
              </div>
            );
          })}
        </div>
      </Panel>
    </PageShell>
  );

  /* =========================================================
     PAYMENTS
     ========================================================= */

  const paymentsPage = (
    <PageShell
      eyebrow="FINANCIAL CONTROL"
      title="Payments & Finance"
      description="Monitor customer payments, seller settlements, platform commission and refunds."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="GROSS REVENUE"
          value="₹18.64L"
          change="+12.4%"
          note="Current month"
        />
        <StatCard
          label="SELLER PAYOUTS"
          value="₹14.72L"
          change="+9.6%"
          note="Settlements"
        />
        <StatCard
          label="PLATFORM COMMISSION"
          value="₹3.92L"
          change="+13.1%"
          note="Marketplace earnings"
        />
        <StatCard
          label="REFUNDS"
          value="₹48.6K"
          change="−4.2%"
          note="Processed refunds"
        />
      </div>

      <div className="admin-two-column">
        <Panel
          eyebrow="REVENUE"
          title="Revenue Overview"
        >
          <div className="admin-chart">
            {[58, 68, 61, 78, 72, 86, 92, 81, 96, 88, 94, 100].map(
              (value, index) => (
                <div
                  className="admin-bar-wrap"
                  key={index}
                >
                  <div
                    className="admin-bar"
                    style={{
                      height: `${value}%`,
                    }}
                  />
                  <span>
                    {index + 1}
                  </span>
                </div>
              )
            )}
          </div>
        </Panel>

        <Panel
          eyebrow="TRANSACTIONS"
          title="Recent Finance Activity"
        >
          <FinanceRow
            title="Customer Payment"
            amount="+₹4,299"
            status="Captured"
          />
          <FinanceRow
            title="Seller Settlement"
            amount="−₹8,240"
            status="Processed"
          />
          <FinanceRow
            title="Customer Refund"
            amount="−₹1,199"
            status="Refunded"
          />
          <FinanceRow
            title="Platform Commission"
            amount="+₹3,420"
            status="Recorded"
          />
        </Panel>
      </div>
    </PageShell>
  );

  /* =========================================================
     RETURNS
     ========================================================= */

  const returnsPage = (
    <PageShell
      eyebrow="CUSTOMER RETURNS"
      title="Returns & Refunds"
      description="Review return requests, refund states and marketplace return performance."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="OPEN RETURNS"
          value="73"
          change="Current"
          note="Awaiting processing"
        />
        <StatCard
          label="REFUNDS PENDING"
          value="19"
          change="Current"
          note="Finance action"
        />
        <StatCard
          label="RETURN RATE"
          value="8.4%"
          change="−1.2%"
          note="Marketplace average"
        />
        <StatCard
          label="RESOLVED"
          value="284"
          change="+14%"
          note="This month"
        />
      </div>

      <Panel
        eyebrow="RETURN MANAGEMENT"
        title="Recent Return Cases"
      >
        {[
          [
            "RET-921",
            "Karthik M",
            "Minimal Casual Shirt",
            "Wrong size",
            "Refunded",
          ],
          [
            "RET-920",
            "Sneha R",
            "Festive Floral Lehenga",
            "Product issue",
            "Under Review",
          ],
          [
            "RET-918",
            "Priya S",
            "Elegant Embroidered Kurti",
            "Colour mismatch",
            "Pickup Scheduled",
          ],
        ].map((item) => (
          <div
            className="admin-case-row"
            key={item[0]}
          >
            <strong>{item[0]}</strong>
            <span>{item[1]}</span>
            <span>{item[2]}</span>
            <span>{item[3]}</span>
            <StatusBadge
              type={
                item[4] === "Refunded"
                  ? "success"
                  : "warning"
              }
            >
              {item[4]}
            </StatusBadge>
            <button
              className="admin-small-button"
              onClick={() => setSelectedReturn(item)}
            >
              Open
            </button>
          </div>
        ))}
      </Panel>
    </PageShell>
  );

  /* =========================================================
     COMPLAINTS
     ========================================================= */

  const complaintsPage = (
    <PageShell
      eyebrow="CUSTOMER RESOLUTION"
      title="Complaints & Disputes"
      description="Resolve customer complaints and marketplace disputes."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="OPEN COMPLAINTS"
          value="38"
          change="Need action"
          note="Active cases"
        />
        <StatCard
          label="HIGH PRIORITY"
          value="7"
          change="Escalated"
          note="Requires attention"
          danger
        />
        <StatCard
          label="RESOLVED"
          value="284"
          change="+18%"
          note="This month"
        />
        <StatCard
          label="AVG RESOLUTION"
          value="18h"
          change="Response time"
          note="Marketplace average"
        />
      </div>

      <Panel
        eyebrow="CASE MANAGEMENT"
        title="Active Cases"
      >
        {complaints.map((item) => (
          <div
            className="admin-case-row"
            key={item.id}
          >
            <strong>{item.id}</strong>
            <span>{item.customer}</span>
            <span>{item.issue}</span>

            <StatusBadge
              type={
                item.priority === "High"
                  ? "danger"
                  : "warning"
              }
            >
              {item.priority}
            </StatusBadge>

            <button
              className="admin-small-button"
              onClick={() =>
                setSelectedCase(item)
              }
            >
              Open Case
            </button>
          </div>
        ))}
      </Panel>
    </PageShell>
  );

  /* =========================================================
     MARKETING
     ========================================================= */

  const marketingPage = (
    <PageShell
      eyebrow="MARKETPLACE GROWTH"
      title="Marketing & Promotions"
      description="Control marketplace-wide offers, campaigns and featured products."
    >
      <div className="admin-promotion-grid">
        <PromotionCard
          title="Flash Sale"
          count="12 Active"
          description="Create limited-time marketplace offers."
          onClick={() =>
            setSelectedMarketing({
              title: "Flash Sale",
              count: "12 Active",
              details:
                "Manage limited-time marketplace campaigns, participating products and offer windows.",
            })
          }
        />

        <PromotionCard
          title="Coupons"
          count="28 Live"
          description="Manage customer discount campaigns."
          onClick={() =>
            setSelectedMarketing({
              title: "Coupons",
              count: "28 Live",
              details:
                "Review coupon rules, discount values, eligibility and active campaigns.",
            })
          }
        />

        <PromotionCard
          title="Featured Products"
          count="46 Featured"
          description="Choose products promoted across Veyraa."
          onClick={() =>
            setSelectedMarketing({
              title: "Featured Products",
              count: "46 Featured",
              details:
                "Select marketplace products to feature across discovery and promotional surfaces.",
            })
          }
        />

        <PromotionCard
          title="Seller Campaigns"
          count="18 Running"
          description="Manage seller participation in campaigns."
          onClick={() =>
            setSelectedMarketing({
              title: "Seller Campaigns",
              count: "18 Running",
              details:
                "Review participating sellers, campaign performance and commercial conditions.",
            })
          }
        />
      </div>
    </PageShell>
  );

  /* =========================================================
     DELIVERY
     ========================================================= */

  const deliveryPage = (
    <PageShell
      eyebrow="DELIVERY OVERSIGHT"
      title="Delivery Management"
      description="Monitor shipment states, delays, exceptions and delivery performance."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="IN TRANSIT"
          value="516"
          change="Current"
          note="Active shipments"
        />
        <StatCard
          label="OUT FOR DELIVERY"
          value="184"
          change="Current"
          note="Last-mile operations"
        />
        <StatCard
          label="DELIVERY SUCCESS"
          value="96.1%"
          change="+2.1%"
          note="Marketplace average"
        />
        <StatCard
          label="DELAYS"
          value="31"
          change="Requires review"
          note="Active exceptions"
          danger
        />
      </div>

      <Panel
        eyebrow="SHIPMENT CONTROL"
        title="Active Deliveries"
      >
        {[
          [
            "DLV-48291",
            "VY28491",
            "Priya S",
            "Out for Delivery",
            "Today · 5:30 PM",
          ],
          [
            "DLV-48292",
            "VY28492",
            "Rahul K",
            "In Transit",
            "Tomorrow",
          ],
          [
            "DLV-48293",
            "VY28493",
            "Sneha R",
            "Processing",
            "30 Sep",
          ],
          [
            "DLV-48294",
            "VY28494",
            "Divya P",
            "Delivered",
            "28 Sep",
          ],
        ].map((item) => (
          <div
            className="admin-case-row"
            key={item[0]}
          >
            <strong>{item[0]}</strong>
            <span>{item[1]}</span>
            <span>{item[2]}</span>
            <StatusBadge
              type={
                item[3] === "Delivered"
                  ? "success"
                  : "warning"
              }
            >
              {item[3]}
            </StatusBadge>
            <span>{item[4]}</span>
            <button
              className="admin-small-button"
              onClick={() =>
                setSelectedDelivery(item)
              }
            >
              View
            </button>
          </div>
        ))}
      </Panel>
    </PageShell>
  );

  /* =========================================================
     REPORTS
     ========================================================= */

  const reportsPage = (
    <PageShell
      eyebrow="BUSINESS INTELLIGENCE"
      title="Reports & Analytics"
      description="Access authorised marketplace, customer, seller, delivery and operational reports."
    >
      <div className="admin-report-grid">
        {[
          [
            "Marketplace Sales",
            "Revenue, orders and commission performance.",
          ],
          [
            "Customer Report",
            "Customer segments, spending and account activity.",
          ],
          [
            "Seller Performance",
            "Sales, fulfilment, returns and Trust Score.",
          ],
          [
            "Delivery Report",
            "Delivery completion, delays and exceptions.",
          ],
          [
            "Returns Report",
            "Return reasons, refund activity and trends.",
          ],
          [
            "Operations Report",
            "Marketplace-wide operational performance.",
          ],
        ].map((report) => (
          <div
            className="admin-report-card"
            key={report[0]}
          >
            <div className="admin-report-icon">
              ▥
            </div>

            <span>REPORT</span>

            <h3>{report[0]}</h3>

            <p>{report[1]}</p>

            <button
              className="admin-outline-button"
              onClick={() =>
                setSelectedReport(report)
              }
            >
              View Report →
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );

  /* =========================================================
     TRUST SCORE
     ========================================================= */

  const trustPage = (
    <PageShell
      eyebrow="ADMIN INTELLIGENCE"
      title="Trust Score Engine"
      description="Evaluate seller reliability using transparent operational signals such as delivery, complaints, returns and service performance."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="SELLERS ANALYSED"
          value="428"
          change="100%"
          note="Marketplace sellers"
        />
        <StatCard
          label="STRONG"
          value="312"
          change="73%"
          note="Trust score ≥ 85"
        />
        <StatCard
          label="WATCH"
          value="92"
          change="21%"
          note="Requires monitoring"
        />
        <StatCard
          label="REVIEW"
          value="24"
          change="6%"
          note="Requires action"
          danger
        />
      </div>

      <Panel
        eyebrow="SELLER TRUST"
        title="Trust Score Breakdown"
      >
        <div className="admin-trust-list">
          {sellers.map((seller) => {
            const score = calculateTrustScore(seller);

            return (
              <div
                className="admin-trust-row"
                key={seller.id}
              >
                <div className="admin-person">
                  <Avatar name={seller.name} />
                  <div>
                    <strong>{seller.name}</strong>
                    <small>{seller.category}</small>
                  </div>
                </div>

                <div className="admin-trust-progress">
                  <div>
                    <span>Trust Score</span>
                    <strong>{score}/100</strong>
                  </div>

                  <div className="admin-progress">
                    <span
                      style={{
                        width: `${score}%`,
                      }}
                    />
                  </div>
                </div>

                <StatusBadge
                  type={
                    score >= 85
                      ? "success"
                      : score >= 70
                      ? "warning"
                      : "danger"
                  }
                >
                  {trustLabel(score)}
                </StatusBadge>

                <button
                  className="admin-small-button"
                  onClick={() =>
                    setSelectedSeller(seller)
                  }
                >
                  View Breakdown
                </button>
              </div>
            );
          })}
        </div>
      </Panel>
    </PageShell>
  );

  /* =========================================================
     AI ANOMALY
     ========================================================= */

  const anomalyPage = (
    <PageShell
      eyebrow="ADMIN INTELLIGENCE"
      title="AI Anomaly Detection"
      description="Identify unusual marketplace activity and investigate the operational signals behind each alert."
    >
      <div className="admin-stat-grid">
        <StatCard
          label="ACTIVE ALERTS"
          value="3"
          change="Requires review"
          note="Current anomaly queue"
          danger
        />
        <StatCard
          label="HIGH SEVERITY"
          value="1"
          change="Priority"
          note="Immediate review"
        />
        <StatCard
          label="SELLER SIGNALS"
          value="1"
          change="Detected"
          note="Operational anomaly"
        />
        <StatCard
          label="CUSTOMER SIGNALS"
          value="1"
          change="Detected"
          note="Behaviour anomaly"
        />
      </div>

      <div className="admin-anomaly-list">
        {anomalies.map((anomaly) => (
          <div
            className="admin-anomaly-card"
            key={anomaly.id}
          >
            <div className="admin-anomaly-top">
              <div className="admin-anomaly-icon">
                !
              </div>

              <div>
                <span>
                  {anomaly.type}
                </span>
                <h3>{anomaly.title}</h3>
                <p>{anomaly.subject}</p>
              </div>

              <StatusBadge
                type={
                  anomaly.severity === "High"
                    ? "danger"
                    : "warning"
                }
              >
                {anomaly.severity}
              </StatusBadge>
            </div>

            <div className="admin-anomaly-reasons">
              {anomaly.reason.map((reason) => (
                <div key={reason}>
                  <span>•</span>
                  {reason}
                </div>
              ))}
            </div>

            <div className="admin-anomaly-footer">
              <span>{anomaly.action}</span>

              <button
                className="admin-primary-button"
                onClick={() =>
                  setSelectedAnomaly(anomaly)
                }
              >
                Investigate →
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );

  /* =========================================================
     AUDIT
     ========================================================= */

  const auditPage = (
    <PageShell
      eyebrow="ADMIN GOVERNANCE"
      title="Audit Logs"
      description="Review administrative actions performed across the marketplace control center."
    >
      <Panel
        eyebrow="SYSTEM AUDIT"
        title="Recent Administrative Activity"
      >
        {auditLogs.map((log, index) => (
          <div
            className="admin-audit-row"
            key={index}
          >
            <span>{log.time}</span>

            <div className="admin-audit-dot" />

            <div>
              <strong>{log.action}</strong>
              <small>
                {log.admin} · {log.target}
              </small>
            </div>

            <StatusBadge type="success">
              Recorded
            </StatusBadge>
          </div>
        ))}
      </Panel>
    </PageShell>
  );

  /* =========================================================
     SETTINGS
     ========================================================= */

/* =========================================================
   SETTINGS
   ========================================================= */

const settingsData = [
  [
    "Platform Profile",
    "Marketplace name, support details and platform information.",
  ],
  [
    "Roles & Permissions",
    "Configure administrative access levels.",
  ],
  [
    "Notifications",
    "Manage operational alerts and system notifications.",
  ],
  [
    "Marketplace Rules",
    "Configure approved marketplace policies and rules.",
  ],
  [
    "Security",
    "Session security and administrative access controls.",
  ],
  [
    "Audit Configuration",
    "Configure audit events and retention settings.",
  ],
];

const settingsPage = selectedSetting ? (
  <PageShell
    eyebrow="ADMIN CONFIGURATION"
    title={selectedSetting[0]}
    description={selectedSetting[1]}
  >

    <button
      className="admin-outline-button"
      style={{ marginBottom: "20px" }}
      onClick={() => setSelectedSetting(null)}
    >
      ← Back to Admin Settings
    </button>

    <div className="admin-detail-page">

      <div className="admin-detail-header">
        <span>CONFIGURATION WORKSPACE</span>

        <h2>
          {selectedSetting[0]}
        </h2>

        <p>
          {selectedSetting[1]}
        </p>
      </div>


      <div className="admin-config-workspace">

        <div className="admin-config-hero">

          <div>
            <span>ADMIN CONTROL</span>

            <h2>
              Authorised Admin Control
            </h2>

            <p>
              Changes made here apply to the Veyraa
              marketplace administration workspace.
            </p>
          </div>

          <StatusBadge type="success">
            Active
          </StatusBadge>

        </div>


        <div className="admin-config-grid">

          <div className="admin-config-card">

            <span className="admin-config-label">
              GENERAL
            </span>

            <h3>
              {selectedSetting[0]}
            </h3>

            <label>
              Configuration name

              <input
                defaultValue={selectedSetting[0]}
              />
            </label>

            <label>
              Workspace status

              <select defaultValue="Enabled">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </label>

          </div>


          <div className="admin-config-card">

            <span className="admin-config-label">
              ACCESS CONTROL
            </span>

            <h3>
              Administrative access
            </h3>

            {[
              [
                "Platform Administrator",
                "Full configuration access",
                "ON",
              ],
              [
                "Operations Administrator",
                "Operational controls only",
                "ON",
              ],
              [
                "Read-only Analyst",
                "View and reporting access",
                "OFF",
              ],
            ].map((role) => (
              <div
                className="admin-config-access"
                key={role[0]}
              >

                <div>
                  <strong>
                    {role[0]}
                  </strong>

                  <small>
                    {role[1]}
                  </small>
                </div>

                <span
                  className={
                    role[2] === "ON"
                      ? "admin-config-on"
                      : "admin-config-off"
                  }
                >
                  {role[2]}
                </span>

              </div>
            ))}

          </div>

        </div>


        <div className="admin-config-actions">

          <button
            className="admin-outline-button"
            onClick={() =>
              setSelectedSetting(null)
            }
          >
            Cancel
          </button>

          <button
            className="admin-primary-button"
            onClick={() => {
              showNotification(
                `${selectedSetting[0]} configuration saved`
              );
            }}
          >
            Save Configuration →
          </button>

        </div>

      </div>

    </div>

  </PageShell>
) : (
  <PageShell
    eyebrow="PLATFORM CONFIGURATION"
    title="Admin Settings"
    description="Manage authorised marketplace configuration and administrative controls."
  >

    <div className="admin-settings-grid">

      {settingsData.map((setting) => (

        <div
          className="admin-setting-card"
          key={setting[0]}
        >

          <div className="admin-setting-icon">
            ⚙
          </div>

          <h3>
            {setting[0]}
          </h3>

          <p>
            {setting[1]}
          </p>

          <button
            className="admin-outline-button"
            onClick={() =>
              setSelectedSetting(setting)
            }
          >
            Configure →
          </button>

        </div>

      ))}

    </div>

  </PageShell>
);
  /* =========================================================
     PAGE SWITCH
     ========================================================= */

  let content = dashboard;

  if (page === "customers") content = customerPage;
  if (page === "sellers") content = sellerPage;
  if (page === "catalogue") content = cataloguePage;
  if (page === "approval") content = approvalPage;
  if (page === "orders") content = ordersPage;
  if (page === "payments") content = paymentsPage;
  if (page === "returns") content = returnsPage;
  if (page === "complaints") content = complaintsPage;
  if (page === "marketing") content = marketingPage;
  if (page === "delivery") content = deliveryPage;
  if (page === "reports") content = reportsPage;
  if (page === "trust") content = trustPage;
  if (page === "anomaly") content = anomalyPage;
  if (page === "audit") content = auditPage;
  if (page === "settings") content = settingsPage;

  return (
    <div className="admin-app">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-logo">
            V
          </div>

          <div>
            <strong>VEYRAA</strong>
            <span>ADMIN CONTROL</span>
          </div>
        </div>

        <div className="admin-navigation">

          {navGroups.map((group) => (
            <div
              className="admin-nav-group"
              key={group.title}
            >
              <span className="admin-nav-heading">
                {group.title}
              </span>

              {group.items.map((item) => (
                <button
                  key={item[0]}
                  className={`admin-nav-item ${
                    page === item[0]
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setPage(item[0])
                  }
                >
                  <span className="admin-nav-icon">
                    {item[1]}
                  </span>

                  <span>{item[2]}</span>

                  {item[0] === "approval" && (
                    <b>24</b>
                  )}

                  {item[0] === "anomaly" && (
                    <b>3</b>
                  )}
                </button>
              ))}
            </div>
          ))}

        </div>

        <div className="admin-system-status">
          <span className="admin-status-dot" />

          <div>
            <strong>System Secure</strong>
            <small>All services operational</small>
          </div>
        </div>

      </aside>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div className="admin-global-search">
            ⌕
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customers, sellers, products or orders..."
            />
          </div>

          <div className="admin-top-actions">

            <button
              className="admin-notification"
              onClick={() =>
                setPage("anomaly")
              }
            >
              ♢
              <b>3</b>
            </button>

            <div className="admin-profile">
              <Avatar name="Admin" />
              <div>
                <strong>Admin</strong>
                <span>Platform Administrator</span>
              </div>
            </div>

          </div>

        </header>

        <div className="admin-content">
          {content}
        </div>

      </main>

      {/* =====================================================
          CUSTOMER PROFILE MODAL
          ===================================================== */}

      {selectedCustomer && (
        <Modal
          close={() =>
            setSelectedCustomer(null)
          }
        >
          <div className="admin-modal-profile">

            <div className="admin-modal-heading">
              <Avatar
                name={selectedCustomer.name}
                large
              />

              <div>
                <span>CUSTOMER PROFILE</span>

                <h2>
                  {selectedCustomer.name}
                </h2>

                <small>
                  {selectedCustomer.id}
                </small>
              </div>
            </div>

            <div className="admin-modal-grid">

              <DetailBox
                label="Email"
                value={selectedCustomer.email}
              />

              <DetailBox
                label="Phone"
                value={selectedCustomer.phone}
              />

              <DetailBox
                label="Segment"
                value={selectedCustomer.segment}
              />

              <DetailBox
                label="Orders"
                value={selectedCustomer.orders}
              />

              <DetailBox
                label="Total Spend"
                value={`₹${selectedCustomer.spend.toLocaleString(
                  "en-IN"
                )}`}
              />

              <DetailBox
                label="Status"
                value={selectedCustomer.status}
              />

            </div>

            <div className="admin-modal-actions">

              <button
                className="admin-primary-button"
                onClick={() =>
                  setSelectedCustomerAction({
                    type: "orders",
                    customer: selectedCustomer,
                  })
                }
              >
                View Order History
              </button>

              <button
                className="admin-outline-button"
                onClick={() =>
                  setSelectedCustomerAction({
                    type: "activity",
                    customer: selectedCustomer,
                  })
                }
              >
                Account Activity
              </button>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          CUSTOMER ORDER HISTORY
          ===================================================== */}

      {selectedCustomerAction?.type ===
        "orders" && (
        <Modal
          close={() =>
            setSelectedCustomerAction(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="CUSTOMER ORDER HISTORY"
              title={
                selectedCustomerAction.customer.name
              }
              description="Complete marketplace order history and purchase activity."
            />

            <div className="admin-history-summary">

              <DetailBox
                label="Total Orders"
                value={
                  selectedCustomerAction.customer
                    .orders
                }
              />

              <DetailBox
                label="Total Spend"
                value={`₹${selectedCustomerAction.customer.spend.toLocaleString(
                  "en-IN"
                )}`}
              />

              <DetailBox
                label="Segment"
                value={
                  selectedCustomerAction.customer
                    .segment
                }
              />

            </div>

            <div className="admin-history-list">

              {orders
                .filter(
                  (order) =>
                    order.customer ===
                    selectedCustomerAction
                      .customer.name
                )
                .map((order) => {
                  const product = getProduct(
                    order.productId
                  );

                  return (
                    <div
                      className="admin-history-order"
                      key={order.id}
                    >
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        onError={(e) => handleProductImageError(e, product)}
                      />

                      <div>
                        <span>{order.id}</span>
                        <strong>
                          {product.name}
                        </strong>
                        <small>
                          {order.date} ·{" "}
                          {order.seller}
                        </small>
                      </div>

                      <div>
                        <strong>
                          ₹
                          {order.amount.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <StatusBadge
                          type={
                            order.status ===
                            "Delivered"
                              ? "success"
                              : order.status ===
                                "Returned"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {order.status}
                        </StatusBadge>
                      </div>
                    </div>
                  );
                })}

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          CUSTOMER ACCOUNT ACTIVITY
          ===================================================== */}

      {selectedCustomerAction?.type ===
        "activity" && (
        <Modal
          close={() =>
            setSelectedCustomerAction(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="CUSTOMER ACCOUNT ACTIVITY"
              title={
                selectedCustomerAction.customer.name
              }
              description="Recent account, order and support activity."
            />

            <div className="admin-activity-profile">

              <Avatar
                name={
                  selectedCustomerAction.customer.name
                }
                large
              />

              <div>
                <strong>
                  {
                    selectedCustomerAction.customer
                      .name
                  }
                </strong>

                <span>
                  {
                    selectedCustomerAction.customer
                      .email
                  }
                </span>

                <small>
                  {
                    selectedCustomerAction.customer
                      .phone
                  }
                </small>
              </div>

            </div>

            <div className="admin-timeline">

              <TimelineItem
                time="Today · 09:24 AM"
                title="Account accessed"
                description="Customer account was accessed successfully."
              />

              <TimelineItem
                time="Yesterday · 06:42 PM"
                title="Order activity"
                description="Customer interacted with marketplace order services."
              />

              <TimelineItem
                time="27 Sep · 04:18 PM"
                title="Product viewed"
                description="Customer browsed products in the fashion catalogue."
              />

              <TimelineItem
                time="26 Sep · 02:51 PM"
                title="Wishlist activity"
                description="Customer updated saved fashion products."
              />

              <TimelineItem
                time="25 Sep · 11:20 AM"
                title="Profile updated"
                description="Customer account information was updated."
              />

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          SELLER PROFILE
          ===================================================== */}

      {selectedSeller && (
        <Modal
          close={() =>
            setSelectedSeller(null)
          }
        >
          <div className="admin-seller-profile">

            <div className="admin-modal-heading">

              <Avatar
                name={selectedSeller.name}
                large
              />

              <div>
                <span>SELLER PROFILE</span>

                <h2>
                  {selectedSeller.name}
                </h2>

                <small>
                  {selectedSeller.company} ·{" "}
                  {selectedSeller.city}
                </small>
              </div>

            </div>

            <div className="admin-trust-hero">

              <div>
                <span>TRUST SCORE</span>

                <strong>
                  {calculateTrustScore(
                    selectedSeller
                  )}
                </strong>

                <small>
                  {trustLabel(
                    calculateTrustScore(
                      selectedSeller
                    )
                  )}
                </small>
              </div>

              <div className="admin-score-ring">
                {calculateTrustScore(
                  selectedSeller
                )}
              </div>

            </div>

            <div className="admin-seller-metrics">

              <DetailBox
                label="Sales"
                value={selectedSeller.sales}
              />

              <DetailBox
                label="Rating"
                value={`★ ${selectedSeller.rating}`}
              />

              <DetailBox
                label="Delivery Delays"
                value={selectedSeller.delays}
              />

              <DetailBox
                label="Complaints"
                value={selectedSeller.complaints}
              />

              <DetailBox
                label="Returns"
                value={`${selectedSeller.returns}%`}
              />

            </div>

            <div className="admin-modal-actions">

              <button
                className="admin-primary-button"
                onClick={() =>
                  setSelectedSellerAction({
                    type: "operations",
                    seller: selectedSeller,
                  })
                }
              >
                View Seller Operations
              </button>

              <button
                className="admin-outline-button"
                onClick={() =>
                  setSelectedSellerAction({
                    type: "verification",
                    seller: selectedSeller,
                  })
                }
              >
                Open Verification
              </button>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          SELLER OPERATIONS
          ===================================================== */}

      {selectedSellerAction?.type ===
        "operations" && (
        <Modal
          close={() =>
            setSelectedSellerAction(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="SELLER OPERATIONS"
              title={
                selectedSellerAction.seller.name
              }
              description="Marketplace performance and operational overview."
            />

            <div className="admin-operation-grid">

              <DetailBox
                label="Total Sales"
                value={
                  selectedSellerAction.seller
                    .sales
                }
              />

              <DetailBox
                label="Rating"
                value={`★ ${selectedSellerAction.seller.rating}`}
              />

              <DetailBox
                label="Complaints"
                value={
                  selectedSellerAction.seller
                    .complaints
                }
              />

              <DetailBox
                label="Delivery Delays"
                value={
                  selectedSellerAction.seller
                    .delays
                }
              />

              <DetailBox
                label="Returns"
                value={`${selectedSellerAction.seller.returns}%`}
              />

              <DetailBox
                label="Trust Score"
                value={calculateTrustScore(
                  selectedSellerAction.seller
                )}
              />

            </div>

            <div className="admin-operation-section">

              <span className="admin-eyebrow">
                OPERATIONAL CHECK
              </span>

              <h3>
                Seller performance indicators
              </h3>

              <div className="admin-operation-check">

                <DetailBox
                  label="Order Fulfilment"
                  value="94.2%"
                />

                <DetailBox
                  label="Customer Satisfaction"
                  value={`${selectedSellerAction.seller.rating}/5`}
                />

                <DetailBox
                  label="Delivery Reliability"
                  value={`${selectedSellerAction.seller.deliveryReliability}%`}
                />

              </div>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          SELLER VERIFICATION
          ===================================================== */}

      {selectedSellerAction?.type ===
        "verification" && (
        <Modal
          close={() =>
            setSelectedSellerAction(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="SELLER VERIFICATION"
              title={
                selectedSellerAction.seller.name
              }
              description="Review seller registration and marketplace verification status."
            />

            <div className="admin-verification-list">

              <VerificationItem
                label="Seller Identity"
                value="Verified"
                ok
              />

              <VerificationItem
                label="Business Information"
                value="Verified"
                ok
              />

              <VerificationItem
                label="Marketplace Category"
                value={
                  selectedSellerAction.seller
                    .category
                }
                ok
              />

              <VerificationItem
                label="Operating Location"
                value={
                  selectedSellerAction.seller.city
                }
                ok
              />

              <VerificationItem
                label="Performance Review"
                value={
                  selectedSellerAction.seller
                    .status === "Verified"
                    ? "Passed"
                    : "Requires Review"
                }
                ok={
                  selectedSellerAction.seller
                    .status === "Verified"
                }
              />

            </div>

            <div className="admin-modal-actions">

              <button
                className="admin-primary-button"
                onClick={() =>
                  showNotification(
                    "Seller approval recorded"
                  )
                }
              >
                Approve Seller
              </button>

              <button
                className="admin-outline-button"
                onClick={() =>
                  showNotification(
                    "Information request recorded"
                  )
                }
              >
                Request More Information
              </button>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          PRODUCT PREVIEW
          ===================================================== */}

      {selectedProduct && (
        <Modal
          close={() =>
            setSelectedProduct(null)
          }
        >
          <div className="admin-product-preview">

            <div className="admin-product-preview-image">

              <img
                src={getProductImage(selectedProduct)}
                alt={selectedProduct.name}
                onError={(e) => handleProductImageError(e, selectedProduct)}
              />

              <span>
                {selectedProduct.tag}
              </span>

            </div>

            <div className="admin-product-preview-info">

              <span className="admin-eyebrow">
                PRODUCT GOVERNANCE
              </span>

              <h2>
                {selectedProduct.name}
              </h2>

              <p>
                Veyraa fashion product from the
                marketplace catalogue.
              </p>

              <div className="admin-product-price">
                ₹
                {selectedProduct.price.toLocaleString(
                  "en-IN"
                )}

                <del>
                  ₹
                  {selectedProduct.mrp.toLocaleString(
                    "en-IN"
                  )}
                </del>
              </div>

              <div className="admin-modal-grid">

                <DetailBox
                  label="Audience"
                  value={
                    selectedProduct.audience
                  }
                />

                <DetailBox
                  label="Category"
                  value={
                    selectedProduct.category
                  }
                />

                <DetailBox
                  label="Type"
                  value={
                    selectedProduct.type
                  }
                />

                <DetailBox
                  label="Material"
                  value={
                    selectedProduct.material
                  }
                />

                <DetailBox
                  label="Colour"
                  value={
                    selectedProduct.colour
                  }
                />

                <DetailBox
                  label="Rating"
                  value={`★ ${selectedProduct.rating}`}
                />

                <DetailBox
                  label="Stock"
                  value={`${selectedProduct.stock} units`}
                />

                <DetailBox
                  label="Seller"
                  value={
                    selectedProduct.seller
                  }
                />

              </div>

              <div className="admin-modal-actions">

                <button
                  className="admin-primary-button"
                  onClick={() => {
                    showNotification(
                      "Product listing approved"
                    );
                    setSelectedProduct(null);
                  }}
                >
                  Approve Listing
                </button>

                <button
                  className="admin-outline-button"
                  onClick={() =>
                    showNotification(
                      "Product flagged for review"
                    )
                  }
                >
                  Flag for Review
                </button>

              </div>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          ORDER PREVIEW
          ===================================================== */}

      {selectedOrder && (
        <Modal
          close={() =>
            setSelectedOrder(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="ORDER MANAGEMENT"
              title={selectedOrder.id}
              description="Complete order, customer, product, payment and fulfilment information."
            />

            <div className="admin-order-preview">

              <div className="admin-order-preview-product">

                <img
                  src={getProductImage(
                    getProduct(selectedOrder.productId)
                  )}
                  alt={selectedOrder.product}
                  onError={(e) =>
                    handleProductImageError(
                      e,
                      getProduct(selectedOrder.productId)
                    )
                  }
                />

                <div>
                  <span>PRODUCT</span>

                  <h3>
                    {selectedOrder.product}
                  </h3>

                  <small>
                    Seller ·{" "}
                    {selectedOrder.seller}
                  </small>
                </div>

              </div>

              <div className="admin-modal-grid">

                <DetailBox
                  label="Customer"
                  value={
                    selectedOrder.customer
                  }
                />

                <DetailBox
                  label="Order Date"
                  value={selectedOrder.date}
                />

                <DetailBox
                  label="Amount"
                  value={`₹${selectedOrder.amount.toLocaleString(
                    "en-IN"
                  )}`}
                />

                <DetailBox
                  label="Payment"
                  value={selectedOrder.payment}
                />

                <DetailBox
                  label="Status"
                  value={selectedOrder.status}
                />

                <DetailBox
                  label="Seller"
                  value={selectedOrder.seller}
                />

              </div>

              <div className="admin-order-timeline">

                <TimelineItem
                  time="Order placed"
                  title="Payment confirmed"
                  description="Customer payment successfully captured."
                />

                <TimelineItem
                  time="Processing"
                  title="Seller fulfilment"
                  description="Seller prepared the marketplace order."
                />

                <TimelineItem
                  time="Shipment"
                  title="Delivery processing"
                  description="Order entered the delivery lifecycle."
                />

                <TimelineItem
                  time={selectedOrder.status}
                  title="Current state"
                  description={`Current order state: ${selectedOrder.status}.`}
                />

              </div>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          RETURN CASE PREVIEW
          ===================================================== */}

      {selectedReturn && (
        <Modal close={() => setSelectedReturn(null)}>
          <div className="admin-detail-page">
            <DetailHeader
              eyebrow="RETURN CASE PREVIEW"
              title={selectedReturn[0]}
              description="Review customer return details, refund status and resolution information."
            />

            <div className="admin-case-header">
              <Avatar name={selectedReturn[1]} large />
              <div>
                <strong>{selectedReturn[1]}</strong>
                <span>Customer return request</span>
              </div>
              <StatusBadge type={selectedReturn[4] === "Refunded" ? "success" : "warning"}>
                {selectedReturn[4]}
              </StatusBadge>
            </div>

            <div className="admin-modal-grid">
              <DetailBox label="Return ID" value={selectedReturn[0]} />
              <DetailBox label="Customer" value={selectedReturn[1]} />
              <DetailBox label="Product" value={selectedReturn[2]} />
              <DetailBox label="Reason" value={selectedReturn[3]} />
              <DetailBox label="Current Status" value={selectedReturn[4]} />
              <DetailBox label="Case Type" value="Customer Return" />
            </div>

            <div className="admin-case-resolution">
              <span className="admin-eyebrow">RETURN RESOLUTION</span>
              <h3>Case handling</h3>
              <p>Review the return information before taking the next operational action.</p>
              <div className="admin-modal-actions">
                <button className="admin-primary-button" onClick={() => { showNotification(`${selectedReturn[0]} reviewed`); setSelectedReturn(null); }}>Mark Reviewed</button>
                <button className="admin-outline-button" onClick={() => setSelectedReturn(null)}>Close Preview</button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          COMPLAINT CASE
          ===================================================== */}

      {selectedCase && (
        <Modal
          close={() =>
            setSelectedCase(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="CASE MANAGEMENT"
              title={selectedCase.id}
              description="Customer complaint and dispute resolution workspace."
            />

            <div className="admin-case-header">

              <Avatar
                name={selectedCase.customer}
                large
              />

              <div>
                <strong>
                  {selectedCase.customer}
                </strong>

                <span>
                  Customer complaint
                </span>
              </div>

              <StatusBadge
                type={
                  selectedCase.priority ===
                  "High"
                    ? "danger"
                    : "warning"
                }
              >
                {selectedCase.priority}
              </StatusBadge>

            </div>

            <div className="admin-modal-grid">

              <DetailBox
                label="Case ID"
                value={selectedCase.id}
              />

              <DetailBox
                label="Customer"
                value={selectedCase.customer}
              />

              <DetailBox
                label="Issue"
                value={selectedCase.issue}
              />

              <DetailBox
                label="Related Order"
                value={selectedCase.order}
              />

              <DetailBox
                label="Priority"
                value={selectedCase.priority}
              />

              <DetailBox
                label="Status"
                value={selectedCase.status}
              />

            </div>

            <div className="admin-case-resolution">

              <span className="admin-eyebrow">
                RESOLUTION WORKSPACE
              </span>

              <h3>
                Investigation checklist
              </h3>

              <label>
                <input type="checkbox" />
                Customer complaint reviewed
              </label>

              <label>
                <input type="checkbox" />
                Related order verified
              </label>

              <label>
                <input type="checkbox" />
                Seller response reviewed
              </label>

              <label>
                <input type="checkbox" />
                Resolution decision recorded
              </label>

            </div>

            <div className="admin-modal-actions">

              <button
                className="admin-primary-button"
                onClick={() => {
                  showNotification(
                    `${selectedCase.id} resolved`
                  );
                  setSelectedCase(null);
                }}
              >
                Resolve Case
              </button>

              <button
                className="admin-outline-button"
                onClick={() =>
                  showNotification(
                    `${selectedCase.id} escalated`
                  )
                }
              >
                Escalate Case
              </button>

              <button
                className="admin-outline-button"
                onClick={() =>
                  showNotification(
                    "Seller contact request created"
                  )
                }
              >
                Contact Seller
              </button>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          ANOMALY PREVIEW
          ===================================================== */}

      {selectedAnomaly && (
        <Modal
          close={() =>
            setSelectedAnomaly(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="AI ANOMALY INVESTIGATION"
              title={
                selectedAnomaly.title
              }
              description="Review the evidence and operational signals behind this anomaly."
            />

            <div className="admin-anomaly-detail">

              <div>
                <span>SUBJECT</span>
                <strong>
                  {selectedAnomaly.subject}
                </strong>
              </div>

              <div>
                <span>TYPE</span>
                <strong>
                  {selectedAnomaly.type}
                </strong>
              </div>

              <div>
                <span>SEVERITY</span>
                <strong>
                  {selectedAnomaly.severity}
                </strong>
              </div>

            </div>

            <div className="admin-anomaly-reasons large">

              <h3>
                Detection factors
              </h3>

              {selectedAnomaly.reason.map(
                (reason) => (
                  <div key={reason}>
                    <span>✓</span>
                    {reason}
                  </div>
                )
              )}

            </div>

            <div className="admin-case-resolution">

              <span className="admin-eyebrow">
                ADMIN ACTION
              </span>

              <h3>
                Recommended operational review
              </h3>

              <p>
                {selectedAnomaly.action}
              </p>

            </div>

            <div className="admin-modal-actions">

              <button
                className="admin-primary-button"
                onClick={() => {
                  showNotification(
                    "Anomaly marked as reviewed"
                  );
                  setSelectedAnomaly(null);
                }}
              >
                Mark Reviewed
              </button>

              <button
                className="admin-outline-button"
                onClick={() =>
                  showNotification(
                    "Anomaly escalated"
                  )
                }
              >
                Escalate
              </button>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          MARKETING PREVIEW
          ===================================================== */}

      {selectedMarketing && (
        <Modal
          close={() =>
            setSelectedMarketing(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="MARKETPLACE GROWTH"
              title={selectedMarketing.title}
              description={selectedMarketing.details}
            />

            <div className="admin-marketing-preview">

              <div>
                <span>STATUS</span>
                <strong>
                  {selectedMarketing.count}
                </strong>
              </div>

              <div>
                <span>MARKETPLACE</span>
                <strong>Veyraa Fashion Hub</strong>
              </div>

              <div>
                <span>CONTROL</span>
                <strong>Admin Managed</strong>
              </div>

            </div>

            <div className="admin-case-resolution">

              <span className="admin-eyebrow">
                CAMPAIGN CONTROL
              </span>

              <h3>
                Promotion configuration
              </h3>

              <label>
                <span>Campaign status</span>
                <select>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Scheduled</option>
                </select>
              </label>

              <label>
                <span>Eligibility</span>
                <select>
                  <option>All Customers</option>
                  <option>VIP Customers</option>
                  <option>Selected Segments</option>
                </select>
              </label>

            </div>

            <div className="admin-modal-actions">

              <button
                className="admin-primary-button"
                onClick={() =>
                  showNotification(
                    `${selectedMarketing.title} updated`
                  )
                }
              >
                Save Changes
              </button>

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          DELIVERY PREVIEW
          ===================================================== */}

      {selectedDelivery && (
        <Modal
          close={() =>
            setSelectedDelivery(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="DELIVERY OPERATIONS"
              title={selectedDelivery[0]}
              description="Shipment tracking and delivery lifecycle preview."
            />

            <div className="admin-modal-grid">

              <DetailBox
                label="Order"
                value={selectedDelivery[1]}
              />

              <DetailBox
                label="Customer"
                value={selectedDelivery[2]}
              />

              <DetailBox
                label="Current State"
                value={selectedDelivery[3]}
              />

              <DetailBox
                label="ETA"
                value={selectedDelivery[4]}
              />

            </div>

            <div className="admin-order-timeline">

              <TimelineItem
                time="1"
                title="Assigned"
                description="Delivery assignment created."
              />

              <TimelineItem
                time="2"
                title="Accepted"
                description="Delivery partner accepted the shipment."
              />

              <TimelineItem
                time="3"
                title="In Transit"
                description="Shipment is moving through the delivery network."
              />

              <TimelineItem
                time="4"
                title={selectedDelivery[3]}
                description="Current delivery state."
              />

            </div>

          </div>
        </Modal>
      )}

      {/* =====================================================
          REPORT PREVIEW
          ===================================================== */}

      {selectedReport && (
        <Modal
          close={() =>
            setSelectedReport(null)
          }
        >
          <div className="admin-detail-page">

            <DetailHeader
              eyebrow="REPORT PREVIEW"
              title={selectedReport[0]}
              description={selectedReport[1]}
            />

            <div className="admin-report-preview">

              <div>
                <span>REPORT STATUS</span>
                <strong>Available</strong>
              </div>

              <div>
                <span>DATA PERIOD</span>
                <strong>Current Month</strong>
              </div>

              <div>
                <span>ACCESS</span>
                <strong>Admin</strong>
              </div>

            </div>

            <div className="admin-chart large-chart">

              {[52, 67, 61, 74, 70, 82, 76, 91, 87, 94, 90, 100].map(
                (value, index) => (
                  <div
                    className="admin-bar-wrap"
                    key={index}
                  >
                    <div
                      className="admin-bar"
                      style={{
                        height: `${value}%`,
                      }}
                    />
                    <span>
                      {index + 1}
                    </span>
                  </div>
                )
              )}

            </div>

            <button
              className="admin-primary-button"
              onClick={() =>
                setSelectedFullReport(selectedReport)
              }
            >
              Open Full Report →
            </button>

          </div>
        </Modal>
      )}

      {/* =====================================================
          FULL REPORT PAGE
          ===================================================== */}

      {selectedFullReport && (
        <Modal
          close={() => setSelectedFullReport(null)}
        >
          <div className="admin-full-report-page">
            <div className="admin-full-report-head">
              <div>
                <span className="admin-eyebrow">FULL REPORT</span>
                <h2>{selectedFullReport[0]}</h2>
                <p>{selectedFullReport[1]}</p>
              </div>
              <StatusBadge type="success">Available</StatusBadge>
            </div>

            <div className="admin-report-toolbar">
              <div><span>PERIOD</span><strong>Current Month</strong></div>
              <div><span>REPORT TYPE</span><strong>Marketplace Performance</strong></div>
              <div><span>ACCESS</span><strong>Administrator</strong></div>
              <div><span>GENERATED</span><strong>28 Sep 2026</strong></div>
            </div>

            <div className="admin-report-summary-grid">
              <StatCard label="Revenue" value="₹18.64L" change="+12.4%" note="Current month" />
              <StatCard label="Orders" value="4,826" change="+8.1%" note="Marketplace orders" />
              <StatCard label="Commission" value="₹2.24L" change="+10.6%" note="Platform earnings" />
              <StatCard label="Refund Rate" value="3.8%" change="-0.7%" note="Lower than previous period" />
            </div>

            <div className="admin-report-main-grid">
              <section className="admin-report-chart-panel">
                <div className="admin-panel-head"><div><span className="admin-eyebrow">PERFORMANCE TREND</span><h2>Marketplace sales</h2></div><span className="admin-right-text">Last 12 periods</span></div>
                <div className="admin-full-chart">
                  {[52,67,61,74,70,82,76,91,87,94,90,100].map((value,index)=>(
                    <div className="admin-full-bar-wrap" key={index}><div className="admin-full-bar" style={{height:`${value}%`}} /><span>{index+1}</span></div>
                  ))}
                </div>
              </section>

              <section className="admin-report-side-panel">
                <div className="admin-panel-head"><div><span className="admin-eyebrow">REPORT BREAKDOWN</span><h2>Operational mix</h2></div></div>
                <HealthRow label="Order fulfilment" value="94.2%" progress={94.2} />
                <HealthRow label="Seller reliability" value="91.8%" progress={91.8} />
                <HealthRow label="Customer resolution" value="87.4%" progress={87.4} />
                <HealthRow label="Delivery success" value="96.1%" progress={96.1} />
              </section>
            </div>

            <div className="admin-report-table">
              <div className="admin-report-table-head"><span>METRIC</span><span>VALUE</span><span>CHANGE</span><span>STATUS</span></div>
              {[["Gross Merchandise Value","₹18.64L","+12.4%","Healthy"],["Completed Orders","4,526","+9.2%","Healthy"],["Returned Orders","184","-3.1%","Improving"],["Active Sellers","428","+6.2%","Healthy"]].map(row=>(
                <div className="admin-report-table-row" key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><StatusBadge type="success">{row[3]}</StatusBadge></div>
              ))}
            </div>

            <div className="admin-full-report-actions">
              <button className="admin-outline-button" onClick={() => setSelectedFullReport(null)}>Close Report</button>
              <button className="admin-primary-button" onClick={() => showNotification(`${selectedFullReport[0]} report exported`)}>Export Report →</button>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          NOTIFICATION
          ===================================================== */}

      {notification && (
        <div className="admin-toast">
          ✓ {notification}
        </div>
      )}

    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
   ========================================================= */

function PageShell({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="admin-page">

      <div className="admin-page-heading">

        <div>
          <span className="admin-eyebrow">
            {eyebrow}
          </span>

          <h1>{title}</h1>

          <p>{description}</p>
        </div>

      </div>

      {children}

    </section>
  );
}

function Panel({
  eyebrow,
  title,
  action,
  onAction,
  rightText,
  children,
}) {
  return (
    <section className="admin-panel">

      <div className="admin-panel-head">

        <div>
          {eyebrow && (
            <span className="admin-eyebrow">
              {eyebrow}
            </span>
          )}

          <h2>{title}</h2>
        </div>

        {action && (
          <button
            className="admin-text-button"
            onClick={onAction}
          >
            {action}
          </button>
        )}

        {rightText && (
          <span className="admin-right-text">
            {rightText}
          </span>
        )}

      </div>

      {children}

    </section>
  );
}

function StatCard({
  label,
  value,
  change,
  note,
  danger,
}) {
  return (
    <div
      className={`admin-stat-card ${
        danger ? "danger" : ""
      }`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{change}</small>
      <p>{note}</p>
    </div>
  );
}

function Avatar({
  name,
  large = false,
}) {
  return (
    <div
      className={`admin-avatar ${
        large ? "large" : ""
      }`}
    >
      {String(name).charAt(0).toUpperCase()}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="admin-badge">
      {children}
    </span>
  );
}

function StatusBadge({
  children,
  type = "success",
}) {
  return (
    <span
      className={`admin-status-badge ${type}`}
    >
      {children}
    </span>
  );
}

function DetailBox({
  label,
  value,
}) {
  return (
    <div className="admin-detail-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProductCard({
  product,
  onView,
  approval = false,
}) {
  return (
    <div className="admin-product-card">

      <div className="admin-product-image">

        <img
          src={getProductImage(product)}
          alt={product.name}
          onError={(e) => handleProductImageError(e, product)}
        />

        <span>{product.tag}</span>

      </div>

      <div className="admin-product-card-body">

        <small>
          {product.audience} ·{" "}
          {product.category}
        </small>

        <h3>{product.name}</h3>

        <div className="admin-product-card-meta">

          <strong>
            ₹{product.price.toLocaleString("en-IN")}
          </strong>

          <span>
            ★ {product.rating}
          </span>

        </div>

        <div className="admin-product-card-bottom">

          <span>
            {product.stock} in stock
          </span>

          <StatusBadge
            type={
              product.status ===
              "Approved"
                ? "success"
                : "warning"
            }
          >
            {product.status}
          </StatusBadge>

        </div>

        <button
          className="admin-primary-button full"
          onClick={onView}
        >
          {approval
            ? "Review Product →"
            : "View Product →"}
        </button>

      </div>

    </div>
  );
}

function HealthRow({
  label,
  value,
  progress,
}) {
  return (
    <div className="admin-health-row">

      <div>
        <strong>{label}</strong>
        <span>{value}</span>
      </div>

      <div className="admin-progress">
        <span
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

    </div>
  );
}

function FinanceRow({
  title,
  amount,
  status,
}) {
  return (
    <div className="admin-finance-row">

      <div>
        <strong>{title}</strong>
        <small>{status}</small>
      </div>

      <strong>{amount}</strong>

    </div>
  );
}

function PromotionCard({
  title,
  count,
  description,
  onClick,
}) {
  return (
    <div className="admin-promotion-card">

      <div className="admin-promotion-icon">
        ✦
      </div>

      <span>{count}</span>

      <h3>{title}</h3>

      <p>{description}</p>

      <button
        className="admin-outline-button"
        onClick={onClick}
      >
        Manage →
      </button>

    </div>
  );
}

function Modal({
  children,
  close,
}) {
  return (
    <div
      className="admin-modal-overlay"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          close();
        }
      }}
    >
      <div className="admin-modal">

        <button
          className="admin-modal-close"
          onClick={close}
        >
          ×
        </button>

        {children}

      </div>
    </div>
  );
}

function DetailHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="admin-detail-header">

      <span className="admin-eyebrow">
        {eyebrow}
      </span>

      <h2>{title}</h2>

      <p>{description}</p>

    </div>
  );
}

function TimelineItem({
  time,
  title,
  description,
}) {
  return (
    <div className="admin-timeline-item">

      <div className="admin-timeline-dot">
        ✓
      </div>

      <div>
        <span>{time}</span>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

    </div>
  );
}

function VerificationItem({
  label,
  value,
  ok,
}) {
  return (
    <div className="admin-verification-item">

      <div
        className={`admin-verification-check ${
          ok ? "ok" : ""
        }`}
      >
        {ok ? "✓" : "!"}
      </div>

      <div>
        <strong>{label}</strong>
        <small>{value}</small>
      </div>

      <span>
        {ok ? "Verified" : "Review"}
      </span>

    </div>
  );
}