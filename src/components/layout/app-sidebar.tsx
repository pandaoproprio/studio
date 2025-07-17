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
  SidebarMenuSubItem,
  SidebarMenuSubContent,
  SidebarMenuSubTrigger
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
  TrendingDown,
  BookMarked,
  DollarSign,
  Receipt,
  FileCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { 
      id: "management",
      label: "Gestão", 
      icon: Building,
      subItems: [
        { href: "/dashboard/projects", label: "Projetos", icon: KanbanSquare },
        { 
          label: "Financeiro", 
          icon: DollarSign,
          subItems: [
            { href: "/dashboard/financial", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/financials/transactions", label: "Transações", icon: FileText },
            { href: "/dashboard/financial/reimbursements", label: "Gestão de Reembolsos", icon: FileCheck },
          ]
        },
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
        { href: "/dashboard/reimbursements", label: "Solicitar Reembolso", icon: Receipt },
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
        { href: "/dashboard/reports/academic-research-assistant", label: "Assistente de Pesquisa", icon: BookMarked },
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
    if (!href) return false;
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
  
  const renderMenuItems = (items: any[]) => {
    return items.map((item) => {
      if (item.subItems) {
        return (
          <SidebarMenuItem key={item.id || item.label}>
            <SidebarMenuSub>
                <SidebarMenuSubTrigger 
                    isActive={item.subItems.some((si: any) => si.href && isActive(si.href))}
                    tooltip={{ children: item.label, side: "right" }}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuSubTrigger>
                <SidebarMenuSubContent>
                    {item.subItems.map((subItem: any) => {
                        if (subItem.subItems) { // For nested submenus
                           return (
                             <SidebarMenuSub key={subItem.label}>
                                <SidebarMenuSubTrigger isActive={subItem.subItems.some((ssi: any) => ssi.href && isActive(ssi.href))}>
                                   <SidebarMenuButton asChild isActive={isActive(subItem.href)}>
                                    <>
                                      <subItem.icon />
                                      <span>{subItem.label}</span>
                                    </>
                                  </SidebarMenuButton>
                                </SidebarMenuSubTrigger>
                                <SidebarMenuSubContent>
                                    {subItem.subItems.map((ssi: any) => (
                                         <SidebarMenuSubItem key={ssi.href} asChild isActive={isActive(ssi.href)}>
                                            <Link href={ssi.href}><ssi.icon />{ssi.label}</Link>
                                         </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSubContent>
                            </SidebarMenuSub>
                           )
                        }
                        return (
                            <SidebarMenuSubItem key={subItem.href} asChild isActive={isActive(subItem.href)}>
                                <Link href={subItem.href}><subItem.icon />{subItem.label}</Link>
                            </SidebarMenuSubItem>
                        )
                    })}
                </SidebarMenuSubContent>
            </SidebarMenuSub>
          </SidebarMenuItem>
        );
      }
      return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={isActive(item.href)}
            tooltip={{
              children: item.label,
              side: "right",
            }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });
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
            {renderMenuItems(menuItems)}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
