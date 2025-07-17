
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Filter, Search, FileSignature } from "lucide-react";
import Link from "next/link";

type ContractStatus = "Ativo" | "Expirado" | "Em Renovação" | "Rascunho";

const contracts = [
  {
    id: "CTR-001",
    title: "Contrato de Prestação de Serviços - Soluções Tech",
    type: "Fornecedor",
    project: "Desenvolvimento do Website",
    value: "R$ 25.000,00",
    startDate: "01/02/2024",
    endDate: "01/08/2024",
    status: "Ativo",
  },
  {
    id: "CTR-002",
    title: "Acordo de Parceria - Empresa Parceira S.A.",
    type: "Parceria",
    project: "Projeto Social Comunitário",
    value: "N/A",
    startDate: "15/01/2024",
    endDate: "15/01/2025",
    status: "Ativo",
  },
  {
    id: "CTR-003",
    title: "Termo de Doação - Fundação XYZ",
    type: "Financiamento",
    project: "Campanha de Marketing Digital",
    value: "R$ 50.000,00",
    startDate: "01/06/2024",
    endDate: "31/12/2024",
    status: "Ativo",
  },
  {
    id: "CTR-004",
    title: "Contrato de Aluguel - Sede",
    type: "Infraestrutura",
    project: "N/A",
    value: "R$ 5.000,00 / mês",
    startDate: "01/01/2023",
    endDate: "31/12/2024",
    status: "Em Renovação",
  },
    {
    id: "CTR-005",
    title: "Contrato de Catering - Sabor & Cia",
    type: "Fornecedor",
    project: "Evento Beneficente Anual",
    value: "R$ 8.000,00",
    startDate: "10/05/2023",
    endDate: "10/07/2023",
    status: "Expirado",
  },
];

const getStatusBadgeClass = (status: ContractStatus) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Em Renovação":
        return "bg-yellow-100 text-yellow-800";
      case "Expirado":
        return "bg-red-100 text-red-800";
      case "Rascunho":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
};

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Contratos</h1>
        <p className="text-muted-foreground">
          Centralize, monitore e gerencie todos os contratos da sua organização.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
             <CardTitle className="font-headline">Contratos</CardTitle>
            <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar contrato..." className="w-64 pl-9" />
                </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Contrato
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">
                    <div className="font-semibold">{contract.title}</div>
                    <div className="text-sm text-muted-foreground">
                        {contract.project !== 'N/A' ? `Projeto: ${contract.project}` : 'Sem projeto vinculado'}
                    </div>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline">{contract.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{contract.value}</TableCell>
                  <TableCell>{contract.endDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Anexos</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Arquivar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
