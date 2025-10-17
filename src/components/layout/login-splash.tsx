// src/components/layout/login-splash.tsx
import Image from "next/image";
import { Leaf } from "lucide-react";

export function LoginSplash() {
    return (
        <div className="relative hidden bg-muted lg:block">
            <Image
            src="https://picsum.photos/seed/login/1200/800"
            alt="Imagem de fundo da tela de login"
            width={1200}
            height={800}
            className="h-full w-full object-cover dark:brightness-[0.3]"
            data-ai-hint="office background"
            priority
            />
            <div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
                <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-8 w-8" />
                    <h1 className="text-3xl font-bold font-headline">AnnIConecta</h1>
                </div>
                <p className="text-lg">
                    A plataforma completa para a transformação digital da sua organização social.
                </p>
            </div>
      </div>
    )
}
