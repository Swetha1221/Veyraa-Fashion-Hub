import React, { useMemo, useState } from "react";
import "./DeliveryDashboard.css";

const deliveriesSeed = [
  {
    id: "VY28492", deliveryId: "DLV-48292", customer: "Rahul K", phone: "+91 98765 43210",
    product: "Royal Purple Silk Saree", price: "₹2,499", seller: "Shasha Studio",
    address: "RS Puram, Coimbatore", distance: "4.8 km", eta: "12:40 PM", deadline: "1:30 PM",
    status: "In Transit", confidence: 94, risk: "Low", priority: "Priority",
    image: "https://www.karagiri.com/cdn/shop/files/bscls-1005.jpg?v=1775211691",
    fallbackImage: "https://www.fabiliciousfashion.com/cdn/shop/products/rose-pink-bridal-net-lehenga-setlehenganitika-gujral-912682.jpg?v=1695669753",
    instructions: "Call before reaching the customer."
  },
  {
    id: "VY28493", deliveryId: "DLV-48293", customer: "Sneha R", phone: "+91 98765 32109",
    product: "Pink Embroidered Kurti", price: "₹1,199", seller: "Veyra Boutique",
    address: "Peelamedu, Coimbatore", distance: "7.2 km", eta: "2:15 PM", deadline: "3:00 PM",
    status: "Assigned", confidence: 88, risk: "Medium", priority: "Normal",
    image: "https://img.tatacliq.com/images/i23/437Wx649H/MP000000026058184_437Wx649H_202504101903366.jpeg",
    fallbackImage: "https://assets2.andaazfashion.com/media/catalog/product/d/e/design-no-dmv13893-womens-churidar-suit-collection-front.jpg",
    instructions: "Customer requested evening-friendly handover."
  },
  {
    id: "VY28494", deliveryId: "DLV-48294", customer: "Divya P", phone: "+91 98765 21098",
    product: "Festive Blue Chudidar Suit", price: "₹1,699", seller: "Shasha Studio",
    address: "Gandhipuram, Coimbatore", distance: "2.1 km", eta: "11:55 AM", deadline: "12:30 PM",
    status: "Out for Delivery", confidence: 97, risk: "Low", priority: "Priority",
    image: "https://assets2.andaazfashion.com/media/catalog/product/d/e/design-no-dmv13893-womens-churidar-suit-collection-front.jpg",
    fallbackImage: "https://img.tatacliq.com/images/i23/437Wx649H/MP000000026058184_437Wx649H_202504101903366.jpeg",
    instructions: "Apartment delivery. Use reception if customer is unavailable."
  },
  {
    id: "VY28495", deliveryId: "DLV-48295", customer: "Karthik M", phone: "+91 98765 10987",
    product: "Men's Classic Cotton Kurta", price: "₹1,299", seller: "Veyra Boutique",
    address: "Saibaba Colony, Coimbatore", distance: "9.4 km", eta: "3:10 PM", deadline: "4:00 PM",
    status: "Picked Up", confidence: 91, risk: "Low", priority: "Normal",
    image: "https://ramrajcotton.in/cdn/shop/files/01_ea99ae95-fce3-4a46-be35-7461c0e83f46.jpg?v=1775624091&width=1080",
    fallbackImage: "https://www.fabiliciousfashion.com/cdn/shop/products/rose-pink-bridal-net-lehenga-setlehenganitika-gujral-912682.jpg?v=1695669753",
    instructions: "Verify package seal before handover."
  },
  {
    id: "VY28496", deliveryId: "DLV-48296", customer: "Priya S", phone: "+91 98765 09876",
    product: "Rose Pink Bridal Lehenga", price: "₹5,499", seller: "Shasha Studio",
    address: "Ramanathapuram, Coimbatore", distance: "0 km", eta: "10:45 AM", deadline: "11:00 AM",
    status: "Delivered", confidence: 99, risk: "None", priority: "Priority",
    image: "https://www.fabiliciousfashion.com/cdn/shop/products/rose-pink-bridal-net-lehenga-setlehenganitika-gujral-912682.jpg?v=1695669753",
    fallbackImage: "https://www.karagiri.com/cdn/shop/files/bscls-1005.jpg?v=1775211691",
    instructions: "Collect OTP before marking delivered."
  }
];

