// src/app/dashboard/contracts/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Filter, Search, ShieldAlert, Loader2, Eye } from "lucide-react";
import { getContracts, type Contract, addContract, ContractStatus, fromFirestore } from "@/services/contracts";
import { AddContractDialog } from "@/components/contracts/add-contract-dialog";
import { ViewContractDialog } from "@/components/contracts/view-contract-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { analyzeContractRiskAction } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const getStatusBadgeClass = (status: ContractStatus) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Em Renovação": return "bg-yellow-100 text-yellow-800";
      case "Expirado": return "bg-red-100 text-red-800";
      case "Rascunho": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
};

type ContractRisk = {
    contract: Contract;
    isAtRisk: boolean;
    reason: string;
    suggestedAction: string;
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [riskAlerts, setRiskAlerts] = useState<ContractRisk[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        const data = await getContracts();
        setContracts(data);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao carregar contratos",
            description: "Não foi possível buscar os dados dos contratos.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContracts();
  }, [toast]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [contracts, searchTerm]);

  const handleContractAdded = (newContract: Contract) => {
    setContracts(prev => [newContract, ...prev]);
    toast({
        title: "Contrato Adicionado",
        description: `O contrato "${newContract.title}" foi criado com sucesso.`
    });
  }

  const openViewDialog = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewOpen(true);
  }

  const handleRiskAnalysis = async () => {
    setIsAnalyzing(true);
    setRiskAlerts([]);
    try {
        const atRiskContracts = contracts.filter(c => c.status !== 'Ativo' || new Date(c.endDate) < new Date(new Date().setMonth(new Date().getMonth() + 2)));
        
        if (atRiskContracts.length === 0) {
             toast({ title: "Análise Concluída", description: "Nenhum risco contratual iminente encontrado." });
             return;
        }

        const analysisPromises = atRiskContracts.map(contract => 
            analyzeContractRiskAction({ contractId: contract.id, status: contract.status, endDate: contract.endDate })
        );

        const results = await Promise.all(analysisPromises);
        
        const newAlerts = results
            .map((res, index) => ({...res, contract: atRiskContracts[index]}))
            .filter(res => res.data?.isAtRisk)
            .map(res => ({
                contract: res.contract,
                isAtRisk: res.data!.isAtRisk,
                reason: res.data!.reason,
                suggestedAction: res.data!.suggestedAction,
            }));

        if (newAlerts.length > 0) {
            setRiskAlerts(newAlerts);
        } else {
             toast({ title: "Análise Concluída", description: "Nenhum risco crítico encontrado no momento." });
        }

    } catch (error) {
         toast({ variant: "destructive", title: "Erro na Análise", description: "Falha ao executar a análise de risco." });
    } finally {
        setIsAnalyzing(false);
    }
  }


  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Contratos</h1>
          <p className="text-muted-foreground">
            Centralize, monitore e gerencie todos os contratos da sua organização.
          </p>
        </div>

        {riskAlerts.length > 0 && (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Guardião de Contratos: Riscos Identificados!</AlertTitle>
                <AlertDescription>
                   <ul className="list-disc pl-5 mt-2 space-y-1">
                     {riskAlerts.map(alert => (
                        <li key={alert.contract.id}>
                            <strong>{alert.contract.title}:</strong> {alert.reason} <strong>Ação Sugerida:</strong> {alert.suggestedAction}
                        </li>
                     ))}
                   </ul>
                </AlertDescription>
            </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="font-headline">Contratos</CardTitle>
              <div className="flex items-center gap-2">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar contrato..." className="w-64 pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                 <Button variant="outline" onClick={handleRiskAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analisando...</>
                    ) : (
                        <><ShieldAlert className="mr-2 h-4 w-4" /> Guardião de Contratos</>
                    )}
                 </Button>
                <AddContractDialog onContractAdded={handleContractAdded}>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Contrato
                    </Button>
                </AddContractDialog>
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
                {isLoading ? (
                    Array.from({length: 5}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                ) : (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id} className={riskAlerts.some(a => a.contract.id === contract.id) ? 'bg-destructive/10' : ''}>
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
                         <div className="flex items-center justify-end">
                            <Button variant="ghost" size="icon" onClick={() => openViewDialog(contract)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver Detalhes</span>
                            </Button>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => openViewDialog(contract)}>Ver Detalhes</DropdownMenuItem>
                                <DropdownMenuItem>Anexos</DropdownMenuItem>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Arquivar</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {!isLoading && filteredContracts.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Nenhum contrato encontrado.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
       {selectedContract && <ViewContractDialog contract={selectedContract} open={isViewOpen} onOpenChange={setIsViewOpen} />}
    </>
  );
}
