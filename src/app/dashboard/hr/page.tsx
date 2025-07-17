// src/app/dashboard/hr/page.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter, Bot, Wand2, Loader2, User, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { describeColaboradorAction } from "@/lib/actions";
import { PuffLoader } from "react-spinners";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [profileAnalysis, setProfileAnalysis] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openViewDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setProfileAnalysis(null);
    setError(null);
    setIsViewOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsViewOpen(false);
    setSelectedEmployee(null);
    setProfileAnalysis(null);
  }

  const handleDescribeProfile = async () => {
    if (!selectedEmployee) return;

    setIsLoadingProfile(true);
    setError(null);
    setProfileAnalysis(null);
    try {
      const result = await describeColaboradorAction({
        role: selectedEmployee.role,
        description: selectedEmployee.description,
      });

      if (result.data) {
        setProfileAnalysis(result.data.profile);
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => openViewDialog(employee)}>
                            <User className="mr-2 h-4 w-4" />
                            Ver Perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
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

      {selectedEmployee && (
        <Dialog open={isViewOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} data-ai-hint="person portrait"/>
                            <AvatarFallback>{selectedEmployee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl font-headline">{selectedEmployee.name}</DialogTitle>
                            <DialogDescription>{selectedEmployee.role} • {selectedEmployee.email}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-headline">Descrição de Responsabilidades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{selectedEmployee.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-headline">Análise de Perfil com IA</CardTitle>
                            <CardDescription>Clique no botão para gerar uma análise comportamental com base no cargo e responsabilidades.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" onClick={handleDescribeProfile} disabled={isLoadingProfile} className="w-full">
                                {isLoadingProfile ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analisando...</>
                                ) : (
                                    <><Wand2 className="mr-2 h-4 w-4"/>Gerar Perfil Comportamental</>
                                )}
                            </Button>

                            {isLoadingProfile && (
                                <div className="flex justify-center items-center min-h-[100px]">
                                    <PuffLoader color="hsl(var(--primary))" size={40} />
                                </div>
                            )}

                            {error && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertTitle>Erro na Análise</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {profileAnalysis && (
                                <div className="mt-4 rounded-md border bg-secondary/50 p-4">
                                    <p className="text-sm whitespace-pre-wrap">{profileAnalysis}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
