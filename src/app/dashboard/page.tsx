
import { KeyMetrics } from "@/components/dashboard/key-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, KanbanSquare, Users, FileText, Truck, Package, Clapperboard, Handshake, DoorOpen } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Bem-vinda, Joana!
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo das atividades da sua organização.
        </p>
      </div>

      <KeyMetrics />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ActionCard
            href="/dashboard/projects"
            icon={KanbanSquare}
            title="Gerenciar Projetos"
            description="Acesse seus quadros Kanban e cronogramas Gantt."
            buttonText="Ver Projetos"
        />
         <ActionCard
            href="/dashboard/crm"
            icon={Handshake}
            title="Gestão de Relacionamento"
            description="Gerencie doadores, voluntários e parceiros."
            buttonText="Acessar CRM"
        />
        <ActionCard
            href="/dashboard/hr"
            icon={Users}
            title="Gestão de Pessoas"
            description="Administre colaboradores, férias e avaliações."
            buttonText="Acessar RH"
        />
        <ActionCard
            href="/dashboard/rooms"
            icon={DoorOpen}
            title="Reservar Salas"
            description="Agende e gerencie o uso das salas de reunião."
            buttonText="Ver Calendário"
        />
         <ActionCard
            href="/dashboard/suppliers"
            icon={Truck}
            title="Gestão de Fornecedores"
            description="Centralize as informações e o relacionamento com seus fornecedores."
            buttonText="Ver Fornecedores"
        />
        <ActionCard
            href="/dashboard/assets"
            icon={Package}
            title="Gestão de Ativos"
            description="Monitore e gerencie os ativos da sua organização."
            buttonText="Ver Ativos"
        />
        <ActionCard
            href="/dashboard/feed"
            icon={Clapperboard}
            title="Comunicação"
            description="Acesse o feed de notícias e comunicados."
            buttonText="Ver Feed"
        />
        <ActionCard
            href="/dashboard/reports/impact-generator"
            icon={FileText}
            title="Gerar Relatório"
            description="Use IA para criar relatórios de impacto detalhados."
            buttonText="Novo Relatório"
        />
      </div>
    </div>
  );
}

function ActionCard({ href, icon: Icon, title, description, buttonText }: { href:string, icon: React.ElementType, title: string, description: string, buttonText: string }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-grow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow justify-between">
                <p className="text-muted-foreground mb-4 text-sm">{description}</p>
                <Link href={href} passHref>
                    <Button className="w-full">{buttonText}</Button>
                </Link>
            </CardContent>
        </Card>
    )
}
