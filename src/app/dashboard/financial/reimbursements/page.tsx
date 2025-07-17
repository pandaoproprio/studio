// src/app/dashboard/financial/reimbursements/page.tsx
"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

type ReimbursementStatus = 'Aprovado' | 'Pendente' | 'Recusado';

interface ReimbursementRequest {
  id: string;
  description: string;
  date: Date;
  amount: number;
  category: string;
  status: ReimbursementStatus;
  requester: {
    name: string;
    avatar: string;
  }
}

const initialRequests: ReimbursementRequest[] = [
  { id: 'reimb-3', description: 'Compra de material de escritório urgente', date: new Date(2024, 6, 25), amount: 120.00, category: 'Material de Escritório', status: 'Pendente', requester: { name: 'Carlos Andrade', avatar: 'https://placehold.co/100x100.png' } },
  { id: 'reimb-5', description: 'Hospedagem para conferência', date: new Date(2024, 7, 5), amount: 450.00, category: 'Viagem', status: 'Pendente', requester: { name: 'Beatriz Costa', avatar: 'https://placehold.co/100x100.png' }},
  { id: 'reimb-1', description: 'Almoço com parceiro XYZ', date: new Date(2024, 6, 20), amount: 85.50, category: 'Alimentação', status: 'Aprovado', requester: { name: 'Joana Silva', avatar: 'https://placehold.co/100x100.png' } },
  { id: 'reimb-2', description: 'Táxi para evento de captação', date: new Date(2024, 6, 22), amount: 45.00, category: 'Transporte', status: 'Aprovado', requester: { name: 'Joana Silva', avatar: 'https://placehold.co/100x100.png' } },
  { id: 'reimb-4', description: 'Assinatura de software de design', date: new Date(2024, 6, 15), amount: 99.00, category: 'Outros', status: 'Recusado', requester: { name: 'Mariana Ferreira', avatar: 'https://placehold.co/100x100.png' }},
];


const getStatusBadgeClass = (status: ReimbursementStatus) => {
    switch (status) {
        case "Aprovado": return "bg-green-100 text-green-800";
        case "Pendente": return "bg-yellow-100 text-yellow-800";
        case "Recusado": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

export default function ManageReimbursementsPage() {
    const [requests, setRequests] = useState<ReimbursementRequest[]>(initialRequests);

    const handleStatusChange = (id: string, newStatus: 'Aprovado' | 'Recusado') => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">
                        Gestão de Reembolsos
                    </h1>
                    <p className="text-muted-foreground">
                        Aprove, recuse e gerencie as solicitações de reembolso da sua equipe.
                    </p>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Solicitações</CardTitle>
                    <CardDescription>
                        Abaixo estão todas as solicitações de reembolso pendentes e finalizadas.
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
        </div>
    )
}