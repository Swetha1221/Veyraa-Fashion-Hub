import { act, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import { products as womenProducts } from "./components/WomenFashion";

const customerRoutes = [
  ["/", /Dress With Confidence/],
  ["/deals", "MAHA INDIAN SALE"],
  ["/women", /Modern Style.*Made for Her/],
  ["/men", /Modern Style.*Made for Him/],
  ["/kids", /Little Looks/],
  ["/new-arrivals", /^New Arrivals/],
  ["/trending", /^Trending Now/],
  ["/befitting-your-style", "BEFITTING YOUR STYLE"],
  ["/befitting-style", "BEFITTING YOUR STYLE"],
  ["/look-preview", "Complete The Look"],
  ["/cart", "Your Cart"],
  ["/wishlist", "My Wishlist"],
  ["/billing", "Billing & Payment"],
  ["/my-orders", "My Orders"],
  ["/subscription-plans", "Choose the plan that fits your fashion journey.", 2],
  ["/search?q=saree", "Find Your Next Look"],
  ["/best-sellers", "Best Sellers"],
  ["/recommended", "Recommended"],
  ["/shop-by-vibe", "Shop By Vibe"],
  ["/shop-by-occasion", "Shop By Occasion"],
  ["/shop-by-color", "Shop By Color"],
  ["/ai/fashion-matchmaker", "FIND YOUR PERFECT MATCH"],
  ["/ai/pick-my-vibe", "SHOP YOUR ENERGY"],
  ["/ai/complete-my-look", "BUILD THE COMPLETE OUTFIT"],
  ["/ai/fit-profile", "FIT MADE PERSONAL"],
  ...[
    "tshirts", "tops", "dresses", "frocks", "jeans", "trousers", "skirts",
    "kurtis", "chudidars", "salwar", "sarees", "lehengas", "jackets",
    "sportswear", "nightwear", "footwear", "handbags", "jewellery",
    "watches", "sunglasses", "belts", "beauty",
  ].map(category => [`/women/${category}`, /Modern Style.*Made for Her/]),
  ...["shirts", "kurtas", "sherwanis", "blazers"]
    .map(category => [`/men/${category}`, /Modern Style.*Made for Him/]),
  ["/kids/frocks", /Little Looks/],
  [`/products/${encodeURIComponent(womenProducts[0].id)}?catalog=Women`, womenProducts[0].name],
];

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, "", "/");
  jest.spyOn(window, "scrollTo").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test.each(customerRoutes)("direct entry and remount render %s", (route, heading, level = 1) => {
  window.history.replaceState({}, "", route);
  const { unmount } = render(<App />);
  expect(screen.getByRole("heading", { name: heading, level })).toBeInTheDocument();
  unmount();
  render(<App />);
  expect(screen.getByRole("heading", { name: heading, level })).toBeInTheDocument();
});

test.each(["seller", "admin", "delivery"].flatMap(role => [[role, ""], [role, "/dashboard"]]))(
  "%s%s login remains role-specific across direct entry, remount and logout",
  (role, suffix) => {
    window.history.replaceState({}, "", `/${role}${suffix}`);
    const { unmount } = render(<App />);
    const heading = `Welcome back, ${role === "delivery" ? "Delivery Partner" : role === "seller" ? "Seller" : "Admin"}.`;
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "route-audit" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "route-audit" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign In →", exact: true }));
    expect(screen.getByTitle(/^Logout from/)).toBeInTheDocument();
    expect(sessionStorage.getItem(`veyraa_${role}_authenticated`)).toBe("true");
    for (const otherRole of ["seller", "admin", "delivery"].filter(value => value !== role)) {
      expect(sessionStorage.getItem(`veyraa_${otherRole}_authenticated`)).toBeNull();
    }
    unmount();
    render(<App />);
    expect(screen.getByTitle(/^Logout from/)).toBeInTheDocument();
    fireEvent.click(screen.getByTitle(/^Logout from/));
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    expect(sessionStorage.getItem(`veyraa_${role}_authenticated`)).toBeNull();
  }
);

test.each([
  ["seller", ""],
  ["admin", "admin-nav-item"],
  ["delivery", "vd-nav-item"],
])("every existing %s sidebar module renders", (role, navClass) => {
  window.history.replaceState({}, "", `/${role}`);
  sessionStorage.setItem(`veyraa_${role}_authenticated`, "true");
  render(<App />);
  const navigation = within(screen.getByRole("complementary"));
  const buttons = navigation.getAllByRole("button").filter(button => !navClass || button.classList.contains(navClass));
  expect(buttons).toHaveLength(role === "seller" ? 14 : role === "admin" ? 16 : 11);
  for (const button of buttons) {
    fireEvent.click(button);
    expect(button).toHaveClass("active");
    expect(screen.getByTitle(/^Logout from/)).toBeInTheDocument();
    expect(window.location.pathname).toBe(`/${role}`);
  }
});

