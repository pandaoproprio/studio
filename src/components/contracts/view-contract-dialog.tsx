// src/components/contracts/view-contract-dialog.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type Contract, ContractStatus } from "@/services/contracts";

interface ViewContractDialogProps {
    contract: Contract | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const getStatusBadgeClass = (status: ContractStatus) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Em Renovação": return "bg-yellow-100 text-yellow-800";
      case "Expirado": return "bg-red-100 text-red-800";
      case "Rascunho": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
};

export function ViewContractDialog({ contract, open, onOpenChange }: ViewContractDialogProps) {
  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{contract.title}</DialogTitle>
          <DialogDescription>
            Detalhes do Contrato
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="flex items-center gap-4">
                 <Badge variant="outline">{contract.type}</Badge>
                 <Badge className={getStatusBadgeClass(contract.status)}>{contract.status}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-semibold">{contract.value}</p>
                </div>
                 <div>
                    <p className="text-muted-foreground">Data de Início</p>
                    <p className="font-semibold">{contract.startDate}</p>
                </div>
                 <div>
                    <p className="text-muted-foreground">Data de Vencimento</p>
                    <p className="font-semibold">{contract.endDate}</p>
                </div>
            </div>
            {contract.project !== 'N/A' && (
                 <div>
                    <p className="text-muted-foreground text-sm">Projeto Vinculado</p>
                    <p className="font-semibold text-sm">{contract.project}</p>
                </div>
            )}
             {contract.fullText && (
                <div>
                    <p className="text-muted-foreground text-sm">Objeto do Contrato</p>
                    <p className="text-sm whitespace-pre-wrap bg-secondary/50 p-3 rounded-md">{contract.fullText}</p>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
