function ProductCategories({ productTypes }) {

  const categoryImages = {
    "T-Shirts":
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",

    Shirts:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=85",

    Tops:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85",

    Dresses:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85",

    Frocks:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=85",

    Jeans:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85",

    Trousers:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=85",

    Skirts:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=85",

    Salwar:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85",

    Sarees:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85",

    Kurtis:
      "https://images.pexels.com/photos/35521738/pexels-photo-35521738.jpeg?auto=compress&cs=tinysrgb&w=700",

    Chudidars:
      "https://images.pexels.com/photos/18878870/pexels-photo-18878870.jpeg?auto=compress&cs=tinysrgb&w=700",

    Lehengas:
      "https://images.pexels.com/photos/38876954/pexels-photo-38876954.jpeg?auto=compress&cs=tinysrgb&w=700",

    Kurtas:
      "https://images.pexels.com/photos/29138637/pexels-photo-29138637.jpeg?auto=compress&cs=tinysrgb&w=700",

    Sherwanis:
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=700&q=85",

    Jackets:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85",

    Blazers:
      "https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=700&q=85",

    Footwear:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",

    Handbags:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85",

    Jewellery:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=85",

    Watches:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",

    Sunglasses:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85",

    Belts:
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=700&q=85"
  };

  /* =====================================================
     HOME PRODUCT CATEGORY → PAGE ROUTES
     ===================================================== */

  const categoryRoutes = {
    "T-Shirts": "/women/tshirts",
    "Shirts": "/men/shirts",
    "Tops": "/women/tops",
    "Dresses": "/women/dresses",
    "Frocks": "/women/frocks",
    "Jeans": "/women/jeans",
    "Trousers": "/women/trousers",
    "Skirts": "/women/skirts",
    "Kurtis": "/women/kurtis",
    "Chudidars": "/women/chudidars",
    "Salwar": "/women/salwar",
    "Sarees": "/women/sarees",
    "Lehengas": "/women/lehengas",

    "Kurtas": "/men/kurtas",
    "Sherwanis": "/men/sherwanis",
    "Jackets": "/women/jackets",
    "Blazers": "/men/blazers",

    "Footwear": "/women/footwear",
    "Handbags": "/women/handbags",
    "Jewellery": "/women/jewellery",
    "Watches": "/women/watches",
    "Sunglasses": "/women/sunglasses",
    "Belts": "/women/belts"
  };

  return (
    <section className="product-categories-section">

      <div className="section-heading">

        <span className="eyebrow">
          FASHION CATEGORIES
        </span>

        <h2>
          Shop By Product
        </h2>

        <p>
          Find the perfect piece for every mood, moment and wardrobe.
        </p>

      </div>

      <div className="product-type-grid">

        {productTypes.map((type) => (

          <article
            className="product-type-card"
            key={type}

            /* ===============================
               CLICK CATEGORY
               =============================== */

            onClick={() => {

              const route = categoryRoutes[type];

              if (route) {
                window.location.href = route;
              }

            }}

            style={{
              cursor: categoryRoutes[type]
                ? "pointer"
                : "default"
            }}
          >

            <img
              src={
                categoryImages[type] ||
                "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=85"
              }
              alt={type}
            />

            <div className="product-card-overlay">

              <span className="product-category-name">
                {type}
              </span>

              <span className="category-arrow">
                Explore →
              </span>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}

export default ProductCategories;