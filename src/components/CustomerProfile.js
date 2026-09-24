import React, { useEffect, useMemo, useState } from "react";
import "./CustomerProfile.css";
import {
  getCurrentCustomer,
  getSavedFitProfile,
  getFitRecommendations,
} from "../data/customerAccount";
import { addToCart } from "../data/unifiedCatalog";

function CustomerProfile({ onClose, onOpenFitProfile }) {
  const currentCustomer = getCurrentCustomer();
  const savedName = currentCustomer.name || "Customer";

  const savedProfile = JSON.parse(
    localStorage.getItem("veyraaCustomerProfile") || "{}"
  );

  const [profile, setProfile] = useState({
    name: savedProfile.name || savedName,
    email: savedProfile.email || currentCustomer.email || "",
    phone: savedProfile.phone || currentCustomer.phone || "",
    dob: savedProfile.dob || "",
    gender: savedProfile.gender || "",
    style: savedProfile.style || "",
    size: savedProfile.size || "",
    address: savedProfile.address || "",
  });

  const [fitProfile, setFitProfile] = useState(() =>
    getSavedFitProfile(currentCustomer.id)
  );

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleFitUpdate = () => {
      setFitProfile(getSavedFitProfile(currentCustomer.id));
    };
    window.addEventListener("storage", handleFitUpdate);
    window.addEventListener("veyraa:fit-profile-updated", handleFitUpdate);
    return () => {
      window.removeEventListener("storage", handleFitUpdate);
      window.removeEventListener("veyraa:fit-profile-updated", handleFitUpdate);
    };
  }, [currentCustomer.id]);

  const recommendations = useMemo(() => {
    return getFitRecommendations(fitProfile, 4);
  }, [fitProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "veyraaCustomerProfile",
      JSON.stringify(profile)
    );

    if (currentCustomer.id && currentCustomer.id !== "guest") {
      localStorage.setItem(
        `veyraaCustomerProfile_${currentCustomer.id}`,
        JSON.stringify(profile)
      );
    }

    localStorage.setItem(
      "veyraaCustomerName",
      profile.name
    );

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("veyraa:auth-updated"));

    setSaved(true);
  };

  return (
    <div className="customer-profile-panel">
      {/* HEADER */}
      <div className="customer-profile-header">
        <button
          type="button"
          className="profile-back-button"
          onClick={onClose}
          aria-label="Back"
        >
          ←
        </button>

        <div>
          <span className="profile-eyebrow">VEYRAA CUSTOMER</span>
          <h2>My Profile</h2>
          <p>Manage your personal information, fit profile and fashion preferences.</p>
        </div>
      </div>

      {/* AVATAR SECTION */}
      <div className="profile-avatar-section">
        <div className="profile-large-avatar">
          {(profile.name || "C").charAt(0).toUpperCase()}
        </div>

        <div>
          <h3>{profile.name || "Customer"}</h3>
          <p>Your Veyraa fashion profile</p>
        </div>
      </div>

      <form className="customer-profile-form" onSubmit={handleSave}>
        {/* PERSONAL INFORMATION */}
        <div className="profile-section-title">
          PERSONAL INFORMATION
        </div>

        <div className="profile-form-grid">
          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="profile-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="profile-field">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="profile-field">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label>Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* FASHION PREFERENCES */}
        <div className="profile-section-title">
          FASHION PREFERENCES
        </div>

        <div className="profile-form-grid">
          <div className="profile-field">
            <label>Preferred Style</label>
            <select
              name="style"
              value={profile.style}
              onChange={handleChange}
            >
              <option value="">Select preferred style</option>
              <option value="Casual">Casual</option>
              <option value="Contemporary">Contemporary</option>
              <option value="Traditional">Traditional</option>
              <option value="Party Wear">Party Wear</option>
              <option value="Formal">Formal</option>
              <option value="Streetwear">Streetwear</option>
            </select>
          </div>

          <div className="profile-field">
            <label>Preferred Size</label>
            <select
              name="size"
              value={profile.size}
              onChange={handleChange}
            >
              <option value="">Select size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
        </div>

        {/* DELIVERY INFORMATION */}
        <div className="profile-section-title">
          DELIVERY INFORMATION
        </div>

        <div className="profile-field profile-address-field">
          <label>Saved Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="Enter your preferred delivery address"
            rows="3"
          />
        </div>

        {/* FIT PROFILE SECTION */}
        <div className="profile-section-title">
          FIT PROFILE
        </div>

        <div className="profile-fit-card">
          <div className="profile-fit-card-header">
            <h4>Your saved measurements</h4>
            <button
              type="button"
              className="profile-edit-fit-btn"
              onClick={onOpenFitProfile}
            >
              {fitProfile?.isCompleted ? "Edit Fit Profile" : "Complete Fit Profile"}
            </button>
          </div>

          {fitProfile?.isCompleted ? (
            <div className="profile-measurements-table">
              <div className="measurement-row">
                <span>Height</span>
                <strong>{fitProfile.height ? `${fitProfile.height} cm` : "—"}</strong>
              </div>
              <div className="measurement-row">
                <span>Weight</span>
                <strong>{fitProfile.weight ? `${fitProfile.weight} kg` : "—"}</strong>
              </div>
              <div className="measurement-row">
                <span>Chest/Bust</span>
                <strong>{fitProfile.chest ? `${fitProfile.chest} cm` : "—"}</strong>
              </div>
              <div className="measurement-row">
                <span>Waist</span>
                <strong>{fitProfile.waist ? `${fitProfile.waist} cm` : "—"}</strong>
              </div>
              <div className="measurement-row">
                <span>Hip</span>
                <strong>{fitProfile.hip ? `${fitProfile.hip} cm` : "—"}</strong>
              </div>
              <div className="measurement-row">
                <span>Shoulder Width</span>
                <strong>{fitProfile.shoulder ? `${fitProfile.shoulder} cm` : "—"}</strong>
              </div>
              <div className="measurement-row">
                <span>Arm Length</span>
                <strong>{fitProfile.armLength ? `${fitProfile.armLength} cm` : "—"}</strong>
              </div>
            </div>
          ) : (
            <p className="profile-fit-empty-text">
              No measurements saved yet. Complete your Fit Profile once to receive personalized size and style recommendations.
            </p>
          )}
        </div>

        {/* RECOMMENDED FOR YOUR FIT */}
        {fitProfile?.isCompleted && recommendations.length > 0 && (
          <div className="profile-recommendations-section">
            <div className="profile-section-title">
              RECOMMENDED FOR YOUR FIT
            </div>
            <p className="profile-recommendations-subtitle">
              Selected based on your saved fit preferences.
            </p>

            <div className="profile-recommendations-grid">
              {recommendations.map((item) => (
                <article key={item.id} className="profile-rec-card">
                  <div
                    className="profile-rec-image-wrap"
                    onClick={() => {
                      window.location.href = `/products/${encodeURIComponent(item.id)}`;
                    }}
                  >
                    <img src={item.resolvedImage} alt={item.name} loading="lazy" />
                    <span className="profile-rec-badge">{item.fitBadge}</span>
                  </div>

                  <div className="profile-rec-info">
                    <span className="profile-rec-category">
                      {item.audience} • {item.categoryGroup}
                    </span>
                    <h5
                      onClick={() => {
                        window.location.href = `/products/${encodeURIComponent(item.id)}`;
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </h5>

                    <div className="profile-rec-price-row">
                      <strong>₹{item.price.toLocaleString("en-IN")}</strong>
                      {item.originalPrice > item.price && (
                        <del>₹{item.originalPrice.toLocaleString("en-IN")}</del>
                      )}
                    </div>

                    <button
                      type="button"
                      className="profile-rec-cart-btn"
                      onClick={() => {
                        addToCart(item);
                        alert(`"${item.name}" added to cart ✓`);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* SAVE AREA */}
        <div className="profile-save-area">
          {saved && (
            <span className="profile-success">
              ✓ Profile saved successfully
            </span>
          )}

          <button
            type="submit"
            className="account-primary-button profile-save-button"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerProfile;