"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Globe, Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Translatable } from "@/components/translatable";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { CONTENT_KEYS } from "@/lib/content-keys";

const NAV_ITEMS = [
  { href: "/dashboard", label: CONTENT_KEYS.DASHBOARD.NAV.DASHBOARD, icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: CONTENT_KEYS.DASHBOARD.NAV.ANALYTICS, icon: BarChart3 },
  { href: "/dashboard/sites", label: CONTENT_KEYS.DASHBOARD.NAV.SITES, icon: Globe },
];

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const showNav = true;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen bg-background">
        {showNav && (
          <aside className="w-56 border-r border-border bg-card flex flex-col shrink-0">
            <div className="p-5 border-b border-border">
              <Skeleton className="h-6 w-32" />
            </div>
            <nav className="flex-1 p-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </nav>
          </aside>
        )}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </main>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {showNav && (
        <aside className="w-56 sm:w-64 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-5 border-b border-border">
            <Link
              href="/dashboard"
              className="text-base font-bold text-card-foreground tracking-tight"
            >
              <Translatable id={CONTENT_KEYS.DASHBOARD.BRAND} />
            </Link>
          </div>

          <nav className="flex-1 p-3 space-y-0.5" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href) && pathname !== "/dashboard";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate">
                    <Translatable id={item.label as string} />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <Link href="/dashboard/sites">
              <Button size="sm" className="w-full text-xs" variant="outline">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <Translatable id={CONTENT_KEYS.DASHBOARD.BUTTON.CREATE_SITE} />
              </Button>
            </Link>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground truncate">
                <Translatable id={CONTENT_KEYS.DASHBOARD.ACCOUNT} />
              </span>
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-8 w-8" },
                }}
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className={cn("flex-1", showNav && "p-4 sm:p-6")}>{children}</div>
      </main>
    </div>
  );
}