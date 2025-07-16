
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  CreditCard,
  FileText,
  Bot,
  Leaf,
  Truck,
  Package,
  Clapperboard,
  Handshake,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projetos", icon: KanbanSquare },
  { href: "/dashboard/crm", label: "CRM", icon: Handshake },
  { href: "/dashboard/hr", label: "AnnIRH", icon: Users },
  { href: "/dashboard/suppliers", label: "Fornecedores", icon: Truck },
  { href: "/dashboard/assets", label: "Ativos", icon: Package },
  { href: "/dashboard/feed", label: "Feed", icon: Clapperboard },
  { href: "/dashboard/billing", label: "Assinatura", icon: CreditCard },
  { href: "/dashboard/reports", label: "Relatórios IA", icon: Bot,
    subItems: [
        { href: "/dashboard/reports/impact-generator", label: "Gerador de Impacto"},
    ]
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (item.href === '/dashboard') {
      return pathname === item.href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar variant="sidebar" side="left" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 p-2">
            <div className="flex items-center justify-center rounded-lg bg-primary p-2">
                <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
          <span className="font-headline text-lg font-semibold tracking-tight text-sidebar-foreground">
            AnnIConecta
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
             <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={{
                      children: item.label,
                      side: "right",
                    }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
