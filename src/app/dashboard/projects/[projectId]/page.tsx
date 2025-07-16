// src/app/dashboard/projects/[projectId]/page.tsx
"use client";

import { useState } from "react";
import { KanbanBoard, type TaskWithColumn } from "@/components/projects/kanban-board";
import { GanttChart } from "@/components/projects/gantt-chart";
import { Button } from "@/components/ui/button";
import { Plus, GanttChartSquare, KanbanSquare, ArrowLeft, ShieldAlert, Loader2 } from "lucide-react";
import { ProjectSwitcher } from "@/components/projects/project-switcher";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { projectRiskAnalysisAction } from "@/lib/actions";
import { type AnalyzeTaskRiskOutput } from "@/ai/flows/project-risk-analysis";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { initialColumns } from "@/components/projects/kanban-board";


type View = "kanban" | "gantt";
type RiskAnalysisResult = { task: TaskWithColumn, analysis: AnalyzeTaskRiskOutput };

export default function ProjectBoardPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [view, setView] = useState<View>("kanban");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskResult, setRiskResult] = useState<RiskAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleRiskAnalysis = async () => {
    setIsAnalyzing(true);
    setRiskResult(null);

    // In a real app, you'd fetch tasks from a DB. Here we simulate scanning them.
    // We'll just pick one "at-risk" task for demonstration.
    const taskToAnalyze = initialColumns
      .find(c => c.id === 'in-progress')?.tasks
      .find(t => t.id === 'task-5');

    if (!taskToAnalyze) {
      toast({
        title: "Análise Concluída",
        description: "Nenhuma tarefa de alto risco imediato foi encontrada.",
      });
      setIsAnalyzing(false);
      return;
    }

    try {
      const result = await projectRiskAnalysisAction({
        taskTitle: taskToAnalyze.title,
        taskDescription: taskToAnalyze.description,
        taskPriority: taskToAnalyze.priority,
        daysInCurrentStatus: 7, // Simulated value for demonstration
      });

      if (result.data && result.data.isAtRisk) {
        setRiskResult({
          task: { ...taskToAnalyze, columnId: 'in-progress' },
          analysis: result.data,
        });
      } else if(result.error) {
         toast({ variant: "destructive", title: "Erro na Análise", description: result.error });
      } else {
         toast({
            title: "Análise Concluída",
            description: "Nenhum risco crítico encontrado no momento.",
         });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Erro Inesperado", description: "Falha ao executar a análise de risco." });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleRiskDialogAction = (action: 'move' | 'ignore' | 'view') => {
    if (!riskResult) return;
    
    if (action === 'move') {
        toast({
            title: "Ação Registrada",
            description: `A tarefa "${riskResult.task.title}" foi movida para 'Impedido'.`
        });
        // Here you would add the logic to actually move the task between columns.
    }
    setRiskResult(null);
  }


  return (
    <>
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
                <p className="text-muted-foreground">
                    Projeto: {projectId}
                </p>
              </div>
          </div>
          <div className="flex gap-2">
              <Button
                  variant="outline"
                  onClick={handleRiskAnalysis}
                  disabled={isAnalyzing}
              >
                  {isAnalyzing ? (
                      <> <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analisando... </>
                  ) : (
                      <> <ShieldAlert className="mr-2 h-4 w-4"/> Análise de Risco por IA </>
                  )}
              </Button>
              <Button
                  variant="outline"
                  onClick={() => setView(view === "kanban" ? "gantt" : "kanban")}
              >
                  {view === "kanban" ? (
                  <>
                      <GanttChartSquare className="mr-2 h-4 w-4" />
                      Ver Gantt
                  </>
                  ) : (
                  <>
                      <KanbanSquare className="mr-2 h-4 w-4" />
                      Ver Kanban
                  </>
                  )}
              </Button>
              <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Tarefa
              </Button>
          </div>
        </div>
        <div className="flex-1">
          {view === "kanban" ? <KanbanBoard /> : <GanttChart />}
        </div>
      </div>

      {riskResult && (
        <AlertDialog open={!!riskResult} onOpenChange={(open) => !open && setRiskResult(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-destructive" />
                Guardião do Projeto: Risco Identificado
              </AlertDialogTitle>
              <AlertDialogDescription>
                A IA analisou a tarefa <strong>"{riskResult.task.title}"</strong> e a marcou como um risco potencial para o projeto.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4 text-sm">
                <p className="font-semibold">Justificativa da IA:</p>
                <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                   "{riskResult.analysis.reason}"
                </blockquote>
                <p>
                    <span className="font-semibold">Confiança da Análise:</span> {(riskResult.analysis.confidenceScore * 100).toFixed(0)}%
                </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => handleRiskDialogAction('ignore')}>Ignorar por agora</AlertDialogCancel>
              <Button variant="secondary" onClick={() => handleRiskDialogAction('view')}>Ver Tarefa</Button>
              <AlertDialogAction asChild>
                <Button onClick={() => handleRiskDialogAction('move')}>Mover para Impedido</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
