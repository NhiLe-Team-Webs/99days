import { ReactNode, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, HeartHandshake, BookOpenCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Bảng điều khiển",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Biết ơn",
    to: "/gratitude",
    icon: HeartHandshake,
  },
  {
    label: "Trả bài",
    to: "/homework",
    icon: BookOpenCheck,
  },
  {
    label: "Cập nhật tiến độ",
    to: "/progress",
    icon: Activity,
  },
];

interface AuthenticatedLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

function ExpandSidebarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
      <path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z" />
    </svg>
  );
}

function CollapseSidebarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
      <path d="M440-280v-400L240-480l200 200Zm80 160h80v-720h-80v720Z" />
    </svg>
  );
}

export function AuthenticatedLayout({
  title,
  description,
  children,
  className,
}: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider className="bg-muted/40">
      <AuthenticatedLayoutContent title={title} description={description} className={className}>
        {children}
      </AuthenticatedLayoutContent>
    </SidebarProvider>
  );
}

function AuthenticatedLayoutContent({
  title,
  description,
  children,
  className,
}: AuthenticatedLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();

  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Đăng xuất thất bại:", error.message);
      }
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    } finally {
      navigate("/");
    }
  }, [navigate]);

  const isCollapsed = state === "collapsed";

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-between border-b border-border px-3 py-3">
          {!isCollapsed ? (
            <span className="text-lg font-semibold text-sidebar-foreground">99 Days Challenge</span>
          ) : (
            <span className="sr-only">99 Days Challenge</span>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-md border border-border bg-background p-1.5 transition hover:bg-muted"
            aria-label={isCollapsed ? "Mở thanh điều hướng" : "Thu gọn thanh điều hướng"}
          >
            {isCollapsed ? <ExpandSidebarIcon /> : <CollapseSidebarIcon />}
          </button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Điều hướng</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;

                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link to={item.to} className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {!isCollapsed ? (
          <>
            <SidebarSeparator />
            <SidebarFooter className="px-4 py-4">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </SidebarFooter>
          </>
        ) : null}
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="flex min-h-screen flex-col">
        <header className="flex items-center gap-4 border-b border-border bg-background/80 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="flex lg:hidden" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </header>
        <main className={cn("flex-1 px-6 py-6", className)}>{children}</main>
      </SidebarInset>
    </>
  );
}

export default AuthenticatedLayout;
