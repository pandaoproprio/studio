// src/app/dashboard/reports/corporate-risk-analysis/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { corporateRiskAnalysisAction } from "@/lib/actions";
import { CorporateRiskAnalysisInputSchema, type CorporateRiskAnalysisInput, type CorporateRiskAnalysisOutput } from "@/ai/schemas/corporate-risk-analysis-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, ShieldAlert, TrendingDown, DollarSign, Users, Shield, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";

const initialState: {
  message: string;
  data?: CorporateRiskAnalysisOutput | null;
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
          Analisando Riscos...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Analisar Risco Corporativo
        </>
      )}
    </Button>
  );
}

export default function CorporateRiskAnalysisPage() {
  const [state, formAction] = useActionState(corporateRiskAnalysisAction, initialState);
  
  const form = useForm<CorporateRiskAnalysisInput>({
    resolver: zodResolver(CorporateRiskAnalysisInputSchema),
    defaultValues: {
      initiativeDescription: "",
      context: "",
    },
  });

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between no-print">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Análise de Risco Corporativo com IA
            </h1>
            <p className="text-muted-foreground">
            Avalie os riscos financeiros, operacionais e de reputação de novas iniciativas.
            </p>
        </div>
        {state.data && (
            <Button onClick={handlePrint} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Exportar para PDF
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="no-print">
          <CardHeader>
            <CardTitle className="font-headline">Descrição da Iniciativa</CardTitle>
            <CardDescription>
              Detalhe a iniciativa ou cenário que você deseja que a IA analise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form action={formAction} className="space-y-8">
                 <FormField
                    control={form.control}
                    name="initiativeDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Iniciativa / Cenário</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Lançar programa de voluntariado internacional" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="context"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contexto Adicional</FormLabel>
                            <FormControl>
                                <Textarea rows={6} placeholder="Forneça detalhes relevantes, como orçamento estimado, cronograma, principais envolvidos, objetivos, etc." {...field} />
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

        <div className="printable-content">
            <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">Análise de Risco</CardTitle>
                <CardDescription>O diagnóstico da IA sobre os riscos da iniciativa aparecerá aqui.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
                {state.data ? (
                    <div className="w-full space-y-6">
                        <Card>
                            <CardHeader className="text-center">
                                <CardDescription>Nível de Risco Geral</CardDescription>
                                <CardTitle className="text-5xl">{state.data.overallRiskScore}<span className="text-xl text-muted-foreground">/100</span></CardTitle>
                                <p className="text-sm font-semibold">{state.data.overallRiskLevel}</p>
                            </CardHeader>
                        </Card>

                        <div className="space-y-4">
                            <RiskCategoryCard icon={DollarSign} title="Riscos Financeiros" risks={state.data.financialRisks} />
                            <RiskCategoryCard icon={Users} title="Riscos Operacionais" risks={state.data.operationalRisks} />
                            <RiskCategoryCard icon={Shield} title="Riscos de Reputação" risks={state.data.reputationalRisks} />
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Plano de Mitigação</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                                    {state.data.mitigationPlan.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>

                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                        <ShieldAlert className="h-12 w-12 mb-4" />
                        <p>Aguardando análise de risco...</p>
                    </div>
                )}
                {state.message && !state.data && (
                    <Alert variant={state.errors ? "destructive" : "default"} className="mt-4">
                        <AlertTitle>{state.errors ? "Erro de Validação" : "Status"}</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}


interface RiskCategoryCardProps {
    icon: React.ElementType;
    title: string;
    risks: string[];
}

function RiskCategoryCard({ icon: Icon, title, risks }: RiskCategoryCardProps) {
    if (risks.length === 0) return null;

    return (
        <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
                <Icon className="h-5 w-5 text-destructive" />
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                    {risks.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </CardContent>
        </Card>
    )
}
