import React, { useState, useEffect } from "react";

import "./SubscriptionPlans.css";

import { getCurrentCustomer } from "../data/customerAccount";



const CUSTOMER_PLANS = [

  {

    key: "basic",

    name: "Basic",

    price: 999,

    subtitle: "Essential Veyraa membership for smarter everyday fashion shopping.",

    features: [

      "Veyraa Plus Customer Membership",

      "Exclusive Offers",

      "Early Access to Selected Sales",

      "Featured Products & Collections",

      "Marketing Campaign Collections",

      "Creator Fashion Discovery",

      "Premium Customer Support",

    ],

  },

  {

    key: "elite",

    name: "Elite",

    price: 1999,

    subtitle: "Premium fashion access with added convenience and exclusive experiences.",

    featured: true,

    features: [

      "Everything in Basic Plan",

      "Brand Partnership Collections",

      "Creator & Influencer Commerce",

      "Pre-Order & Demand Reservation",

      "Function Gift Registry",

      "Saree Ready-to-Wear Services",

      "Fall & Pico",

      "Pre-Pleating",

      "Blouse Stitching",

      "Enhanced Delivery Experience",

      "Exclusive Fashion Campaigns",

    ],

  },

  {

    key: "diamond",

    name: "Diamond",

    price: 2500,

    subtitle: "Complete premium Veyraa membership for luxury and occasion shopping.",

    features: [

      "Everything in Elite Plan",

      "Pattu Buyback & Restoration",

      "Pre-Loved Silk Marketplace Access",

      "Function Saree Rental",

      "Bridal Jewellery Rental",

      "Rent-to-Buy Option",

      "Premium Brand Collections",

      "Early Access to Premium Collections",

      "Premium Occasion Experience",

    ],

  },

];



const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;



