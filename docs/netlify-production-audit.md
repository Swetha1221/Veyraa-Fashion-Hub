# Netlify deployment audit

Audited on October 5, 2026. Deployment changes preserved the existing UI, route names,
catalogue, portal separation, browser storage, and business behavior. No backend URLs,
fake API responses, new authentication provider, or database migration were introduced.

## Route inventory

`src/App.js` dispatches using `window.location.pathname`; this project does not use
React Router. The inventory contains **35 dispatch entries: 28 concrete/base paths
and seven descendant-prefix patterns**. Customer routes account for 29 entries
(25 concrete paths and four prefixes); each other portal accounts for two entries
(one base path and one prefix). Descendant patterns cover arbitrarily many URLs and
are not counted as separate modules or independently routed dashboard tabs.

| Portal | Existing path | Existing destination |
| --- | --- | --- |
| Customer | `/` | Home; also the existing fallback for unrecognized paths |
| Customer | `/deals` | DealsPage |
| Customer | `/women` | WomenFashion |
| Customer | `/women/*` | WomenFashion, with supported category slugs |
| Customer | `/men` | MenCategory |
| Customer | `/men/*` | MenCategory |
| Customer | `/kids` | KidsCategory |
| Customer | `/kids/*` | KidsCategory |
| Customer | `/new-arrivals` | NewArrivalsPage |
| Customer | `/trending` | TrendingPage |
| Customer | `/befitting-your-style` | BefittingStylePage |
| Customer | `/befitting-style` | Existing BefittingStylePage alias |
| Customer | `/look-preview` | LookPreview |
| Customer | `/products/*` | ProductDetail, retaining catalogue/query parameters |
| Customer | `/cart` | Cart |
| Customer | `/wishlist` | Wishlist |
| Customer | `/billing` | Billing |
| Customer | `/my-orders` | MyOrders |
| Customer | `/subscription-plans` | SubscriptionPlans |
| Customer | `/search` | SearchResultsPage, retaining search query parameters |
| Customer | `/best-sellers` | DiscoveryPage |
| Customer | `/recommended` | DiscoveryPage |
| Customer | `/shop-by-vibe` | DiscoveryPage |
| Customer | `/shop-by-occasion` | DiscoveryPage |
| Customer | `/shop-by-color` | DiscoveryPage |
| Customer | `/ai/fashion-matchmaker` | AIFeaturePage |
| Customer | `/ai/pick-my-vibe` | AIFeaturePage |
| Customer | `/ai/complete-my-look` | AIFeaturePage |
| Customer | `/ai/fit-profile` | AIFeaturePage |
| Seller | `/seller` | SellerPortal login gate and SellerDashboard |
| Seller | `/seller/*` | The same seller login gate/dashboard |
| Admin | `/admin` | AdminPortal login gate and AdminDashboard |
| Admin | `/admin/*` | The same admin login gate/dashboard |
| Delivery | `/delivery` | DeliveryPortal login gate and DeliveryDashboard |
| Delivery | `/delivery/*` | The same delivery login gate/dashboard |

Customer login/register, account/profile editing, and fit-profile editing are existing
account-sidebar flows, not `/login` or `/register` routes. CustomerAuth is an unused
alternative component. No invented authentication routes were added.

Women has 22 named descendant categories: `tshirts`, `tops`, `dresses`, `frocks`,
`jeans`, `trousers`, `skirts`, `kurtis`, `chudidars`, `salwar`, `sarees`, `lehengas`,
`jackets`, `sportswear`, `nightwear`, `footwear`, `handbags`, `jewellery`, `watches`,
`sunglasses`, `belts`, and `beauty`. All were tested on direct initialization/remount.
The existing men's category links `/men/shirts`, `/men/kurtas`, `/men/sherwanis`, and
`/men/blazers` were also tested. Men/Kids descendant paths continue to render their
existing general category pages; unlike Women, they do not select filters from URL
slugs. Their product filtering was not rewritten as part of this deployment repair.

## Portal modules

All **41 existing sidebar modules** were clicked and rendered in regression tests.
These modules use React state within their portal; they do not have distinct URLs.
Refresh preserves the role's existing session gate but resets dashboard/module state
to its existing default. Descendant URLs such as `/seller/dashboard` also render the
default portal page, rather than introducing a new module-to-URL mapping.

Seller's 14 modules were Home, All Orders, Pending Orders, Returns, All Products,
Inventory, Pricing & Offers, Payments, Sales Analytics, Demand Intelligence, Restock
Nudge, Seller Performance, Settings, and Seller Plans.

Admin's 16 modules were Dashboard, Customers, Sellers, Catalogue, Product Approval,
Orders, Payments & Finance, Returns & Refunds, Complaints & Disputes, Marketing &
Promotions, Delivery Management, Reports & Analytics, Trust Score Engine, AI Anomaly
Detection, Audit Logs, and Settings.

Delivery's 11 modules were Dashboard, My Deliveries, Pickup Center, Live Tracking,
Route Pulse, ETA & Delay Monitor, Delivery Exceptions, Returns & Reverse Pickup,
Delivery History, Performance, and Notifications.

