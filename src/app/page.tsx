// src/app/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "test@example.com" && password === "password") {
      router.push("/dashboard");
    } else {
      setError("Email ou senha inválidos.");
    }
  };

  const isFormInvalid = !email || !password;

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
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="test@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full font-bold" disabled={isFormInvalid}>
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
              <Link href="/signup" passHref>
                <Button variant="link" size="sm" className="p-0">
                  Crie uma agora
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
