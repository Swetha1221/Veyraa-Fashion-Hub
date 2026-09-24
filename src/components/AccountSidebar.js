import React, { useEffect, useState } from "react";
import CustomerProfile from "./CustomerProfile";
import "./AccountSidebar.css";
import {
  getCurrentCustomer,
  getSavedFitProfile,
  saveCustomerFitProfile,
  loginCustomer,
  logoutCustomer,
} from "../data/customerAccount";

function AccountSidebar({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");
  const [showFitProfileEditor, setShowFitProfileEditor] = useState(false);
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [customer, setCustomer] = useState(getCurrentCustomer);
  const [fitProfile, setFitProfile] = useState(() => getSavedFitProfile(customer.id));

  // Dynamic counts
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  // Form states for login/signup
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // Sync state with localStorage & custom events
  const syncAllState = () => {
    const current = getCurrentCustomer();
    setCustomer(current);
    setFitProfile(getSavedFitProfile(current.id));

    try {
      const savedWishlist = JSON.parse(localStorage.getItem("veyraaWishlist")) || [];
      setWishlistCount(savedWishlist.length);
    } catch (e) {
      setWishlistCount(0);
    }

    try {
      const savedCart = JSON.parse(localStorage.getItem("veyraaCart")) || [];
      const count = savedCart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    } catch (e) {
      setCartCount(0);
    }

    try {
      const savedOrders = JSON.parse(localStorage.getItem("veyraa_orders")) || [];
      setOrderCount(savedOrders.length);
    } catch (e) {
      setOrderCount(0);
    }
  };

  useEffect(() => {
    syncAllState();
    window.addEventListener("storage", syncAllState);
    window.addEventListener("veyraa:cart-updated", syncAllState);
    window.addEventListener("veyraa:wishlist-updated", syncAllState);
    window.addEventListener("veyraa:auth-updated", syncAllState);
    window.addEventListener("veyraa:fit-profile-updated", syncAllState);

    return () => {
      window.removeEventListener("storage", syncAllState);
      window.removeEventListener("veyraa:cart-updated", syncAllState);
      window.removeEventListener("veyraa:wishlist-updated", syncAllState);
      window.removeEventListener("veyraa:auth-updated", syncAllState);
      window.removeEventListener("veyraa:fit-profile-updated", syncAllState);
    };
  }, [isOpen]);

  const handleLogin = (e) => {
    e.preventDefault();
    loginCustomer({
      email: loginData.email,
      name: loginData.email.split("@")[0],
    });
    syncAllState();
  };

  const handleSignup = (e) => {
    e.preventDefault();
    loginCustomer({
      name: signupData.name,
      phone: signupData.phone,
      email: signupData.email,
    });
    syncAllState();
  };

  const handleFitProfileSave = (e) => {
    e.preventDefault();
    saveCustomerFitProfile(fitProfile, customer.id);
    setShowFitProfileEditor(false);
    syncAllState();
    alert("Your Fit Profile has been saved successfully!");
  };

  const handleLogout = () => {
    logoutCustomer();
    syncAllState();
    setMode("login");
  };

  const navigateTo = (url) => {
    onClose();
    window.location.href = url;
  };

  return (
    <>
      {isOpen && (
        <div
          className="account-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`account-sidebar ${
          isOpen ? "account-sidebar-open" : ""
        }`}
      >
        {/* HEADER */}
        <div className="account-sidebar-header">
          <div>
            <span className="account-small-title">
              VEYRAA
            </span>

            <h2>
              {customer.isLoggedIn ? "My Account" : "Welcome"}
            </h2>
          </div>

          <button
            className="account-close"
            onClick={onClose}
            aria-label="Close account"
          >
            ×
          </button>
        </div>

        {customer.isLoggedIn ? (
          <div className="account-sidebar-compact">
            {/* 1. CUSTOMER PROFILE HEADER */}
            <div className="account-profile-header">
              <div className="account-profile-avatar">
                {(customer.name || "V").charAt(0).toUpperCase()}
              </div>

              <div className="account-profile-meta">
                <h3>Hello, {customer.name || "Customer"}</h3>
                <span className="account-profile-status">
                  <span className="account-status-dot" /> Logged In
                </span>
              </div>
            </div>

            {/* 2. FIT PROFILE CARD (PROMINENT PROMOTIONAL CARD) */}
            <div
              className="fit-card-prominent"
              onClick={() => setShowFitProfileEditor(true)}
              role="button"
              tabIndex={0}
            >
              <div className="fit-card-top">
                <span className={`fit-card-badge ${fitProfile?.isCompleted ? "completed" : ""}`}>
                  {fitProfile?.isCompleted ? "✓ FIT PROFILE SAVED" : "✦ NEW · SMART FIT"}
                </span>
                <span className="fit-card-arrow">→</span>
              </div>

              {!fitProfile?.isCompleted ? (
                <>
                  <div className="fit-card-title">
                    COMPLETE YOUR FIT PROFILE
                  </div>
                  <p className="fit-card-desc">
                    Get more relevant fashion recommendations based on your measurements.
                  </p>
                  <div className="fit-card-actions">
                    <button
                      type="button"
                      className="fit-action-btn-sm primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFitProfileEditor(true);
                      }}
                    >
                      COMPLETE FIT PROFILE →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="fit-card-title">
                    YOUR FIT PROFILE
                  </div>
                  <p className="fit-card-desc">
                    ✓ Profile completed · Personalized recommendations active
                  </p>

                  <div className="fit-measurements-compact-grid">
                    <div className="measurement-cell">
                      <span>Height</span>
                      <strong>{fitProfile.height ? `${fitProfile.height} cm` : "—"}</strong>
                    </div>
                    <div className="measurement-cell">
                      <span>Weight</span>
                      <strong>{fitProfile.weight ? `${fitProfile.weight} kg` : "—"}</strong>
                    </div>
                    <div className="measurement-cell">
                      <span>Chest</span>
                      <strong>{fitProfile.chest ? `${fitProfile.chest} cm` : "—"}</strong>
                    </div>
                    <div className="measurement-cell">
                      <span>Waist</span>
                      <strong>{fitProfile.waist ? `${fitProfile.waist} cm` : "—"}</strong>
                    </div>
                    <div className="measurement-cell">
                      <span>Hip</span>
                      <strong>{fitProfile.hip ? `${fitProfile.hip} cm` : "—"}</strong>
                    </div>
                    <div className="measurement-cell">
                      <span>Shoulder</span>
                      <strong>{fitProfile.shoulder ? `${fitProfile.shoulder} cm` : "—"}</strong>
                    </div>
                  </div>

                  <div className="fit-card-actions">
                    <button
                      type="button"
                      className="fit-action-btn-sm secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFitProfileEditor(true);
                      }}
                    >
                      EDIT MEASUREMENTS
                    </button>
                    <button
                      type="button"
                      className="fit-action-btn-sm primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCustomerProfile(true);
                      }}
                    >
                      VIEW PROFILE
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* NAVIGATION ROWS: Wishlist, Cart, My Orders, Account Settings */}
            <div className="account-menu-list">
              {/* 3. WISHLIST */}
              <button
                type="button"
                className="account-row-item"
                onClick={() => navigateTo("/wishlist")}
              >
                <div className="account-row-left">
                  <span className="account-row-icon">♡</span>
                  <div className="account-row-text">
                    <span className="account-row-title">Wishlist</span>
                    <span className="account-row-sub">
                      {wishlistCount > 0 ? `${wishlistCount} items saved` : "Saved fashion pieces"}
                    </span>
                  </div>
                </div>
                <div className="account-row-right">
                  {wishlistCount > 0 && (
                    <span className="account-row-badge">{wishlistCount}</span>
                  )}
                  <span className="account-row-arrow">→</span>
                </div>
              </button>

              {/* 4. CART */}
              <button
                type="button"
                className="account-row-item"
                onClick={() => navigateTo("/cart")}
              >
                <div className="account-row-left">
                  <span className="account-row-icon">🛒</span>
                  <div className="account-row-text">
                    <span className="account-row-title">Shopping Cart</span>
                    <span className="account-row-sub">
                      {cartCount > 0 ? `${cartCount} items in bag` : "Your shopping bag"}
                    </span>
                  </div>
                </div>
                <div className="account-row-right">
                  {cartCount > 0 && (
                    <span className="account-row-badge">{cartCount}</span>
                  )}
                  <span className="account-row-arrow">→</span>
                </div>
              </button>

              {/* 5. MY ORDERS */}
              <button
                type="button"
                className="account-row-item"
                onClick={() => navigateTo("/my-orders")}
              >
                <div className="account-row-left">
                  <span className="account-row-icon">🛍</span>
                  <div className="account-row-text">
                    <span className="account-row-title">My Orders</span>
                    <span className="account-row-sub">
                      {orderCount > 0 ? `${orderCount} order(s) placed` : "Track & view purchases"}
                    </span>
                  </div>
                </div>
                <div className="account-row-right">
                  {orderCount > 0 && (
                    <span className="account-row-badge">{orderCount}</span>
                  )}
                  <span className="account-row-arrow">→</span>
                </div>
              </button>

              {/* 6. ACCOUNT SETTINGS */}
              <button
                type="button"
                className="account-row-item"
                onClick={() => setShowCustomerProfile(true)}
              >
                <div className="account-row-left">
                  <span className="account-row-icon">⚙</span>
                  <div className="account-row-text">
                    <span className="account-row-title">Account Settings</span>
                    <span className="account-row-sub">
                      Personal info, preferences & delivery
                    </span>
                  </div>
                </div>
                <div className="account-row-right">
                  <span className="account-row-arrow">→</span>
                </div>
              </button>
            </div>

            {/* 7. LOGOUT */}
            <button
              type="button"
              className="account-logout-btn"
              onClick={handleLogout}
            >
              <span>↪</span> Logout
            </button>
          </div>
        ) : (
          <>
            <div className="account-tabs">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Login
              </button>

              <button
                className={mode === "signup" ? "active" : ""}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            {mode === "login" ? (
              <form className="account-form" onSubmit={handleLogin}>
                <label>Email or Phone</label>
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit" className="account-primary-button">
                  Login
                </button>

                <div className="account-divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="google-login-button"
                  onClick={() =>
                    alert("Google authentication can be connected here.")
                  }
                >
                  <span>G</span>
                  Continue with Google
                </button>

                <p className="switch-account">
                  New to Veyraa?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              <form className="account-form" onSubmit={handleSignup}>
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      name: e.target.value,
                    })
                  }
                  required
                />

                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={signupData.phone}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      phone: e.target.value,
                    })
                  }
                  required
                />

                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      email: e.target.value,
                    })
                  }
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Create password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <button type="submit" className="account-primary-button">
                  Create Account
                </button>

                <div className="account-divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="google-login-button"
                  onClick={() =>
                    alert("Google authentication can be connected here.")
                  }
                >
                  <span>G</span>
                  Continue with Google
                </button>
              </form>
            )}

            <button
              className="fit-profile-card"
              onClick={() => setShowFitProfileEditor(true)}
            >
              <span className="fit-icon">✦</span>
              <span>
                <strong>Fit Profile Check</strong>
                <small>Create your one-time body measurement profile</small>
              </span>
              <span>→</span>
            </button>
          </>
        )}

        {/* FIT PROFILE EDITOR PANEL */}
        {showFitProfileEditor && (
          <div className="fit-profile-panel">
            <div className="fit-profile-header">
              <button
                type="button"
                onClick={() => setShowFitProfileEditor(false)}
              >
                ←
              </button>

              <div>
                <span>VEYRAA SMART FIT</span>
                <h2>Fit Profile Check</h2>
              </div>
            </div>

            <p className="fit-profile-description">
              Enter your measurements once. Veyraa uses your fit profile to suggest suitable sizes and relevant fashion products.
            </p>

            <form className="fit-form" onSubmit={handleFitProfileSave}>
              <label>Height (cm)</label>
              <input
                type="number"
                placeholder="Example: 165"
                value={fitProfile.height || ""}
                onChange={(e) =>
                  setFitProfile({
                    ...fitProfile,
                    height: e.target.value,
                  })
                }
                required
              />

              <label>Weight (kg)</label>
              <input
                type="number"
                placeholder="Example: 58"
                value={fitProfile.weight || ""}
                onChange={(e) =>
                  setFitProfile({
                    ...fitProfile,
                    weight: e.target.value,
                  })
                }
                required
              />

              <label>Chest / Bust (cm)</label>
              <input
                type="number"
                placeholder="Enter measurement"
                value={fitProfile.chest || ""}
                onChange={(e) =>
                  setFitProfile({
                    ...fitProfile,
                    chest: e.target.value,
                  })
                }
                required
              />

              <label>Waist (cm)</label>
              <input
                type="number"
                placeholder="Enter measurement"
                value={fitProfile.waist || ""}
                onChange={(e) =>
                  setFitProfile({
                    ...fitProfile,
                    waist: e.target.value,
                  })
                }
                required
              />

              <label>Hip (cm)</label>
              <input
                type="number"
                placeholder="Enter measurement"
                value={fitProfile.hip || ""}
                onChange={(e) =>
                  setFitProfile({
                    ...fitProfile,
                    hip: e.target.value,
                  })
                }
                required
              />

              <label>Shoulder Width (cm)</label>
              <input
                type="number"
                placeholder="Enter measurement"
                value={fitProfile.shoulder || ""}
                onChange={(e) =>
                  setFitProfile({
                    ...fitProfile,
                    shoulder: e.target.value,
                  })
                }
              />

              <label>Arm Length (cm)</label>
              <input
                type="number"
                placeholder="Enter measurement"
                value={fitProfile.armLength || ""}
                onChange={(e) =>
                  setFitProfile({
                    ...fitProfile,
                    armLength: e.target.value,
                  })
                }
              />

              <button type="submit" className="account-primary-button">
                Save My Fit Profile
              </button>
            </form>
          </div>
        )}

        {/* CUSTOMER PROFILE MODAL */}
        {showCustomerProfile && (
          <CustomerProfile
            onClose={() => setShowCustomerProfile(false)}
            onOpenFitProfile={() => {
              setShowCustomerProfile(false);
              setShowFitProfileEditor(true);
            }}
          />
        )}
      </aside>
    </>
  );
}

export default AccountSidebar;