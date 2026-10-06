import React from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductCategories from "../components/ProductCategories";
import Footer from "../components/Footer";

import {
  categories,
  productTypes,
} from "../data/homeData";

function Home() {
  return (
    <div className="home-page">

      <Navbar />

      <main>

        {/* HERO */}
        <Hero />


        {/* PROMOTIONAL OFFERS */}
        <section className="promo-strip"  id="deals-valid">

          <div className="promo-card">

            <span className="promo-small">
              LIMITED TIME
            </span>

            <h3>
              Get up to 60% OFF
            </h3>

            <p>
              On selected fashion & accessories
            </p>

            <span className="promo-arrow">
              →
            </span>

          </div>


          <div className="promo-card">

            <span className="promo-small">
              SPECIAL OFFER
            </span>

            <h3>
              ₹60 OFF
            </h3>

            <p>
              On your next fashion order
            </p>

          </div>


          <div className="promo-card">

            <span className="promo-small">
              VEYRAA EDIT
            </span>

            <h3>
              Fresh Styles
            </h3>

            <p>
              Discover the latest fashion
            </p>

          </div>

        </section>


        {/* LOCKED DEALS */}
        <section className="locked-deals">

          <div className="locked-content" id="locked-deals">

            <span>
              EXCLUSIVE VEYRAA EVENT
            </span>

            <h2>
              LOCKED DEALS
            </h2>

            <p>
              Sale starts tonight • Limited fashion offers
            </p>

          </div>

          <button className="locked-button" onClick={() => { window.location.href = "/deals"; }}>
            View Deals →
          </button>

        </section>


        {/* EXISTING CATEGORY SECTION */}
        <CategorySection categories={categories} />


        {/* SHOP BY PRODUCT */}
        <ProductCategories productTypes={productTypes} />


        {/* DO NOT CHANGE THIS */}
        {/* FASHION YOUR WAY */}
       


       


    




      
      </main>

      <Footer />

    </div>
  );
}

export default Home;
