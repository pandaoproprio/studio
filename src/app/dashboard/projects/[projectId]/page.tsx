// src/app/dashboard/projects/[projectId]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Upload, Users, Calendar, Activity, UserCheck, Code, UserCog } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { getProjects, type Project } from '@/services/projects';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


const roleIcons: { [key: string]: React.ElementType } = {
    'Product Owner': UserCog,
    'Scrum Master': UserCheck,
    'Time de Desenvolvimento': Code,
    'default': Users
}

export default function ProjectDashboardPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
        const fetchProject = async () => {
            setIsLoading(true);
            try {
                // In a real app, you would fetch a single project by ID.
                // Here, we fetch all and find the one we need.
                const allProjects = await getProjects();
                const currentProject = allProjects.find(p => p.id === projectId);
                setProject(currentProject || null);
            } catch (error) {
                console.error("Failed to fetch project", error);
                setProject(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);


    const recentActivities = [
        { id: 1, user: "Joana Silva", action: "moveu a tarefa 'Desenvolver front-end' para Concluído", time: "2 horas atrás" },
        { id: 2, user: "Carlos Andrade", action: "adicionou um novo comentário na tarefa 'Conectar com gateway'", time: "ontem" },
        { id: 3, user: "Beatriz Costa", action: "criou a tarefa 'Revisar documentação da API'", time: "2 dias atrás" },
    ];

    if (isLoading) {
        return (
             <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card><CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-full mt-2" /><Skeleton className="h-4 w-5/6 mt-1" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
                        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                    </div>
                    <div className="space-y-6">
                        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-5 w-full" /><Skeleton className="h-5 w-full" /></CardContent></Card>
                        <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></CardContent></Card>
                         <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></CardContent></Card>
                    </div>
                </div>
            </div>
        )
    }

    if (!project) {
        return <div>Projeto não encontrado.</div>
    }

    const spent = project.budget ? project.progress / 100 * project.budget : 0;
    const remaining = project.budget ? project.budget - spent : 0;
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{project.name}</CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Progresso</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} />
                                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                    <span>Início: {project.startDate}</span>
                                    <span>Término: {project.endDate}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Atividade Recente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {recentActivities.map(activity => (
                                    <li key={activity.id} className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                            <Activity className="h-4 w-4"/>
                                        </div>
                                        <div>
                                            <p className="text-sm"><span className="font-semibold">{activity.user}</span> {activity.action}.</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                 {/* Coluna Lateral */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Equipe do Projeto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             {project.team && project.team.length > 0 ? project.team.map(member => {
                                const Icon = roleIcons[member.role] || roleIcons.default;
                                return (
                                    <div key={member.role} className="flex items-center gap-3 text-sm">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback><Icon className="h-5 w-5" /></AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-muted-foreground">{member.role}</p>
                                            <p>{member.name}</p>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma equipe definida.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Financeiro</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Orçamento</span>
                                <span className="font-semibold">{project.budget?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Gasto</span>
                                <span className="font-semibold">{spent > 0 ? spent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Disponível</span>
                                <span className="font-semibold text-green-600">{remaining > 0 ? remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}</span>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/dashboard/projects/${projectId}/financials`}>Ver Detalhes</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Documentos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm border-b pb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground"/>
                                    <span>escopo_do_projeto_v2.pdf</span>
                                </div>
                                <span className="text-muted-foreground">1.2MB</span>
                            </div>
                             <div className="flex items-center justify-between text-sm border-b pb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground"/>
                                    <span>apresentacao_kickoff.pptx</span>
                                </div>
                                <span className="text-muted-foreground">4.5MB</span>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/dashboard/projects/${projectId}/documents`}>
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Adicionar/Ver Documentos
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}