test("customer login persists across remount without authenticating other portals", () => {
  const { unmount } = render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Account", exact: true }));
  fireEvent.change(screen.getByPlaceholderText("Enter email or phone"), { target: { value: "route-audit@example.test" } });
  fireEvent.change(screen.getByPlaceholderText("Enter password"), { target: { value: "route-audit" } });
  fireEvent.click(screen.getByText("Login", { selector: 'button[type="submit"]' }));
  expect(localStorage.getItem("veyraaCustomer")).toBe("true");
  unmount();
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Account", exact: true }));
  expect(within(screen.getByRole("complementary")).getByRole("heading", { name: "Hello, route-audit" })).toBeInTheDocument();
  for (const role of ["seller", "admin", "delivery"]) {
    expect(sessionStorage.getItem(`veyraa_${role}_authenticated`)).toBeNull();
  }
});

test("women category state follows direct entry and browser history", () => {
  window.history.replaceState({}, "", "/women/sarees");
  render(<App />);
  expect(screen.getByRole("button", { name: "Sarees", exact: true })).toHaveClass("active");
  fireEvent.click(screen.getByRole("button", { name: "Kurtis", exact: true }));
  expect(window.location.pathname).toBe("/women/kurtis");
  act(() => {
    window.history.replaceState({}, "", "/women/sarees");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  expect(screen.getByRole("button", { name: "Sarees", exact: true })).toHaveClass("active");
  act(() => {
    window.history.replaceState({}, "", "/women");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  expect(screen.getByRole("button", { name: "All Women", exact: true })).toHaveClass("active");
});

test("footer contact navigation has a real target", () => {
  render(<App />);
  expect(screen.getByRole("link", { name: "Contact Support →" })).toHaveAttribute("href", "#contact");
  expect(screen.getByRole("heading", { name: "CONTACT US" })).toBeInTheDocument();
});

test("the seller dashboard logout button returns to seller login", () => {
  window.history.replaceState({}, "", "/seller");
  sessionStorage.setItem("veyraa_seller_authenticated", "true");
  render(<App />);
  const logoutButton = screen.getAllByRole("button", { name: /Logout/ })
    .find(button => button.classList.contains("sv-logout"));
  fireEvent.click(logoutButton);
  expect(sessionStorage.getItem("veyraa_seller_authenticated")).toBeNull();
  expect(screen.getByRole("heading", { name: "Welcome back, Seller." })).toBeInTheDocument();
});

test("customer registration and logout keep the existing local account flow", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Account", exact: true }));
  fireEvent.click(screen.getByRole("button", { name: "Sign Up", exact: true }));
  fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "Route Audit" } });
  fireEvent.change(screen.getByPlaceholderText("Enter phone number"), { target: { value: "0000000000" } });
  fireEvent.change(screen.getByPlaceholderText("Enter email address"), { target: { value: "route-audit@example.test" } });
  fireEvent.change(screen.getByPlaceholderText("Create password"), { target: { value: "route-audit" } });
  fireEvent.click(screen.getByRole("button", { name: "Create Account", exact: true }));
  expect(screen.getByRole("heading", { name: "Hello, Route Audit" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Logout/ }));
  expect(localStorage.getItem("veyraaCustomer")).toBeNull();
  expect(screen.getByPlaceholderText("Enter email or phone")).toBeInTheDocument();
});

test.each(customerRoutes)("visible navigation on %s targets existing routes", route => {
  window.history.replaceState({}, "", route);
  render(<App />);
  const knownPaths = customerRoutes.map(([entry]) => entry.split("?")[0])
    .concat(["/seller", "/admin", "/delivery"]);
  const destinations = screen.queryAllByRole("link")
    .map(link => new URL(link.getAttribute("href"), "https://veyraa.invalid"))
    .filter(destination => destination.origin === "https://veyraa.invalid");
  for (const destination of destinations) {
    const isKnown = knownPaths.includes(destination.pathname) || /^\/(women|men|kids|products|seller|admin|delivery)\//.test(destination.pathname);
    expect({ path: destination.pathname, isKnown }).toEqual({ path: destination.pathname, isKnown: true });
  }
});
