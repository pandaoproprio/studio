// src/app/dashboard/reimbursements/page.tsx
"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type ReimbursementStatus = 'Aprovado' | 'Pendente' | 'Recusado';

interface Reimbursement {
  id: string;
  description: string;
  date: Date;
  amount: number;
  category: string;
  status: ReimbursementStatus;
}

const initialReimbursements: Reimbursement[] = [
  { id: 'reimb-1', description: 'Almoço com parceiro XYZ', date: new Date(2024, 6, 20), amount: 85.50, category: 'Alimentação', status: 'Aprovado' },
  { id: 'reimb-2', description: 'Táxi para evento de captação', date: new Date(2024, 6, 22), amount: 45.00, category: 'Transporte', status: 'Aprovado' },
  { id: 'reimb-3', description: 'Compra de material de escritório urgente', date: new Date(2024, 6, 25), amount: 120.00, category: 'Material de Escritório', status: 'Pendente' },
  { id: 'reimb-4', description: 'Hospedagem para conferência', date: new Date(2024, 6, 15), amount: 350.00, category: 'Viagem', status: 'Recusado' },
];

const reimbursementCategories = ["Viagem", "Alimentação", "Transporte", "Material de Escritório", "Outros"];

const getStatusBadgeClass = (status: ReimbursementStatus) => {
    switch (status) {
        case "Aprovado": return "bg-green-100 text-green-800";
        case "Pendente": return "bg-yellow-100 text-yellow-800";
        case "Recusado": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
}


export default function ReimbursementsPage() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(initialReimbursements);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newReimbursement: Reimbursement = {
        id: `reimb-${Date.now()}`,
        description: formData.get('description') as string,
        amount: parseFloat(formData.get('amount') as string),
        category: formData.get('category') as string,
        date: date || new Date(),
        status: 'Pendente',
    };
    setReimbursements(prev => [newReimbursement, ...prev]);
    setIsDialogOpen(false);
    e.currentTarget.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Solicitação de Reembolsos
          </h1>
          <p className="text-muted-foreground">
            Envie e acompanhe suas solicitações de reembolso de despesas.
          </p>
        </div>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Solicitar Novo Reembolso
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova Solicitação de Reembolso</DialogTitle>
                    <DialogDescription>Preencha os detalhes da despesa para solicitar o reembolso.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="description">Descrição da Despesa</Label>
                        <Input id="description" name="description" placeholder="Ex: Almoço com cliente" required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="amount">Valor (R$)</Label>
                            <Input id="amount" name="amount" type="number" step="0.01" placeholder="85.50" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select name="category" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reimbursementCategories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="date">Data da Despesa</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Futuramente, adicionar upload de comprovante aqui */}
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit">Enviar Solicitação</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Meus Reembolsos</CardTitle>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reimbursements.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>{format(item.date, 'dd/MM/yyyy')}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{item.category}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getStatusBadgeClass(item.status)}>{item.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
