// src/app/dashboard/projects/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
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
} from "@/components/ui/accordion";
import { getProjects, type Project } from "@/services/projects";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


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

function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-3/4 pt-2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
      <CardContent>
        <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}


export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProjects() {
        setIsLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar projetos",
                description: "Não foi possível buscar os dados dos projetos.",
            });
        } finally {
            setIsLoading(false);
        }
    }
    fetchProjects();
  }, [toast]);

  const handleProjectAdded = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    toast({
        title: "Projeto Adicionado",
        description: `"${newProject.name}" foi criado com sucesso.`
    })
  };
  
  const institutionalProjects = useMemo(() => projects.filter(p => p.category === 'Institucional'), [projects]);
  const socialProjects = useMemo(() => projects.filter(p => p.category === 'Social'), [projects]);

  const socialProjectsCEAP = useMemo(() => socialProjects.filter(p => p.subcategory === 'CEAP'), [socialProjects]);
  const socialProjectsParceiros = useMemo(() => socialProjects.filter(p => p.subcategory === 'Parceiros'), [socialProjects]);
  const socialProjectsOutros = useMemo(() => socialProjects.filter(p => p.subcategory === 'Outros'), [socialProjects]);

  const renderProjectList = (projectList: Project[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      );
    }
    if (projectList.length === 0) {
      return <p className="text-center text-muted-foreground py-10">Nenhum projeto encontrado.</p>;
    }
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectList.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    );
  };

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
                 {renderProjectList(institutionalProjects)}
            </TabsContent>
            <TabsContent value="social" className="mt-6">
                <Accordion type="multiple" defaultValue={['ceap', 'parceiros', 'outros']} className="w-full space-y-4">
                    <AccordionItem value="ceap" className="border rounded-lg">
                        <AccordionTrigger className="px-4 text-lg font-headline">CEAP</AccordionTrigger>
                        <AccordionContent className="p-4">
                            {renderProjectList(socialProjectsCEAP)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="parceiros" className="border rounded-lg">
                        <AccordionTrigger className="px-4 text-lg font-headline">Parceiros</AccordionTrigger>
                        <AccordionContent className="p-4">
                           {renderProjectList(socialProjectsParceiros)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="outros" className="border rounded-lg">
                        <AccordionTrigger className="px-4 text-lg font-headline">Outros</AccordionTrigger>
                        <AccordionContent className="p-4">
                             {renderProjectList(socialProjectsOutros)}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </TabsContent>
        </Tabs>
    </div>
  );
}
