// src/app/dashboard/reports/progress-generator/page.tsx
"use client";

import { useState, useMemo, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateProgressReportAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { initialColumns as kanbanData } from '@/components/projects/kanban-board';

const projects = [
    { id: "projeto-social", name: "Projeto Social Comunitário" },
    { id: "marketing", name: "Campanha de Marketing Digital" },
    { id: "website", name: "Desenvolvimento do Website" },
    { id: "evento-beneficente", name: "Evento Beneficente Anual" }
];

const initialState = {
  message: "",
  data: null,
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analisando e Gerando...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Gerar Relatório com IA
        </>
      )}
    </Button>
  );
}

export default function ProgressGeneratorPage() {
  const [state, formAction] = useActionState(generateProgressReportAction, initialState);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const projectData = useMemo(() => {
    if (!selectedProjectId) return null;
    
    // Simulação de busca de dados do projeto. Em uma aplicação real, isso seria uma chamada a uma API.
    const tasksTodo = kanbanData.find(c => c.id === 'todo')?.tasks.map(t => t.title) || [];
    const tasksInProgress = kanbanData.find(c => c.id === 'in-progress')?.tasks.map(t => t.title) || [];
    const tasksDone = kanbanData.find(c => c.id === 'done')?.tasks.map(t => t.title) || [];

    return {
      projectName: projects.find(p => p.id === selectedProjectId)?.name || 'Projeto Desconhecido',
      tasksTodo,
      tasksInProgress,
      tasksDone,
    };
  }, [selectedProjectId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Gerador de Relatório de Progresso com IA
        </h1>
        <p className="text-muted-foreground">
          Selecione um projeto, ajuste o contexto e deixe a IA criar um relatório de status personalizado.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Parâmetros do Relatório</CardTitle>
            <CardDescription>
              Forneça o contexto para a IA gerar o relatório mais preciso e eficaz.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectId">Projeto</Label>
                <Select name="projectId" onValueChange={setSelectedProjectId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {state.errors?.projectId && (
                    <p className="text-sm text-destructive">{state.errors.projectId[0]}</p>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="targetAudience">Público-Alvo</Label>
                    <Select name="targetAudience" defaultValue="Stakeholders">
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o público" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Stakeholders">Stakeholders</SelectItem>
                            <SelectItem value="Equipe Interna">Equipe Interna</SelectItem>
                            <SelectItem value="Doadores">Doadores</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="tone">Tom do Relatório</Label>
                    <Select name="tone" defaultValue="Formal">
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tom" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Formal">Formal</SelectItem>
                            <SelectItem value="Otimista">Otimista</SelectItem>
                            <SelectItem value="Cauteloso">Cauteloso</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalContext">Contexto Adicional (Opcional)</Label>
                <Textarea
                    id="additionalContext"
                    name="additionalContext"
                    placeholder="Forneça qualquer informação extra que a IA deva considerar, como moral da equipe, feedbacks de clientes, bloqueios externos, etc."
                    rows={4}
                />
              </div>

              {/* Hidden fields to pass data to the action */}
              {projectData && (
                <>
                    <input type="hidden" name="projectName" value={projectData.projectName} />
                    <input type="hidden" name="tasksTodo" value={JSON.stringify(projectData.tasksTodo)} />
                    <input type="hidden" name="tasksInProgress" value={JSON.stringify(projectData.tasksInProgress)} />
                    <input type="hidden" name="tasksDone" value={JSON.stringify(projectData.tasksDone)} />
                </>
              )}

              <SubmitButton />
            </form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Relatório Gerado</CardTitle>
            <CardDescription>O relatório de progresso personalizado pela IA aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
              <div className="prose prose-sm max-w-none h-full rounded-lg border bg-secondary/50 p-4 overflow-y-auto">
              {state.data ? (
                  <div className="whitespace-pre-wrap font-body text-sm" dangerouslySetInnerHTML={{ __html: state.data.report }} />
              ) : (
                  <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                      <p>Aguardando geração do relatório...</p>
                  </div>
              )}
              {state.message && !state.data && (
                  <Alert variant={state.errors ? "destructive" : "default"} className="mt-4">
                      <AlertTitle>{state.errors ? "Erro" : "Status"}</AlertTitle>
                      <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
              )}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}