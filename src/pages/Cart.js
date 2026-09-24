import React, { useEffect, useState } from "react";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("veyraaCart")) || [];

    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, change) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: Math.max(
              1,
              (item.quantity || 1) + change
            ),
          };
        }

        return item;
      });

    setCartItems(updatedCart);

    localStorage.setItem(
      "veyraaCart",
      JSON.stringify(updatedCart)
    );
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );

    setCartItems(updatedCart);

    localStorage.setItem(
      "veyraaCart",
      JSON.stringify(updatedCart)
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * (item.quantity || 1),
    0
  );

  const delivery = subtotal >= 999 || subtotal === 0
    ? 0
    : 49;

  const total = subtotal + delivery;

  return (
    <div className="veyraa-cart-page">

      {/* HEADER */}

      <section className="cart-header">

        <span>VEYRAA SHOPPING</span>

        <h1>Your Cart</h1>

        <p>
          Review your selected fashion pieces
          before checkout.
        </p>

      </section>


      {/* EMPTY CART */}

      {cartItems.length === 0 ? (

        <section className="empty-cart">

          <div className="empty-cart-icon">
            🛍️
          </div>

          <h2>Your Cart is Empty</h2>

          <p>
            Looks like you haven't added anything
            to your cart yet.
          </p>

          <button
            onClick={() => {
              window.location.href = "/women";
            }}
          >
            Continue Shopping →
          </button>

        </section>

      ) : (

        /* CART CONTENT */

        <section className="cart-layout">

          {/* PRODUCTS */}

          <div className="cart-products">

            <div className="cart-products-heading">

              <h2>
                Shopping Bag
              </h2>

              <span>
                {cartItems.length} Item
                {cartItems.length > 1 ? "s" : ""}
              </span>

            </div>


            {cartItems.map((item) => (

              <article
                className="cart-product-card"
                key={item.id}
              >

                {/* IMAGE */}

                <div className="cart-product-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>


                {/* DETAILS */}

                <div className="cart-product-details">

                  <span className="cart-category">
                    WOMEN ·{" "}
                    {item.type?.toUpperCase()}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {item.material} ·{" "}
                    {item.colour}
                  </p>

                  <div className="cart-price">
                    ₹{item.price}

                    {item.oldPrice && (
                      <del>
                        ₹{item.oldPrice}
                      </del>
                    )}
                  </div>


                  {/* QUANTITY */}

                  <div className="quantity-section">

                    <span>
                      Quantity
                    </span>

                    <div className="quantity-control">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            -1
                          )
                        }
                      >
                        −
                      </button>

                      <strong>
                        {item.quantity || 1}
                      </strong>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>


                  {/* REMOVE */}

                  <button
                    className="remove-cart-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>


                {/* ITEM TOTAL */}

                <div className="cart-item-total">

                  <strong>
                    ₹
                    {(
                      item.price *
                      (item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </strong>

                </div>

              </article>

            ))}

          </div>


          {/* ORDER SUMMARY */}

          <aside className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <strong>

                {delivery === 0
                  ? "FREE"
                  : `₹${delivery}`}

              </strong>

            </div>


            <div className="summary-divider" />


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>
<button
  className="checkout-button"
onClick={() => {
  window.location.href = "/billing";
}}
>
  Proceed to Checkout →
</button>

        


            <button
              className="continue-shopping"
              onClick={() => {
                window.location.href =
                  "/women";
              }}
            >
              ← Continue Shopping
            </button>

          </aside>

        </section>

      )}

    </div>
  );
}

export default Cart;