import React from "react";

function Footer() {
  return (
    <footer className="footer">

      {/* MAIN FOOTER */}
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">

          <img
            src="/logo512.png"
            alt="Veyraa Fashion Hub"
            className="footer-logo"
          />

          <p>
            Fashion that understands your style,
            personality and everyday vibe.
          </p>

          {/* SOCIAL ICONS */}
          <div className="footer-social">
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Pinterest">p</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>

        </div>


        {/* SHOP */}
        <div className="footer-column">

          <h3>SHOP</h3>

          <span className="footer-line"></span>

          <a href="#categories">Women</a>
          <a href="#categories">Men</a>
          <a href="#categories">Kids</a>
          <a href="#trending">Trending</a>
          <a href="#deals">Deals</a>

        </div>


        {/* VEYRAA AI */}
        <div className="footer-column">

          <h3>VEYRAA AI</h3>

          <span className="footer-line"></span>

          <a href="#ai-fashion">Fashion Matchmaker</a>
          <a href="#ai-fashion">AI Style Twin</a>
          <a href="#complete-look">Complete My Look</a>
          <a href="#ai-fashion">Virtual Try-On</a>
          <a href="#ai-fashion">Digital Closet</a>

        </div>


        {/* CONTACT */}
        <div className="footer-column contact-column">

          <h3>CONTACT US</h3>

          <span className="footer-line"></span>

          <p>📍 Coimbatore, Tamil Nadu</p>
          <p>📞 +91 98765 43210</p>
          <p>✉ support@veyraa.com</p>
          <p>💬 Live Chat</p>

          <a href="#contact" className="contact-button">
            Contact Support →
          </a>

        </div>

      </div>


      {/* COMMUNITY */}
      <div className="footer-community">

        <div className="community-text">

          <span className="community-icon">✉</span>

          <div>
            <h3>Join the Veyraa Community</h3>

            <p>
              Get exclusive deals, new arrivals and style inspiration.
            </p>
          </div>

        </div>


        <div className="newsletter">

          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button>
            Subscribe →
          </button>

        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <div className="footer-copy">
          <span>© 2026 Veyraa Fashion Hub</span>
          <span>All Rights Reserved.</span>
        </div>


        {/* CENTER BRAND MESSAGE */}
        <div className="footer-center-text">
          Fashion <span>•</span> Technology <span>•</span> Personalization
        </div>


        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <span>|</span>
          <a href="#">Terms of Service</a>
          <span>|</span>
          <a href="#">Cookies</a>
        </div>

      </div>

    </footer>
  );
}

export default Footer;