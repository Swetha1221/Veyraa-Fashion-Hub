import React, { useState } from "react";
import "./PortalLogin.css";

const PORTAL_INFO = {
  seller: {
    label: "Seller Center",
    title: "Welcome back, Seller.",
    description:
      "Sign in to access your seller operations, catalogue, inventory and intelligence.",
  },

  admin: {
    label: "Admin Control Center",
    title: "Welcome back, Admin.",
    description:
      "Sign in to access Veyraa operations, sellers, catalogue and analytics.",
  },

  delivery: {
    label: "Delivery Center",
    title: "Welcome back, Delivery Partner.",
    description:
      "Sign in to access assigned orders, pickup, delivery tracking and delivery operations.",
  },
};

function PortalLogin({ role, children }) {
  const storageKey = `veyraa_${role}_authenticated`;

  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(storageKey) === "true"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const account = PORTAL_INFO[role] || PORTAL_INFO.seller;

  const login = (e) => {
    e.preventDefault();

    const enteredUsername = username.trim();
    const enteredPassword = password.trim();

    // Any username + any password is accepted.
    // Only empty fields are rejected.
    if (!enteredUsername || !enteredPassword) {
      setError("Please enter both username and password.");
      return;
    }

    sessionStorage.setItem(storageKey, "true");

    setAuthenticated(true);
    setError("");
  };

  const logout = () => {
    sessionStorage.removeItem(storageKey);

    setAuthenticated(false);
    setUsername("");
    setPassword("");
    setError("");
    setShowPassword(false);
  };

  // =====================================================
  // AFTER LOGIN
  // =====================================================

  if (authenticated) {
    return (
      <div className="portal-authenticated">
        {React.cloneElement(children, { onLogout: logout })}

        <button
          className="portal-logout"
          onClick={logout}
          title={`Logout from ${account.label}`}
        >
          ↪ Logout
        </button>
      </div>
    );
  }

  // =====================================================
  // LOGIN PAGE
  // =====================================================

  return (
    <div className={`portal-login-page portal-${role}`}>
      <div className="portal-login-shell">

        {/* BRAND */}
        <div className="portal-login-brand">
          <div className="portal-logo">V</div>

          <div>
            <strong>VEYRAA</strong>
            <span>{account.label.toUpperCase()}</span>
          </div>
        </div>

        {/* LOGIN CONTENT */}
        <div className="portal-login-content">

          {/* LEFT SIDE */}
          <div className="portal-login-copy">
            <small>SECURE WORKSPACE</small>

            <h1>{account.title}</h1>

            <p>{account.description}</p>

            <div className="portal-login-points">
              <span>✓ Role-based access</span>
              <span>✓ Secure session login</span>
              <span>✓ Veyraa workspace</span>
            </div>
          </div>

          {/* LOGIN CARD */}
          <form
            className="portal-login-card"
            onSubmit={login}
          >
            <div className="portal-card-kicker">
              {role === "seller"
                ? "SELLER LOGIN"
                : role === "admin"
                ? "ADMIN LOGIN"
                : "DELIVERY LOGIN"}
            </div>

            <h2>Sign in</h2>

            <p>
              Enter your Veyraa workspace credentials.
            </p>

            {/* USERNAME */}
            <label>
              Username

              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </label>

            {/* PASSWORD */}
            <label>
              Password

              <div className="portal-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {/* ERROR */}
            {error && (
              <div className="portal-login-error">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              className="portal-login-submit"
              type="submit"
            >
              Sign In →
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="portal-login-footer">
          Veyraa Fashion Hub ·{" "}
          {role === "seller"
            ? "Seller Workspace"
            : role === "admin"
            ? "Admin Workspace"
            : "Delivery Workspace"}
        </div>

      </div>
    </div>
  );
}

// =====================================================
// SELLER PORTAL
// =====================================================

export function SellerPortal({ children }) {
  return (
    <PortalLogin role="seller">
      {children}
    </PortalLogin>
  );
}

// =====================================================
// ADMIN PORTAL
// =====================================================

export function AdminPortal({ children }) {
  return (
    <PortalLogin role="admin">
      {children}
    </PortalLogin>
  );
}

// =====================================================
// DELIVERY PORTAL
// =====================================================

export function DeliveryPortal({ children }) {
  return (
    <PortalLogin role="delivery">
      {children}
    </PortalLogin>
  );
}

export default PortalLogin;
