
import { AccountStatus } from "@/components/dashboard/account-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, KanbanSquare, Users, FileText, Truck } from "lucide-react";
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

      <AccountStatus />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ActionCard
            href="/dashboard/projects"
            icon={KanbanSquare}
            title="Gerenciar Projetos"
            description="Acesse seus quadros Kanban e cronogramas Gantt."
            buttonText="Ver Projetos"
        />
        <ActionCard
            href="/dashboard/hr"
            icon={Users}
            title="Gestão de Pessoas"
            description="Administre colaboradores, férias e avaliações."
            buttonText="Acessar AnnIRH"
        />
         <ActionCard
            href="/dashboard/suppliers"
            icon={Truck}
            title="Gestão de Fornecedores"
            description="Centralize as informações e o relacionamento com seus fornecedores."
            buttonText="Ver Fornecedores"
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
