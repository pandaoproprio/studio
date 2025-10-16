// src/app/dashboard/hr/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter, User, FileText } from "lucide-react";
import { getEmployees, type Employee } from "@/services/hr";
import { EmployeeProfileDialog } from "@/components/hr/employee-profile-dialog";
import { AddEmployeeDialog } from "@/components/hr/add-employee-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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

export default function HrPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEmployees() {
      setIsLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar colaboradores",
          description: "Não foi possível buscar os dados dos colaboradores.",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployees();
  }, [toast]);

  const handleEmployeeAdded = (newEmployee: Employee) => {
    setEmployees(prev => [newEmployee, ...prev]);
    toast({
      title: "Colaborador Adicionado",
      description: `${newEmployee.name} foi adicionado(a) com sucesso.`
    });
  }
  
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
                <AddEmployeeDialog onEmployeeAdded={handleEmployeeAdded}>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Colaborador
                  </Button>
                </AddEmployeeDialog>
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
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <Skeleton className="h-10 w-10 rounded-full" />
                           <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-[70px] rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.id}>
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
                            <EmployeeProfileDialog employeeId={employee.id}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <User className="mr-2 h-4 w-4" />
                                  Ver Perfil
                              </DropdownMenuItem>
                            </EmployeeProfileDialog>
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
