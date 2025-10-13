import { ReactNode, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, HeartHandshake, BookOpenCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Trang điều khiển",
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

export function AuthenticatedLayout({
  title,
  description,
  children,
  className,
}: AuthenticatedLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <SidebarProvider className="bg-muted/40">
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-border px-4 py-4">
          <span className="text-lg font-semibold text-sidebar-foreground">
            99 Days Challenge
          </span>
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
        <SidebarSeparator />
        <SidebarFooter className="px-4 py-4">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="flex min-h-screen flex-col">
        <header className="flex items-center gap-4 border-b border-border bg-background/80 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="flex lg:hidden" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </header>
        <main className={cn("flex-1 px-6 py-6", className)}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AuthenticatedLayout;
