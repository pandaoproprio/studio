// src/app/dashboard/reports/narrative-report/page.tsx
"use client";

import { useState } from "react";
import { useForm, useFieldArray, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { generateNarrativeReportAction } from "@/lib/actions";
import { GenerateNarrativeReportInputSchema, type GenerateNarrativeReportInput } from "@/ai/schemas/generate-narrative-report-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, PlusCircle, Trash2, FileText, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const initialState = {
  message: "",
  data: null,
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full mt-8">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando Relatório...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Gerar Relatório Narrativo com IA
        </>
      )}
    </Button>
  );
}

function ActionsArray() {
    const { control } = useFormContext<GenerateNarrativeReportInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "actions"
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Ações Desenvolvidas no Período</h3>
                    <p className="text-sm text-muted-foreground">Adicione cada atividade ou evento realizado.</p>
                </div>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", dateAndLocation: "", audience: "", results: "", challenges: "", evaluation: "" })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Ação
                </Button>
            </div>
            
            {fields.map((field, index) => (
                 <Card key={field.id} className="relative bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="text-xl">Ação {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={control}
                            name={`actions.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Ação</FormLabel>
                                    <FormControl><Input placeholder="Ex: Atendimento Emergencial Presencial" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField
                                control={control}
                                name={`actions.${index}.dateAndLocation`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data e Local</FormLabel>
                                        <FormControl><Input placeholder="Ex: 01/12/23 – Praça da Merck" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={control}
                                name={`actions.${index}.audience`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Público Alcançado</FormLabel>
                                        <FormControl><Input placeholder="Ex: 3 pessoas" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={control}
                            name={`actions.${index}.results`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Principais Resultados</FormLabel>
                                    <FormControl><Textarea rows={2} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`actions.${index}.challenges`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Principais Desafios/Dificuldades</FormLabel>
                                    <FormControl><Textarea rows={2} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={control}
                            name={`actions.${index}.evaluation`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avaliação</FormLabel>
                                    <FormControl><Textarea rows={2} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <Button type="button" variant="ghost" size="icon" className="absolute top-4 right-4 text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </Card>
            ))}
            {fields.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhuma ação adicionada ainda.</p>}
        </div>
    )
}


export default function NarrativeReportPage() {
  const [state, formAction] = useActionState(generateNarrativeReportAction, initialState);
  const [isFormVisible, setIsFormVisible] = useState(true);

  const form = useForm<GenerateNarrativeReportInput>({
    resolver: zodResolver(GenerateNarrativeReportInputSchema),
    defaultValues: {
      projectName: "",
      coordinatorName: "",
      monthYear: "",
      thematicAreas: "Segurança Alimentar, Saúde Mental, Educação, Cultura e Esporte.",
      projectChanges: {
          scopeChange: "O CEAP não solicitou mudança no escopo do projeto.",
          objectivesChange: "O CEAP não solicitou mudança nos objetivos geral e específicos do projeto.",
          outsideScopeActions: "Sim. O CEAP realizou entregas pontuais de cestas básicas para famílias que não são acompanhadas pelo projeto.",
      },
      actions: [],
      indicators: {
        directImpact: "",
        indirectImpact: "",
        itemsDistributed: "",
      },
      observations: "",
    },
  });

  const onSubmit = (data: GenerateNarrativeReportInput) => {
    // This function is just to trigger the action with validated data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });
    formAction(formData);
    setIsFormVisible(false);
  }

  if (!isFormVisible && state.data) {
     return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Relatório Narrativo Gerado
                    </h1>
                    <p className="text-muted-foreground">
                    Abaixo está o relatório gerado pela IA. Copie ou imprima conforme necessário.
                    </p>
                </div>
                 <Button variant="outline" onClick={() => setIsFormVisible(true)}>Voltar ao Formulário</Button>
            </div>
             <Card className="flex flex-col">
                <CardContent className="flex-1 p-6">
                    <div 
                        className="prose prose-sm max-w-none h-full rounded-lg border bg-secondary/50 p-6 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: state.data.report }} 
                    />
                </CardContent>
            </Card>
        </div>
     )
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Gerador de Relatório Narrativo
        </h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para que a IA possa construir um relatório de execução detalhado.
        </p>
      </div>
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                 <fieldset className="space-y-4">
                     <h3 className="text-lg font-medium">Informações Gerais</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="projectName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Projeto</FormLabel>
                                    <FormControl><Input placeholder="Ex: Mutirão de Amor" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="coordinatorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Coordenador</FormLabel>
                                    <FormControl><Input placeholder="Ex: Raphael Araujo" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="monthYear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mês/Ano de Referência</FormLabel>
                                    <FormControl><Input placeholder="Ex: Dezembro – 2023" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="thematicAreas"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Áreas Temáticas</FormLabel>
                                <FormControl><Textarea rows={2} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>

                <Separator />

                 <fieldset className="space-y-4">
                     <h3 className="text-lg font-medium">Alterações no Projeto</h3>
                     <FormField
                        control={form.control}
                        name="projectChanges.scopeChange"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>A organização solicitou mudanças no escopo?</FormLabel>
                                <FormControl><Textarea rows={2} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="projectChanges.objectivesChange"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>A organização solicitou mudanças nos objetivos?</FormLabel>
                                <FormControl><Textarea rows={2} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="projectChanges.outsideScopeActions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Foram realizadas ações diferentes das mencionadas no escopo?</FormLabel>
                                <FormControl><Textarea rows={2} {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>
                
                <Separator />
                
                <ActionsArray />

                <Separator />

                <fieldset className="space-y-4">
                    <h3 className="text-lg font-medium">Indicadores do Mês</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="indicators.directImpact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pessoas Impactadas Diretamente</FormLabel>
                                    <FormControl><Input placeholder="Ex: 80 pessoas" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="indicators.indirectImpact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pessoas Impactadas Indiretamente</FormLabel>
                                    <FormControl><Input placeholder="Ex: 600 pessoas" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="indicators.itemsDistributed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Itens Distribuídos</FormLabel>
                                    <FormControl><Input placeholder="Ex: 20 cestas básicas" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </fieldset>

                <Separator />
                
                <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observações Gerais</FormLabel>
                            <FormControl><Textarea rows={4} placeholder="Descreva os principais aprendizados, desafios e observações gerais do mês." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <SubmitButton />

                 {state.message && !state.data && (
                    <Alert variant={state.errors ? "destructive" : "default"}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{state.errors ? "Erro de Validação" : "Status"}</AlertTitle>
                        <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
    </div>
  );
}
