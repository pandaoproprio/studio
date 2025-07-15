import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter } from "lucide-react";

const employees = [
  {
    name: "Carlos Andrade",
    email: "carlos.andrade@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Gerente de Projetos",
    status: "Ativo",
    vacation: "15/01/2025 - 30/01/2025",
  },
  {
    name: "Beatriz Costa",
    email: "beatriz.costa@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Coordenadora de Voluntários",
    status: "Ativo",
    vacation: "N/A",
  },
  {
    name: "Mariana Ferreira",
    email: "mariana.ferreira@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Assistente Social",
    status: "Licença",
    vacation: "N/A",
  },
  {
    name: "Ricardo Souza",
    email: "ricardo.souza@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Analista Financeiro",
    status: "Ativo",
    vacation: "01/03/2025 - 15/03/2025",
  },
  {
    name: "Fernanda Lima",
    email: "fernanda.lima@example.com",
    avatar: "https://placehold.co/100x100.png",
    role: "Psicóloga",
    status: "Férias",
    vacation: "20/12/2024 - 10/01/2025",
  },
];

export default function HrPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">AnnIRH – Gestão de Pessoas</h1>
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
                    <Badge variant={employee.status === 'Ativo' ? 'secondary' : 'default'}
                           className={
                            employee.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                            employee.status === 'Férias' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                           }>
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
  );
}
