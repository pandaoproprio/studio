// src/components/dashboard/quick-access-carousel.tsx
"use client"
import { KanbanSquare, Handshake, Users, DoorOpen, Truck, Package, Clapperboard, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const actions = [
  { href: "/dashboard/projects", icon: KanbanSquare, title: "Gerenciar Projetos", description: "Acesse seus quadros Kanban e cronogramas." },
  { href: "/dashboard/crm", icon: Handshake, title: "Gestão de Relacionamento", description: "Gerencie doadores, voluntários e parceiros." },
  { href: "/dashboard/hr", icon: Users, title: "Gestão de Pessoas", description: "Administre colaboradores, férias e avaliações." },
  { href: "/dashboard/rooms", icon: DoorOpen, title: "Reservar Salas", description: "Agende e gerencie o uso das salas de reunião." },
  { href: "/dashboard/suppliers", icon: Truck, title: "Gestão de Fornecedores", description: "Centralize as informações dos fornecedores." },
  { href: "/dashboard/assets", icon: Package, title: "Gestão de Ativos", description: "Monitore e gerencie os ativos da organização." },
  { href: "/dashboard/feed", icon: Clapperboard, title: "Comunicação", description: "Acesse o feed de notícias e comunicados." },
  { href: "/dashboard/reports/impact-generator", icon: FileText, title: "Gerar Relatório de Impacto", description: "Use IA para criar relatórios detalhados." },
];

export function QuickAccessCarousel() {
  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle className="font-headline">Acesso Rápido</CardTitle>
            <CardDescription>Navegue para os principais módulos.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
            <Carousel
                opts={{
                align: "start",
                }}
                className="w-full max-w-xs"
            >
                <CarouselContent>
                {actions.map((action, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <ActionCard {...action} />
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </CardContent>
    </Card>
  );
}


function ActionCard({ href, icon: Icon, title, description }: { href: string, icon: React.ElementType, title: string, description: string }) {
    return (
        <Card className="flex flex-col h-full text-center items-center shadow-lg">
            <CardHeader className="items-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-7 w-7" />
                </div>
                <CardTitle className="font-headline text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow justify-between">
                <p className="text-muted-foreground mb-4 text-sm">{description}</p>
                <Link href={href} passHref>
                    <Button className="w-full">Acessar</Button>
                </Link>
            </CardContent>
        </Card>
    )
}
