
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generateImpactReportAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando Relatório...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Gerar com IA
        </>
      )}
    </Button>
  );
}

export function ImpactReportForm() {
  const [state, formAction] = useFormState(generateImpactReportAction, initialState);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Gerador de Relatório de Impacto</CardTitle>
          <CardDescription>
            Descreva seu projeto e deixe a IA criar um relatório de impacto profissional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Descrição do Projeto</Label>
              <Textarea
                id="projectDescription"
                name="projectDescription"
                placeholder="Ex: Projeto de capacitação de jovens em tecnologia na comunidade X..."
                rows={5}
                required
              />
              {state.errors?.projectDescription && (
                <p className="text-sm text-destructive">{state.errors.projectDescription[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectOutcomes">Resultados do Projeto</Label>
              <Textarea
                id="projectOutcomes"
                name="projectOutcomes"
                placeholder="Ex: 50 jovens formados, 80% de empregabilidade, aumento de 30% na renda familiar..."
                rows={5}
                required
              />
               {state.errors?.projectOutcomes && (
                <p className="text-sm text-destructive">{state.errors.projectOutcomes[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="desiredReportSections">Seções Desejadas no Relatório</Label>
              <Input
                id="desiredReportSections"
                name="desiredReportSections"
                placeholder="Ex: Sumário Executivo, Metodologia, Resultados, Depoimentos"
                required
              />
              {state.errors?.desiredReportSections && (
                <p className="text-sm text-destructive">{state.errors.desiredReportSections[0]}</p>
              )}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Relatório Gerado</CardTitle>
          <CardDescription>O resultado do seu relatório aparecerá aqui.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
            <div className="prose prose-sm max-w-none h-full rounded-lg border bg-secondary/50 p-4 overflow-y-auto">
            {state.data ? (
                <pre className="whitespace-pre-wrap font-body text-sm">{state.data.report}</pre>
            ) : (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                    <p>Aguardando geração do relatório...</p>
                </div>
            )}
            {state.message && !state.data && (
                <Alert variant={state.errors ? "destructive" : "default"} className="mt-4">
                    <AlertTitle>{state.errors ? "Erro de Validação" : "Status"}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
