import React, { useMemo, useState } from "react";

import { products as womenProducts } from "./WomenFashion";
import { products as menProducts } from "./MenCategory";
import { kidsProducts } from "./KidsCategory";

const catalog = [
  ...womenProducts.map((product) => ({
    ...product,
    audience: "Women",
  })),

  ...menProducts.map((product) => ({
    ...product,
    audience: "Men",
  })),

  ...kidsProducts.map((product) => ({
    ...product,
    audience: product.gender || "Kids",
  })),
];

/* =========================================================
   IMAGE
========================================================= */

function imageFor(product) {
  const raw = String(product?.image || "").trim();

  if (
    /^(https?:|data:|blob:)/i.test(raw) ||
    /^\/(women|men|kids)\//i.test(raw)
  ) {
    return encodeURI(raw);
  }

  return encodeURI(
    `/${String(product?.audience || "women").toLowerCase()}/${raw.replace(
      /^\/+/,
      ""
    )}`
  );
}

/* =========================================================
   PRODUCT TEXT
========================================================= */

function productText(product) {
  return [
    product?.name,
    product?.type,
    product?.category,
    product?.material,
    product?.colour,
    product?.color,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/* =========================================================
   MAIN FASHION TYPE
========================================================= */

function detectMainType(product) {
  const text = productText(product);

  if (/saree|sari/.test(text)) return "saree";

  if (/lehenga|ghagra/.test(text)) return "lehenga";

  if (/kurti|kurta|chudidar|salwar/.test(text)) return "kurti";

  if (/dress|gown|frock|jumpsuit/.test(text)) return "dress";

  if (/shirt|t-shirt|tee|polo/.test(text)) return "shirt";

  if (/trouser|pant|jeans|denim|shorts|skirt/.test(text)) {
    return "bottom";
  }

  if (/blazer|jacket|coat/.test(text)) return "layer";

  if (/sherwani|ethnic wear/.test(text)) return "ethnic";

  return "fashion";
}

function isMainFashionPiece(product) {
  return [
    "saree",
    "lehenga",
    "kurti",
    "dress",
    "shirt",
    "bottom",
    "layer",
    "ethnic",
    "fashion",
  ].includes(detectMainType(product));
}

/* =========================================================
   RELEVANT OUTFIT ROLES
========================================================= */

function getLookRoles(main) {
  const type = detectMainType(main);
  const audience = main?.audience;

  /* WOMEN */

  if (audience === "Women") {
    if (type === "saree") {
      return [
        {
          role: "JEWELLERY",
          words: [
            "jewellery",
            "jewelry",
            "earring",
            "necklace",
            "bangle",
            "bracelet",
          ],
        },
        {
          role: "BAG",
          words: [
            "bag",
            "clutch",
            "handbag",
            "purse",
          ],
        },
        {
          role: "FOOTWEAR",
          words: [
            "heel",
            "sandal",
            "footwear",
            "shoe",
          ],
        },
      ];
    }

    if (type === "lehenga") {
      return [
        {
          role: "JEWELLERY",
          words: [
            "jewellery",
            "jewelry",
            "earring",
            "necklace",
            "bangle",
            "bracelet",
          ],
        },
        {
          role: "BAG",
          words: [
            "bag",
            "clutch",
            "handbag",
            "purse",
          ],
        },
        {
          role: "FOOTWEAR",
          words: [
            "heel",
            "sandal",
            "footwear",
            "shoe",
          ],
        },
      ];
    }

    if (type === "kurti") {
      return [
        {
          role: "BOTTOMWEAR",
          words: [
            "palazzo",
            "legging",
            "leggings",
            "trouser",
            "pant",
            "chudidar",
          ],
        },
        {
          role: "BAG",
          words: [
            "bag",
            "handbag",
            "purse",
            "clutch",
          ],
        },
        {
          role: "FOOTWEAR",
          words: [
            "shoe",
            "sandal",
            "footwear",
            "heel",
          ],
        },
      ];
    }

    return [
      {
        role: "BAG",
        words: [
          "bag",
          "handbag",
          "purse",
          "clutch",
        ],
      },
      {
        role: "JEWELLERY",
        words: [
          "jewellery",
          "jewelry",
          "earring",
          "necklace",
          "bracelet",
        ],
      },
      {
        role: "FOOTWEAR",
        words: [
          "shoe",
          "sandal",
          "heel",
          "footwear",
        ],
      },
    ];
  }

  /* MEN */

  if (audience === "Men") {
    return [
      {
        role: "FOOTWEAR",
        words: [
          "shoe",
          "sneaker",
          "sandal",
          "footwear",
        ],
      },
      {
        role: "WATCH / ACCESSORY",
        words: [
          "watch",
          "belt",
          "wallet",
          "accessory",
        ],
      },
      {
        role: "BAG",
        words: [
          "bag",
          "backpack",
          "wallet",
        ],
      },
    ];
  }

  /* KIDS */

  return [
    {
      role: "FOOTWEAR",
      words: [
        "shoe",
        "sandal",
        "sneaker",
        "footwear",
      ],
    },
    {
      role: "BAG",
      words: [
        "bag",
        "backpack",
        "pouch",
      ],
    },
    {
      role: "ACCESSORY",
      words: [
        "accessory",
        "watch",
        "cap",
        "hair",
      ],
    },
  ];
}

/* =========================================================
   FIND RELEVANT PRODUCT
========================================================= */

function findCompatibleProduct(main, role, usedIds) {
  if (!main) return null;

  const candidates = catalog.filter((product) => {
    if (!product) return false;

    if (String(product.id) === String(main.id)) {
      return false;
    }

    if (product.audience !== main.audience) {
      return false;
    }

    if (usedIds.includes(String(product.id))) {
      return false;
    }

    const text = productText(product);

    return role.words.some((word) =>
      text.includes(word)
    );
  });

  if (!candidates.length) {
    return null;
  }

  const mainPrice = Number(main.price || 0);

  return [...candidates].sort((a, b) => {
    const aDistance = Math.abs(
      Number(a.price || 0) - mainPrice * 0.35
    );

    const bDistance = Math.abs(
      Number(b.price || 0) - mainPrice * 0.35
    );

    return aDistance - bDistance;
  })[0];
}

/* =========================================================
   COMPLETE MY LOOK
========================================================= */

function CompleteMyLook({ actions }) {
  const mainPieces = useMemo(
    () =>
      catalog.filter((product) =>
        isMainFashionPiece(product)
      ),
    []
  );

  const queryProduct = new URLSearchParams(
    window.location.search
  ).get("product");

  const initialProduct =
    mainPieces.find(
      (product) =>
        String(product.id) ===
        String(queryProduct)
    ) || mainPieces[0];

  const [mainId, setMainId] = useState(
    String(initialProduct?.id || "")
  );

  const [selected, setSelected] = useState({});

  const main =
    mainPieces.find(
      (product) =>
        String(product.id) ===
        String(mainId)
    ) || initialProduct;

  const mainType = detectMainType(main);

  const roles = useMemo(() => getLookRoles(main), [main]);

  const recommendations = useMemo(() => {
    const used = [
      String(main?.id),
    ];

    return roles
      .map((role) => {
        const product = findCompatibleProduct(
          main,
          role,
          used
        );

        if (product) {
          used.push(String(product.id));
        }

        return {
          role: role.role,
          product,
        };
      })
      .filter((item) => item.product);
  }, [main, roles]);

  const pieces = [
    main,
    ...Object.values(selected),
  ].filter(Boolean);

  const total = pieces.reduce(
    (sum, product) =>
      sum + Number(product.price || 0),
    0
  );

  const togglePiece = (product) => {
    const key = String(product.id);

    setSelected((current) => {
      if (current[key]) {
        const next = {
          ...current,
        };

        delete next[key];

        return next;
      }

      return {
        ...current,
        [key]: product,
      };
    });
  };

  const addCompleteLook = () => {
    if (!actions?.addToCart) return;

    pieces.forEach((product) => {
      actions.addToCart(product);
    });
  };

  return (
    <div className="complete-look-page">

      {/* HERO */}

      <section className="look-preview-hero">

        <div className="look-preview-copy">

          <span className="ai-kicker">
            VEYRAA AI · COMPLETE MY LOOK
          </span>

          <h2>
            Build your complete outfit.
          </h2>

          <p>
            Start with one fashion piece.
            Veyraa finds complementary products
            that actually belong with it.
          </p>

          <div className="look-context-tags">
            <span>
              {main?.audience}
            </span>

            <span>
              {mainType}
            </span>

            <span>
              {recommendations.length} matching pieces
            </span>
          </div>

        </div>

        <div className="look-main-picker">

          <label>
            CHOOSE YOUR MAIN PIECE

            <select
              value={main?.id || ""}
              onChange={(event) => {
                setMainId(event.target.value);
                setSelected({});
              }}
            >
              {mainPieces.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>

          </label>

        </div>

      </section>

      {/* SELECTED MAIN PRODUCT */}

      {main && (
        <section className="look-main-preview">

          <div className="look-main-image">

            <img
              src={imageFor(main)}
              alt={main.name}
            />

          </div>

          <div className="look-main-info">

            <span className="ai-kicker">
              YOUR MAIN PIECE
            </span>

            <h2>
              {main.name}
            </h2>

            <p>
              {main.audience} ·{" "}
              {main.type || main.category}
            </p>

            <strong>
              ₹
              {Number(
                main.price || 0
              ).toLocaleString("en-IN")}
            </strong>

            <a
              href={`/products/${encodeURIComponent(
                main.id
              )}?catalog=${main.audience}`}
              className="look-product-link"
            >
              View Product →
            </a>

          </div>

        </section>
      )}

      {/* RECOMMENDATIONS */}

      <section className="look-recommendations">

        <div className="look-section-title">

          <span className="ai-kicker">
            STEP 02 · COMPLETE THE OUTFIT
          </span>

          <h2>
            What goes with your piece?
          </h2>

          <p>
            These recommendations change according
            to the selected product, audience and
            fashion type.
          </p>

        </div>

        <div className="look-pieces-grid">

          {recommendations.map(
            ({ role, product }) => {

              const key =
                String(product.id);

              const active =
                Boolean(selected[key]);

              return (
                <article
                  className={
                    active
                      ? "look-piece active"
                      : "look-piece"
                  }
                  key={key}
                >

                  <div className="look-piece-image">

                    <img
                      src={imageFor(product)}
                      alt={product.name}
                    />

                    <span>
                      {role}
                    </span>

                  </div>

                  <div className="look-piece-info">

                    <small>
                      {product.type ||
                        product.category}
                    </small>

                    <h3>
                      {product.name}
                    </h3>

                    <strong>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </strong>

                    <a
                      href={`/products/${encodeURIComponent(
                        product.id
                      )}?catalog=${product.audience}`}
                      className="look-product-link"
                    >
                      View Product →
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        togglePiece(product)
                      }
                    >
                      {active
                        ? "✓ Added to Look"
                        : "Add to Look"}
                    </button>

                  </div>

                </article>
              );
            }
          )}

        </div>

      </section>

      {/* FINAL ORDER SUMMARY */}

      <section className="look-summary">

        <div>
          <span>
            YOUR COMPLETE LOOK
          </span>

          <strong>
            {pieces.length}{" "}
            {pieces.length === 1
              ? "piece"
              : "pieces"}
          </strong>
        </div>

        <div>
          <span>
            TOTAL
          </span>

          <strong>
            ₹
            {total.toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>

        <button
          type="button"
          onClick={addCompleteLook}
        >
          Add Complete Look →
        </button>

      </section>

    </div>
  );
}

export default CompleteMyLook;
