import React, { useEffect, useState } from "react";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("veyraaWishlist")) || [];

    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "veyraaWishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const addToCart = (product) => {
    const existingCart =
      JSON.parse(localStorage.getItem("veyraaCart")) || [];

    const existingProduct = existingCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "veyraaCart",
      JSON.stringify(updatedCart)
    );

    alert("Added to cart ✓");
  };

  const continueShopping = () => {
    window.location.href = "/women";
  };

  return (
    <div className="wishlist-page">

      {/* HEADER */}

      <header className="wishlist-header">

        <span className="wishlist-eyebrow">
          VEYRAA COLLECTION
        </span>

        <h1>My Wishlist</h1>

        <p>
          Your saved fashion pieces, all in one place.
        </p>

      </header>


      {/* EMPTY WISHLIST */}

      {wishlist.length === 0 ? (

        <section className="wishlist-empty">

          <div className="wishlist-empty-icon">
            ♡
          </div>

          <h2>Your Wishlist is Empty</h2>

          <p>
            Save your favourite fashion pieces here
            and come back to them anytime.
          </p>

          <button
            onClick={continueShopping}
          >
            Explore Fashion →
          </button>

        </section>

      ) : (

        <main className="wishlist-container">

          {/* TOP BAR */}

          <div className="wishlist-topbar">

            <div>
              <h2>Saved Pieces</h2>

              <span>
                {wishlist.length}{" "}
                {wishlist.length === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <button
              className="wishlist-shop-button"
              onClick={continueShopping}
            >
              Continue Shopping
            </button>

          </div>


          {/* PRODUCTS */}

          <div className="wishlist-grid">

            {wishlist.map((product) => (

              <article
                className="wishlist-card"
                key={product.id}
              >

                {/* IMAGE */}

                <div className="wishlist-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button
                    className="wishlist-remove"
                    onClick={() =>
                      removeFromWishlist(product.id)
                    }
                    aria-label="Remove from wishlist"
                  >
                    ♥
                  </button>

                  {product.badge && (
                    <span className="wishlist-badge">
                      {product.badge}
                    </span>
                  )}

                </div>


                {/* DETAILS */}

                <div className="wishlist-details">

                  <span className="wishlist-category">
                    WOMEN ·{" "}
                    {(
                      product.type ||
                      product.category ||
                      "FASHION"
                    ).toUpperCase()}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="wishlist-material">
                    {product.material || "Premium Material"}
                    {product.colour
                      ? ` · ${product.colour}`
                      : ""}
                  </p>


                  <div className="wishlist-price">

                    <strong>
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </strong>

                    {product.oldPrice && (
                      <del>
                        ₹
                        {Number(
                          product.oldPrice
                        ).toLocaleString("en-IN")}
                      </del>
                    )}

                  </div>


                  {/* ACTION */}

                  <button
                    className="wishlist-cart-button"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    🛒 Add to Cart
                  </button>

                </div>

              </article>

            ))}

          </div>

        </main>

      )}

    </div>
  );
}

export default Wishlist;