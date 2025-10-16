// src/components/projects/add-project-dialog.tsx
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { type Project, type NewProjectData, addProject } from "@/services/projects";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const teamMemberSchema = z.object({
    role: z.string().min(1, "O cargo é obrigatório."),
    name: z.string().min(1, "O nome é obrigatório.")
});

const projectSchema = z.object({
  name: z.string().min(3, "O nome do projeto deve ter pelo menos 3 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
  category: z.enum(['Institucional', 'Social'], { required_error: "Selecione uma categoria." }),
  subcategory: z.enum(['CEAP', 'Parceiros', 'Outros']).optional(),
  budget: z.coerce.number().min(0, "O orçamento deve ser um valor positivo."),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de início inválida."}),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Data de fim inválida."}),
  team: z.array(teamMemberSchema).optional(),
}).refine(data => data.category !== 'Social' || !!data.subcategory, {
    message: "A subcategoria é obrigatória para projetos sociais.",
    path: ["subcategory"],
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: "A data de fim deve ser posterior à data de início.",
    path: ["endDate"],
});


interface AddProjectDialogProps {
  children: React.ReactNode;
  onProjectAdded: (data: Project) => void;
}

export function AddProjectDialog({ children, onProjectAdded }: AddProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      budget: 0,
      startDate: '',
      endDate: '',
      team: [{ role: "Product Owner", name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "team",
  });

  const category = form.watch("category");

  const onSubmit = async (data: NewProjectData) => {
    setIsSubmitting(true);
    try {
        const newProject = await addProject(data);
        onProjectAdded(newProject);
        setIsOpen(false);
        form.reset();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Falha ao adicionar projeto",
            description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        })
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar um novo projeto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
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
             <div className="space-y-4 rounded-md border p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Equipe do Projeto</h3>
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ role: "", name: "" })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Membro
                    </Button>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-10 gap-2 items-end">
                        <FormField
                            control={form.control}
                            name={`team.${index}.role`}
                            render={({ field }) => (
                                <FormItem className="col-span-4">
                                    <FormLabel className={index !== 0 ? 'sr-only' : ''}>Cargo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Scrum Master" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`team.${index}.name`}
                            render={({ field }) => (
                                <FormItem className="col-span-5">
                                     <FormLabel className={index !== 0 ? 'sr-only' : ''}>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Carlos Andrade" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="col-span-1">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                ))}
             </div>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Projeto
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}