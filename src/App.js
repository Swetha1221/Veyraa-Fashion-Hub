import "./App.css";

import Billing from "./pages/Billing";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import TrendingPage from "./pages/TrendingPage";
import BefittingStylePage from "./pages/BefittingStylePage";
import LookPreview from "./pages/LookPreview";
import AIFeaturePage from "./pages/AIFeaturePage";

import DiscoveryPage from "./pages/DiscoveryPage";
import DealsPage from "./pages/DealsPage";

import KidsCategory from "./components/KidsCategory";
import WomenFashion from "./components/WomenFashion";
import MenCategory from "./components/MenCategory";

function App() {
  const path = window.location.pathname;

  // =====================================================
  // CART
  // =====================================================

  if (path === "/cart") {
    return <Cart />;
  }

  // =====================================================
  // BILLING
  // =====================================================

  if (path === "/billing") {
    return <Billing />;
  }

  // =====================================================
  // MY ORDERS
  // =====================================================

  if (path === "/my-orders") {
    return <MyOrders />;
  }

  // =====================================================
  // WISHLIST
  // =====================================================

  if (path === "/wishlist") {
    return <Wishlist />;
  }

  // =====================================================
  // WOMEN
  // =====================================================

  if (path === "/women") {
    return <WomenFashion />;
  }

  // Women categories
  if (path.startsWith("/women/")) {
    return <WomenFashion />;
  }

  // =====================================================
  // BEFITTING YOUR STYLE
  // =====================================================

  if (path === "/befitting-your-style" || path === "/befitting-style") {
    return <BefittingStylePage />;
  }

  if (path === "/look-preview") {
    return <LookPreview />;
  }

if (
  [
    "/ai/fashion-matchmaker",
    "/ai/pick-my-vibe",
    "/ai/complete-my-look",
    "/ai/fit-profile",
  ].includes(path)
) {
  return <AIFeaturePage />;
} 

  // =====================================================
  // MEN
  // =====================================================

  if (path === "/men") {
    return <MenCategory />;
  }

  // Men categories
  if (path.startsWith("/men/")) {
    return <MenCategory />;
  }

  // =====================================================
  // KIDS
  // =====================================================

  if (path === "/kids") {
    return <KidsCategory />;
  }

  // Kids categories
  if (path.startsWith("/kids/")) {
    return <KidsCategory />;
  }

  // =====================================================
  // DISCOVERY PAGES
  // =====================================================

  // New Arrivals
  if (path === "/new-arrivals") {
    return <NewArrivalsPage />;
  }

  // Trending Now
  if (path === "/trending") {
    return <TrendingPage />;
  }

  // Best Sellers
  if (path === "/best-sellers") {
    return (
      <DiscoveryPage
        title="Best Sellers"
        subtitle="Shop the styles loved by the Veyraa fashion community."
      />
    );
  }

  // Recommended
  if (path === "/recommended") {
    return (
      <DiscoveryPage
        title="Recommended"
        subtitle="Discover fashion recommendations curated for your style."
      />
    );
  }

  // Shop By Vibe
  if (path === "/shop-by-vibe") {
    return (
      <DiscoveryPage
        title="Shop By Vibe"
        subtitle="Find fashion that matches your mood, personality and vibe."
      />
    );
  }

  // Deals & Offers
  if (path === "/deals") {
    return <DealsPage />;
  }

  // Shop By Occasion
  if (path === "/shop-by-occasion") {
    return (
      <DiscoveryPage
        title="Shop By Occasion"
        subtitle="Find the perfect look for every special moment."
      />
    );
  }

  // Shop By Color
  if (path === "/shop-by-color") {
    return (
      <DiscoveryPage
        title="Shop By Color"
        subtitle="Explore your favourite fashion styles by colour."
      />
    );
  }

  // =====================================================
  // PRODUCT DETAILS
  // =====================================================

  if (path.startsWith("/products/")) {
    return <ProductDetail />;
  }

  // =====================================================
  // HOME
  // =====================================================

  return <Home />;
}

export default App;