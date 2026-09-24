function DiscoverySection({ discovery }) {

  const discoveryImages = {
    "New Arrivals":
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",

    "Trending Now":
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85",

    "Best Sellers":
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85",

    Recommended:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85",

    "Shop By Vibe":
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85",

    "Deals & Offers":
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1200&q=85",

    "Shop By Occasion":
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",

    "Shop By Color":
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=85"
  };

  /* ==========================================
     DISCOVERY CARD → SEPARATE PAGE ROUTES
     ========================================== */

  const discoveryRoutes = {
    "New Arrivals": "/new-arrivals",
    "Trending Now": "/trending",
    "Best Sellers": "/best-sellers",
    Recommended: "/recommended",
    "Shop By Vibe": "/shop-by-vibe",
    "Deals & Offers": "/deals",
    "Shop By Occasion": "/shop-by-occasion",
    "Shop By Color": "/shop-by-color"
  };

  const openDiscoveryPage = (title) => {
    const route = discoveryRoutes[title];

    if (route) {
      window.location.href = route;
    }
  };

  return (
    <section className="discovery-section" id="new-arrivals">

      <div className="section-heading discovery-heading">

        <span className="eyebrow">
          DISCOVER
        </span>

        <h2>
          Fashion, Your Way
        </h2>

        <p>
          Explore collections curated around your style,
          mood and everyday moments.
        </p>

      </div>

      <div className="discovery-grid">

        {discovery.map((item) => (

          <article
            className="discovery-card"
            key={item.title}

            onClick={() => openDiscoveryPage(item.title)}

            style={{
              cursor: discoveryRoutes[item.title]
                ? "pointer"
                : "default"
            }}
          >

            <img
              src={
                discoveryImages[item.title] ||
                "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=85"
              }
              alt={item.title}
            />

            <div className="discovery-content">

              <span className="discovery-label">
                VEYRAA EDIT
              </span>

              <h3>
                {item.title}
              </h3>

              <p>
                {item.text}
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openDiscoveryPage(item.title);
                }}
              >
                Explore Collection →
              </button>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}

export default DiscoverySection;