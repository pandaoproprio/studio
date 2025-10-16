// src/app/dashboard/suppliers/page.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter, Eye, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const initialSuppliers = [
  {
    name: "Grafica Impressão Rápida",
    contact: "contato@graficarapida.com",
    avatar: "https://placehold.co/100x100.png",
    category: "Material Gráfico",
    status: "Ativo",
    cnpj: "12.345.678/0001-99",
    address: "Rua das Impressões, 123, São Paulo, SP",
    phone: "(11) 98765-4321"
  },
  {
    name: "Sabor & Cia Alimentos",
    contact: "vendas@saborecia.com",
    avatar: "https://placehold.co/100x100.png",
    category: "Alimentação",
    status: "Ativo",
    cnpj: "98.765.432/0001-11",
    address: "Avenida dos Sabores, 456, Rio de Janeiro, RJ",
    phone: "(21) 91234-5678"
  },
  {
    name: "Soluções Tech",
    contact: "suporte@solucoestech.com.br",
    avatar: "https://placehold.co/100x100.png",
    category: "Tecnologia",
    status: "Inativo",
    cnpj: "11.222.333/0001-44",
    address: "Rua dos Bytes, 789, Belo Horizonte, MG",
    phone: "(31) 95555-4444"
  },
  {
    name: "Limpeza & Cia",
    contact: "comercial@limpezacia.com",
    avatar: "https://placehold.co/100x100.png",
    category: "Material de Limpeza",
    status: "Ativo",
    cnpj: "44.555.666/0001-55",
    address: "Travessa da Faxina, 101, Curitiba, PR",
    phone: "(41) 96666-7777"
  },
  {
    name: "Transportadora Veloz",
    contact: "logistica@veloz.com",
    avatar: "https://placehold.co/100x100.png",
    category: "Logística",
    status: "Pendente",
    cnpj: "66.777.888/0001-33",
    address: "Estrada da Entrega, 202, Salvador, BA",
    phone: "(71) 98888-9999"
  },
];

type Supplier = typeof initialSuppliers[0];

// Mock do usuário logado e sua role
const loggedInUser = { role: "admin" }; // Pode ser 'user', 'admin', ou 'superadmin'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const canEditOrDelete = loggedInUser.role === 'admin' || loggedInUser.role === 'superadmin';

  const openViewDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewOpen(true);
  }

  const handleAddSupplier = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSupplier: Supplier = {
      name: formData.get("name") as string,
      contact: formData.get("contact") as string,
      category: formData.get("category") as string,
      cnpj: formData.get("cnpj") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      status: "Ativo", // Default status
      avatar: "https://placehold.co/100x100.png"
    };

    setSuppliers(prev => [newSupplier, ...prev]);
    setIsAddOpen(false);
  };

  return (
    <>
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
                {canEditOrDelete && (
                  <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Fornecedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
                        <DialogDescription>
                          Preencha os detalhes do novo fornecedor.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddSupplier} className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome do Fornecedor</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact">Email de Contato</Label>
                          <Input id="contact" name="contact" type="email" required />
                        </div>
                         <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input id="phone" name="phone" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoria</Label>
                          <Input id="category" name="category" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cnpj">CNPJ</Label>
                          <Input id="cnpj" name="cnpj" required />
                        </div>
                         <div className="space-y-2">
                          <Label htmlFor="address">Endereço</Label>
                          <Input id="address" name="address" required />
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
                          <Button type="submit">Adicionar Fornecedor</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
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
                  <TableHead className="text-right">Ações</TableHead>
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
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button aria-haspopup="true" size="icon" variant="ghost" onClick={() => openViewDialog(supplier)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver detalhes</span>
                          </Button>
                          {canEditOrDelete && (
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button aria-haspopup="true" size="icon" variant="ghost">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Toggle menu</span>
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                      <DropdownMenuItem>
                                          <Pencil className="mr-2 h-4 w-4" />
                                          Editar
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-destructive">
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Excluir
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          )}
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedSupplier && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedSupplier.name}</DialogTitle>
                    <DialogDescription>Detalhes do Fornecedor</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p><strong>Contato:</strong> {selectedSupplier.contact}</p>
                    <p><strong>Telefone:</strong> {selectedSupplier.phone}</p>
                    <p><strong>Endereço:</strong> {selectedSupplier.address}</p>
                    <p><strong>CNPJ:</strong> {selectedSupplier.cnpj}</p>
                    <p><strong>Categoria:</strong> {selectedSupplier.category}</p>
                    <p><strong>Status:</strong> {selectedSupplier.status}</p>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
