// src/app/dashboard/financial/reimbursements/page.tsx
"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, Filter, PlusCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


type ReimbursementStatus = 'Aprovado' | 'Pendente' | 'Recusado';

interface Reimbursement {
  id: string;
  description: string;
  date: Date;
  amount: number;
  category: string;
  status: ReimbursementStatus;
  requester: {
    id: string;
    name: string;
    avatar: string;
  }
}

const initialRequests: Reimbursement[] = [
  { id: 'reimb-1', description: 'Almoço com parceiro XYZ', date: new Date(2024, 6, 20), amount: 85.50, category: 'Alimentação', status: 'Aprovado', requester: { id: 'user-1', name: 'Joana Silva', avatar: 'https://placehold.co/100x100.png' } },
  { id: 'reimb-2', description: 'Táxi para evento de captação', date: new Date(2024, 6, 22), amount: 45.00, category: 'Transporte', status: 'Aprovado', requester: { id: 'user-1', name: 'Joana Silva', avatar: 'https://placehold.co/100x100.png' } },
  { id: 'reimb-3', description: 'Compra de material de escritório urgente', date: new Date(2024, 6, 25), amount: 120.00, category: 'Material de Escritório', status: 'Pendente', requester: { id: 'user-2', name: 'Carlos Andrade', avatar: 'https://placehold.co/100x100.png' } },
  { id: 'reimb-4', description: 'Hospedagem para conferência', date: new Date(2024, 6, 15), amount: 350.00, category: 'Viagem', status: 'Recusado', requester: { id: 'user-1', name: 'Joana Silva', avatar: 'https://placehold.co/100x100.png' }},
  { id: 'reimb-5', description: 'Hospedagem para conferência', date: new Date(2024, 7, 5), amount: 450.00, category: 'Viagem', status: 'Pendente', requester: { id: 'user-3', name: 'Beatriz Costa', avatar: 'https://placehold.co/100x100.png' }},
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

// Mock do usuário logado (pode ser 'admin' ou 'user')
const loggedInUser = { id: 'user-1', name: 'Joana Silva', avatar: 'https://placehold.co/100x100.png', role: 'admin' };

export default function ReimbursementsUnifiedPage() {
    const [requests, setRequests] = useState<Reimbursement[]>(initialRequests);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());
    
    const myRequests = requests.filter(r => r.requester.id === loggedInUser.id);

    const handleStatusChange = (id: string, newStatus: 'Aprovado' | 'Recusado') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    }
    
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
            requester: {
                id: loggedInUser.id,
                name: loggedInUser.name,
                avatar: loggedInUser.avatar,
            }
        };
        setRequests(prev => [newReimbursement, ...prev]);
        setIsDialogOpen(false);
        e.currentTarget.reset();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">
                        Reembolsos
                    </h1>
                    <p className="text-muted-foreground">
                        Solicite e gerencie os reembolsos de despesas da sua organização.
                    </p>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nova Solicitação
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
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                    <Button type="submit">Enviar Solicitação</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue={loggedInUser.role === 'admin' ? "manage" : "my-requests"}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="my-requests">Minhas Solicitações</TabsTrigger>
                    <TabsTrigger value="manage" disabled={loggedInUser.role !== 'admin'}>Gerenciar Solicitações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-requests">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Minhas Solicitações de Reembolso</CardTitle>
                            <CardDescription>Acompanhe o status das suas solicitações.</CardDescription>
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
                                    {myRequests.map((item) => (
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
                                    {myRequests.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">Você ainda não fez nenhuma solicitação.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="manage">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Gerenciar Solicitações</CardTitle>
                            <CardDescription>
                                Aprove, recuse e gerencie as solicitações de reembolso da sua equipe.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Solicitante</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                        <TableHead className="text-center">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map(req => (
                                        <TableRow key={req.id}>
                                            <TableCell>
                                                 <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={req.requester.avatar} alt={req.requester.name} data-ai-hint="person portrait"/>
                                                        <AvatarFallback>{req.requester.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{req.requester.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{req.description}</div>
                                                <div className="text-sm text-muted-foreground">{req.category}</div>
                                            </TableCell>
                                            <TableCell>{format(req.date, 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadgeClass(req.status)}>{req.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                 {req.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {req.status === 'Pendente' ? (
                                                    <div className="flex justify-center gap-2">
                                                        <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleStatusChange(req.id, 'Recusado')}>
                                                            <X className="h-4 w-4 mr-2"/> Recusar
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" onClick={() => handleStatusChange(req.id, 'Aprovado')}>
                                                            <Check className="h-4 w-4 mr-2"/> Aprovar
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground italic">Finalizado</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
