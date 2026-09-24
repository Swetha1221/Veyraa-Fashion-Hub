import React from "react";

const features = [
  {
    number: "01",
    icon: "✦",
    tag: "PERSONALIZED MATCHING",
    title: "Fashion Matchmaker",
    subtitle: "Find your fashion match",
    description:
      "Answer a few simple questions and Veyraa matches you with products based on what you need, where you are shopping for, your style and budget.",
    points: [
      "What are you shopping for?",
      "Where are you planning to wear it?",
      "Style & budget based matching",
    ],
    route: "/ai/fashion-matchmaker",
  },

  {
    number: "02",
    icon: "◇",
    tag: "VIBE DISCOVERY",
    title: "Pick My Vibe",
    subtitle: "Shop the mood you're in",
    description:
      "Choose how you want to dress today and discover fashion that matches your selected vibe.",
    points: [
      "Cute • Bold • Street",
      "Elegant • Formal • Girly",
      "Vibe-based product discovery",
    ],
    route: "/ai/pick-my-vibe",
  },

  {
    number: "03",
    icon: "◇",
    tag: "OUTFIT BUILDER",
    title: "Complete My Look",
    subtitle: "Build the entire outfit",
    description:
      "Select one fashion piece and Veyraa creates a coordinated styling plan with relevant pieces that actually belong with it.",
    points: [
      "Select your main fashion piece",
      "Relevant matching products",
      "Build and order the complete look",
    ],
    route: "/ai/complete-my-look",
  },

  {
    number: "04",
    icon: "◎",
    tag: "FIT PERSONALIZATION",
    title: "Fit Profile Check",
    subtitle: "Recommendations made for your fit",
    description:
      "Create your one-time fit profile using your measurements and preferences to receive more relevant product suggestions.",
    points: [
      "One-time measurement profile",
      "Personalized fit guidance",
      "Product recommendations",
    ],
    route: "/ai/fit-profile",
  },
];

function AIFashionStudio() {
  const openFeature = (route) => {
    window.location.href = route;
  };

  return (
    <section className="veyraa-ai-home-section" id="ai-fashion">

      <div className="veyraa-ai-heading">

        <span className="veyraa-ai-eyebrow">
          VEYRAA AI STUDIO
        </span>

        <h2>
          Fashion that
          <br />
          understands you.
        </h2>

        <p>
          Discover smarter ways to find, style and choose fashion
          that fits what you actually need.
        </p>

      </div>


      <div className="veyraa-ai-grid">

        {features.map((feature) => (

          <article
            className="veyraa-ai-card"
            key={feature.title}
            onClick={() => openFeature(feature.route)}
          >

            <div className="veyraa-ai-card-top">

              <span className="veyraa-ai-number">
                {feature.number}
              </span>

              <div className="veyraa-ai-icon">
                {feature.icon}
              </div>

              <span className="veyraa-ai-arrow">
                ↗
              </span>

            </div>


            <div className="veyraa-ai-card-body">

              <span className="veyraa-ai-tag">
                {feature.tag}
              </span>

              <h3>
                {feature.title}
              </h3>

              <h4>
                {feature.subtitle}
              </h4>

              <p>
                {feature.description}
              </p>


              <div className="veyraa-ai-points">

                {feature.points.map((point) => (
                  <span key={point}>
                    ✓ {point}
                  </span>
                ))}

              </div>

            </div>


            <div className="veyraa-ai-card-footer">

              <span>
                Explore experience
              </span>

              <span>
                →
              </span>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}

export default AIFashionStudio;