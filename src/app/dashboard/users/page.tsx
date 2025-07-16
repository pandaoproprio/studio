// src/app/dashboard/users/page.tsx
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
import { MoreHorizontal, PlusCircle, Filter, Shield, ShieldCheck, ShieldAlert, Pencil, Trash2 } from "lucide-react";

type UserRole = "superadmin" | "admin" | "user";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

const initialUsers: User[] = [
  { id: "user-1", name: "Joana Silva", email: "superadmin@anniconecta.com", avatar: "https://placehold.co/100x100.png", role: "superadmin" },
  { id: "user-2", name: "Carlos Andrade", email: "admin1@example.com", avatar: "https://placehold.co/100x100.png", role: "admin" },
  { id: "user-3", name: "Beatriz Costa", email: "user1@example.com", avatar: "https://placehold.co/100x100.png", role: "user" },
  { id: "user-4", name: "Ricardo Souza", email: "user2@example.com", avatar: "https://placehold.co/100x100.png", role: "user" },
  { id: "user-5", name: "Mariana Ferreira", email: "admin2@example.com", avatar: "https://placehold.co/100x100.png", role: "admin" },
];

const roleConfig: Record<UserRole, { label: string; icon: React.ElementType; className: string }> = {
  superadmin: { label: "Super Admin", icon: ShieldAlert, className: "bg-red-100 text-red-800 border-red-200" },
  admin: { label: "Admin", icon: ShieldCheck, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  user: { label: "User", icon: Shield, className: "bg-blue-100 text-blue-800 border-blue-200" },
};

// Simulação do usuário logado. Altere o ID para testar as permissões.
const loggedInUserId = "user-1"; 

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const loggedInUser = users.find(u => u.id === loggedInUserId);
  if (!loggedInUser) {
    return <div>Erro: Usuário logado não encontrado.</div>;
  }

  const canManageUser = (targetUser: User): { canEdit: boolean; canDelete: boolean } => {
    if (!loggedInUser || loggedInUser.id === targetUser.id) {
        return { canEdit: false, canDelete: false }; // Não pode gerenciar a si mesmo
    }

    switch (loggedInUser.role) {
        case "superadmin":
            return { canEdit: true, canDelete: true }; // Superadmin pode tudo
        case "admin":
            // Admin só pode gerenciar 'user'
            if (targetUser.role === 'user') {
                return { canEdit: true, canDelete: true };
            }
            return { canEdit: false, canDelete: false };
        case "user":
        default:
            return { canEdit: false, canDelete: false }; // User não pode nada
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Gerenciar Usuários</h1>
        <p className="text-muted-foreground">
          Adicione, edite e gerencie as permissões dos usuários da plataforma.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-headline">Usuários do Sistema</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Pesquisar usuário..." className="w-64" />
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
              {loggedInUser.role === 'superadmin' && (
                  <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Novo Usuário
                  </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const { canEdit, canDelete } = canManageUser(user);
                const RoleIcon = roleConfig[user.role].icon;

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait"/>
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1.5 pl-2 ${roleConfig[user.role].className}`}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {roleConfig[user.role].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {(canEdit || canDelete) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            {canEdit && (
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4"/>
                                Editar Usuário
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                                <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Excluir Usuário
                                </DropdownMenuItem>
                                </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
