// src/components/hr/employee-profile-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wand2, Loader2, User, File, CalendarOff, FileUp, PlusCircle, Trash2 } from "lucide-react";
import { describeColaboradorAction } from "@/lib/actions";
import { PuffLoader } from "react-spinners";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getEmployeeById, type Employee } from "@/services/hr";
import { Skeleton } from "../ui/skeleton";


interface EmployeeProfileDialogProps {
    employeeId: string;
    children: React.ReactNode;
}

const getLeaveStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Aprovado":
      case "Agendado":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
};

export function EmployeeProfileDialog({ employeeId, children }: EmployeeProfileDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
    const [profileAnalysis, setProfileAnalysis] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && employeeId) {
            const fetchEmployee = async () => {
                setIsLoadingEmployee(true);
                setEmployee(null);
                setProfileAnalysis(null);
                setError(null);
                try {
                    const data = await getEmployeeById(employeeId);
                    setEmployee(data);
                } catch (err) {
                    setError("Falha ao carregar dados do colaborador.");
                } finally {
                    setIsLoadingEmployee(false);
                }
            };
            fetchEmployee();
        }
    }, [isOpen, employeeId]);
    
    const handleDescribeProfile = async () => {
        if (!employee) return;
    
        setIsLoadingProfile(true);
        setError(null);
        setProfileAnalysis(null);
        try {
          const result = await describeColaboradorAction({
            role: employee.role,
            description: employee.description,
          });
    
          if (result.data) {
            setProfileAnalysis(result.data.profile);
          } else {
            setError(result.error || "Falha ao gerar o perfil.");
          }
        } catch (e) {
          setError("Ocorreu um erro inesperado.");
        } finally {
          setIsLoadingProfile(false);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-4xl">
                 <DialogHeader>
                    {isLoadingEmployee || !employee ? (
                        <div className="flex items-start gap-4">
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-48" />
                                <Skeleton className="h-5 w-64" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="person portrait"/>
                                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-2xl font-headline">{employee.name}</DialogTitle>
                                <DialogDescription>{employee.role} • {employee.email}</DialogDescription>
                            </div>
                        </div>
                    )}
                </DialogHeader>
                <div className="py-4">
                    {isLoadingEmployee || !employee ? (
                        <div className="space-y-4">
                             <Skeleton className="h-10 w-full" />
                             <Skeleton className="h-64 w-full" />
                        </div>
                    ) : (
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/> Perfil</TabsTrigger>
                                <TabsTrigger value="documents"><File className="mr-2 h-4 w-4"/> Documentos</TabsTrigger>
                                <TabsTrigger value="leaves"><CalendarOff className="mr-2 h-4 w-4"/> Férias e Ausências</TabsTrigger>
                            </TabsList>
                            <div className="mt-4 max-h-[50vh] overflow-y-auto pr-2">
                                <TabsContent value="profile" className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-headline">Descrição de Responsabilidades</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{employee.description}</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-headline">Análise de Perfil com IA</CardTitle>
                                            <CardDescription>Clique no botão para gerar uma análise comportamental com base no cargo e responsabilidades.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button variant="outline" onClick={handleDescribeProfile} disabled={isLoadingProfile} className="w-full">
                                                {isLoadingProfile ? (
                                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analisando...</>
                                                ) : (
                                                    <><Wand2 className="mr-2 h-4 w-4"/>Gerar Perfil Comportamental</>
                                                )}
                                            </Button>

                                            {isLoadingProfile && (
                                                <div className="flex justify-center items-center min-h-[100px]">
                                                    <PuffLoader color="hsl(var(--primary))" size={40} />
                                                </div>
                                            )}

                                            {error && (
                                                <Alert variant="destructive" className="mt-4">
                                                    <AlertTitle>Erro na Análise</AlertTitle>
                                                    <AlertDescription>{error}</AlertDescription>
                                                </Alert>
                                            )}

                                            {profileAnalysis && (
                                                <div className="mt-4 rounded-md border bg-secondary/50 p-4">
                                                    <p className="text-sm whitespace-pre-wrap">{profileAnalysis}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="documents">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg font-headline">Documentos</CardTitle>
                                                <Button variant="outline"><FileUp className="mr-2 h-4 w-4"/> Adicionar Documento</Button>
                                            </div>
                                            <CardDescription>Gerencie currículos, contratos e outros documentos.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Nome do Arquivo</TableHead>
                                                        <TableHead>Tipo</TableHead>
                                                        <TableHead>Data de Upload</TableHead>
                                                        <TableHead>Tamanho</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {employee.documents.map(doc => (
                                                        <TableRow key={doc.id}>
                                                            <TableCell className="font-medium">{doc.name}</TableCell>
                                                            <TableCell>{doc.type}</TableCell>
                                                            <TableCell>{doc.uploadDate}</TableCell>
                                                            <TableCell>{doc.size}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {employee.documents.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="h-24 text-center">Nenhum documento encontrado.</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="leaves">
                                     <Card>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg font-headline">Histórico de Ausências</CardTitle>
                                                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/> Registrar Nova Ausência</Button>
                                            </div>
                                            <CardDescription>Monitore férias, licenças e outros afastamentos.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Tipo</TableHead>
                                                        <TableHead>Data de Início</TableHead>
                                                        <TableHead>Data de Fim</TableHead>
                                                        <TableHead>Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                     {employee.leaves.map(leave => (
                                                        <TableRow key={leave.id}>
                                                            <TableCell className="font-medium">{leave.type}</TableCell>
                                                            <TableCell>{leave.startDate}</TableCell>
                                                            <TableCell>{leave.endDate}</TableCell>
                                                            <TableCell>
                                                                <Badge className={getLeaveStatusBadgeClass(leave.status)}>{leave.status}</Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {employee.leaves.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="h-24 text-center">Nenhuma ausência registrada.</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </div>
                        </Tabs>
                    )}
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
