// src/app/dashboard/projects/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KanbanSquare, PlusCircle, Search } from "lucide-react";
import Link from "next/link";

const projects = [
    {
      id: "projeto-social",
      name: "Projeto Social Comunitário",
      description: "Iniciativa para capacitação de jovens em tecnologia e habilidades para o mercado de trabalho.",
      status: "Em Andamento",
      progress: 75,
    },
    {
      id: "marketing",
      name: "Campanha de Marketing Digital",
      description: "Campanha para arrecadação de fundos e divulgação da marca da organização.",
      status: "Em Andamento",
      progress: 40,
    },
    {
      id: "website",
      name: "Desenvolvimento do Website",
      description: "Criação do novo portal institucional com foco em usabilidade e doações.",
      status: "Aguardando Revisão",
      progress: 90,
    },
    {
        id: "evento-beneficente",
        name: "Evento Beneficente Anual",
        description: "Organização da festa julina para arrecadação de fundos e engajamento da comunidade.",
        status: "Planejamento",
        progress: 15,
    }
];

export default function ProjectsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Projetos
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os projetos da sua organização.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar projeto..." className="w-64 pl-9" />
            </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <KanbanSquare className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="font-headline pt-2">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
            <CardContent>
                <Link href={`/dashboard/projects/${project.id}`} passHref>
                    <Button className="w-full">Acessar Projeto</Button>
                </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
