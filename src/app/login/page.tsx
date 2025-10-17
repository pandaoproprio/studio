// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { LogIn, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for prototype
    if (email === "test@example.com" && password === "password") {
      router.push("/dashboard");
    } else {
      setError("Email ou senha inválidos. Use test@example.com e 'password' para acessar.");
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Leaf className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold font-headline text-primary">AnnIConecta</h1>
                    </div>
                    <p className="text-balance text-muted-foreground">
                        Insira seu e-mail abaixo para fazer login em sua conta
                    </p>
                </div>
                 {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Senha</Label>
                            <Link href="#" className="ml-auto inline-block text-sm underline">
                                Esqueceu sua senha?
                            </Link>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          required 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Não tem uma conta?{" "}
                    <Link href="/signup" className="underline">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
        <div className="hidden bg-muted lg:block">
            <Image
                src="https://picsum.photos/seed/3/1200/1800"
                alt="Image"
                width="1920"
                height="1080"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                data-ai-hint="social organization community"
            />
        </div>
    </div>
  );
}
