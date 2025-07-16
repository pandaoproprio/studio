
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Filter, Phone, Mail, FileText, Calendar, Send, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type InteractionType = 'Reunião' | 'Ligação' | 'Email' | 'Evento' | 'Outro';

interface Interaction {
  id: string;
  type: InteractionType;
  date: string;
  notes: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: "Doador" | "Voluntário" | "Parceiro" | "Beneficiário";
  status: "Ativo" | "Inativo" | "Pendente";
  engagement: "Alto" | "Médio" | "Baixo" | "N/A";
  phone: string;
  interactions: Interaction[];
}

const initialContacts: Contact[] = [
  {
    id: "contact-1",
    name: "Ana Pereira",
    email: "ana.pereira@email.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Doador",
    status: "Ativo",
    engagement: "Alto",
    phone: "(11) 98765-4321",
    interactions: [
        { id: 'int-1', type: 'Email', date: '20/07/2024', notes: 'Enviado agradecimento pela última doação.'},
        { id: 'int-2', type: 'Ligação', date: '15/07/2024', notes: 'Conversamos sobre o impacto do projeto. Mostrou-se muito engajada.'},
    ],
  },
  {
    id: "contact-2",
    name: "Marcos Viana",
    email: "marcos.viana@email.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Voluntário",
    status: "Ativo",
    engagement: "Médio",
    phone: "(21) 91234-5678",
    interactions: [
        { id: 'int-3', type: 'Reunião', date: '05/07/2024', notes: 'Reunião de alinhamento para o próximo evento. Comprometeu-se a ajudar na organização.'},
    ],
  },
  {
    id: "contact-3",
    name: "Empresa Parceira S.A.",
    email: "contato@parceira.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Parceiro",
    status: "Ativo",
    engagement: "Alto",
    phone: "(31) 3333-4444",
    interactions: [
        { id: 'int-4', type: 'Reunião', date: '18/07/2024', notes: 'Alinhamento da parceria para o segundo semestre.'},
    ],
  },
  {
    id: "contact-4",
    name: "Lucas Martins",
    email: "lucas.martins@email.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Doador",
    status: "Inativo",
    engagement: "Baixo",
    phone: "(41) 99999-8888",
    interactions: [],
  },
  {
    id: "contact-5",
    name: "Juliana Ribeiro",
    email: "juliana.ribeiro@email.com",
    avatar: "https://placehold.co/100x100.png",
    type: "Voluntário",
    status: "Pendente",
    engagement: "N/A",
    phone: "(51) 98888-7777",
    interactions: [],
  },
];


const interactionIcons: Record<InteractionType, React.ElementType> = {
    'Reunião': Users,
    'Ligação': Phone,
    'Email': Mail,
    'Evento': Calendar,
    'Outro': FileText
}

export default function CrmPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

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

  const openViewDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewOpen(true);
  }

  const handleAddInteraction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedContact) return;

    const formData = new FormData(e.currentTarget);
    const newInteraction: Interaction = {
        id: `int-${Date.now()}`,
        type: formData.get('type') as InteractionType,
        date: new Date().toLocaleDateString('pt-BR'),
        notes: formData.get('notes') as string,
    }

    const updatedContact = {
        ...selectedContact,
        interactions: [newInteraction, ...selectedContact.interactions]
    };

    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    setSelectedContact(updatedContact);
    e.currentTarget.reset();
  }


  return (
    <>
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
                          <DropdownMenuItem onSelect={() => openViewDialog(contact)}>Ver Detalhes</DropdownMenuItem>
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

       {selectedContact && (
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">{selectedContact.name}</DialogTitle>
                    <DialogDescription>{selectedContact.type} • {selectedContact.email} • {selectedContact.phone}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 max-h-[60vh] overflow-y-auto">
                    {/* Coluna de Registro de Interação */}
                    <div className="space-y-4">
                        <h3 className="font-semibold font-headline">Registrar Nova Interação</h3>
                        <form onSubmit={handleAddInteraction} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Interação</Label>
                                <Select name="type" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(interactionIcons).map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Anotações</Label>
                                <Textarea id="notes" name="notes" rows={4} required placeholder="Descreva a interação..."/>
                            </div>
                            <Button type="submit" className="w-full">
                                <Send className="mr-2 h-4 w-4"/>
                                Salvar Interação
                            </Button>
                        </form>
                    </div>
                    {/* Coluna de Histórico de Interações */}
                    <div className="space-y-4">
                        <h3 className="font-semibold font-headline">Histórico de Interações</h3>
                        {selectedContact.interactions.length > 0 ? (
                             <div className="space-y-4">
                                {selectedContact.interactions.map(interaction => {
                                    const Icon = interactionIcons[interaction.type];
                                    return (
                                        <div key={interaction.id} className="flex gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                                                <Icon className="h-5 w-5 text-secondary-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{interaction.type} <span className="text-sm font-normal text-muted-foreground ml-2">{interaction.date}</span></p>
                                                <p className="text-sm text-muted-foreground">{interaction.notes}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                             </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic text-center pt-8">Nenhuma interação registrada.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
