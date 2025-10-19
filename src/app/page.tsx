// src/app/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DEMO_CREDENTIALS = {
  email: "test@example.com",
  password: "password",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim();

    if (normalizedEmail === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      router.push("/dashboard");
    } else {
      setError("Email ou senha inválidos.");
    }
  };

  const isFormInvalid = !email.trim() || !password;

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
                  <AlertTitle>Erro ao entrar</AlertTitle>
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
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(null);
                  }}
                />
              </div>
              <Button type="submit" className="w-full font-bold" disabled={isFormInvalid}>
                Entrar
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Credenciais de demonstração: test@example.com / password
              </p>
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
        © {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/pandaoproprio/anniconecta"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          AnnITech – IT Solutions
        </a>
        . Todos os direitos reservados.
      </footer>
    </div>
  );
}
