import React, { useEffect, useState } from "react";
import AccountSidebar from "./AccountSidebar";
import SearchModal from "./SearchModal";

function Navbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => {
    try {
      return (JSON.parse(localStorage.getItem("veyraaCart")) || []).reduce((total, item) => total + (item.quantity || 1), 0);
    } catch (error) {
      return 0;
    }
  });

  useEffect(() => {
    const syncCart = () => {
      try {
        setCartCount((JSON.parse(localStorage.getItem("veyraaCart")) || []).reduce((total, item) => total + (item.quantity || 1), 0));
      } catch (error) {
        setCartCount(0);
      }
    };
    const openSearchHandler = () => setSearchOpen(true);

    window.addEventListener("storage", syncCart);
    window.addEventListener("veyraa:cart-updated", syncCart);
    window.addEventListener("veyraa:open-search", openSearchHandler);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("veyraa:cart-updated", syncCart);
      window.removeEventListener("veyraa:open-search", openSearchHandler);
    };
  }, []);

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* VEYRAA LOGO */}
        <a href="/" className="brand">
          <img
            src="/logo512.png"
            alt="Veyraa Fashion Hub"
            className="veyraa-logo"
          />
        </a>


        {/* NAVIGATION */}
        <nav className="nav-links">

          {/* HOME */}
          <a href="/">
            Home
          </a>

          {/* DEALS */}
          <a href="/deals">
            Deals
          </a>

          {/* WOMEN */}
          <a href="/women">
            Women
          </a>

          {/* MEN */}
          <a href="/men">
            Men
          </a>

          {/* KIDS */}
          <a href="/kids">
            Kids
          </a>

          {/* NEW ARRIVALS */}
          <a href="/new-arrivals">
            New Arrivals
          </a>

          {/* TRENDING */}
          <a href="/trending">
            Trending
          </a>

          {/* BEFITTING YOUR STYLE */}
          <a href="/befitting-your-style">
            Befitting Your Style
          </a>

        </nav>


        {/* RIGHT SIDE ACTIONS */}
        <div className="nav-actions">

          {/* SEARCH */}
          <button
            aria-label="Search"
            type="button"
            onClick={() => setSearchOpen(true)}
          >
            ⌕
          </button>


          {/* WISHLIST */}
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


          {/* CART */}
          <button
            className={cartCount ? "cart-nav-button has-items" : "cart-nav-button"}
            type="button"
            aria-label="Shopping Cart"
            onClick={() => {
              window.location.href = "/cart";
            }}
          >
            <span aria-hidden="true">🛒</span>
            {cartCount > 0 && <b className="cart-count-badge">{cartCount}</b>}
          </button>


          {/* ACCOUNT */}
          <button
            type="button"
            aria-label="Account"
            onClick={() => setAccountOpen(true)}
          >
            ◯
          </button>

        </div>

      </div>


      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* ACCOUNT SIDEBAR */}
      <AccountSidebar
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
      />

    </header>
  );
}

export default Navbar;