import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, ExternalLink } from "lucide-react";

const invoices = [
  { id: "INV-2024-005", date: "01 de Julho, 2024", amount: "R$ 199,00", status: "Pago" },
  { id: "INV-2024-004", date: "01 de Junho, 2024", amount: "R$ 199,00", status: "Pago" },
  { id: "INV-2024-003", date: "01 de Maio, 2024", amount: "R$ 199,00", status: "Pago" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Assinatura e Faturamento</h1>
        <p className="text-muted-foreground">
          Gerencie sua assinatura, visualize faturas e atualize seu método de pagamento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Plano Atual</CardTitle>
                    <CardDescription>Você está no plano AnnIConecta Pro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-bold">R$199</span>
                        <span className="text-muted-foreground">/mês</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Sua assinatura será renovada em <strong>1 de Agosto, 2024</strong>.
                    </p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Módulo de Projetos</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Módulo AnnIRH</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Módulos de IA</li>
                    </ul>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button>Mudar Plano</Button>
                    <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-red-50">Cancelar Assinatura</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Histórico de Faturas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fatura</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Download</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>{invoice.amount}</TableCell>
                                    <TableCell><Badge className="bg-green-100 text-green-800 hover:bg-green-200">Pago</Badge></TableCell>
                                    <TableCell><Button variant="outline" size="sm">Download</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Portal do Cliente</CardTitle>
                    <CardDescription>
                        Para uma gestão completa, acesse nosso portal seguro da Stripe.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Button className="w-full">
                        Acessar Portal de Assinatura
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground text-center">
                        Você será redirecionado para a Stripe.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Cupom Promocional</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="coupon">Código do Cupom</Label>
                        <div className="flex gap-2">
                            <Input id="coupon" placeholder="Ex: PROMO50" />
                            <Button variant="secondary">Aplicar</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
