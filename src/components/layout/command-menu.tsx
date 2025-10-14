// src/components/layout/command-menu.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCommandMenu } from '@/hooks/use-command-menu';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  CreditCard,
  Bot,
  Truck,
  Package,
  Clapperboard,
  Handshake,
  DoorOpen,
  UserCog,
  FileSignature,
  Film,
  Building,
  FileText,
  PlusCircle,
  Settings,
  HeartPulse,
  TrendingDown,
  BookMarked,
  DollarSign,
  Receipt,
  FileCheck,
  Search,
} from 'lucide-react';

export function CommandMenu() {
  const router = useRouter();
  const { isOpen, setOpen } = useCommandMenu();

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, [setOpen]);

  const commands = [
    {
      group: 'Navegação',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Ir para o Dashboard',
          action: () => router.push('/dashboard'),
        },
        {
          icon: KanbanSquare,
          label: 'Ir para Projetos',
          action: () => router.push('/dashboard/projects'),
        },
        {
          icon: DollarSign,
          label: 'Ir para Dashboard Financeiro',
          action: () => router.push('/dashboard/financial'),
        },
         {
          icon: FileText,
          label: 'Ir para Todas as Transações',
          action: () => router.push('/dashboard/financials/transactions'),
        },
        {
          icon: FileCheck,
          label: 'Ir para Gestão de Reembolsos',
          action: () => router.push('/dashboard/financial/reimbursements'),
        },
        {
          icon: Receipt,
          label: 'Ir para Solicitar Reembolso',
          action: () => router.push('/dashboard/reimbursements'),
        },
        {
          icon: Handshake,
          label: 'Ir para CRM',
          action: () => router.push('/dashboard/crm'),
        },
        {
          icon: Users,
          label: 'Ir para RH',
          action: () => router.push('/dashboard/hr'),
        },
        {
          icon: FileSignature,
          label: 'Ir para Contratos',
          action: () => router.push('/dashboard/contracts'),
        },
         {
          icon: Truck,
          label: 'Ir para Fornecedores',
          action: () => router.push('/dashboard/suppliers'),
        },
        {
          icon: DoorOpen,
          label: 'Ir para Salas',
          action: () => router.push('/dashboard/rooms'),
        },
        {
          icon: Package,
          label: 'Ir para Ativos',
          action: () => router.push('/dashboard/assets'),
        }
      ],
    },
    {
        group: 'Relatórios IA',
        items: [
            {
                icon: FileText,
                label: 'Gerador de Relatório de Impacto',
                action: () => router.push('/dashboard/reports/impact-generator'),
            },
            {
                icon: FileText,
                label: 'Gerador de Relatório de Progresso',
                action: () => router.push('/dashboard/reports/progress-generator'),
            },
             {
                icon: FileText,
                label: 'Gerador de Relatório Narrativo',
                action: () => router.push('/dashboard/reports/narrative-report'),
            },
            {
                icon: Film,
                label: 'Gerador de Vídeo',
                action: () => router.push('/dashboard/video-generator'),
            },
            {
                icon: HeartPulse,
                label: 'Diagnóstico Organizacional',
                action: () => router.push('/dashboard/reports/organizational-diagnosis'),
            },
            {
                icon: TrendingDown,
                label: 'Análise de Risco Corporativo',
                action: () => router.push('/dashboard/reports/corporate-risk-analysis'),
            },
            {
                icon: BookMarked,
                label: 'Assistente de Pesquisa Acadêmica',
                action: () => router.push('/dashboard/reports/academic-research-assistant'),
            },
             {
                icon: Search,
                label: 'Resolução de Problemas (A3)',
                action: () => router.push('/dashboard/reports/a3-problem-solving'),
            }
        ]
    },
    {
      group: 'Ações',
      items: [
        {
          icon: PlusCircle,
          label: 'Criar Novo Projeto',
          action: () => router.push('/dashboard/projects/new'), // Placeholder
        },
        {
          icon: PlusCircle,
          label: 'Adicionar Novo Contato',
          action: () => router.push('/dashboard/crm/new'), // Placeholder
        },
        {
          icon: PlusCircle,
          label: 'Registrar Novo Contrato',
          action: () => router.push('/dashboard/contracts/new'), // Placeholder
        },
        {
          icon: PlusCircle,
          label: 'Solicitar Reembolso',
          action: () => router.push('/dashboard/reimbursements'), // Goes to the page where they can open the dialog
        },
         {
          icon: PlusCircle,
          label: 'Registrar Nova Transação',
          action: () => router.push('/dashboard/financial'), // Goes to the page where they can open the dialog
        },
      ],
    },
    {
      group: 'Configurações',
      items: [
         {
          icon: UserCog,
          label: 'Gerenciar Usuários',
          action: () => router.push('/dashboard/users'),
        },
        {
          icon: CreditCard,
          label: 'Gerenciar Assinatura',
          action: () => router.push('/dashboard/billing'),
        },
        {
          icon: Settings,
          label: 'Configurações da Conta',
          action: () => router.push('/dashboard/settings'), // Placeholder
        }
      ],
    },
  ];

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem
                key={item.label}
                onSelect={() => runCommand(item.action)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
