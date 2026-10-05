import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

import "./Billing.css";

function Billing() {
  const [cartItems, setCartItems] = useState([]);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("veyraaCart")) || [];

    setCartItems(savedCart);
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * (item.quantity || 1),
    0
  );

  const originalTotal = cartItems.reduce(
    (total, item) => total + (Number(item.oldPrice || item.originalPrice || item.price) || 0) * (item.quantity || 1),
    0
  );
  const discount = Math.max(0, originalTotal - subtotal);
  const offer = subtotal >= 3000 ? 200 : 0;
  const couponDiscount = appliedCoupon ? Math.round(subtotal * appliedCoupon.rate) : 0;
  const taxableAmount = Math.max(0, subtotal - discount - offer - couponDiscount);
  const gst = Math.round(taxableAmount * 0.05);

  const delivery = subtotal >= 999 || subtotal === 0 ? 0 : 49;

  const total = taxableAmount + gst + delivery;

  const applyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    const coupons = {
      VEYRAA10: { code: "VEYRAA10", rate: 0.1 },
      STYLE15: { code: "STYLE15", rate: 0.15 },
      WELCOME10: { code: "WELCOME10", rate: 0.1 },
    };
    setAppliedCoupon(coupons[normalized] || null);
  };

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

const placeOrder = async () => {
  if (isPlacingOrder) return;

  if (
    !customer.name ||
    !customer.phone ||
    !customer.email ||
    !customer.address ||
    !customer.city ||
    !customer.state ||
    !customer.pincode
  ) {
    alert("Please complete all billing details.");
    return;
  }

  if (cartItems.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  setIsPlacingOrder(true);

  try {
    const orderId = "VEY-" + Date.now();

    // Expected delivery: 11 days from order date
    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 11);

    const formattedDeliveryDate = expectedDelivery.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    // Prepare product details from the existing cart
    const productsText = cartItems
      .map(
        (item) =>
          `${item.name} | Qty: ${item.quantity || 1} | ₹${(
            Number(item.price) * (item.quantity || 1)
          ).toLocaleString("en-IN")}`
      )
      .join("\n");

    // Create the existing order structure
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleString("en-IN"),
      items: cartItems,
      customer: customer,
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      discount: discount,
      offer: offer,
      coupon: couponDiscount,
      gst: gst,
      delivery: delivery,
      total: total,
      status: "Order Placed",
      expectedDeliveryDate: formattedDeliveryDate,
      confirmationEmailSent: false,
    };

    // Save order using the existing localStorage system
    const existingOrders =
      JSON.parse(localStorage.getItem("veyraa_orders")) || [];

    localStorage.setItem(
      "veyraa_orders",
      JSON.stringify([newOrder, ...existingOrders])
    );

    // Send order confirmation email
    let confirmationEmailSent = false;
    try {
      await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      {
        customer_name: customer.name,
        customer_email: customer.email,
        email: customer.email,
        order_id: orderId,
        products: productsText,
        total_amount: Number(total).toLocaleString("en-IN"),
        delivery_date: formattedDeliveryDate,
      },
      {
        publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
      }
      );
      confirmationEmailSent = true;
    } catch {
      confirmationEmailSent = false;
    }

    // Mark confirmation email as successfully sent
    const updatedOrders =
      JSON.parse(localStorage.getItem("veyraa_orders")) || [];

    const finalOrders = updatedOrders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            confirmationEmailSent,
          }
        : order
    );

    localStorage.setItem("veyraa_orders", JSON.stringify(finalOrders));

    // Clear cart after successful order + email
    localStorage.removeItem("veyraaCart");

    alert(
      `Order placed successfully!\n\nOrder ID: ${orderId}\n${confirmationEmailSent ? `Confirmation email sent to ${customer.email}` : "The confirmation email could not be sent. Your order is saved; do not place it again."}`
    );

    // Go to My Orders
    window.location.href = "/my-orders";
  } catch (error) {
    alert(
      "Your order could not be completed. Check My Orders before trying again."
    );

    setIsPlacingOrder(false);
  }
};
  return (
    <div className="billing-page">

      {/* HEADER */}

      <section className="billing-header">

        <span>VEYRAA CHECKOUT</span>

        <h1>Billing & Payment</h1>

        <p>
          Complete your details and securely place
          your fashion order.
        </p>

      </section>


      {/* MAIN */}

      <section className="billing-layout">

        {/* LEFT */}

        <div className="billing-left">

          {/* CUSTOMER DETAILS */}

          <div className="billing-card">

            <div className="billing-card-title">
              <span>01</span>

              <div>
                <h2>Contact Details</h2>
                <p>
                  Enter your contact information
                </p>
              </div>
            </div>


            <div className="billing-grid">

              <div className="billing-field">
                <label>Full Name</label>

                <input
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>


              <div className="billing-field">
                <label>Phone Number</label>

                <input
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>


              <div className="billing-field full">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

            </div>

          </div>


          {/* ADDRESS */}

          <div className="billing-card">

            <div className="billing-card-title">

              <span>02</span>

              <div>
                <h2>Billing Address</h2>
                <p>
                  Where should we deliver your order?
                </p>
              </div>

            </div>


            <div className="billing-grid">

              <div className="billing-field full">
                <label>Address</label>

                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  placeholder="House / Flat No, Street, Area"
                />
              </div>


              <div className="billing-field">
                <label>City</label>

                <input
                  name="city"
                  value={customer.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>


              <div className="billing-field">
                <label>State</label>

                <input
                  name="state"
                  value={customer.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>


              <div className="billing-field">
                <label>Pincode</label>

                <input
                  name="pincode"
                  value={customer.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
              </div>

            </div>

          </div>


          {/* PAYMENT */}

          <div className="billing-card">

            <div className="billing-card-title">

              <span>03</span>

              <div>
                <h2>Payment Method</h2>
                <p>
                  Select your preferred payment method
                </p>
              </div>

            </div>


            <div className="payment-options">

              <label
                className={
                  paymentMethod === "UPI"
                    ? "payment-option active"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div>
                  <strong>UPI</strong>
                  <small>
                    Google Pay · PhonePe · Paytm
                  </small>
                </div>

              </label>


              <label
                className={
                  paymentMethod === "Card"
                    ? "payment-option active"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  value="Card"
                  checked={paymentMethod === "Card"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div>
                  <strong>Credit / Debit Card</strong>
                  <small>
                    Visa · Mastercard · RuPay
                  </small>
                </div>

              </label>


              <label
                className={
                  paymentMethod === "COD"
                    ? "payment-option active"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div>
                  <strong>Cash on Delivery</strong>
                  <small>
                    Pay when your order arrives
                  </small>
                </div>

              </label>

            </div>

          </div>

        </div>


        {/* RIGHT */}

        <aside className="billing-summary">

          <h2>Order Summary</h2>

          <div className="billing-items">

            {cartItems.map((item) => (

              <div
                className="billing-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>

                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    Qty: {item.quantity || 1}
                  </span>

                </div>

                <b>
                  ₹
                  {(
                    item.price *
                    (item.quantity || 1)
                  ).toLocaleString("en-IN")}
                </b>

              </div>

            ))}

          </div>


          <div className="billing-line">
            <span>Subtotal</span>

            <strong>
              ₹{subtotal.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="billing-line">
            <span>Discount</span>
            <strong>-₹{discount.toLocaleString("en-IN")}</strong>
          </div>

          <div className="billing-line">
            <span>Offer</span>
            <strong>-₹{offer.toLocaleString("en-IN")}</strong>
          </div>

          <div className="coupon-box">
            <label htmlFor="coupon-code">Have a coupon?</label>
            <div>
              <input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" disabled={Boolean(appliedCoupon)} />
              {appliedCoupon ? <button type="button" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>Remove</button> : <button type="button" onClick={applyCoupon}>Apply</button>}
            </div>
            {appliedCoupon && <small>{appliedCoupon.code} applied successfully.</small>}
          </div>

          <div className="billing-line">
            <span>Coupon</span>
            <strong>-₹{couponDiscount.toLocaleString("en-IN")}</strong>
          </div>

          <div className="billing-line">
            <span>GST (5%)</span>
            <strong>₹{gst.toLocaleString("en-IN")}</strong>
          </div>


          <div className="billing-line">
            <span>Delivery</span>

            <strong>
              {delivery === 0
                ? "FREE"
                : `₹${delivery}`}
            </strong>
          </div>


          <div className="billing-divider" />


          <div className="billing-total">

            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>

          </div>


         <button
  className="place-order-button"
  onClick={placeOrder}
  disabled={isPlacingOrder}
  aria-busy={isPlacingOrder}
>
  {isPlacingOrder ? "Processing Order..." : "Place Order →"}
</button>


          <p className="secure-payment">
            🔒 Secure checkout · Your information is protected
          </p>

        </aside>

      </section>

    </div>
  );
}

export default Billing;
