import { useCallback, useEffect, useState } from "react";

export const portalPages = {
  seller: ["home", "orders", "pending", "returns", "products", "inventory", "pricing", "payments", "analytics", "demand", "restock", "performance", "settings", "seller-plans"],
  admin: ["dashboard", "customers", "sellers", "catalogue", "approval", "orders", "payments", "returns", "complaints", "marketing", "delivery", "reports", "trust", "anomaly", "audit", "settings"],
  delivery: ["dashboard", "deliveries", "pickup", "tracking", "route", "eta", "exceptions", "returns", "history", "performance", "notifications"],
};

export function getPathname() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

export function usePathname() {
  const [pathname, setPathname] = useState(getPathname);

  useEffect(() => {
    const updatePathname = () => setPathname(getPathname());
    window.addEventListener("popstate", updatePathname);
    window.addEventListener("veyraa:navigation", updatePathname);
    return () => {
      window.removeEventListener("popstate", updatePathname);
      window.removeEventListener("veyraa:navigation", updatePathname);
    };
  }, []);

  return pathname;
}

export function usePortalPage(role) {
  const pathname = usePathname();
  const requestedPage = pathname.slice(`/${role}/`.length);
  const page = portalPages[role].includes(requestedPage)
    ? requestedPage
    : portalPages[role][0];

  const setPage = useCallback((nextPage) => {
    if (!portalPages[role].includes(nextPage)) return;
    const nextPath = `/${role}/${nextPage}`;
    if (getPathname() !== nextPath) {
      window.history.pushState(null, "", nextPath);
      window.dispatchEvent(new Event("veyraa:navigation"));
    }
  }, [role]);

  return [page, setPage];
}
