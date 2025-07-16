// src/app/dashboard/hr/page.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter, Bot } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { describeColaboradorAction } from "@/lib/actions";
import { PuffLoader } from "react-spinners";

const employees = [
  {
    id: "emp-001",
    name: "Carlos Andrade",
    email: "carlos.andrade@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Gerente de Projetos",
    description: "Responsável pelo planejamento e execução dos projetos sociais, liderando equipes multidisciplinares e garantindo a entrega dos objetivos dentro do prazo e orçamento.",
    status: "Ativo",
    vacation: "15/01/2025 - 30/01/2025",
  },
  {
    id: "emp-002",
    name: "Beatriz Costa",
    email: "beatriz.costa@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Coordenadora de Voluntários",
    description: "Engaja, recruta e coordena a base de voluntários da organização, garantindo seu bem-estar, treinamento e alocação eficaz nos projetos.",
    status: "Ativo",
    vacation: "N/A",
  },
  {
    id: "emp-003",
    name: "Mariana Ferreira",
    email: "mariana.ferreira@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Assistente Social",
    description: "Atua na linha de frente, prestando suporte direto aos beneficiários dos projetos e suas famílias, realizando acompanhamento e encaminhamentos.",
    status: "Licença",
    vacation: "N/A",
  },
  {
    id: "emp-004",
    name: "Ricardo Souza",
    email: "ricardo.souza@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Analista Financeiro",
    description: "Cuida da saúde financeira da organização, incluindo orçamentos, relatórios de prestação de contas, controle de fluxo de caixa e conformidade fiscal.",
    status: "Ativo",
    vacation: "01/03/2025 - 15/03/2025",
  },
  {
    id: "emp-005",
    name: "Fernanda Lima",
    email: "fernanda.lima@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Psicóloga",
    description: "Oferece suporte psicossocial para a equipe interna e para os beneficiários dos programas, conduzindo sessões e desenvolvendo programas de bem-estar.",
    status: "Férias",
    vacation: "20/12/2024 - 10/01/2025",
  },
];

type Employee = typeof employees[0];

export default function HrPage() {
  const [profileData, setProfileData] = useState<{ profile: string; employeeName: string } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDescribeProfile = async (employee: Employee) => {
    setIsLoadingProfile(true);
    setError(null);
    setProfileData(null);
    try {
      const result = await describeColaboradorAction({
        role: employee.role,
        description: employee.description,
      });

      if (result.data) {
        setProfileData({
          profile: result.data.profile,
          employeeName: employee.name,
        });
      } else {
        setError(result.error || "Falha ao gerar o perfil.");
      }
    } catch (e) {
      setError("Ocorreu um erro inesperado.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Férias":
        return "bg-blue-100 text-blue-800";
      case "Licença":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">RH – Gestão de Pessoas</h1>
          <p className="text-muted-foreground">
            Gerencie as informações e o ciclo de vida dos colaboradores.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="font-headline">Colaboradores</CardTitle>
              <div className="flex items-center gap-2">
                <Input placeholder="Pesquisar colaborador..." className="w-64" />
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Colaborador
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Próximas Férias</TableHead>
                  <TableHead>Ações de IA</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.email}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="person portrait"/>
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusBadgeClass(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.vacation}</TableCell>
                    <TableCell>
                       <Button variant="outline" size="sm" onClick={() => handleDescribeProfile(employee)}>
                          <Bot className="mr-2 h-4 w-4" />
                          Descrever Perfil
                       </Button>
                    </TableCell>
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
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Desativar</DropdownMenuItem>
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

      <AlertDialog open={isLoadingProfile || !!profileData || !!error} onOpenChange={(open) => {
          if(!open) {
            setIsLoadingProfile(false);
            setProfileData(null);
            setError(null);
          }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">
              {isLoadingProfile && "Analisando Perfil..."}
              {error && "Erro na Análise"}
              {profileData && `Perfil Comportamental de ${profileData.employeeName}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isLoadingProfile && "Aguarde enquanto a IA gera a análise com base no cargo e responsabilidades."}
              {error && `Ocorreu um erro: ${error}`}
              {profileData && "Esta é uma análise gerada por IA com base nas informações fornecidas."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center items-center min-h-[150px]">
            {isLoadingProfile ? (
              <PuffLoader color="hsl(var(--primary))" />
            ) : profileData ? (
              <p className="text-sm text-foreground whitespace-pre-wrap">{profileData.profile}</p>
            ) : error ? null : null}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
                setIsLoadingProfile(false);
                setProfileData(null);
                setError(null);
            }}>Fechar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
