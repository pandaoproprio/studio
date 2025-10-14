// src/app/dashboard/video-generator/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { generateVideoStoryAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Film, AlertCircle, Upload, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GenerateVideoStoryOutput } from "@/ai/schemas/generate-video-story-schemas";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { Input } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando Vídeo... Isso pode levar um minuto.
        </>
      ) : (
        <>
          <Film className="mr-2 h-4 w-4" />
          Gerar História em Vídeo com IA
        </>
      )}
    </Button>
  );
}

export default function VideoGeneratorPage() {
  const [result, setResult] = useState<{data?: GenerateVideoStoryOutput; error?: string} | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [initialImage, setInitialImage] = useState<{file: File, preview: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setInitialImage({ file, preview });
    }
  }

  const handleRemoveImage = () => {
    if (initialImage) {
      URL.revokeObjectURL(initialImage.preview);
    }
    setInitialImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleFormAction = async (formData: FormData) => {
    setResult(null);
    const text = formData.get("storyText") as string;
    if (!text || text.trim().length < 20) {
        setResult({error: "O texto precisa ter pelo menos 20 caracteres."});
        return;
    }
    
    let initialImageDataUri: string | undefined = undefined;
    if (initialImage) {
        const reader = new FileReader();
        initialImageDataUri = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(initialImage.file);
        });
    }

    const response = await generateVideoStoryAction({storyText: text, initialImageDataUri});
    setResult(response);
  };
  
  useEffect(() => {
    if (!carouselApi || !result?.data) {
      return;
    }

    const handleSelect = () => {
        const currentSlide = carouselApi.selectedScrollSnap();
        const scene = result.data?.scenes[currentSlide];
        if (scene && audioRef.current) {
            audioRef.current.src = scene.audioUri;
            audioRef.current.play().catch(e => console.error("Audio play failed", e));
        }
    }
    
    handleSelect(); // Play audio for the initial slide
    carouselApi.on("select", handleSelect);
    
    return () => {
      carouselApi.off("select", handleSelect);
    };

  }, [carouselApi, result?.data]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Gerador de Histórias em Vídeo com IA
        </h1>
        <p className="text-muted-foreground">
          Transforme um texto em uma narrativa audiovisual com imagens e narração geradas por IA.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Fonte da História</CardTitle>
            <CardDescription>
              Insira o texto base e, opcionalmente, uma imagem inicial para a IA criar o roteiro, as imagens e a narração.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleFormAction} className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="initialImage">Imagem de Referência (Opcional)</Label>
                {initialImage ? (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden group">
                        <Image src={initialImage.preview} alt="Prévia da imagem inicial" fill className="object-cover"/>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRemoveImage}
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ) : (
                    <Input id="initialImage" name="initialImage" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="storyText">Texto de Entrada</Label>
                <Textarea
                  id="storyText"
                  name="storyText"
                  placeholder="Ex: Cole aqui um relatório de impacto, um comunicado ou a descrição de um projeto..."
                  rows={8}
                  required
                />
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Resultado Gerado</CardTitle>
            <CardDescription>A história em vídeo gerada pela IA aparecerá aqui.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            {result?.data ? (
                <div className="w-full space-y-4">
                     <h3 className="text-center text-lg font-semibold">{result.data.title}</h3>
                     <Carousel className="w-full" setApi={setCarouselApi}>
                        <CarouselContent>
                            {result.data.scenes.map((scene, index) => (
                                <CarouselItem key={index}>
                                    <div className="aspect-video relative w-full overflow-hidden rounded-lg">
                                        <Image src={scene.imageUrl} alt={`Cena ${index + 1}`} fill className="object-cover" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs">
                                            <p>{scene.text}</p>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2"/>
                    </Carousel>
                    <audio ref={audioRef} className="w-full hidden" controls>
                        Seu navegador não suporta o elemento de áudio.
                    </audio>
                </div>
            ) : result?.error ? (
                 <Alert variant="destructive" className="w-full">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro na Geração</AlertTitle>
                    <AlertDescription>{result.error}</AlertDescription>
                </Alert>
            ) : (
                <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                    <div className="space-y-2">
                        <Wand2 className="h-12 w-12 mx-auto" />
                        <p>Aguardando geração do vídeo...</p>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
