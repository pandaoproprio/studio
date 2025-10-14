// src/app/dashboard/reports/a3-problem-solving/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { a3ProblemSolvingAction } from "@/lib/actions";
import { A3ProblemSolvingInputSchema, type A3ProblemSolvingInput, type A3ProblemSolvingOutput } from "@/ai/schemas/a3-problem-solving-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Search, Zap, ListChecks, Target, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const initialState: {
  message: string;
  data?: A3ProblemSolvingOutput | null;
  errors?: any;
} = {
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
          Analisando e Gerando A3...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Gerar Análise A3 com IA
        </>
      )}
    </Button>
  );
}

export default function A3ProblemSolvingPage() {
  const [state, formAction] = useActionState(a3ProblemSolvingAction, initialState);
  
  const form = useForm<A3ProblemSolvingInput>({
    resolver: zodResolver(A3ProblemSolvingInputSchema),
    defaultValues: {
      background: "",
      currentState: "",
      goals: "",
    },
  });

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Assistente de Resolução de Problemas (A3)
        </h1>
        <p className="text-muted-foreground">
          Use a metodologia A3 e a IA para analisar problemas complexos e criar planos de ação eficazes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Descrição do Problema</CardTitle>
            <CardDescription>
              Forneça as informações iniciais para a IA construir o relatório A3.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form action={formAction} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="background"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>1. Fundo ou Contexto do Problema</FormLabel>
                            <FormControl>
                                <Textarea rows={4} placeholder="Ex: A participação em nossos eventos de voluntariado tem diminuído nos últimos 3 meses, impactando a execução dos projetos." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="currentState"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>2. Estado Atual e Evidências</FormLabel>
                            <FormControl>
                                <Textarea rows={4} placeholder="Ex: A taxa de comparecimento caiu de 80% para 50%. Feedbacks informais mencionam 'falta de comunicação clara' e 'pouca antecedência na convocação'." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>3. Objetivos e Metas</FormLabel>
                            <FormControl>
                                <Textarea rows={2} placeholder="Ex: Aumentar a taxa de comparecimento dos voluntários para 75% em 60 dias. Melhorar a satisfação dos voluntários em 20%." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SubmitButton />
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Relatório A3 Gerado pela IA</CardTitle>
            <CardDescription>A análise e o plano de ação da IA aparecerão aqui.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            {state.data ? (
                <div className="w-full space-y-4 overflow-y-auto max-h-[80vh] pr-2">
                    <ResultCard icon={Search} title="4. Análise de Causa Raiz (5 Porquês)">
                       <ul className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                            {state.data.rootCauseAnalysis.map((item, index) => <li key={index} className="pl-2">{item}</li>)}
                       </ul>
                    </ResultCard>

                    <ResultCard icon={ListChecks} title="5. Plano de Ação">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>O Quê?</TableHead>
                                    <TableHead>Quem?</TableHead>
                                    <TableHead>Quando?</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {state.data.actionPlan.map((action, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{action.what}</TableCell>
                                        <TableCell>{action.who}</TableCell>
                                        <TableCell>{action.when}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ResultCard>
                     <ResultCard icon={Target} title="6. Resultados Esperados e Acompanhamento">
                        <h4 className="font-semibold text-foreground">Resultados Esperados</h4>
                        <p className="text-muted-foreground text-sm mb-4">{state.data.followUp.expectedResults}</p>
                        <h4 className="font-semibold text-foreground">Métricas de Sucesso (KPIs)</h4>
                        <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1 mb-4">
                                {state.data.followUp.kpis.map((kpi, i) => <li key={i}>{kpi}</li>)}
                        </ul>
                        <h4 className="font-semibold text-foreground">Método de Acompanhamento</h4>
                        <p className="text-muted-foreground text-sm">{state.data.followUp.monitoringMethod}</p>
                    </ResultCard>
                </div>
            ) : (
                 <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                    <Zap className="h-12 w-12 mb-4" />
                    <p>Aguardando dados para iniciar a análise A3...</p>
                 </div>
            )}
            {state.message && !state.data && (
                <Alert variant={state.errors ? "destructive" : "default"} className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{state.errors ? "Erro de Validação" : "Status"}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


interface ResultCardProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

function ResultCard({ icon: Icon, title, children }: ResultCardProps) {
    return (
        <Card className="bg-secondary/50">
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                <Icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
