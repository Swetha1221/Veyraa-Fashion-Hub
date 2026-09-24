import React from "react";

function ProductSection({ products }) {
  return (
    <section className="product-section" id="trending">

      <div className="section-header">
        <span>CURATED FOR YOU</span>

        <h2>Trending Fashion</h2>

        <p>
          Discover pieces that are making an impression right now.
        </p>
      </div>

      <div className="product-grid">

        {products.map((product) => (
          <article className="product-card" key={product.id}>

            <div className="product-image-wrapper">

              <img
                src={product.image}
                alt={product.name}
              />

              {product.badge && (
                <span className="product-badge">
                  {product.badge}
                </span>
              )}

              <button
                className="wishlist-button"
                aria-label={`Add ${product.name} to wishlist`}
              >
                ♡
              </button>

            </div>

            <div className="product-info">

              <span className="product-category">
                {product.category}
              </span>

              <h3>{product.name}</h3>

              <div className="product-meta">

                <strong>
                  ₹{product.price}
                </strong>

                {product.originalPrice && (
                  <del>
                    ₹{product.originalPrice}
                  </del>
                )}

              </div>

              {/* Link to the detail page using the product's stable data id. */}
              <a
                className="view-product-button"
                href={`/products/${product.id}`}
              >
                View Product →
              </a>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
}

export default ProductSection;