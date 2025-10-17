// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { LogIn, Leaf, HandHeart } from "lucide-react";
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
    if (email === "test@example.com" && password === "password") {
      router.push("/dashboard");
    } else {
      setError("Email ou senha inválidos. Use test@example.com e 'password' para acessar.");
    }
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 opacity-20"></div>
             <div className="mx-auto w-full max-w-md space-y-8 p-8 relative z-10">
                <div className="flex flex-col items-center text-center">
                     <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4 border-2 border-primary/20">
                        <HandHeart className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold font-headline text-primary">AnnIConecta</h1>
                    <p className="mt-2 text-muted-foreground">
                       Conectando propósitos, transformando vidas.
                    </p>
                </div>
                 {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
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
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Senha</Label>
                            <Link href="#" className="text-sm text-primary/80 hover:underline">
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
                    <Button type="submit" className="w-full !mt-6" size="lg">
                        <LogIn className="mr-2 h-5 w-5" /> Entrar
                    </Button>
                </form>
                <div className="text-center text-sm text-muted-foreground">
                    Ainda não tem uma conta?{" "}
                    <Link href="/signup" className="font-semibold text-primary hover:underline">
                        Cadastre-se gratuitamente
                    </Link>
                </div>
            </div>
        </div>
        <div className="hidden lg:block relative">
            <Image
                src="https://picsum.photos/seed/social-impact/1200/1800"
                alt="Pessoas colaborando em um projeto social"
                width="1920"
                height="1080"
                className="h-full w-full object-cover"
                data-ai-hint="social impact community"
                priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
    </div>
  );
}
