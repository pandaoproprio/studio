// src/components/financial/transaction-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Transaction, TransactionStatus } from "@/lib/types";
import { useEffect } from "react";

const transactionSchema = z.object({
  type: z.enum(["Receita", "Despesa", "Reembolso"], { required_error: "Selecione o tipo de transação." }),
  description: z.string().min(3, "A descrição deve ter pelo menos 3 caracteres."),
  amount: z.coerce.number().positive("O valor deve ser um número positivo."),
  date: z.date({ required_error: "Selecione uma data." }),
  category: z.string().min(1, "Selecione uma categoria."),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
    onSubmit: (data: Transaction) => void;
}

const revenueCategories = ["Doação", "Venda de Produtos", "Eventos", "Patrocínio"];
const expenseCategories = ["Salários", "Aluguel", "Fornecedores", "Marketing", "Infraestrutura"];
const reimbursementCategories = ["Viagem", "Alimentação", "Transporte", "Material de Escritório", "Outros"];

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
        type: "Despesa",
        description: "",
        amount: 0,
        date: new Date(),
        category: ""
    }
  });
  
  const transactionType = form.watch("type");

  useEffect(() => {
    form.resetField("category");
  }, [transactionType, form]);

  const handleSubmit = (data: TransactionFormValues) => {
    const status: TransactionStatus = data.type === 'Reembolso' ? "Em Análise" : "Concluído";
    const newTransaction: Transaction = {
        ...data,
        id: `txn-${Date.now()}`,
        status,
    };
    onSubmit(newTransaction);
    form.reset();
  }
  
  const getCategoriesForType = () => {
    switch (transactionType) {
        case "Receita": return revenueCategories;
        case "Despesa": return expenseCategories;
        case "Reembolso": return reimbursementCategories;
        default: return [];
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Transação</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Receita" />
                    </FormControl>
                    <FormLabel className="font-normal">Receita</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Despesa" />
                    </FormControl>
                    <FormLabel className="font-normal">Despesa</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Reembolso" />
                    </FormControl>
                    <FormLabel className="font-normal">Reembolso</FormLabel>
                  </FormItem>
                </RadioGroup>
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
                <Input placeholder="Ex: Pagamento de aluguel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Categoria</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getCategoriesForType().map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Transação</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Salvar Transação</Button>
      </form>
    </Form>
  );
}
