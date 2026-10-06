import React from "react";

function Footer() {
  return (
    <footer
      style={{
        background: "#120e0f",
        color: "#fff",
        width: "100%",
        marginTop: 0,
        fontFamily: "Arial, sans-serif",
      }}
    >

      {/* ================= MAIN FOOTER ================= */}
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "58px 40px 35px",
          boxSizing: "border-box",
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 0.8fr 1.2fr",
            gap: "90px",
            alignItems: "start",
          }}
        >

          {/* ================= BRAND ================= */}
          <div>

            <img
              src="/logo512.png"
              alt="Veyraa Fashion Hub"
              style={{
                width: "205px",
                height: "auto",
                display: "block",
                background: "#fff",
                borderRadius: "6px",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />

            <p
              style={{
                margin: "20px 0 22px",
                maxWidth: "330px",
                color: "#c8bfc1",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              Fashion that understands your style,
              personality and everyday vibe.
            </p>


            {/* SOCIAL ICONS */}
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >

              {["◎", "f", "p", "▶", "in"].map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  disabled
                  aria-label="Social media"
                  style={{
                    background: "transparent",
                    padding: 0,
                    fontFamily: "inherit",
                    width: "36px",
                    height: "36px",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f0a0bd",
                    textDecoration: "none",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                >
                  {icon}
                </button>
              ))}

            </div>

          </div>


          {/* ================= SHOP ================= */}
          <div>

            <h3
              style={{
                margin: "0 0 10px",
                fontFamily: "Georgia, serif",
                fontSize: "22px",
                color: "#fff",
              }}
            >
              SHOP
            </h3>

            <div
              style={{
                width: "38px",
                height: "2px",
                background: "#e99ab7",
                marginBottom: "22px",
              }}
            />

            {[
              "Women",
              "Men",
              "Kids",
              "Trending",
              "Deals",
            ].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{
                  display: "block",
                  marginBottom: "14px",
                  color: "#c8bfc1",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "color 0.2s ease",
                }}
              >
                {item}
              </a>
            ))}

          </div>


          {/* ================= CONTACT ================= */}
          <div id="contact">

            <h3
              style={{
                margin: "0 0 10px",
                fontFamily: "Georgia, serif",
                fontSize: "22px",
                color: "#fff",
              }}
            >
              CONTACT US
            </h3>

            <div
              style={{
                width: "38px",
                height: "2px",
                background: "#e99ab7",
                marginBottom: "22px",
              }}
            />

            <p
              style={{
                margin: "0 0 14px",
                color: "#c8bfc1",
                fontSize: "14px",
              }}
            >
              📍 Coimbatore, Tamil Nadu
            </p>

            <p
              style={{
                margin: "0 0 14px",
                color: "#c8bfc1",
                fontSize: "14px",
              }}
            >
              📞 +91 98765 43210
            </p>

            <p
              style={{
                margin: "0 0 14px",
                color: "#c8bfc1",
                fontSize: "14px",
              }}
            >
              ✉ support@veyraa.com
            </p>

            <p
              style={{
                margin: "0 0 18px",
                color: "#c8bfc1",
                fontSize: "14px",
              }}
            >
              💬 Live Chat
            </p>


            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "11px 20px",
                border: "1px solid #e99ab7",
                borderRadius: "25px",
                color: "#fff",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "600",
                transition: "all 0.2s ease",
              }}
            >
              Contact Support →
            </a>

          </div>

        </div>


        {/* ================= COMMUNITY ================= */}
        <div
          style={{
            marginTop: "42px",
            padding: "22px 25px",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "30px",
            boxSizing: "border-box",
          }}
        >

          {/* COMMUNITY TEXT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              minWidth: 0,
            }}
          >

            <div
              style={{
                width: "42px",
                height: "42px",
                minWidth: "42px",
                border: "1px solid #e99ab7",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e99ab7",
                fontSize: "17px",
              }}
            >
              ✉
            </div>


            <div>

              <h3
                style={{
                  margin: 0,
                  fontFamily: "Georgia, serif",
                  fontSize: "19px",
                  color: "#fff",
                }}
              >
                Join the Veyraa Community
              </h3>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#aaa0a3",
                  fontSize: "12px",
                }}
              >
                Get exclusive deals, new arrivals and style inspiration.
              </p>

            </div>

          </div>


          {/* NEWSLETTER */}
          <div
            style={{
              display: "flex",
              width: "52%",
              maxWidth: "560px",
              minWidth: "350px",
            }}
          >

            <input
              type="email"
              placeholder="Enter your email address"
              style={{
                flex: 1,
                height: "44px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRight: "none",
                borderRadius: "25px 0 0 25px",
                padding: "0 18px",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box",
                fontSize: "13px",
              }}
            />

            <button
              style={{
                height: "44px",
                padding: "0 25px",
                border: "none",
                borderRadius: "0 25px 25px 0",
                background: "#e99ab7",
                color: "#160f11",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe →
            </button>

          </div>

        </div>


        {/* ================= BOTTOM ================= */}
        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: "20px",
          }}
        >

          {/* COPYRIGHT */}
          <div
            style={{
              color: "#807679",
              fontSize: "11px",
              lineHeight: "1.7",
            }}
          >
            <div>© 2026 Veyraa Fashion Hub</div>
            <div>All Rights Reserved.</div>
          </div>


          {/* CENTER BRAND MESSAGE */}
          <div
            style={{
              color: "#fff",
              fontFamily: "Georgia, serif",
              fontSize: "15px",
              whiteSpace: "nowrap",
            }}
          >
            Fashion

            <span
              style={{
                color: "#e99ab7",
                margin: "0 9px",
              }}
            >
              •
            </span>

            Technology

            <span
              style={{
                color: "#e99ab7",
                margin: "0 9px",
              }}
            >
              •
            </span>

            Personalization
          </div>


          {/* LEGAL LINKS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "8px",
              color: "#807679",
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          >

            <button
              type="button"
              disabled
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                font: "inherit",
                color: "#807679",
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </button>

            <span>|</span>

            <button
              type="button"
              disabled
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                font: "inherit",
                color: "#807679",
                textDecoration: "none",
              }}
            >
              Terms of Service
            </button>

            <span>|</span>

            <button
              type="button"
              disabled
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                font: "inherit",
                color: "#807679",
                textDecoration: "none",
              }}
            >
              Cookies
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
