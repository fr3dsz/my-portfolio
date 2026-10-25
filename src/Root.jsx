import { Suspense, lazy } from "react";
import App from "./App.jsx";
import SiteSettingsProvider from "./components/SiteSettingsProvider.jsx";

// The admin (and the Sanity App SDK it needs) is its own chunk, so visitors
// of the public site never download it.
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

const isAdminPath = (path) => path === "/admin" || path.startsWith("/admin/");

const Root = () =>
  isAdminPath(window.location.pathname) ? (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <AdminApp />
    </Suspense>
  ) : (
    <SiteSettingsProvider>
      <App />
    </SiteSettingsProvider>
  );

export default Root;
