// src/app/dashboard/reports/organizational-diagnosis/page.tsx
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { organizationalDiagnosisAction } from "@/lib/actions";
import { OrganizationalDiagnosisInputSchema, type OrganizationalDiagnosisInput, type OrganizationalDiagnosisOutput } from "@/ai/schemas/organizational-diagnosis-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Lightbulb, TrendingUp, TrendingDown, Target } from "lucide-react";

import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const initialState: {
  message: string;
  data?: OrganizationalDiagnosisOutput | null;
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
          Analisando Organização...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Gerar Diagnóstico com IA
        </>
      )}
    </Button>
  );
}

export default function OrganizationalDiagnosisPage() {
  const [state, formAction] = useActionState(organizationalDiagnosisAction, initialState);
  
  const form = useForm<OrganizationalDiagnosisInput>({
    resolver: zodResolver(OrganizationalDiagnosisInputSchema),
    defaultValues: {
      financials: {
        annualRevenue: 500000,
        annualExpenses: 450000,
        fundingDiversityScore: 5,
        emergencyFundInMonths: 3,
      },
      projects: {
        successRatePercentage: 85,
        onBudgetPercentage: 70,
        beneficiarySatisfactionScore: 8,
      },
      team: {
        employeeRetentionRatePercentage: 90,
        teamSatisfactionScore: 7,
      }
    },
  });

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Diagnóstico Organizacional com IA
        </h1>
        <p className="text-muted-foreground">
          Obtenha um panorama estratégico da saúde da sua organização.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Métricas da Organização</CardTitle>
            <CardDescription>
              Ajuste os sliders e campos para refletir os dados da sua organização.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form action={formAction} className="space-y-8">
                
                {/* Financials */}
                <fieldset className="space-y-4">
                  <legend className="font-semibold text-lg">Saúde Financeira</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="financials.annualRevenue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Receita Anual (R$)</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="financials.annualExpenses"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Despesas Anuais (R$)</FormLabel>
                                <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                   <FormField
                        control={form.control}
                        name="financials.fundingDiversityScore"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Diversidade de Renda (1-10) - Atual: {field.value}</FormLabel>
                                <FormControl>
                                    <Slider defaultValue={[field.value]} min={1} max={10} step={1} onValueChange={(vals) => field.onChange(vals[0])} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="financials.emergencyFundInMonths"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reserva de Emergência (meses) - Atual: {field.value}</FormLabel>
                                <FormControl>
                                     <Slider defaultValue={[field.value]} min={0} max={12} step={1} onValueChange={(vals) => field.onChange(vals[0])} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </fieldset>

                 {/* Projects */}
                <fieldset className="space-y-4">
                  <legend className="font-semibold text-lg">Sucesso de Projetos</legend>
                   <FormField
                        control={form.control}
                        name="projects.successRatePercentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Taxa de Sucesso (%) - Atual: {field.value}%</FormLabel>
                                <FormControl>
                                     <Slider defaultValue={[field.value]} min={0} max={100} step={5} onValueChange={(vals) => field.onChange(vals[0])} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="projects.beneficiarySatisfactionScore"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Satisfação dos Beneficiários (1-10) - Atual: {field.value}</FormLabel>
                                <FormControl>
                                     <Slider defaultValue={[field.value]} min={1} max={10} step={1} onValueChange={(vals) => field.onChange(vals[0])} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </fieldset>

                {/* Team */}
                <fieldset className="space-y-4">
                  <legend className="font-semibold text-lg">Engajamento da Equipe</legend>
                   <FormField
                        control={form.control}
                        name="team.employeeRetentionRatePercentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Taxa de Retenção (%) - Atual: {field.value}%</FormLabel>
                                <FormControl>
                                     <Slider defaultValue={[field.value]} min={0} max={100} step={5} onValueChange={(vals) => field.onChange(vals[0])} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="team.teamSatisfactionScore"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Satisfação da Equipe (1-10) - Atual: {field.value}</FormLabel>
                                <FormControl>
                                     <Slider defaultValue={[field.value]} min={1} max={10} step={1} onValueChange={(vals) => field.onChange(vals[0])} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </fieldset>

                <SubmitButton />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Result Column */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Diagnóstico Estratégico</CardTitle>
            <CardDescription>A análise da IA sobre a saúde da sua organização aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            {state.data ? (
                <div className="w-full space-y-6">
                    <Card>
                        <CardHeader className="text-center">
                            <CardDescription>Saúde Organizacional Geral</CardDescription>
                            <CardTitle className="text-5xl">{state.data.overallHealthScore}<span className="text-xl text-muted-foreground">/100</span></CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <ChartContainer config={{}} className="mx-auto aspect-square h-64">
                                <RadarChart data={state.data.scoresByArea}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="area" />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                    <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                                </RadarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard icon={TrendingUp} title="Pontos Fortes" items={state.data.strengths} />
                        <InfoCard icon={TrendingDown} title="Pontos a Melhorar" items={state.data.weaknesses} />
                    </div>
                     <InfoCard icon={Target} title="Recomendações Estratégicas" items={state.data.recommendations} />

                </div>
            ) : (
                 <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                    <p>Aguardando análise da IA...</p>
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
  );
}


interface InfoCardProps {
    icon: React.ElementType;
    title: string;
    items: string[];
}

function InfoCard({ icon: Icon, title, items }: InfoCardProps) {
    return (
        <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
                <Icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                    {items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </CardContent>
        </Card>
    )
}
