import React, { useEffect, useState } from "react";
import AccountSidebar from "./AccountSidebar";

function Navbar() {
  const [accountOpen, setAccountOpen] = useState(false);

  const [cartCount, setCartCount] = useState(() => {
    try {
      return (JSON.parse(localStorage.getItem("veyraaCart")) || []).reduce(
        (total, item) => total + (item.quantity || 1), 0
      );
    } catch (error) {
      return 0;
    }
  });

  useEffect(() => {
    const syncCart = () => {
      try {
        setCartCount(
          (JSON.parse(localStorage.getItem("veyraaCart")) || []).reduce(
            (total, item) => total + (item.quantity || 1), 0
          )
        );
      } catch (error) {
        setCartCount(0);
      }
    };

    window.addEventListener("storage", syncCart);
    window.addEventListener("veyraa:cart-updated", syncCart);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("veyraa:cart-updated", syncCart);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">

        <a href="/" className="brand">
          <img
            src="/logo512.png"
            alt="Veyraa Fashion Hub"
            className="veyraa-logo"
          />
        </a>

        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/deals">Deals</a>
          <a href="/women">Women</a>
          <a href="/men">Men</a>
          <a href="/kids">Kids</a>
          <a href="/new-arrivals">New Arrivals</a>
          <a href="/trending">Trending</a>
          <a href="/befitting-your-style">Befitting Your Style</a>

          {/* CUSTOMER SUBSCRIPTION PLANS */}
          <a href="/subscription-plans">
            Subscription Plans
          </a>
        </nav>

        <div className="nav-actions">

          <button
            aria-label="Search"
            type="button"
            onClick={() => {
              window.location.href = "/search";
            }}
          >
            ⌕
          </button>

          <button
            className="wishlist-icon"
            type="button"
            onClick={() => {
              window.location.href = "/wishlist";
            }}
            aria-label="Wishlist"
          >
            ♡
          </button>

          <button
            className={
              cartCount
                ? "cart-nav-button has-items"
                : "cart-nav-button"
            }
            type="button"
            aria-label="Shopping Cart"
            onClick={() => {
              window.location.href = "/cart";
            }}
          >
            <span aria-hidden="true">🛒</span>

            {cartCount > 0 && (
              <b className="cart-count-badge">
                {cartCount}
              </b>
            )}
          </button>

          <button
            type="button"
            aria-label="Account"
            onClick={() => setAccountOpen(true)}
          >
            ◯
          </button>

        </div>
      </div>

      <AccountSidebar
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
      />
    </header>
  );
}

export default Navbar;