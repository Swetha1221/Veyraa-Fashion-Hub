import React, { useEffect, useState } from "react";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders =
      JSON.parse(localStorage.getItem("veyraa_orders")) || [];

    setOrders(savedOrders);
  }, []);

  const continueShopping = () => {
    window.location.href = "/women";
  };

  return (
    <div className="my-orders-page">

      {/* ================= HEADER ================= */}

      <header className="my-orders-header">

        <span className="my-orders-eyebrow">
          VEYRAA SHOPPING
        </span>

        <h1>My Orders</h1>

        <p>
          Track, manage and review your fashion purchases.
        </p>

      </header>


      {/* ================= ORDERS ================= */}

      <main className="my-orders-container">

        {orders.length === 0 ? (

          <section className="no-orders">

            <div className="no-orders-icon">
              🛍️
            </div>

            <h2>No Orders Yet</h2>

            <p>
              Your purchased fashion pieces will appear here.
            </p>

            <button
              className="shop-now-button"
              onClick={continueShopping}
            >
              Start Shopping →
            </button>

          </section>

        ) : (

          <>

            {/* ORDER COUNT */}

            <div className="orders-overview">

              <div>
                <h2>Order History</h2>
                <span>
                  {orders.length}{" "}
                  {orders.length === 1 ? "order" : "orders"}
                </span>
              </div>

              <button
                className="orders-shop-button"
                onClick={continueShopping}
              >
                Continue Shopping
              </button>

            </div>


            {/* ORDER LIST */}

            <div className="orders-list">

              {orders.map((order, index) => (

                <article
                  className="order-card"
                  key={order.id || index}
                >

                  {/* ORDER HEADER */}

                  <div className="order-card-header">

                    <div className="order-main-info">

                      <span className="order-label">
                        ORDER ID
                      </span>

                      <strong>
                        {order.id || `VEYRAA-${index + 1}`}
                      </strong>

                    </div>


                    <div className="order-date-block">

                      <span className="order-label">
                        ORDER DATE
                      </span>

                      <span>
                        {order.date
                          ? new Date(order.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Recently"}
                      </span>

                    </div>


                    <span className="order-status">
                      ✓ {order.status || "Order Placed"}
                    </span>

                  </div>


                  {/* ORDER BODY */}

                  <div className="order-products">

                    {(order.items || []).map((item, itemIndex) => (

                      <div
                        className="order-product"
                        key={item.id || itemIndex}
                      >

                        <div className="order-product-image">

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                        </div>


                        <div className="order-product-details">

                          <span className="order-product-category">
                            WOMEN ·{" "}
                            {(
                              item.type ||
                              item.category ||
                              "FASHION"
                            ).toUpperCase()}
                          </span>

                          <h3>
                            {item.name}
                          </h3>

                          <p>
                            {item.material || "Premium Material"}
                            {item.colour
                              ? ` · ${item.colour}`
                              : ""}
                          </p>

                          <div className="order-quantity">
                            Qty: {item.quantity || 1}
                          </div>

                        </div>


                        <div className="order-product-price">

                          ₹
                          {(
                            item.price *
                            (item.quantity || 1)
                          ).toLocaleString("en-IN")}

                        </div>

                      </div>

                    ))}

                  </div>


                  {/* ORDER FOOTER */}

                  <div className="order-footer">

                    <div className="order-payment">

                      <span>Payment</span>

                      <strong>
                        {order.paymentMethod ||
                          order.payment ||
                          "COD"}
                      </strong>

                    </div>


                    <div className="order-total">

                      <span>Total Amount</span>

                      <strong>
                        ₹
                        {Number(
                          order.total || 0
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="order-actions">

                    <button
                      className="track-order-button"
                      onClick={() =>
                        alert(
                          "Order tracking will be available soon."
                        )
                      }
                    >
                      Track Order
                    </button>

                    <button
                      className="view-details-button"
                      onClick={() =>
                        alert(
                          `Order ID: ${
                            order.id || "VEYRAA"
                          }`
                        )
                      }
                    >
                      View Details
                    </button>

                  </div>

                </article>

              ))}

            </div>

          </>

        )}

      </main>

    </div>
  );
}

export default MyOrders;