No hospital-related modules or additional user/role, seller complaint/marketing,
inventory, or subscription/revenue URLs were fabricated to match a requested label.
Only the actual implemented portal modules were inventoried.

## Repairs

Added `public/_redirects` with exactly `/* /index.html 200` and a final newline.
The existing Create React App production script copies the public directory into
`build`; a regression test checked that copying mechanism and the rewrite's exact
contents. Existing assets are still served as files, not separate route HTML pages.
Verification of the final build artifact remains pending the platform build.

Repaired Women's category synchronization on browser Back/Forward events without
changing its categories or filtering. Connected the existing Home View Deals button
to `/deals`, added the missing footer contact anchor target, and replaced the AI
page's nonexistent `/#ai-fashion` fragment destination with the existing `/` route.
The unused AIFashionStudio component was not inserted into Home or used to redesign
the page. Connected SellerDashboard's existing logout control to its existing seller
session gate; its existing plan cleanup remained intact.

Corrected the two Kids fallback-image references in New Arrivals and Trending from
the missing `/kids/kids-01.jpg` to the existing `/kids/casualwearboy.jpg`. Original
product images remained unchanged. Removed CompleteMyLook's hook dependency warning
by deriving look roles inside the existing memo and retaining its actual dependency.

## Validation completed

- `CI=true npm test -- --watchAll=false --runInBand`: **124 tests passed**, two suites.
  Tests rendered real components rather than replacing pages with mock placeholders.
  Coverage included 53 customer URLs on direct initialization and remount, visible
  link destinations on those pages, base/descendant portal logins, role isolation,
  session remounts and logout, customer login/register/logout, all 41 sidebar modules,
  Women history changes, catalogue images, manifest icons, and public copying.
- `node_modules/.bin/eslint src --ext .js,.jsx --max-warnings=0`: **zero errors and
  zero warnings**. No lint rules or CI warning checks were disabled.
- The installed Create React App CSS minimizer was run directly on **30 individual
  source CSS files and their combined contents**: zero minification errors/warnings.
  This was an isolated minifier check, not a webpack production build.
- The production entry import graph resolved **62 local files** with no missing
  imports. All local catalogue image paths, literal image paths, and manifest icons
  checked by the tests existed with their exact filename casing on Linux.
- Searches found no localhost/127.0.0.1 backend or development-port dependency in
  production source. Localhost appeared in the CRA README and camera help text;
  `http://` also appeared in image-URL normalization, not a development endpoint.
- `git diff --check` passed.

The existing, unchanged public deployment was probed over HTTPS: `/` returned 200
and all 34 other dispatch-entry samples returned 404. This reproduced the hosting
failure before deployment of these changes. It was not validation of the new,
undeployed rewrite, nor browser end-to-end testing of a new production bundle.

## Build and Netlify settings

The provided Netlify settings specified `npm run build` and publish directory
`build`; `package.json` specified `react-scripts build`. These already matched, so
no conflicting `netlify.toml`, dependency changes, or build-script overrides were
introduced. Public images, favicon, and manifest remained in `public`.

**The full production build was not run in this session.** The task environment
explicitly prohibited build commands and assigned build validation to the platform.
Consequently, zero production-build errors, the published `_redirects` artifact,
and successful routing on the new production deployment cannot yet be certified.
The old `build-output.log` was not treated as a current build result. Tests, lint,
and standalone CSS checks do not replace the required automatic production build.

After the platform build/deployment, verify `build/_redirects` contains the exact
rewrite and exercise direct URLs, refreshes, and external links against the new
deployment, including authenticated portals. A failed automatic build must still
be investigated; this report does not declare the entire application production-ready.

## Existing production limitations

Checkout calls EmailJS and requires these build-time variables:
`REACT_APP_EMAILJS_SERVICE_ID`, `REACT_APP_EMAILJS_TEMPLATE_ID`, and
`REACT_APP_EMAILJS_PUBLIC_KEY`. All three had nonempty declarations in the existing
repository `.env`; their values were neither printed nor changed. They were not set
in the runner's process environment. Create React App loads `.env` at build time;
the actual EmailJS service/template, allowed production origin, delivery quota, and
email delivery were not verified. Checkout saves the order locally before sending
email and only clears the cart/redirects after successful email delivery. An EmailJS
failure therefore remains a genuine checkout-flow dependency, not a routing error.

No custom deployed backend/API was referenced by the current production entry graph.
Customer accounts, cart, wishlist, orders, and profiles retain their browser storage.
Portal logins accept any nonempty credentials and use role-specific sessionStorage;
that preserves the implementation but is **not secure server-enforced authentication
or authorization**. Seller/Admin/Delivery modules use seeded client state, not a
shared, durable operational backend. Google-login controls are existing placeholders.
Payment verification and AI experiences retain their existing client-side behavior,
not verified live payment or model-provider integrations. These limitations prevent
a claim that real marketplace operations are production-ready.

Remote product images/fonts remain dependent on their existing external providers;
every remote asset was not availability-tested. Camera features still require HTTPS
and browser permission. The unused legacy `src/pages/WomenCategory.js` still imports
a missing `./WomenCategory.css`; it is outside the production entry graph and was
not rewritten or wired into a route.
