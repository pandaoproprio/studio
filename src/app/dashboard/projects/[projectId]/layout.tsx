// src/app/dashboard/projects/[projectId]/layout.tsx
"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, KanbanSquare, DollarSign, FileText, Image } from "lucide-react";
import { ProjectSwitcher } from "@/components/projects/project-switcher";
import { cn } from "@/lib/utils";

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string;

  const navItems = [
    { href: `/dashboard/projects/${projectId}`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/dashboard/projects/${projectId}/board`, label: "Quadro", icon: KanbanSquare },
    { href: `/dashboard/projects/${projectId}/financials`, label: "Financeiro", icon: DollarSign },
    { href: `/dashboard/projects/${projectId}/documents`, label: "Documentos", icon: FileText },
    { href: `/dashboard/projects/${projectId}/photos`, label: "Fotos", icon: Image },
  ];

  return (
    <div className="flex h-full flex-col space-y-6">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/projects">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Voltar para Projetos</span>
                </Link>
              </Button>
              <div>
                <ProjectSwitcher />
              </div>
          </div>
        </div>

        <nav className="flex border-b">
            {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium",
                    pathname === item.href
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                >
                <item.icon className="h-4 w-4" />
                {item.label}
            </Link>
            ))}
        </nav>

        <div className="flex-1 overflow-y-auto">
            {children}
        </div>
    </div>
  );
}
