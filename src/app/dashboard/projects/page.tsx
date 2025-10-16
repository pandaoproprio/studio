// src/app/dashboard/projects/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KanbanSquare, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { AddProjectDialog } from "@/components/projects/add-project-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  category: 'Institucional' | 'Social';
  subcategory?: 'CEAP' | 'Parceiros' | 'Outros';
  budget?: number;
  startDate?: string;
  endDate?: string;
}

const initialProjects: Project[] = [
    {
      id: "projeto-social",
      name: "Projeto Social Comunitário",
      description: "Iniciativa para capacitação de jovens em tecnologia e habilidades para o mercado de trabalho.",
      status: "Em Andamento",
      progress: 75,
      category: 'Social',
      subcategory: 'CEAP',
    },
    {
      id: "marketing",
      name: "Campanha de Marketing Digital",
      description: "Campanha para arrecadação de fundos e divulgação da marca da organização.",
      status: "Em Andamento",
      progress: 40,
      category: 'Institucional',
    },
    {
      id: "website",
      name: "Desenvolvimento do Website",
      description: "Criação do novo portal institucional com foco em usabilidade e doações.",
      status: "Aguardando Revisão",
      progress: 90,
      category: 'Institucional',
    },
    {
        id: "evento-beneficente",
        name: "Evento Beneficente Anual",
        description: "Organização da festa julina para arrecadação de fundos e engajamento da comunidade.",
        status: "Planejamento",
        progress: 15,
        category: 'Social',
        subcategory: 'Parceiros',
    }
];

function ProjectCard({ project }: { project: Project }) {
    return (
        <Card className="flex flex-col">
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
                <div className="space-y-2 mb-4">
                    <Progress value={project.progress} />
                    <div className="text-xs text-muted-foreground">{project.status} - {project.progress}%</div>
                </div>
                <Link href={`/dashboard/projects/${project.id}`} passHref>
                    <Button className="w-full">Acessar Projeto</Button>
                </Link>
            </CardContent>
        </Card>
    );
}


export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleProjectAdded = (newProjectData: Omit<Project, 'id' | 'status' | 'progress'>) => {
    const newProject: Project = {
      ...newProjectData,
      id: newProjectData.name.toLowerCase().replace(/\s+/g, '-'),
      status: 'Planejamento',
      progress: 0,
    };
    setProjects(prev => [newProject, ...prev]);
  };
  
  const institutionalProjects = useMemo(() => projects.filter(p => p.category === 'Institucional'), [projects]);
  const socialProjects = useMemo(() => projects.filter(p => p.category === 'Social'), [projects]);

  const socialProjectsCEAP = useMemo(() => socialProjects.filter(p => p.subcategory === 'CEAP'), [socialProjects]);
  const socialProjectsParceiros = useMemo(() => socialProjects.filter(p => p.subcategory === 'Parceiros'), [socialProjects]);
  const socialProjectsOutros = useMemo(() => socialProjects.filter(p => p.subcategory === 'Outros'), [socialProjects]);


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
            <AddProjectDialog onProjectAdded={handleProjectAdded}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Projeto
              </Button>
            </AddProjectDialog>
        </div>
      </div>
      
        <Tabs defaultValue="social">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="institutional">Projetos Institucionais</TabsTrigger>
                <TabsTrigger value="social">Projetos Sociais</TabsTrigger>
            </TabsList>
            <TabsContent value="institutional" className="mt-6">
                 {institutionalProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {institutionalProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                    </div>
                 ) : (
                    <p className="text-center text-muted-foreground py-10">Nenhum projeto institucional encontrado.</p>
                 )}
            </TabsContent>
            <TabsContent value="social" className="mt-6">
                <Accordion type="multiple" defaultValue={['ceap', 'parceiros', 'outros']} className="w-full space-y-4">
                    <AccordionItem value="ceap" className="border rounded-lg">
                        <AccordionTrigger className="px-4 text-lg font-headline">CEAP</AccordionTrigger>
                        <AccordionContent className="p-4">
                            {socialProjectsCEAP.length > 0 ? (
                               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                   {socialProjectsCEAP.map(p => <ProjectCard key={p.id} project={p} />)}
                               </div>
                            ) : <p className="text-center text-muted-foreground py-6">Nenhum projeto do CEAP.</p>}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="parceiros" className="border rounded-lg">
                        <AccordionTrigger className="px-4 text-lg font-headline">Parceiros</AccordionTrigger>
                        <AccordionContent className="p-4">
                            {socialProjectsParceiros.length > 0 ? (
                               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                   {socialProjectsParceiros.map(p => <ProjectCard key={p.id} project={p} />)}
                               </div>
                            ) : <p className="text-center text-muted-foreground py-6">Nenhum projeto de Parceiros.</p>}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="outros" className="border rounded-lg">
                        <AccordionTrigger className="px-4 text-lg font-headline">Outros</AccordionTrigger>
                        <AccordionContent className="p-4">
                             {socialProjectsOutros.length > 0 ? (
                               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                   {socialProjectsOutros.map(p => <ProjectCard key={p.id} project={p} />)}
                               </div>
                            ) : <p className="text-center text-muted-foreground py-6">Nenhum outro projeto social.</p>}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </TabsContent>
        </Tabs>
    </div>
  );
}
