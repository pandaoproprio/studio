"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle user creation here.
    // For this prototype, we'll just redirect to the dashboard.
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-primary p-3">
              <UserPlus className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold tracking-tight text-primary">
              Criar Conta
            </CardTitle>
            <CardDescription>
              Junte-se à AnnIConecta e transforme sua organização.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" type="text" placeholder="Seu nome" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full font-bold">
                Criar minha conta
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/" passHref>
                <Button variant="link" size="sm" className="p-0">
                  Faça o login
                </Button>
              </Link>
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
