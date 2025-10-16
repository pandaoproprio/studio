// src/components/projects/add-project-dialog.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Project } from "@/app/dashboard/projects/page";

const projectSchema = z.object({
  name: z.string().min(3, "O nome do projeto deve ter pelo menos 3 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  category: z.enum(['Institucional', 'Social'], { required_error: "Selecione uma categoria." }),
  subcategory: z.enum(['CEAP', 'Parceiros', 'Outros']).optional(),
  budget: z.coerce.number().min(0, "O orçamento deve ser um valor positivo."),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de início inválida."}),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de fim inválida."}),
}).refine(data => data.category !== 'Social' || !!data.subcategory, {
    message: "A subcategoria é obrigatória para projetos sociais.",
    path: ["subcategory"],
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: "A data de fim deve ser posterior à data de início.",
    path: ["endDate"],
});

type ProjectFormData = Omit<Project, 'id' | 'status' | 'progress'>;

interface AddProjectDialogProps {
  children: React.ReactNode;
  onProjectAdded: (data: ProjectFormData) => void;
}

export function AddProjectDialog({ children, onProjectAdded }: AddProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      budget: 0,
      startDate: '',
      endDate: '',
    },
  });

  const category = form.watch("category");

  const onSubmit = (data: z.infer<typeof projectSchema>) => {
    onProjectAdded(data);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar um novo projeto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Campanha de Arrecadação de Fundos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo principal deste projeto."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Orçamento (R$)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="25000" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Início</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
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
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria do projeto" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Institucional">Institucional</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
             {category === 'Social' && (
                <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subcategoria (Social)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Selecione a subcategoria" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="CEAP">CEAP</SelectItem>
                            <SelectItem value="Parceiros">Parceiros</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Projeto</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
