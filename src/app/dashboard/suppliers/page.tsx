
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter, Truck } from "lucide-react";

const suppliers = [
  {
    name: "Grafica Impressão Rápida",
    contact: "contato@graficarapida.com",
    avatar: "https://placehold.co/100x100.png",
    category: "Material Gráfico",
    status: "Ativo",
    cnpj: "12.345.678/0001-99",
  },
  {
    name: "Sabor & Cia Alimentos",
    contact: "vendas@saborecia.com",
    avatar: "https://placehold.co/100x100.png",
    category: "Alimentação",
    status: "Ativo",
    cnpj: "98.765.432/0001-11",
  },
  {
    name: "Soluções Tech",
    contact: "suporte@solucoestech.com.br",
    avatar: "https://placehold.co/100x100.png",
    category: "Tecnologia",
    status: "Inativo",
    cnpj: "11.222.333/0001-44",
  },
  {
    name: "Limpeza & Cia",
    contact: "comercial@limpezacia.com",
    avatar: "https://placehold.co/100x100.png",
    category: "Material de Limpeza",
    status: "Ativo",
    cnpj: "44.555.666/0001-55",
  },
  {
    name: "Transportadora Veloz",
    contact: "logistica@veloz.com",
    avatar: "https://placehold.co/100x100.png",
    category: "Logística",
    status: "Pendente",
    cnpj: "66.777.888/0001-33",
  },
];

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Fornecedores</h1>
        <p className="text-muted-foreground">
          Centralize as informações e o relacionamento com seus fornecedores.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-headline">Fornecedores</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Pesquisar fornecedor..." className="w-64" />
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
                Novo Fornecedor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.cnpj}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={supplier.avatar} alt={supplier.name} data-ai-hint="company logo"/>
                        <AvatarFallback>{supplier.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">{supplier.contact}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === 'Ativo' ? 'secondary' : 'default'}
                           className={
                            supplier.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                            supplier.status === 'Pendente' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                           }>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{supplier.cnpj}</TableCell>
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
