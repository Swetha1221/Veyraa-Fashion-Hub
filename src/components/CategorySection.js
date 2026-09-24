import React from "react";

function CategorySection({ categories }) {
  return (
    <section className="section" id="categories">

      <div className="section-header">
        <span>EXPLORE</span>

        <h2>Shop By Category</h2>

        <p>
          Fashion collections designed for every generation.
        </p>
      </div>

      <div className="category-grid">

        {categories.map((category) => (
          <article
            className="category-card"
            key={category.name}

            onClick={() => {
              if (category.name === "WOMEN") {
                window.location.href = "/women";
              } else if (category.name === "MEN") {
                window.location.href = "/men";
              } else if (category.name === "KIDS") {
                window.location.href = "/kids";
              }
            }}

            style={{
              cursor:
                category.name === "WOMEN" ||
                category.name === "MEN" ||
                category.name === "KIDS"
                  ? "pointer"
                  : "default",
            }}
          >

            <img
              src={category.image}
              alt={category.title}
            />

            <div className="category-overlay">

              <span>{category.name}</span>

              <h3>{category.title}</h3>

              <p>{category.description}</p>

              {/* REDIRECT BUTTON */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  if (category.name === "WOMEN") {
                    window.location.href = "/women";
                  } else if (category.name === "MEN") {
                    window.location.href = "/men";
                  } else if (category.name === "KIDS") {
                    window.location.href = "/kids";
                  }
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

export default CategorySection;