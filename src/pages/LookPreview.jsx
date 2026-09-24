import React, { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./LookPreview.css";

function LookPreview() {
  const [look] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("veyraaLookPreview")) || [];
    } catch (error) {
      return [];
    }
  });

  const total = useMemo(() => look.reduce((sum, product) => sum + (Number(product.price) || 0), 0), [look]);

  const addEntireLook = (redirect = true) => {
    const savedCart = JSON.parse(localStorage.getItem("veyraaCart")) || [];
    const updatedCart = [...savedCart];
    look.forEach((product) => {
      const existing = updatedCart.find((item) => String(item.id ?? item.name) === String(product.id ?? product.name));
      if (existing) existing.quantity = (existing.quantity || 1) + 1;
      else updatedCart.push({ ...product, quantity: 1 });
    });
    localStorage.setItem("veyraaCart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("veyraa:cart-updated"));
    if (redirect) window.location.href = "/cart";
  };

  const buyEntireLook = () => {
    addEntireLook(false);
    window.location.href = "/billing";
  };

  return (
    <div className="look-preview-page">
      <Navbar />
      <main className="look-preview-main">
        <a className="look-preview-back" href="/befitting-your-style">← Back to Befitting Your Style</a>
        <header className="look-preview-header">
          <span>VEYRAA CURATED EDIT</span>
          <h1>Complete The Look</h1>
          <p>Your selected pieces, styled together and ready to shop.</p>
        </header>
        {look.length ? (
          <>
            <section className="look-preview-grid">
              {look.map((product, index) => (
                <React.Fragment key={`${product.id}-${index}`}>
                  <article className="look-preview-product">
                    <img src={product.image} alt={product.name} />
                    <span>{index === 0 ? "TOP" : index === 1 ? "BOTTOM" : "ACCESSORY"}</span>
                    <h2>{product.name}</h2>
                    <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
                  </article>
                  {index < look.length - 1 && <div className="look-preview-plus">+</div>}
                </React.Fragment>
              ))}
            </section>
            <section className="look-preview-summary">
              <span>Total Look Price</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
              <div>
                <button type="button" className="look-preview-primary" onClick={addEntireLook}>Add Entire Look to Cart</button>
                <button type="button" className="look-preview-secondary" onClick={buyEntireLook}>Buy Entire Look Now</button>
                <a className="look-preview-secondary" href="/befitting-your-style">Change Look</a>
              </div>
            </section>
          </>
        ) : (
          <section className="look-preview-empty"><h2>Your look is waiting to be styled.</h2><a href="/befitting-your-style">Return to style builder</a></section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default LookPreview;