const navGroups = [
  {
    label: "Operations",
    items: [
      ["dashboard", "⌂", "Dashboard"],
      ["deliveries", "▣", "My Deliveries"],
      ["pickup", "⌂", "Pickup Center"],
      ["tracking", "◉", "Live Tracking"]
    ]
  },
  {
    label: "Intelligence",
    items: [
      ["route", "◆", "Route Pulse", "★"],
      ["eta", "◷", "ETA & Delay Monitor"],
      ["exceptions", "!", "Delivery Exceptions"]
    ]
  },
  {
    label: "Reverse Logistics",
    items: [
      ["returns", "↩", "Returns & Reverse Pickup"],
      ["history", "▤", "Delivery History"]
    ]
  },
  {
    label: "Insights",
    items: [
      ["performance", "↗", "Performance"],
      ["notifications", "●", "Notifications"]
    ]
  }
];

const pickupRows = [
  ["PK-1092", "Shasha Studio", "Gandhipuram", "04", "10:20 AM", "Ready"],
  ["PK-1093", "Veyra Boutique", "RS Puram", "03", "12:10 PM", "Ready"],
  ["PK-1094", "Shasha Studio", "Peelamedu", "06", "2:30 PM", "Not Ready"],
  ["PK-1095", "Aura Ethnic", "Saibaba Colony", "02", "3:45 PM", "Ready"]
];

const exceptions = [
  ["EX-1021", "Customer unavailable", "VY28493", "Sneha R", "Retry", "Medium"],
  ["EX-1022", "Phone unreachable", "VY28495", "Karthik M", "Reschedule", "Medium"],
  ["EX-1023", "Wrong address", "VY28497", "Nithya P", "Report Issue", "High"],
  ["EX-1024", "Package not ready", "VY28498", "Arun S", "Retry", "Low"]
];

function Icon({ children }) {
  return <span className="vd-icon">{children}</span>;
}

function ProductImage({ item, large = false }) {
  const [src, setSrc] = useState(item?.image || item?.fallbackImage || "");
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  React.useEffect(() => {
    setSrc(item?.image || item?.fallbackImage || "");
    setAttemptedFallback(false);
  }, [item?.image, item?.fallbackImage]);

  const handleError = () => {
    if (!attemptedFallback && item?.fallbackImage && src !== item.fallbackImage) {
      setAttemptedFallback(true);
      setSrc(item.fallbackImage);
      return;
    }
    setSrc("");
  };

  if (!src) {
    return (
      <div className={`vd-product-fallback ${large ? "large" : ""}`}>
        <span>V</span>
        <small>VEYRA</small>
      </div>
    );
  }

  return (
    <div className={`vd-product-image-wrap ${large ? "large" : ""}`}>
      <img
        className="vd-product-image"
        src={src}
        alt={item?.product || "Fashion package"}
        loading="eager"
        onError={handleError}
      />
      <span className="vd-image-tag">PACKAGE</span>
    </div>
  );
}

function StatusPill({ status }) {
  const cls = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`vd-status ${cls}`}>{status}</span>;
}

function Metric({ icon, label, value, note, tone = "neutral" }) {
  return (
    <div className={`vd-metric vd-metric-${tone}`}>
      <div className="vd-metric-icon">{icon}</div>
      <div>
        <div className="vd-metric-label">{label}</div>
        <div className="vd-metric-value">{value}</div>
        <div className="vd-metric-note">{note}</div>
      </div>
    </div>
  );
}

function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="vd-page-title">
      <div>
        <div className="vd-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="vd-title-action">{action}</div>}
    </div>
  );
}

