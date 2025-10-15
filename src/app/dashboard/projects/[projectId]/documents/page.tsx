// src/app/dashboard/projects/[projectId]/documents/page.tsx
"use client";

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


const documents = [
    { id: 'doc-1', name: 'Escopo do Projeto v2.1.pdf', type: 'Planejamento', size: '1.2MB', uploadDate: '25/07/2024' },
    { id: 'doc-2', name: 'Apresentação Kick-off.pptx', type: 'Apresentação', size: '4.5MB', uploadDate: '24/07/2024' },
    { id: 'doc-3', name: 'Contrato Fornecedor Gráfica.pdf', type: 'Contrato', size: '850KB', uploadDate: '22/07/2024' },
    { id: 'doc-4', name: 'Relatório Parcial de Impacto.docx', type: 'Relatório', size: '3.1MB', uploadDate: '20/07/2024' },
]

export default function ProjectDocumentsPage() {

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
                        <Button>
                            <Upload className="mr-2 h-4 w-4" />
                            Adicionar Documento
                        </Button>
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
            </CardContent>
        </Card>
    )
}