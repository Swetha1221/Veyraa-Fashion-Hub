import React, { useState } from "react";

function CustomerAuth({ onClose, onLoginSuccess }) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "signup") {
      if (!form.name || !form.phone || !form.email || !form.password) {
        setMessage("Please complete all required fields.");
        return;
      }

      if (form.password.length < 6) {
        setMessage("Password must contain at least 6 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      const customer = {
        name: form.name,
        phone: form.phone,
        email: form.email,
      };

      localStorage.setItem(
        "veyraaCustomer",
        JSON.stringify(customer)
      );

      localStorage.setItem("veyraaLoggedIn", "true");

      setMessage("Account created successfully.");

      setTimeout(() => {
        onLoginSuccess(customer);
      }, 500);

      return;
    }

    if (!form.email || !form.password) {
      setMessage("Enter your email and password.");
      return;
    }

    const customer = {
      name: form.email.split("@")[0],
      email: form.email,
      phone: "",
    };

    localStorage.setItem(
      "veyraaCustomer",
      JSON.stringify(customer)
    );

    localStorage.setItem("veyraaLoggedIn", "true");

    setMessage("Login successful.");

    setTimeout(() => {
      onLoginSuccess(customer);
    }, 500);
  }

  function continueWithGoogle() {
    setMessage(
      "Google sign-in will be connected when the authentication backend is integrated."
    );
  }

  return (
    <div className="customer-auth-overlay">
      <div className="customer-auth-card">

        <button
          className="customer-auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="customer-auth-header">

          <span className="customer-auth-eyebrow">
            VEYRAA ACCOUNT
          </span>

          <h2>
            {mode === "login"
              ? "Welcome Back"
              : "Create Your Account"}
          </h2>

          <p>
            {mode === "login"
              ? "Sign in to continue your fashion journey."
              : "Join Veyraa for a personalized fashion experience."}
          </p>

        </div>

        <div className="customer-auth-tabs">

          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
          >
            Sign Up
          </button>

        </div>

        <form
          className="customer-auth-form"
          onSubmit={handleSubmit}
        >

          {mode === "signup" && (
            <>
              <label>
                Full Name
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>
            </>
          )}

          <label>
            Email Address
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          {mode === "signup" && (
            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </label>
          )}

          {mode === "login" && (
            <div className="customer-auth-options">

              <label className="remember-option">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setMessage(
                    "Password reset will be connected with the authentication service."
                  )
                }
              >
                Forgot password?
              </button>

            </div>
          )}

          {message && (
            <div className="customer-auth-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="customer-auth-submit"
          >
            {mode === "login"
              ? "Login to Veyraa →"
              : "Create Account →"}
          </button>

        </form>

        <div className="customer-auth-divider">
          <span>OR</span>
        </div>

        <button
          className="google-login-button"
          type="button"
          onClick={continueWithGoogle}
        >
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <p className="customer-auth-switch">

          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {mode === "login"
              ? " Create one"
              : " Login"}
          </button>

        </p>

      </div>
    </div>
  );
}

export default CustomerAuth;