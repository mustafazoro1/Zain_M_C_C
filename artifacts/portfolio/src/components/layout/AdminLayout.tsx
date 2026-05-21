import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { LayoutDashboard, FolderOpen, Settings2, LogOut, Home } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: me, isLoading } = useGetAdminMe();
  const logout = useAdminLogout();

  useEffect(() => {
    if (!isLoading && !me?.authenticated) {
      setLocation("/admin-login");
    }
  }, [me, isLoading, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => setLocation("/admin-login"),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[hsl(220,15%,25%)] border-t-[hsl(38,72%,52%)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!me?.authenticated) return null;

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects/new", label: "New Project", icon: FolderOpen },
    { href: "/admin/machinery", label: "Machinery", icon: Settings2 },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? location === "/admin" : location.startsWith(href);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[hsl(220,18%,7%)] border-r border-[hsl(220,15%,16%)] flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-[hsl(220,15%,16%)]">
          <p className="text-sm font-serif font-bold uppercase tracking-tight text-foreground leading-none">
            Zain Manzoor
          </p>
          <p className="text-[9px] tracking-[0.35em] uppercase text-[hsl(38,72%,52%)] mt-0.5">
            Co. — Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-150 ${
                isActive(href)
                  ? "bg-[hsl(38,72%,52%)/12%] text-[hsl(38,72%,52%)] border-l-2 border-[hsl(38,72%,52%)]"
                  : "text-[hsl(220,12%,50%)] hover:text-foreground hover:bg-[hsl(220,15%,14%)] border-l-2 border-transparent"
              }`}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-[hsl(220,15%,16%)] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,50%)] hover:text-foreground hover:bg-[hsl(220,15%,14%)] transition-all"
          >
            <Home size={13} />
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.15em] uppercase text-[hsl(220,12%,50%)] hover:text-red-400 hover:bg-[hsl(220,15%,14%)] transition-all"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-56 min-h-screen">
        <div className="px-8 py-10 max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  );
}
