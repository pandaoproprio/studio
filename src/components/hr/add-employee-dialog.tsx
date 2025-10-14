// src/components/hr/add-employee-dialog.tsx
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
import { addEmployee, type Employee, type NewEmployeeData } from "@/services/hr";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const employeeSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Forneça um email válido."),
  role: z.string().min(3, "O cargo deve ter pelo menos 3 caracteres."),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
});

interface AddEmployeeDialogProps {
    children: React.ReactNode;
    onEmployeeAdded: (employee: Employee) => void;
}

export function AddEmployeeDialog({ children, onEmployeeAdded }: AddEmployeeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<NewEmployeeData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            description: "",
        },
    });

    const onSubmit = async (data: NewEmployeeData) => {
        setIsSubmitting(true);
        try {
            const newEmployee = await addEmployee(data);
            onEmployeeAdded(newEmployee);
            setIsOpen(false);
            form.reset();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Falha ao adicionar colaborador",
                description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
                    <DialogDescription>Preencha os dados abaixo para registrar um novo membro na equipe.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Joana Silva" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Ex: joana.silva@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cargo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Gerente de Projetos" {...field} />
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
                                    <FormLabel>Descrição das Responsabilidades</FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} placeholder="Descreva as principais funções e responsabilidades do cargo." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Colaborador
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
