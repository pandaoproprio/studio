// src/app/dashboard/projects/[projectId]/documents/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Search, MoreHorizontal, Download, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface Document {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
}

const initialDocuments: Document[] = [
    { id: 'doc-1', name: 'Escopo do Projeto v2.1.pdf', type: 'Planejamento', size: '1.2MB', uploadDate: '25/07/2024' },
    { id: 'doc-2', name: 'Apresentação Kick-off.pptx', type: 'Apresentação', size: '4.5MB', uploadDate: '24/07/2024' },
    { id: 'doc-3', name: 'Contrato Fornecedor Gráfica.pdf', type: 'Contrato', size: '850KB', uploadDate: '22/07/2024' },
    { id: 'doc-4', name: 'Relatório Parcial de Impacto.docx', type: 'Relatório', size: '3.1MB', uploadDate: '20/07/2024' },
]

export default function ProjectDocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDocumentAdd = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const file = formData.get('file') as File;
        
        if (!file || !formData.get('type')) return;

        const newDocument: Document = {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: formData.get('type') as string,
            size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            uploadDate: format(new Date(), 'dd/MM/yyyy'),
        };

        setDocuments(prev => [newDocument, ...prev]);
        setIsDialogOpen(false);
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Documentos do Projeto</CardTitle>
                        <CardDescription>Gerencie todos os arquivos e documentos relacionados a este projeto.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar documento..." className="w-64 pl-9" />
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Adicionar Documento
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Adicionar Novo Documento</DialogTitle>
                                    <DialogDescription>
                                        Faça o upload de um novo arquivo para este projeto.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleDocumentAdd} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Tipo do Documento</Label>
                                        <Input id="type" name="type" placeholder="Ex: Relatório, Contrato, Proposta" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="file">Arquivo</Label>
                                        <Input id="file" name="file" type="file" required />
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                        <Button type="submit">Adicionar</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome do Arquivo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Data de Upload</TableHead>
                            <TableHead>Tamanho</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.map(doc => (
                             <TableRow key={doc.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground"/>
                                        <span>{doc.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{doc.type}</TableCell>
                                <TableCell>{doc.uploadDate}</TableCell>
                                <TableCell>{doc.size}</TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>
                                                <Download className="mr-2 h-4 w-4" />
                                                Baixar
                                            </DropdownMenuItem>
                                             <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Excluir
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {documents.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-10 w-10 mx-auto mb-2" />
                        <p>Nenhum documento encontrado.</p>
                        <p className="text-sm">Comece adicionando seu primeiro arquivo.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