function CustomerPlanPreview({ plan, close, onChoose }) {

  if (!plan) return null;

  return (

    <div className="sv-plan-modal-bg" onClick={close}>

      <div className="sv-plan-preview" onClick={(e) => e.stopPropagation()}>

        <button className="sv-plan-x" onClick={close}>×</button>

        <div className="sv-plan-preview-top">

          <small className="sv-kicker">CUSTOMER PLAN PREVIEW</small>

          <span className={`sv-plan-badge ${plan.key === "elite" ? "business" : plan.key === "diamond" ? "premium" : "basic"}`}>

            {plan.name}

          </span>

          <h2>{plan.name} Plan</h2>

          <p>{plan.subtitle}</p>

          <div className="sv-plan-preview-price">

            <strong>{money(plan.price)}</strong><span>/ year</span>

          </div>

        </div>

        <div className="sv-plan-feature-list">

          <div className="sv-plan-feature-head">

            <strong>Included customer features</strong>

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



function CustomerPlanPayment({ plan, close, onSuccess }) {

  const [method, setMethod] = useState("Google Pay");

  const [upiId, setUpiId] = useState("");

  const [demoPin, setDemoPin] = useState("");

  const [mobile, setMobile] = useState("");

  const [processing, setProcessing] = useState(false);

  const [success, setSuccess] = useState(false);

  const [paymentRef, setPaymentRef] = useState("");

  const [verificationId, setVerificationId] = useState("");



  if (!plan) return null;



  const pay = () => {

    if (!/^\d{10}$/.test(mobile) || !upiId.trim() || demoPin.length < 4 || processing) return;

    setProcessing(true);

    window.setTimeout(() => {

      const ref = `VYRA${Date.now().toString().slice(-8)}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

      setPaymentRef(ref);

      setVerificationId(`VY-${plan.key.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`);

      setProcessing(false);

      setSuccess(true);

    }, 900);

  };



  const finish = () => {

    onSuccess(plan, { paymentRef, verificationId, method, upiId, mobile });

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

                <div><b>Veyraa Secure Pay</b><small>Customer subscription checkout</small></div>

              </div>

              <div className="sv-plan-stepper">

                <span className="done"><b>1</b> Plan</span><i></i>

                <span className="current"><b>2</b> Pay</span><i></i>

                <span><b>3</b> Activate</span>

              </div>

              <small className="sv-kicker">SECURE UPI CHECKOUT</small>

              <h2>Pay &amp; Activate {plan.name}</h2>

              <p>Complete the UPI payment flow below. Your selected customer plan will become active after payment confirmation.</p>

            </div>



            <div className="sv-plan-order-summary">

              <div><span>{plan.name} Plan</span><small>Customer subscription · Yearly access</small></div>

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

              <div className="sv-plan-section-title"><span>02</span><div><b>Enter mobile number</b><small>Use the mobile number linked to your Veyraa customer account</small></div></div>

              <label className="sv-plan-field"><span>Paying mobile number</span><div className="sv-plan-input-wrap"><input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" inputMode="numeric" maxLength="10" /><b>+91</b></div></label>

            </div>



            <div className="sv-plan-checkout-section">

              <div className="sv-plan-section-title"><span>03</span><div><b>Enter UPI details</b><small>Enter the UPI ID used for this customer-plan checkout</small></div></div>

              <label className="sv-plan-field"><span>{method} · UPI ID</span><div className="sv-plan-input-wrap"><input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" autoComplete="off" /><b>UPI</b></div></label>

            </div>



            <div className="sv-plan-checkout-section">

              <div className="sv-plan-section-title"><span>04</span><div><b>Confirm payment PIN</b><small>Enter a 4–6 digit demo PIN to confirm this checkout</small></div></div>

              <label className="sv-plan-field"><span>Demo payment PIN</span><div className="sv-plan-input-wrap"><input type="password" value={demoPin} onChange={(e) => setDemoPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="••••" inputMode="numeric" maxLength="6" /><b>PIN</b></div></label>

            </div>



            <div className="sv-plan-security-row"><span>🔒 Secure checkout</span><span>UPI details validated</span><span>✓ Instant activation</span></div>

            <button className="sv-primary sv-plan-pay" onClick={pay} disabled={processing || !/^\d{10}$/.test(mobile) || !upiId.trim() || demoPin.length < 4}>

              {processing ? <><span className="sv-plan-spinner"></span> Verifying payment...</> : <><span>Pay {money(plan.price)}</span><span>→</span></>}

            </button>

            <small className="sv-plan-payment-footnote">Demo transaction environment · no real funds are transferred.</small>

          </>

        ) : (

          <div className="sv-plan-success">

            <div className="sv-plan-success-top"><div className="sv-plan-success-icon">✓</div><span>PAYMENT SUCCESSFUL</span></div>

            <h2>{plan.name} Plan is now active</h2>

            <p>The selected customer subscription has been activated for this current customer session.</p>

            <div className="sv-plan-success-amount"><small>AMOUNT PAID</small><strong>{money(plan.price)}</strong><span>{method} · +91 {mobile}</span></div>

            <div className="sv-plan-success-grid">

              <div><small>Transaction ID</small><b>{paymentRef}</b></div>

              <div><small>Verification ID</small><b>{verificationId}</b></div>

              <div><small>Plan status</small><b>✓ ACTIVE</b></div>

              <div><small>Features enabled</small><b>{plan.features.length} / {plan.features.length}</b></div>

            </div>

            <div className="sv-plan-activation-note"><b>✓ Customer access updated</b><span>All customer benefits included in the {plan.name} plan are now enabled for this customer session.</span></div>

            <button className="sv-primary sv-plan-pay" onClick={finish}>Open Current Plan →</button>

          </div>

        )}

      </div>

    </div>

  );

}



function SubscriptionPlans() {

  const [activePlan, setActivePlan] = useState(null);



  const [planPreview, setPlanPreview] = useState(null);

  const [planPayment, setPlanPayment] = useState(null);



 useEffect(() => {
  const loadSubscription = () => {
    const customer = getCurrentCustomer();

    if (!customer?.isLoggedIn) {
      setActivePlan(null);
      return;
    }

    try {
      const saved = sessionStorage.getItem(
        "veyraaCustomerSubscription"
      );

      setActivePlan(saved ? JSON.parse(saved) : null);
    } catch (error) {
      setActivePlan(null);
    }
  };

  loadSubscription();

  window.addEventListener(
    "veyraa:customer-logout",
    loadSubscription
  );

  window.addEventListener(
    "veyraa:auth-updated",
    loadSubscription
  );

  return () => {
    window.removeEventListener(
      "veyraa:customer-logout",
      loadSubscription
    );

    window.removeEventListener(
      "veyraa:auth-updated",
      loadSubscription 
    );
  };
}, []);


  const handleSuccess = (plan, details) => {

    const saved = { ...plan, payment: details, activatedAt: new Date().toISOString() };
sessionStorage.setItem(
  "veyraaCustomerSubscription",
  JSON.stringify(saved)
);

    setActivePlan(saved);

    setPlanPayment(null);

  };



  return (

    <div className="veyraa-subscription-page" style={{ "--a": "#a51f50" }}>

      <section className="sv-plan-page">

        <div className="sv-plan-hero">

          <div className="sv-plan-hero-content">

            <span className="sv-kicker">VEYRAA CUSTOMER MEMBERSHIP</span>

            <h2>Choose the plan that fits your fashion journey.</h2>

            <p>Unlock the right combination of exclusive offers, fashion discovery, convenience and premium occasion services as your Veyraa experience grows.</p>

            <div className="sv-plan-hero-points"><span>✓ Customer-focused benefits</span><span>✓ Premium fashion services</span><span>✓ Upgrade anytime</span></div>

          </div>

          <div className="sv-plan-hero-badge"><span>CUSTOMER ACCESS</span><strong>3 plans</strong><small>Basic · Elite · Diamond</small></div>

        </div>



        {activePlan && (

          <div className="sv-plan-current-panel">

            <div className="sv-plan-current-panel-main"><div className="sv-plan-current-icon">✓</div><div><small>YOUR CURRENT PLAN</small><h3>{activePlan.name} Customer Plan</h3><p>Payment confirmed · {activePlan.payment?.method || "UPI"} · {activePlan.payment?.upiId || "Verified"}</p></div></div>

            <div className="sv-plan-current-meta"><div><small>VERIFICATION ID</small><b>{activePlan.payment?.verificationId || "—"}</b></div><div><small>TRANSACTION ID</small><b>{activePlan.payment?.paymentRef || "—"}</b></div><div><small>STATUS</small><b>● ACTIVE</b></div></div>

          </div>

        )}



        <div className="sv-plan-grid">

          {CUSTOMER_PLANS.map((plan) => {

            const isActive = activePlan?.key === plan.key;

            return (

              <article className={`sv-plan-card ${plan.key === "elite" ? "business" : plan.key === "diamond" ? "premium" : "basic"} ${isActive ? "active" : ""}`} key={plan.key}>

                {plan.featured && <div className="sv-plan-popular">MOST POPULAR</div>}

                {isActive && <div className="sv-plan-current">CURRENT PLAN · ACTIVE</div>}

                <div className="sv-plan-card-top">

                  <div><span className={`sv-plan-badge ${plan.key === "elite" ? "business" : plan.key === "diamond" ? "premium" : "basic"}`}>{plan.name}</span><span className="sv-plan-monthly">YEARLY SUBSCRIPTION</span></div>

                  <div className="sv-plan-price"><strong>{money(plan.price)}</strong><small>/ year</small></div>

                </div>

                <p>{plan.subtitle}</p>

                <div className="sv-plan-count"><b>{plan.features.length}</b> customer features included</div>

                <div className="sv-plan-card-features">{plan.features.map((feature) => <span key={feature}>✓ <b>{feature}</b></span>)}</div>

                <button className={isActive ? "sv-outline sv-plan-card-btn" : "sv-primary sv-plan-card-btn"} onClick={() => setPlanPreview(plan)}>{isActive ? "View Current Plan" : `Review ${plan.name} Plan`}</button>

              </article>

            );

          })}

        </div>



        {activePlan ? (

          <div className="sv-plan-access">

            <div className="sv-plan-access-head"><div><small className="sv-kicker">ACTIVE CUSTOMER ACCESS</small><h3>{activePlan.name} Plan · All Features Enabled</h3><p>Every customer benefit included in your current plan is shown below with an active status.</p></div><span>✓ ACTIVE ACCESS</span></div>

            <div className="sv-plan-access-grid">{activePlan.features.map((feature) => <div key={feature}><b>✓</b><span>{feature}</span><em>Enabled</em></div>)}</div>

          </div>

        ) : (

          <div className="sv-plan-empty"><div className="sv-plan-empty-icon">◆</div><b>No customer plan is active yet.</b><span>Select a plan above, review all customer features and complete the UPI-style checkout to activate your membership.</span></div>

        )}

      </section>



      {planPreview && <CustomerPlanPreview plan={planPreview} close={() => setPlanPreview(null)} onChoose={(plan) => { setPlanPreview(null); setPlanPayment(plan); }} />}

      {planPayment && <CustomerPlanPayment plan={planPayment} close={() => setPlanPayment(null)} onSuccess={handleSuccess} />}

    </div>

  );

}



export default SubscriptionPlans;