
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateImpactReportAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const impactReportSchema = z.object({
  projectDescription: z.string().min(20, "A descrição do projeto deve ter pelo menos 20 caracteres."),
  projectOutcomes: z.string().min(20, "Os resultados do projeto devem ter pelo menos 20 caracteres."),
  desiredReportSections: z.string().min(5, "Forneça pelo menos uma seção desejada para o relatório."),
});

type ImpactReportFormValues = z.infer<typeof impactReportSchema>;

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
  const [state, formAction] = useActionState(generateImpactReportAction, initialState);
  
  const form = useForm<ImpactReportFormValues>({
    resolver: zodResolver(impactReportSchema),
    defaultValues: {
      projectDescription: "",
      projectOutcomes: "",
      desiredReportSections: "Sumário Executivo, Metodologia, Resultados Chave, Depoimentos, Próximos Passos",
    },
  });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Gerador de Relatório de Impacto</CardTitle>
          <CardDescription>
            Descreva seu projeto e deixe a IA criar um relatório de impacto profissional e bem-formatado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-6">
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Projeto</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Projeto de capacitação de jovens em tecnologia na comunidade X, focado em desenvolvimento web e mobile..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectOutcomes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultados e Métricas Chave</FormLabel>
                     <FormControl>
                        <Textarea
                            placeholder="Ex: 50 jovens formados, 80% de empregabilidade, aumento de 30% na renda familiar, 10 apps desenvolvidos..."
                            rows={5}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredReportSections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seções Desejadas (separadas por vírgula)</FormLabel>
                    <FormControl>
                        <Input
                            placeholder="Ex: Sumário Executivo, Metodologia, Resultados, Depoimentos"
                            {...field}
                        />
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
          <CardTitle className="font-headline">Relatório Gerado</CardTitle>
          <CardDescription>O resultado do seu relatório formatado em HTML aparecerá aqui.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="prose prose-sm max-w-none h-full rounded-lg border bg-secondary/50 p-4 overflow-y-auto">
            {state?.data?.report ? (
              <div dangerouslySetInnerHTML={{ __html: state.data.report }} />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                <p>Aguardando geração do relatório...</p>
              </div>
            )}
            {state?.message && !state.data && (
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
