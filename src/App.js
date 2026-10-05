import "./App.css";
import { usePathname } from "./routing";

// =====================================================
// CUSTOMER PAGES
// =====================================================

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
import SearchResultsPage from "./pages/SearchResultsPage";
import DiscoveryPage from "./pages/DiscoveryPage";
import DealsPage from "./pages/DealsPage";

// =====================================================
// CUSTOMER SUBSCRIPTION
// =====================================================

import SubscriptionPlans from "./pages/SubscriptionPlans";

// =====================================================
// CUSTOMER CATEGORIES
// =====================================================

import KidsCategory from "./components/KidsCategory";
import WomenFashion from "./components/WomenFashion";
import MenCategory from "./components/MenCategory";

// =====================================================
// PORTALS
// =====================================================

import SellerDashboard from "./pages/Seller/SellerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DeliveryDashboard from "./components/Delivery/DeliveryDashboard";

// =====================================================
// PORTAL LOGIN
// =====================================================

import {
  SellerPortal,
  AdminPortal,
  DeliveryPortal,
} from "./pages/PortalLogin";

function App() {
  const path = usePathname();

  // =====================================================
  // SELLER PORTAL
  // =====================================================

  if (path === "/seller" || path.startsWith("/seller/")) {
    return (
      <SellerPortal>
        <SellerDashboard />
      </SellerPortal>
    );
  }

  // =====================================================
  // ADMIN PORTAL
  // =====================================================

  if (path === "/admin" || path.startsWith("/admin/")) {
    return (
      <AdminPortal>
        <AdminDashboard />
      </AdminPortal>
    );
  }

  // =====================================================
  // DELIVERY PORTAL
  // =====================================================

  if (path === "/delivery" || path.startsWith("/delivery/")) {
    return (
      <DeliveryPortal>
        <DeliveryDashboard />
      </DeliveryPortal>
    );
  }

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
  // VEYRAA CUSTOMER MEMBERSHIP
  // =====================================================

  if (path === "/subscription-plans") {
    return <SubscriptionPlans />;
  }

  // =====================================================
  // WOMEN
  // =====================================================

  if (path === "/women") {
    return <WomenFashion />;
  }

  if (path.startsWith("/women/")) {
    return <WomenFashion />;
  }

  // =====================================================
  // BEFITTING YOUR STYLE
  // =====================================================

  if (
    path === "/befitting-your-style" ||
    path === "/befitting-style"
  ) {
    return <BefittingStylePage />;
  }

  // =====================================================
  // LOOK PREVIEW
  // =====================================================

  if (path === "/look-preview") {
    return <LookPreview />;
  }

  // =====================================================
  // AI FEATURES
  // =====================================================

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

  if (path.startsWith("/men/")) {
    return <MenCategory />;
  }

  // =====================================================
  // KIDS
  // =====================================================

  if (path === "/kids") {
    return <KidsCategory />;
  }

  if (path.startsWith("/kids/")) {
    return <KidsCategory />;
  }

  // =====================================================
  // SEARCH
  // =====================================================

  if (path === "/search") {
    return <SearchResultsPage />;
  }

  // =====================================================
  // NEW ARRIVALS
  // =====================================================

  if (path === "/new-arrivals") {
    return <NewArrivalsPage />;
  }

  // =====================================================
  // TRENDING
  // =====================================================

  if (path === "/trending") {
    return <TrendingPage />;
  }

  // =====================================================
  // BEST SELLERS
  // =====================================================

  if (path === "/best-sellers") {
    return (
      <DiscoveryPage
        title="Best Sellers"
        subtitle="Shop the styles loved by the Veyraa fashion community."
      />
    );
  }

  // =====================================================
  // RECOMMENDED
  // =====================================================

  if (path === "/recommended") {
    return (
      <DiscoveryPage
        title="Recommended"
        subtitle="Discover fashion recommendations curated for your style."
      />
    );
  }

  // =====================================================
  // SHOP BY VIBE
  // =====================================================

  if (path === "/shop-by-vibe") {
    return (
      <DiscoveryPage
        title="Shop By Vibe"
        subtitle="Find fashion that matches your mood, personality and vibe."
      />
    );
  }

  // =====================================================
  // DEALS
  // =====================================================

  if (path === "/deals") {
    return <DealsPage />;
  }

  // =====================================================
  // SHOP BY OCCASION
  // =====================================================

  if (path === "/shop-by-occasion") {
    return (
      <DiscoveryPage
        title="Shop By Occasion"
        subtitle="Find the perfect look for every special moment."
      />
    );
  }

  // =====================================================
  // SHOP BY COLOR
  // =====================================================

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
