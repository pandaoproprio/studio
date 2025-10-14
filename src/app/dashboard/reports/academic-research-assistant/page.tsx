// src/app/dashboard/reports/academic-research-assistant/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { academicResearchAssistantAction } from "@/lib/actions";
import { AcademicResearchAssistantInputSchema, type AcademicResearchAssistantInput, type AcademicResearchAssistantOutput } from "@/ai/schemas/academic-research-assistant-schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, BookOpenCheck, Pilcrow, ExternalLink, BookMarked, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: {
  message: string;
  data?: AcademicResearchAssistantOutput | null;
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
          Pesquisando...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Gerar Plano de Pesquisa
        </>
      )}
    </Button>
  );
}

export default function AcademicResearchAssistantPage() {
  const [state, formAction] = useActionState(academicResearchAssistantAction, initialState);
  
  const form = useForm<AcademicResearchAssistantInput>({
    resolver: zodResolver(AcademicResearchAssistantInputSchema),
    defaultValues: {
      topic: "",
      researchType: "applied",
      targetAudience: "Liderança da organização",
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
            Assistente de Pesquisa Acadêmica com IA
            </h1>
            <p className="text-muted-foreground">
            Obtenha um plano de pesquisa estruturado e fontes confiáveis para qualquer tema.
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
            <CardTitle className="font-headline">Tema da Pesquisa</CardTitle>
            <CardDescription>
              Forneça o tema e o contexto para a IA gerar um plano de pesquisa detalhado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form action={formAction} className="space-y-8">
                 <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tópico de Pesquisa</FormLabel>
                            <FormControl>
                                <Textarea rows={4} placeholder="Ex: O impacto da gamificação no engajamento de voluntários em ONGs." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="researchType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Pesquisa</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="basic">Básica (Teórica)</SelectItem>
                                        <SelectItem value="applied">Aplicada (Prática)</SelectItem>
                                        <SelectItem value="quantitative">Quantitativa</SelectItem>
                                        <SelectItem value="qualitative">Qualitativa</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Público-Alvo do Estudo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Gestores de ONGs" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                <SubmitButton />
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="printable-content">
            <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">Plano de Pesquisa Gerado</CardTitle>
                <CardDescription>O plano de pesquisa e as fontes recomendadas pela IA aparecerão aqui.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
                {state.data ? (
                    <div className="w-full space-y-6 overflow-y-auto max-h-[70vh] pr-2">
                        <ResultCard icon={BookOpenCheck} title="Plano de Pesquisa">
                        <h4 className="font-semibold text-foreground">Introdução</h4>
                        <p className="text-muted-foreground text-sm mb-4">{state.data.plan.introduction}</p>
                        <h4 className="font-semibold text-foreground">Perguntas Norteadoras</h4>
                        <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1 mb-4">
                                {state.data.plan.researchQuestions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                        <h4 className="font-semibold text-foreground">Metodologia Sugerida</h4>
                        <p className="text-muted-foreground text-sm">{state.data.plan.methodology}</p>
                        </ResultCard>

                        <ResultCard icon={Pilcrow} title="Fontes Acadêmicas Recomendadas">
                            <ul className="space-y-3">
                            {state.data.sources.map((source, index) => (
                                <li key={index} className="text-sm">
                                    <p className="font-semibold text-foreground">{source.title}</p>
                                    <p className="text-muted-foreground text-xs">Autor(es): {source.authors}</p>
                                    <p className="text-muted-foreground text-xs">Publicado em: {source.publication}</p>
                                    <a href={source.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                                        Acessar Fonte <ExternalLink className="h-3 w-3" />
                                    </a>
                                </li>
                            ))}
                            </ul>
                        </ResultCard>
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                        <BookMarked className="h-12 w-12 mb-4" />
                        <p>Aguardando tópico para iniciar a pesquisa...</p>
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


interface ResultCardProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

function ResultCard({ icon: Icon, title, children }: ResultCardProps) {
    return (
        <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
                <Icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