export default function DeliveryDashboard() {
  const [page, setPage] = useState("dashboard");
  const [deliveries, setDeliveries] = useState(deliveriesSeed);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("All");
  const [toast, setToast] = useState("");

  const filteredDeliveries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return deliveries.filter(d => {
      const filterOk = deliveryFilter === "All" || d.status === deliveryFilter;
      const searchOk = !q || [d.id, d.deliveryId, d.customer, d.product, d.address].join(" ").toLowerCase().includes(q);
      return filterOk && searchOk;
    });
  }, [deliveries, search, deliveryFilter]);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__veyraToast);
    window.__veyraToast = window.setTimeout(() => setToast(""), 2600);
  };

  const updateStatus = (id, next) => {
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, status: next } : d));
    setSelected(prev => prev && prev.id === id ? { ...prev, status: next } : prev);
    notify(`${id} moved to ${next}.`);
  };

  const openDelivery = (item) => setSelected(item);

  const sidebar = (
    <aside className="vd-sidebar">
      <div className="vd-brand">
        <div className="vd-brand-mark">V</div>
        <div>
          <strong>VEYRA</strong>
          <span>DELIVERY OPERATIONS</span>
        </div>
      </div>

      <div className="vd-driver-card">
        <div className="vd-avatar">DP</div>
        <div className="vd-driver-copy">
          <strong>Delivery Partner</strong>
          <span>Coimbatore Zone</span>
        </div>
        <span className="vd-online-dot" />
      </div>

      <div className="vd-side-scroll">
        {navGroups.map(group => (
          <div className="vd-nav-group" key={group.label}>
            <div className="vd-nav-label">{group.label}</div>
            {group.items.map(([key, icon, label, badge]) => (
              <button key={key} className={`vd-nav-item ${page === key ? "active" : ""}`} onClick={() => setPage(key)}>
                <Icon>{icon}</Icon>
                <span>{label}</span>
                {badge && <b>{badge}</b>}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="vd-side-footer">
        <div className="vd-online-row"><span className="vd-online-dot" /> Online <small>Available for delivery</small></div>
        <div className="vd-vehicle">
          <span>VEHICLE</span>
          <strong>TN 38 AB 4721</strong>
          <small>Bike · Active · 86% fuel</small>
        </div>
      </div>
    </aside>
  );

  const topbar = (
    <header className="vd-topbar">
      <div className="vd-search">
        <span>⌕</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders, customers, addresses..." />
        <kbd>⌘ K</kbd>
      </div>
      <div className="vd-top-actions">
        <button className="vd-top-btn" onClick={() => setPage("notifications")}>◌ <span>3</span></button>
        <div className="vd-user-mini"><div className="vd-avatar small">DP</div><div><strong>Delivery Partner</strong><span>Online</span></div></div>
      </div>
    </header>
  );

  const dashboard = (
    <>
      <div className="vd-command-strip">
        <div><span className="vd-live-dot" /> LIVE OPERATIONS <strong>Route network is healthy.</strong></div>
        <div>Last sync <strong>14:08:42</strong> · 17 completed today</div>
      </div>

      <div className="vd-metrics-grid">
        <Metric icon="▣" label="Today's Deliveries" value="24" note="+6.2% vs yesterday" tone="accent" />
        <Metric icon="⌂" label="Pending Pickups" value="08" note="2 added today" />
        <Metric icon="→" label="Out for Delivery" value="11" note="Active right now" tone="success" />
        <Metric icon="✓" label="Delivered" value="17" note="71% complete" tone="success" />
        <Metric icon="◷" label="Delayed" value="02" note="Needs attention" tone="warning" />
      </div>

      <div className="vd-dashboard-grid">
        <section className="vd-panel vd-priority-panel">
          <div className="vd-panel-head">
            <div><span className="vd-eyebrow">LIVE QUEUE</span><h2>Priority deliveries</h2></div>
            <button className="vd-link-btn" onClick={() => setPage("deliveries")}>View all →</button>
          </div>
          <div className="vd-priority-list">
            {deliveries.slice(0, 5).map(item => (
              <button className="vd-priority-row" key={item.id} onClick={() => openDelivery(item)}>
                <ProductImage item={item} />
                <div className="vd-row-main"><strong>{item.id}</strong><span>{item.customer}</span><small>{item.product}</small></div>
                <div className="vd-row-end"><StatusPill status={item.status} /><small>{item.eta}</small></div>
              </button>
            ))}
          </div>
        </section>

        <section className="vd-panel vd-route-mini">
          <div className="vd-panel-head">
            <div><span className="vd-eyebrow">ROUTE PULSE</span><h2>Today's route</h2></div>
            <button className="vd-icon-btn" onClick={() => setPage("route")}>↗</button>
          </div>
          <div className="vd-route-line">
            {["S", "1", "2", "3", "R"].map((n, i) => (
              <div className="vd-route-stop" key={n}>
                <div className={`vd-route-node ${i === 2 ? "current" : ""}`}>{n}</div>
                <div><strong>{["Shasha Studio", "Divya P", "Rahul K", "Sneha R", "Nithya P"][i]}</strong><span>{["10:20 AM", "11:55 AM", "12:40 PM", "2:15 PM", "4:00 PM"][i]}</span></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="vd-panel">
        <div className="vd-panel-head">
          <div><span className="vd-eyebrow">DELIVERY CONTROL</span><h2>Operational health</h2></div>
          <button className="vd-outline-btn" onClick={() => setPage("eta")}>Open intelligence</button>
        </div>
        <div className="vd-health-grid">
          <div><span>On-time rate</span><strong>94.6%</strong><div className="vd-progress"><i style={{width:"94.6%"}} /></div><small>+2.1% this week</small></div>
          <div><span>Average ETA confidence</span><strong>92.4%</strong><div className="vd-progress"><i style={{width:"92.4%"}} /></div><small>Across active orders</small></div>
          <div><span>Exception load</span><strong>04</strong><div className="vd-progress danger"><i style={{width:"34%"}} /></div><small>2 require action</small></div>
          <div><span>Route efficiency</span><strong>88%</strong><div className="vd-progress"><i style={{width:"88%"}} /></div><small>27.8 km planned</small></div>
        </div>
      </section>
    </>
  );

  const deliveriesPage = (
    <>
      <PageTitle eyebrow="OPERATIONS / DELIVERIES" title="My Deliveries" description="Manage assigned orders, delivery deadlines, proof and live execution from one workspace."
        action={<button className="vd-primary-btn" onClick={() => setPage("route")}>Open Route Pulse →</button>} />
      <div className="vd-filter-bar">
        {["All","Assigned","Picked Up","In Transit","Out for Delivery","Delivered"].map(f => (
          <button key={f} className={deliveryFilter === f ? "active" : ""} onClick={() => setDeliveryFilter(f)}>{f}</button>
        ))}
        <span className="vd-filter-count">{filteredDeliveries.length} orders</span>
      </div>
      <section className="vd-panel vd-table-panel">
        <div className="vd-table-scroll">
          <table className="vd-table">
            <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>PACKAGE</th><th>DELIVERY LOCATION</th><th>ETA</th><th>RISK</th><th>STATUS</th><th></th></tr></thead>
            <tbody>
              {filteredDeliveries.map(item => (
                <tr key={item.id} onClick={() => openDelivery(item)}>
                  <td><strong>{item.id}</strong><small>{item.deliveryId}</small></td>
                  <td><div className="vd-customer"><span>{item.customer[0]}</span><div><strong>{item.customer}</strong><small>{item.phone}</small></div></div></td>
                  <td><div className="vd-package"><ProductImage item={item}/><div><strong>{item.product}</strong><small>{item.price} · Fashion package</small></div></div></td>
                  <td><strong>{item.address}</strong><small>{item.distance} from current route</small></td>
                  <td><strong>{item.eta}</strong><small>Deadline {item.deadline}</small></td>
                  <td><span className={`vd-risk ${item.risk.toLowerCase()}`}>{item.risk}</span></td>
                  <td><StatusPill status={item.status}/></td>
                  <td><button className="vd-row-action" onClick={e => {e.stopPropagation(); openDelivery(item)}}>Preview</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  const pickupPage = (
    <>
      <PageTitle eyebrow="WORKSPACE / PICKUP" title="Pickup Center" description="Collect ready packages from sellers before beginning the delivery route." />
      <div className="vd-metrics-grid four">
        <Metric icon="⌂" label="Pickup Requests" value="08" note="Today" />
        <Metric icon="✓" label="Ready" value="06" note="Available now" tone="success" />
        <Metric icon="◷" label="Pending" value="02" note="Awaiting seller" tone="warning" />
        <Metric icon="▣" label="Packages" value="31" note="Today's total" tone="accent" />
      </div>
      <section className="vd-panel vd-table-panel">
        <div className="vd-panel-head"><div><span className="vd-eyebrow">SELLER HANDOVER</span><h2>Pickup requests</h2></div><button className="vd-outline-btn" onClick={() => notify("Pickup queue refreshed.")}>Refresh queue</button></div>
        <div className="vd-table-scroll"><table className="vd-table">
          <thead><tr><th>PICKUP</th><th>SELLER</th><th>LOCATION</th><th>PACKAGES</th><th>TIME</th><th>STATUS</th><th>ACTION</th></tr></thead>
          <tbody>{pickupRows.map((r,i)=><tr key={r[0]}>
            <td><strong>{r[0]}</strong></td><td><strong>{r[1]}</strong></td><td>{r[2]}</td><td><strong>{r[3]}</strong></td><td>{r[4]}</td>
            <td><StatusPill status={r[5] === "Ready" ? "Ready" : "Not Ready"}/></td>
            <td><button className="vd-row-action" onClick={() => r[5] === "Ready" ? notify(`${r[0]} pickup confirmed.`) : notify("Seller package is not ready yet.")}>{r[5] === "Ready" ? "Confirm Pickup" : "View"}</button></td>
          </tr>)}</tbody>
        </table></div>
      </section>
    </>
  );

  const trackingPage = (
    <>
      <PageTitle eyebrow="OPERATIONS / LIVE TRACKING" title="Live Tracking" description="Latest authorized delivery movement, assigned orders and route context." action={<span className="vd-live-badge"><span/> Live</span>} />
      <div className="vd-tracking-layout">
        <section className="vd-panel vd-map-panel">
          <div className="vd-map-head"><div><span className="vd-eyebrow">DELIVERY MOVEMENT</span><h2>Current delivery network</h2></div><span className="vd-live-badge"><span/> Position synced</span></div>
          <div className="vd-map">
            <div className="vd-map-grid"/>
            <div className="vd-road road-a"/><div className="vd-road road-b"/><div className="vd-road road-c"/>
            <div className="vd-map-pin seller">S</div><div className="vd-map-pin dp">DP</div>
            <div className="vd-map-pin one">1</div><div className="vd-map-pin two">2</div><div className="vd-map-pin three">3</div>
            <div className="vd-map-label seller-label">Seller pickup</div><div className="vd-map-label dp-label">Current position</div>
          </div>
        </section>
        <section className="vd-panel vd-assigned-panel"><div className="vd-panel-head"><div><span className="vd-eyebrow">ASSIGNED ORDERS</span><h2>Current movement</h2></div></div>
          {deliveries.map(item=><button className="vd-assigned-row" key={item.id} onClick={()=>openDelivery(item)}><span>{item.customer[0]}</span><div><strong>{item.customer}</strong><small>{item.address}</small></div><StatusPill status={item.status}/></button>)}
        </section>
      </div>
    </>
  );

  const routePage = (
    <>
      <div className="vd-route-hero"><div><span className="vd-eyebrow">TODAY'S ROUTE</span><h1>5 stops <em>•</em> 27.8 km</h1><p>Sequence optimized around delivery deadlines, priority orders and reverse pickups.</p></div><div className="vd-route-hero-stat"><span>EST. COMPLETION</span><strong>4h 20m</strong><small>88% route efficiency</small></div></div>
      <div className="vd-route-layout">
        <section className="vd-panel vd-stops-panel"><div className="vd-panel-head"><div><span className="vd-eyebrow">EXECUTION SEQUENCE</span><h2>Optimized stops</h2></div><button className="vd-outline-btn" onClick={()=>notify("Route adjustment request created.")}>Adjust Route</button></div>
          {[
            ["S","Seller Pickup","Shasha Studio","Start","10:20 AM"],
            ["1","Customer Delivery","Divya P","2.1 km","11:55 AM"],
            ["2","Customer Delivery","Rahul K","4.8 km","12:40 PM"],
            ["3","Customer Delivery","Sneha R","7.2 km","2:15 PM"],
            ["R","Return Pickup","Nithya P","11.6 km","4:00 PM"]
          ].map((s,i)=><div className={`vd-stop ${i===2?"current":""}`} key={s[0]}>
            <div className="vd-stop-node">{s[0]}</div><div className="vd-stop-info"><span>{s[1]}</span><strong>{s[2]}</strong><small>◉ {s[3]} {i===2 && <b> · CURRENT STOP</b>}</small></div><strong className="vd-stop-time">{s[4]}</strong>
          </div>)}
        </section>
        <aside className="vd-route-side"><div className="vd-panel"><span className="vd-eyebrow">ROUTE INTELLIGENCE</span><h2>Why this sequence?</h2><ol><li><b>01</b> Priority orders are placed before their delivery deadlines.</li><li><b>02</b> Nearby customer destinations are grouped to reduce travel.</li><li><b>03</b> Return pickup is scheduled after outbound deliveries.</li></ol></div><div className="vd-panel vd-risk-panel"><span className="vd-eyebrow">ROUTE RISK</span><strong><i/> Low</strong><p>No major route disruption is currently detected.</p></div></aside>
      </div>
    </>
  );

  const etaPage = (
    <>
      <PageTitle eyebrow="INTELLIGENCE / ETA" title="ETA & Delay Monitor" description="Predictive delivery visibility with confidence and delay-risk signals." />
      <div className="vd-metrics-grid four"><Metric icon="%" label="Average ETA confidence" value="92.4%" note="Across active orders"/><Metric icon="!" label="Orders at risk" value="02" note="Requires attention" tone="warning"/><Metric icon="✓" label="On-time prediction" value="94.6%" note="Current estimate" tone="success"/><Metric icon="◷" label="Average delay" value="14 min" note="Current risk window"/></div>
      <section className="vd-panel vd-table-panel"><div className="vd-table-scroll"><table className="vd-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>ETA</th><th>CONFIDENCE</th><th>DELAY RISK</th><th>DEADLINE</th></tr></thead><tbody>{deliveries.map(d=><tr key={d.id}><td><strong>{d.id}</strong><small>{d.deliveryId}</small></td><td><strong>{d.customer}</strong><small>{d.distance}</small></td><td><strong>{d.eta}</strong></td><td><div className="vd-confidence"><span><i style={{width:`${d.confidence}%`}}/></span><b>{d.confidence}%</b></div></td><td><span className={`vd-risk ${d.risk.toLowerCase()}`}>{d.risk}</span></td><td>{`Today, ${d.deadline}`}</td></tr>)}</tbody></table></div></section>
      <div className="vd-info-banner"><strong>ⓘ ETA is predictive, not a delivery guarantee.</strong><span>Confidence represents how reliable the current estimate is based on available delivery signals.</span></div>
    </>
  );

  const exceptionsPage = (
    <>
      <PageTitle eyebrow="EXCEPTIONS / ACTION CENTER" title="Delivery Exceptions" description="Resolve failed attempts and operational blockers before they become customer complaints." />
      <div className="vd-exception-grid">{exceptions.map((e,i)=><div className="vd-exception-card" key={e[0]}><div className="vd-ex-top"><span className={`vd-severity ${e[5].toLowerCase()}`}>{e[5]}</span><span>{e[0]}</span></div><h3>{e[1]}</h3><p>{e[2]} · {e[3]}</p><div className="vd-ex-actions"><button onClick={()=>notify(`${e[4]} action opened for ${e[2]}.`)}>{e[4]}</button><button onClick={()=>notify(`Issue reported for ${e[2]}.`)}>Report Issue</button></div></div>)}</div>
    </>
  );

  const returnsPage = (
    <>
      <PageTitle eyebrow="REVERSE LOGISTICS" title="Returns & Reverse Pickup" description="Manage customer return pickups and movement back to sellers or return centres." />
      <section className="vd-panel vd-table-panel"><div className="vd-panel-head"><div><span className="vd-eyebrow">RETURN QUEUE</span><h2>Reverse pickups</h2></div><span className="vd-count-chip">06 active</span></div><div className="vd-table-scroll"><table className="vd-table"><thead><tr><th>RETURN</th><th>CUSTOMER</th><th>ORDER</th><th>PICKUP LOCATION</th><th>STATUS</th><th>DEADLINE</th></tr></thead><tbody>{[
        ["RET-9021","Nithya P","VY28497","Ramanathapuram","Pickup Assigned","4:00 PM"],
        ["RET-9022","Arun S","VY28498","Peelamedu","Pickup Pending","5:10 PM"],
        ["RET-9023","Meena K","VY28488","RS Puram","Return In Transit","Today"],
        ["RET-9024","Kaviya R","VY28482","Gandhipuram","Returned to Seller","Completed"]
      ].map(r=><tr key={r[0]}><td><strong>{r[0]}</strong></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><StatusPill status={r[4]}/></td><td>{r[5]}</td></tr>)}</tbody></table></div></section>
    </>
  );

  const historyPage = (
    <>
      <PageTitle eyebrow="HISTORY / AUDIT TRAIL" title="Delivery History" description="Completed deliveries, failed attempts, cancellations and proof records." />
      <section className="vd-panel vd-table-panel"><div className="vd-table-scroll"><table className="vd-table"><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>DATE / TIME</th><th>OUTCOME</th><th>PROOF</th></tr></thead><tbody>{deliveries.map((d,i)=><tr key={d.id}><td><strong>{d.id}</strong></td><td>{d.customer}</td><td>28 Sep · {d.eta}</td><td><StatusPill status={d.status === "Delivered" ? "Delivered" : i===2 ? "Failed" : d.status}/></td><td><button className="vd-row-action" onClick={()=>openDelivery(d)}>View Proof</button></td></tr>)}</tbody></table></div></section>
    </>
  );

  const performancePage = (
    <>
      <PageTitle eyebrow="INSIGHTS / PERFORMANCE" title="Performance" description="Understand delivery execution, punctuality, exceptions and customer feedback." />
      <div className="vd-performance-hero"><div><span className="vd-eyebrow">THIS MONTH</span><strong>94.6%</strong><span>on-time delivery</span></div><div><span className="vd-eyebrow">COMPLETED</span><strong>482</strong><span>successful deliveries</span></div><div><span className="vd-eyebrow">AVG TIME</span><strong>38m</strong><span>per delivery</span></div><div><span className="vd-eyebrow">FEEDBACK</span><strong>4.8/5</strong><span>customer rating</span></div></div>
      <div className="vd-dashboard-grid"><section className="vd-panel"><div className="vd-panel-head"><div><span className="vd-eyebrow">WEEKLY TREND</span><h2>Delivery performance</h2></div></div><div className="vd-chart"><div className="vd-chart-bars">{[58,72,65,81,74,90,94].map((v,i)=><div key={i}><span style={{height:`${v}%`}}/><small>{["M","T","W","T","F","S","S"][i]}</small></div>)}</div></div></section><section className="vd-panel"><div className="vd-panel-head"><div><span className="vd-eyebrow">QUALITY SIGNALS</span><h2>Execution quality</h2></div></div><div className="vd-quality-list"><div><span>Successful deliveries</span><strong>97.2%</strong></div><div><span>Failed attempts</span><strong>2.8%</strong></div><div><span>Return pickups</span><strong>18</strong></div><div><span>Customer feedback</span><strong>4.8 / 5</strong></div></div></section></div>
    </>
  );

  const notificationsPage = (
    <>
      <PageTitle eyebrow="SYSTEM / ALERTS" title="Notifications" description="Operational events that need your attention." />
      <div className="vd-notification-list">{[
        ["New delivery assigned","VY28502 has been assigned to your route.","2 min ago","new"],
        ["Delay warning","VY28493 has a medium delay risk based on route conditions.","18 min ago","warning"],
        ["Customer unavailable","Sneha R was unavailable during the first attempt.","34 min ago","action"],
        ["Route changed","Pickup PK-1093 has been moved to 12:10 PM.","1 hr ago","new"],
        ["Return pickup","RET-9021 is ready for reverse pickup.","2 hr ago","action"]
      ].map(n=><div className="vd-notification" key={n[0]}><div className={`vd-notification-icon ${n[3]}`}>{n[3]==="warning"?"!":"•"}</div><div><strong>{n[0]}</strong><p>{n[1]}</p><small>{n[2]}</small></div><button onClick={()=>notify("Notification marked as read.")}>Mark read</button></div>)}</div>
    </>
  );

  const renderPage = () => {
    switch (page) {
      case "deliveries": return deliveriesPage;
      case "pickup": return pickupPage;
      case "tracking": return trackingPage;
      case "route": return routePage;
      case "eta": return etaPage;
      case "exceptions": return exceptionsPage;
      case "returns": return returnsPage;
      case "history": return historyPage;
      case "performance": return performancePage;
      case "notifications": return notificationsPage;
      default: return dashboard;
    }
  };

  return (
    <div className="vd-app">
      {sidebar}
      <main className="vd-main">
        {topbar}
        <div className="vd-content">{renderPage()}</div>
      </main>

      {selected && (
        <div className="vd-modal-backdrop" onMouseDown={() => setSelected(null)}>
          <div className="vd-delivery-drawer" onMouseDown={e => e.stopPropagation()}>
            <div className="vd-drawer-head">
              <div><span className="vd-eyebrow">DELIVERY PREVIEW · {selected.deliveryId}</span><h2>{selected.id}</h2></div>
              <button className="vd-close" onClick={() => setSelected(null)}>×</button>
            </div>
            <div className="vd-drawer-scroll">
              <div className="vd-drawer-package"><ProductImage item={selected}/><div><span className="vd-eyebrow">PACKAGE</span><h3>{selected.product}</h3><p>{selected.price} · {selected.seller}</p></div><StatusPill status={selected.status}/></div>
              <div className="vd-drawer-grid">
                <div><span>Customer</span><strong>{selected.customer}</strong><small>{selected.phone}</small></div>
                <div><span>Delivery location</span><strong>{selected.address}</strong><small>{selected.distance} from route</small></div>
                <div><span>ETA</span><strong>{selected.eta}</strong><small>Deadline {selected.deadline}</small></div>
                <div><span>ETA confidence</span><strong>{selected.confidence}%</strong><small>{selected.risk} delay risk</small></div>
              </div>
              <div className="vd-lifecycle">
                <div className="vd-eyebrow">DELIVERY LIFECYCLE</div>
                {["Assigned","Picked Up","In Transit","Out for Delivery","Delivered"].map((s,i)=>{
                  const order=["Assigned","Picked Up","In Transit","Out for Delivery","Delivered"];
                  const current=order.indexOf(selected.status);
                  return <div className={`vd-life-step ${i <= current ? "done":""} ${i === current ? "current":""}`} key={s}><span>{i < current ? "✓" : i+1}</span><div><strong>{s}</strong><small>{i <= current ? "Completed / active" : "Pending"}</small></div></div>
                })}
              </div>
              <div className="vd-detail-block"><span className="vd-eyebrow">DELIVERY INSTRUCTION</span><p>{selected.instructions}</p></div>
              <div className="vd-detail-block vd-proof-block">
                <div className="vd-proof-heading">
                  <div><span className="vd-eyebrow">PROOF & HANDOVER</span><strong>Delivery verification</strong></div>
                  <span className={`vd-proof-state ${selected.status === "Delivered" ? "verified" : "pending"}`}>{selected.status === "Delivered" ? "VERIFIED" : "PENDING"}</span>
                </div>
                <div className="vd-proof-box">
                  <div className="vd-proof-icon">✓</div>
                  <div><span>Customer OTP</span><strong>{selected.status === "Delivered" ? "OTP verified successfully" : "Required at handover"}</strong><small>{selected.status === "Delivered" ? "Verified at 10:45 AM · Customer confirmed receipt" : "Proof will be captured after customer verification."}</small></div>
                </div>
                <div className="vd-proof-meta"><span>Package condition</span><strong>Sealed & intact</strong><span>Handover method</span><strong>Customer handover</strong></div>
              </div>
            </div>
            <div className="vd-drawer-actions">
              <button className="vd-outline-btn" onClick={()=>notify(`Calling ${selected.customer}...`)}>☎ Contact Customer</button>
              {selected.status !== "Delivered" && <button className="vd-primary-btn" onClick={()=>updateStatus(selected.id, selected.status === "Assigned" ? "Picked Up" : selected.status === "Picked Up" ? "In Transit" : selected.status === "In Transit" ? "Out for Delivery" : "Delivered")}>{selected.status === "Out for Delivery" ? "Confirm Delivered" : "Advance Status →"}</button>}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="vd-toast"><span>✓</span>{toast}</div>}
    </div>
  );
}
