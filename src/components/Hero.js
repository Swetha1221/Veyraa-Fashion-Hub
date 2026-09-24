import React, { useEffect, useState } from "react";
import "./Hero.css";

const slides = [
  {
    image: "/hero/hero1.png",
    tag: "EFFORTLESS EVERYDAY STYLE",
    title: "Dress With Confidence. Own Your Style.",
    description:
      "From everyday essentials to statement pieces, discover looks made for you.",
    link: "/women",
  },
  {
    image: "/hero/hero2.png",
    tag: "ETHNIC ELEGANCE",
    title: "Make Every Moment More Beautiful.",
    description:
      "Discover elegant ethnic styles designed for celebrations and unforgettable moments.",
    link: "/women",
  },
  {
    image: "/hero/hero3.png",
    tag: "YOUR STYLE. YOUR STATEMENT.",
    title: "Express Yourself With Every Look.",
    description:
      "Explore fashion that brings your personality and individuality to life.",
    link: "/women",
  },
  {
    image: "/hero/hero4.png",
    tag: "STYLE FOR EVERY GENERATION",
    title: "Fashion That Grows With You.",
    description:
      "Discover stylish looks thoughtfully curated for every generation.",
    link: "/men",
  },
  {
    image: "/hero/hero5.png",
    tag: "MODERN MEN'S EDIT",
    title: "Own Your Look. Own Your Confidence.",
    description:
      "Sharp essentials and modern styles designed for the man of today.",
    link: "/kids",
  },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  const handleShopNow = () => {
    window.location.href = slide.link;
  };

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url("${slide.image}")`,
      }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <span className="hero-tag">{slide.tag}</span>

        <h1>{slide.title}</h1>

        <p>{slide.description}</p>

        <div className="hero-buttons">
          <button type="button" onClick={handleShopNow}>
            SHOP NOW →
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              window.location.href = "/befitting-style";
            }}
          >
            FIND MY STYLE
          </button>
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={index === currentSlide ? "active" : ""}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;