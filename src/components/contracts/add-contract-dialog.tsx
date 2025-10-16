// src/components/contracts/add-contract-dialog.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Contract, type NewContractData, addContract } from "@/services/contracts";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contractSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres."),
  type: z.string().min(3, "O tipo de contrato é obrigatório."),
  project: z.string().optional(),
  value: z.string().min(1, "O valor é obrigatório."),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de início inválida."}),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de fim inválida."}),
  fullText: z.string().optional(),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: "A data de fim deve ser posterior à data de início.",
    path: ["endDate"],
});


interface AddContractDialogProps {
  children: React.ReactNode;
  onContractAdded: (contract: Contract) => void;
}

export function AddContractDialog({ children, onContractAdded }: AddContractDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      title: "",
      type: "",
      project: "",
      value: "",
      startDate: "",
      endDate: "",
      fullText: "",
    },
  });

  const onSubmit = async (data: Omit<NewContractData, 'project'> & { project?: string }) => {
    setIsSubmitting(true);
    try {
        const submissionData: NewContractData = {
            ...data,
            project: data.project || 'N/A',
        }
        const newContract = await addContract(submissionData);
        onContractAdded(newContract);
        setIsOpen(false);
        form.reset();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Falha ao adicionar contrato",
            description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        })
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Contrato</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar um novo contrato.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Contrato</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Contrato de Prestação de Serviços de TI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <FormControl><Input placeholder="Ex: Fornecedor" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Projeto Vinculado (Opcional)</FormLabel>
                            <FormControl><Input placeholder="Ex: Desenvolvimento do Website" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valor</FormLabel>
                            <FormControl><Input placeholder="R$ 25.000,00" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Início</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Fim</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="fullText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto Completo / Objeto do Contrato (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cole ou descreva aqui os principais pontos do contrato..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Contrato
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
