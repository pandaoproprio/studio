
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter, Laptop, Sofa, Car } from "lucide-react";

type AssetCategory = "Eletrônicos" | "Mobiliário" | "Veículos";
type AssetStatus = "Em uso" | "Disponível" | "Manutenção";

const assets = [
  {
    name: "Notebook Dell Inspiron",
    category: "Eletrônicos" as AssetCategory,
    status: "Em uso" as AssetStatus,
    location: "Sede - Sala 1",
    purchaseDate: "15/03/2023",
    value: "R$ 4.500,00",
  },
  {
    name: "Projetor Epson PowerLite",
    category: "Eletrônicos" as AssetCategory,
    status: "Disponível" as AssetStatus,
    location: "Almoxarifado",
    purchaseDate: "20/08/2022",
    value: "R$ 2.800,00",
  },
  {
    name: "Cadeira de Escritório",
    category: "Mobiliário" as AssetCategory,
    status: "Manutenção" as AssetStatus,
    location: "Sede - Sala 2",
    purchaseDate: "10/01/2021",
    value: "R$ 600,00",
  },
  {
    name: "Mesa de Reunião",
    category: "Mobiliário" as AssetCategory,
    status: "Em uso" as AssetStatus,
    location: "Sala de Reuniões",
    purchaseDate: "10/01/2021",
    value: "R$ 1.200,00",
  },
  {
    name: "Veículo Utilitário",
    category: "Veículos" as AssetCategory,
    status: "Em uso" as AssetStatus,
    location: "Garagem",
    purchaseDate: "05/06/2023",
    value: "R$ 80.000,00",
  },
];

const categoryIcons: Record<AssetCategory, React.ElementType> = {
  "Eletrônicos": Laptop,
  "Mobiliário": Sofa,
  "Veículos": Car,
};

const getStatusBadgeClass = (status: AssetStatus) => {
    switch (status) {
        case "Em uso": return "bg-green-100 text-green-800";
        case "Disponível": return "bg-blue-100 text-blue-800";
        case "Manutenção": return "bg-orange-100 text-orange-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Gestão de Ativos</h1>
        <p className="text-muted-foreground">
          Acompanhe e gerencie os ativos físicos da sua organização.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-headline">Ativos</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Pesquisar ativo..." className="w-64" />
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
                Novo Ativo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ativo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Data de Aquisição</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => {
                const Icon = categoryIcons[asset.category] || Laptop;
                return (
                    <TableRow key={asset.name}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="rounded-md h-12 w-12">
                                <AvatarFallback className="rounded-md bg-secondary text-secondary-foreground">
                                    <Icon className="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold">{asset.name}</div>
                                <div className="text-sm text-muted-foreground">{asset.value}</div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>
                        <Badge className={getStatusBadgeClass(asset.status)}>
                        {asset.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>{asset.purchaseDate}</TableCell>
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
                            <DropdownMenuItem className="text-destructive">Baixar Ativo</DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
