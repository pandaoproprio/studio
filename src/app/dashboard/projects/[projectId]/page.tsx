// src/app/dashboard/projects/[projectId]/page.tsx

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Upload, Users, Calendar, Activity } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from 'next/navigation';


// Mock data, to be replaced with real data
const projectDetails = {
    name: "Projeto Social Comunitário",
    description: "Iniciativa para capacitação de jovens em tecnologia e habilidades para o mercado de trabalho na comunidade 'Esperança'. O projeto visa não apenas fornecer conhecimento técnico, mas também desenvolver competências socioemocionais, preparando os participantes para os desafios do futuro e promovendo a inclusão digital e social.",
    progress: 75,
    status: "Em Andamento",
    startDate: "01/02/2024",
    endDate: "01/08/2024",
    budget: "R$ 25.000,00",
    spent: "R$ 18.750,00",
};


const recentActivities = [
    { id: 1, user: "Joana Silva", action: "moveu a tarefa 'Desenvolver front-end' para Concluído", time: "2 horas atrás" },
    { id: 2, user: "Carlos Andrade", action: "adicionou um novo comentário na tarefa 'Conectar com gateway'", time: "ontem" },
    { id: 3, user: "Beatriz Costa", action: "criou a tarefa 'Revisar documentação da API'", time: "2 dias atrás" },
];

export default function ProjectDashboardPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{projectDetails.name}</CardTitle>
                            <CardDescription>{projectDetails.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Progresso</span>
                                    <span>{projectDetails.progress}%</span>
                                </div>
                                <Progress value={projectDetails.progress} />
                                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                    <span>Início: {projectDetails.startDate}</span>
                                    <span>Término: {projectDetails.endDate}</span>
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
                            <CardTitle className="font-headline">Financeiro</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Orçamento</span>
                                <span className="font-semibold">{projectDetails.budget}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Gasto</span>
                                <span className="font-semibold">{projectDetails.spent}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Disponível</span>
                                <span className="font-semibold text-green-600">R$ 6.250,00</span>
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