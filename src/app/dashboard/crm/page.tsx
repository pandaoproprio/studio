
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter } from "lucide-react";

const contacts = [
  {
    name: "Ana Pereira",
    email: "ana.pereira@email.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Doador",
    status: "Ativo",
    engagement: "Alto",
  },
  {
    name: "Marcos Viana",
    email: "marcos.viana@email.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Voluntário",
    status: "Ativo",
    engagement: "Médio",
  },
  {
    name: "Empresa Parceira S.A.",
    email: "contato@parceira.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Parceiro",
    status: "Ativo",
    engagement: "Alto",
  },
  {
    name: "Lucas Martins",
    email: "lucas.martins@email.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Doador",
    status: "Inativo",
    engagement: "Baixo",
  },
  {
    name: "Juliana Ribeiro",
    email: "juliana.ribeiro@email.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Voluntário",
    status: "Pendente",
    engagement: "N/A",
  },
];

export default function CrmPage() {
  const getEngagementBadgeClass = (engagement: string) => {
    switch (engagement) {
      case "Alto":
        return "bg-green-100 text-green-800";
      case "Médio":
        return "bg-yellow-100 text-yellow-800";
      case "Baixo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Inativo":
        return "bg-red-100 text-red-800";
      case "Pendente":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">CRM - Gestão de Relacionamento</h1>
        <p className="text-muted-foreground">
          Construa e fortaleça o relacionamento com seus doadores, voluntários e parceiros.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-headline">Contatos</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Pesquisar contato..." className="w-64" />
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
                Novo Contato
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Engajamento</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.email}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person portrait"/>
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{contact.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(contact.status)}>
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <Badge className={getEngagementBadgeClass(contact.engagement)}>
                      {contact.engagement}
                    </Badge>
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
                        <DropdownMenuItem>Registrar Interação</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
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
