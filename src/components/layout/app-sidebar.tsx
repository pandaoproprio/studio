// src/components/layout/app-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  CreditCard,
  Bot,
  Leaf,
  Truck,
  Package,
  Clapperboard,
  Handshake,
  DoorOpen,
  UserCog,
  FileSignature,
  Film,
  Building,
  FileText,
  HeartPulse,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";


const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
      id: "management",
      label: "Gestão", 
      icon: Building,
      subItems: [
        { href: "/dashboard/projects", label: "Projetos", icon: KanbanSquare },
        { href: "/dashboard/contracts", label: "Contratos", icon: FileSignature },
        { href: "/dashboard/assets", label: "Ativos", icon: Package },
        { href: "/dashboard/suppliers", label: "Fornecedores", icon: Truck },
        { href: "/dashboard/rooms", label: "Salas", icon: DoorOpen },
      ]
  },
   { 
      id: "relationships",
      label: "Relacionamentos", 
      icon: Handshake,
      subItems: [
        { href: "/dashboard/crm", label: "CRM", icon: Handshake },
        { href: "/dashboard/hr", label: "RH", icon: Users },
      ]
  },
  { href: "/dashboard/feed", label: "Feed", icon: Clapperboard },
  { 
    id: "reports",
    label: "Relatórios IA", 
    icon: Bot,
    subItems: [
        { href: "/dashboard/reports/impact-generator", label: "Gerador de Impacto", icon: FileText},
        { href: "/dashboard/reports/progress-generator", label: "Gerador de Progresso", icon: FileText},
        { href: "/dashboard/video-generator", label: "Gerador de Vídeo", icon: Film },
        { href: "/dashboard/reports/organizational-diagnosis", label: "Diagnóstico Organizacional", icon: HeartPulse },
        { href: "/dashboard/reports/corporate-risk-analysis", label: "Análise de Risco", icon: TrendingDown },
    ]
  },
  { 
    id: "settings",
    label: "Administração", 
    icon: UserCog,
    subItems: [
       { href: "/dashboard/users", label: "Gerenciar Usuários", icon: UserCog },
       { href: "/dashboard/billing", label: "Assinatura", icon: CreditCard },
    ]
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isSectionActive = (item: any) => {
    if (!item.subItems) return false;
    return item.subItems.some((subItem: any) => pathname.startsWith(subItem.href));
  }
  

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
             item.subItems ? (
                <Collapsible key={item.id} asChild defaultOpen={isSectionActive(item)}>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                className="justify-between"
                                isActive={isSectionActive(item)}
                                tooltip={{
                                    children: item.label,
                                    side: "right",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <item.icon />
                                    <span>{item.label}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                            <SidebarMenuSub>
                                {item.subItems.map(subItem => (
                                <SidebarMenuSubItem key={subItem.href}>
                                    <SidebarMenuSubButton asChild isActive={isActive(subItem.href)}>
                                      <Link href={subItem.href}>
                                        {subItem.icon && <subItem.icon />}
                                        {subItem.label}
                                      </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
              </Collapsible>
             ) : (
                <SidebarMenuItem key={item.href!}>
                    <Link href={item.href!}>
                    <SidebarMenuButton
                        isActive={isActive(item.href!)}
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
             )
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}