import { useEffect } from "react";
import { SDKProvider } from "@sanity/sdk-react";
import { dataset, projectId } from "../lib/sanity";
import { AdminLayout } from "./components/AdminLayout";
import { EmptyState, ErrorBoundary, Link, Skeleton } from "./components/ui";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import { ExperienceEditor, ExperienceList } from "./pages/Experience";
import Layout from "./pages/Layout";
import { ProjectEditor, ProjectList } from "./pages/Projects";
import Settings from "./pages/Settings";
import { TechEditor, TechList } from "./pages/TechStack";
import { matchPath, usePath } from "./router";

// Custom admin on the Sanity App SDK: <SDKProvider> handles sign-in with the
// Sanity account (project members only) and live document sync. The Studio
// stays available for anything not covered here.

const ROUTES = [
  ["/admin", Dashboard],
  ["/admin/layout", Layout],
  ["/admin/projects", ProjectList],
  ["/admin/projects/:id", ProjectEditor],
  ["/admin/experience", ExperienceList],
  ["/admin/experience/:id", ExperienceEditor],
  ["/admin/tech", TechList],
  ["/admin/tech/:id", TechEditor],
  ["/admin/about", About],
  ["/admin/settings", Settings],
];

const TITLES = {
  "/admin": "Dashboard",
  "/admin/layout": "Page layout",
  "/admin/projects": "Projects",
  "/admin/experience": "Experience",
  "/admin/tech": "Tech stack",
  "/admin/about": "About",
  "/admin/settings": "Site settings",
};

function NotFound() {
  return (
    <EmptyState title="Page not found" action={<Link to="/admin" className="text-sm text-accent underline underline-offset-4">Go to the dashboard</Link>}>
      There&apos;s no admin page at this address.
    </EmptyState>
  );
}

function Routes() {
  const path = usePath();
  let page = <NotFound />;
  for (const [pattern, Page] of ROUTES) {
    const params = matchPath(pattern, path);
    if (params) {
      page = <Page {...params} />;
      break;
    }
  }

  useEffect(() => {
    const section = Object.entries(TITLES).find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`) && prefix !== "/admin");
    document.title = `${section ? section[1] : "Admin"} · fr3dsz admin`;
  }, [path]);

  return (
    <AdminLayout path={path}>
      <ErrorBoundary resetKey={path}>{page}</ErrorBoundary>
    </AdminLayout>
  );
}

export default function AdminApp() {
  // Not SanityApp: outside localhost it redirects to sanity.io/welcome unless framed by Sanity's dashboard.
  return (
    <SDKProvider
      config={[{ projectId, dataset }]}
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas">
          <Skeleton className="h-2 w-40" />
        </div>
      }
    >
      <Routes />
    </SDKProvider>
  );
}
