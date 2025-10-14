// src/app/dashboard/reports/narrative-report/page.tsx
"use client";

import { useState } from "react";
import { useForm, useFieldArray, useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";

import { generateNarrativeReportAction } from "@/lib/actions";
import { GenerateNarrativeReportInputSchema, type GenerateNarrativeReportInput } from "@/ai/schemas/generate-narrative-report-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, PlusCircle, Trash2, FileText, AlertCircle, ImageUp, X, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import RichTextEditor from "@/components/reports/rich-text-editor";


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
    const { control, setValue } = useFormContext<GenerateNarrativeReportInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "actions"
    });

    const handleImageUpload = (index: number, files: FileList | null) => {
        if (!files) return;
        const currentImages = control.getValues(`actions.${index}.images`) || [];
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUri = e.target?.result as string;
                setValue(`actions.${index}.images`, [...currentImages, dataUri]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (actionIndex: number, imageIndex: number) => {
        const currentImages = control.getValues(`actions.${actionIndex}.images`) || [];
        const newImages = currentImages.filter((_, i) => i !== imageIndex);
        setValue(`actions.${actionIndex}.images`, newImages);
    };

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
                    onClick={() => append({ name: "", dateAndLocation: "", audience: "", results: "", challenges: "", evaluation: "", images: [] })}
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
                        <Controller
                            control={control}
                            name={`actions.${index}.results`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Principais Resultados</FormLabel>
                                    <FormControl><RichTextEditor value={field.value} onChange={field.onChange} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Controller
                            control={control}
                            name={`actions.${index}.challenges`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Principais Desafios/Dificuldades</FormLabel>
                                    <FormControl><RichTextEditor value={field.value} onChange={field.onChange} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <Controller
                            control={control}
                            name={`actions.${index}.evaluation`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avaliação</FormLabel>
                                    <FormControl><RichTextEditor value={field.value} onChange={field.onChange} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                         <FormItem>
                            <FormLabel>Imagens da Ação</FormLabel>
                            <FormControl>
                                <div className="p-4 border-2 border-dashed rounded-md">
                                    <Input 
                                        id={`image-upload-${index}`}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageUpload(index, e.target.files)}
                                        className="hidden"
                                    />
                                    <label htmlFor={`image-upload-${index}`} className="flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary">
                                        <ImageUp className="h-8 w-8 mb-2"/>
                                        <span>Clique para adicionar imagens</span>
                                    </label>
                                </div>
                            </FormControl>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                {(control.getValues(`actions.${index}.images`) || []).map((imgSrc, imgIndex) => (
                                    <div key={imgIndex} className="relative group aspect-video">
                                        <Image src={imgSrc} alt={`Preview ${imgIndex}`} layout="fill" className="object-cover rounded-md" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                            onClick={() => removeImage(index, imgIndex)}
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>

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
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });
    formAction(formData);
  }

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between no-print">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                Gerador de Relatório Narrativo
                </h1>
                <p className="text-muted-foreground">
                Preencha os campos abaixo para que a IA possa construir um relatório de execução detalhado.
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
            <div className={state.data ? 'no-print' : ''}>
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
            
            <div className={state.data ? '' : 'hidden'}>
                <Card className="flex flex-col printable-content">
                    <CardHeader>
                        <CardTitle className="font-headline">Relatório Gerado</CardTitle>
                        <CardDescription>O resultado do seu relatório formatado aparecerá aqui.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div 
                            className="prose prose-sm max-w-none h-full rounded-lg border bg-secondary/50 p-6 overflow-y-auto"
                        >
                            {state.data ? (
                                <div dangerouslySetInnerHTML={{ __html: state.data.report }} />
                            ) : (
                                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                                    <p>Aguardando geração do relatório...</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
