import React, { useEffect, useRef, useState } from "react";
import "./SearchModal.css";
import {
  searchCatalog,
  resolveCatalogImage,
  addToCart,
  toggleWishlist,
} from "../data/unifiedCatalog";

const SUGGESTED_SEARCHES = [
  "Sarees",
  "Kurtis",
  "Shirts",
  "Dresses",
  "Bags",
  "Men",
  "Kids",
  "Women",
];

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [wishlistMap, setWishlistMap] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const inputRef = useRef(null);

  // Sync wishlist map
  const syncWishlist = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
      const map = {};
      saved.forEach((item) => {
        map[String(item.id)] = true;
      });
      setWishlistMap(map);
    } catch (e) {
      setWishlistMap({});
    }
  };

  useEffect(() => {
    if (isOpen) {
      syncWishlist();
      setQuery("");
      setResults([]);
      setHasSearched(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search
  const handleQueryChange = (val) => {
    setQuery(val);
    const trimmed = val.trim();
    if (trimmed.length > 0) {
      const found = searchCatalog(trimmed);
      setResults(found);
      setHasSearched(true);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    const found = searchCatalog(suggestion);
    setResults(found);
    setHasSearched(true);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`"${product.name}" added to cart ✓`);
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    const added = toggleWishlist(product);
    setWishlistMap((prev) => ({
      ...prev,
      [String(product.id)]: added,
    }));
    showToast(
      added
        ? `Saved to wishlist ♥`
        : `Removed from wishlist`
    );
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2400);
  };

  const handleViewProduct = (product) => {
    window.location.href = `/products/${encodeURIComponent(product.id)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="search-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP SEARCH BAR */}
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <span className="search-icon-symbol" aria-hidden="true">⌕</span>
            <input
              ref={inputRef}
              type="text"
              className="search-modal-input"
              placeholder="Search sarees, shirts, kurtis, bags, dresses, men, kids..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              aria-label="Search products"
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            className="search-close-btn"
            onClick={onClose}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>

        {/* NOTIFICATION TOAST */}
        {toastMessage && (
          <div className="search-toast" role="status">
            {toastMessage}
          </div>
        )}

        {/* BODY CONTENT */}
        <div className="search-modal-body">
          {!hasSearched ? (
            <div className="search-suggestions-panel">
              <span className="suggestions-label">POPULAR FASHION SEARCHES</span>
              <div className="suggestions-chips">
                {SUGGESTED_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="search-hint">
                Type keywords like <em>"Saree"</em>, <em>"sar"</em>, <em>"shirt"</em>, <em>"men shirt"</em>, <em>"kurti"</em>, or <em>"bag"</em> to find styles across our collections.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="search-no-results">
              <div className="no-results-icon">⌕</div>
              <h3>No styles found</h3>
              <p>
                We couldn't find any items matching "<strong>{query}</strong>". Try checking for typos or searching for a broader category.
              </p>
              <button
                type="button"
                className="browse-all-btn"
                onClick={() => {
                  onClose();
                  window.location.href = "/deals";
                }}
              >
                Browse All Fashion →
              </button>
            </div>
          ) : (
            <div className="search-results-panel">
              <div className="search-results-meta">
                <span>
                  Found <strong>{results.length}</strong> {results.length === 1 ? "style" : "styles"} for "<em>{query}</em>"
                </span>
              </div>

              <div className="search-results-grid">
                {results.map((product) => {
                  const isWishlisted = !!wishlistMap[String(product.id)];
                  const imageUrl = resolveCatalogImage(product);
                  const originalPrice = product.originalPrice || product.oldPrice || product.price;
                  const discount = product.discountPercent;

                  return (
                    <article
                      key={`${product.audience}-${product.id}`}
                      className="search-product-card"
                    >
                      <div
                        className="search-card-image-wrap"
                        onClick={() => handleViewProduct(product)}
                      >
                        <img
                          src={imageUrl}
                          alt={product.name}
                          loading="lazy"
                        />
                        {discount > 0 && (
                          <span className="search-card-discount-badge">
                            {discount}% OFF
                          </span>
                        )}
                        <button
                          type="button"
                          className={`search-card-wishlist-btn ${
                            isWishlisted ? "active" : ""
                          }`}
                          onClick={(e) => handleToggleWishlist(e, product)}
                          aria-label={
                            isWishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          {isWishlisted ? "♥" : "♡"}
                        </button>
                      </div>

                      <div className="search-card-details">
                        <span className="search-card-category">
                          {product.audience} • {product.categoryGroup || product.type || product.category}
                        </span>

                        <h4
                          className="search-card-title"
                          onClick={() => handleViewProduct(product)}
                          title={product.name}
                        >
                          {product.name}
                        </h4>

                        <div className="search-card-pricing">
                          <span className="search-card-price">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {originalPrice > product.price && (
                            <del className="search-card-old-price">
                              ₹{originalPrice.toLocaleString("en-IN")}
                            </del>
                          )}
                        </div>

                        <div className="search-card-actions">
                          <button
                            type="button"
                            className="search-card-view-btn"
                            onClick={() => handleViewProduct(product)}
                          >
                            View Product
                          </button>
                          <button
                            type="button"
                            className="search-card-cart-btn"
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
