import { Suspense, useState } from "react";
import { Briefcase, Code2, ExternalLink, FileUser, LayoutDashboard, LayoutList, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { useAdminAuth } from "../auth";
import { STUDIO_URL } from "../lib";
import { Button, Link } from "./ui";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/layout", label: "Page layout", icon: LayoutList },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/experience", label: "Experience", icon: FileUser },
  { to: "/admin/tech", label: "Tech stack", icon: Code2 },
  { to: "/admin/about", label: "About", icon: UserRound },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
];

const isActive = (item, path) => (item.exact ? path === item.to : path === item.to || path.startsWith(`${item.to}/`));

function CurrentUser() {
  const { user, signOut } = useAdminAuth();
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {user.profileImage ? (
        <img src={user.profileImage} alt="" className="size-7 shrink-0 rounded-full" />
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-elevated text-xs text-ink">{user.name?.[0] ?? "?"}</span>
      )}
      <span className="min-w-0 flex-1 truncate text-sm text-ink" title={user.email}>
        {user.name}
      </span>
      <Button variant="ghost" size="icon" icon={LogOut} aria-label="Sign out" title="Sign out" onClick={signOut} />
    </div>
  );
}

export function AdminLayout({ path, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
        <Link to="/admin" className="font-display text-lg text-ink">
          fr3dsz <span className="font-sans text-sm text-stone">admin</span>
        </Link>
        <Button variant="ghost" size="icon" icon={open ? X : Menu} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="admin-sidebar" onClick={() => setOpen(!open)} />
      </header>

      {open && <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-canvas/70 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-16 items-center border-b border-line px-5">
          <Link to="/admin" className="font-display text-lg text-ink">
            fr3dsz <span className="font-sans text-sm text-stone">admin</span>
          </Link>
        </div>

        <nav aria-label="Admin" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = isActive(item, path);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-150 ${active ? "bg-elevated text-ink" : "text-stone hover:bg-elevated/60 hover:text-ink"}`}
              >
                <item.icon aria-hidden="true" className={`size-4 ${active ? "text-accent" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-line px-3 py-3">
          <a href="/" className="flex items-center justify-between px-3 py-2 text-sm text-stone transition-colors hover:text-ink">
            View site
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
          <a href={STUDIO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-2 text-sm text-stone transition-colors hover:text-ink">
            Open Studio
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
          <Suspense fallback={null}>
            <CurrentUser />
          </Suspense>
        </div>
      </aside>

      <main className="min-w-0 pt-14 lg:ml-64 lg:pt-0">
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-10">{children}</div>
      </main>
    </div>
  );
}
