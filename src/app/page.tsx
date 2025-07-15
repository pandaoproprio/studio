"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary p-3">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold tracking-tight text-primary">
              AnnIConecta
            </CardTitle>
            <CardDescription>
              A plataforma para transformação digital de organizações sociais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full font-bold">
                Entrar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Button variant="link" size="sm">
              Esqueceu sua senha?
            </Button>
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Button variant="link" size="sm" className="p-0">
                Crie uma agora
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AnnITech – IT Solutions. Todos os direitos reservados.
      </footer>
    </div>
  );
}
