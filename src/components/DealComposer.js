import React from "react";

function DealComposer({ deal }) {
  return (
    <section className="deal-composer-section">

      <div className="deal-composer-content" id="deal-composer">

        <span className="section-eyebrow">
          VEYRAA SMART SHOPPING
        </span>

        <h2>
          Compose
          <br />
          Your Deal
        </h2>

        <p>
          Build your own fashion combination and discover
          the value of buying your complete look together.
        </p>

        <div className="deal-items">

          {deal.items.map((item) => (
            <div className="deal-item" key={item.name}>

              <span>{item.type}</span>

              <strong>{item.name}</strong>

              <span>₹{item.price}</span>

            </div>
          ))}

        </div>

        <div className="deal-summary">

          <div>
            <span>Individual Total</span>
            <strong>₹{deal.individualTotal}</strong>
          </div>

          <div>
            <span>Bundle Price</span>
            <strong>₹{deal.bundlePrice}</strong>
          </div>

          <div className="deal-saving">
            <span>You Save</span>
            <strong>₹{deal.savings}</strong>
          </div>

        </div>

        <button className="primary-button">
          Build My Deal →
        </button>

      </div>

    </section>
  );
}

export default DealComposer;
