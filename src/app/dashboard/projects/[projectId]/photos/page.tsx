// src/app/dashboard/projects/[projectId]/photos/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, Search, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface Photo {
  id: string;
  name: string;
  url: string;
  size: string;
  uploadDate: string;
}

const initialPhotos: Photo[] = [
  { id: 'photo-1', name: 'Voluntários em ação.jpg', url: 'https://picsum.photos/seed/picsum1/600/400', size: '2.1MB', uploadDate: '25/07/2024' },
  { id: 'photo-2', name: 'Entrega de cestas básicas.png', url: 'https://picsum.photos/seed/picsum2/600/400', size: '1.8MB', uploadDate: '25/07/2024' },
  { id: 'photo-3', name: 'Reunião de planejamento.jpeg', url: 'https://picsum.photos/seed/picsum3/600/400', size: '3.2MB', uploadDate: '24/07/2024' },
  { id: 'photo-4', name: 'Evento na comunidade.jpg', url: 'https://picsum.photos/seed/picsum4/600/400', size: '4.0MB', uploadDate: '22/07/2024' },
];

export default function ProjectPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePhotoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File;

    if (!file) return;
    
    // In a real app, you'd upload the file and get a URL.
    // Here, we'll use a placeholder.
    const newPhoto: Photo = {
      id: `photo-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file), // Creates a temporary local URL
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      uploadDate: format(new Date(), 'dd/MM/yyyy'),
    };

    setPhotos(prev => [newPhoto, ...prev]);
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline">Galeria de Fotos do Projeto</CardTitle>
            <CardDescription>Gerencie todas as mídias visuais relacionadas a este projeto.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar foto..." className="w-64 pl-9" />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Adicionar Fotos
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novas Fotos</DialogTitle>
                  <DialogDescription>
                    Faça o upload de novas imagens para a galeria do projeto.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePhotoAdd} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Arquivo(s) de Imagem</Label>
                    <Input id="file" name="file" type="file" accept="image/*" multiple required />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit">Adicionar à Galeria</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <Card key={photo.id} className="group relative overflow-hidden">
                <Image
                  src={photo.url}
                  alt={photo.name}
                  width={600}
                  height={400}
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <p className="font-semibold text-sm truncate">{photo.name}</p>
                  <p className="text-xs opacity-80">{photo.uploadDate} - {photo.size}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Nenhuma foto encontrada</h3>
            <p className="text-sm">Comece adicionando a primeira imagem a este projeto.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
