// src/app/dashboard/feed/page.tsx
"use client";
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { summarizePostAction } from '@/lib/actions';
import { Bot, Clapperboard, Loader2, MessageCircle, Send, ThumbsUp, Trash2 } from 'lucide-react';

const initialPosts = [
  {
    id: 1,
    author: "Joana Silva",
    avatar: "https://placehold.co/100x100.png",
    time: "5 min atrás",
    content: "Lançamos nosso novo programa de mentoria para jovens da comunidade! 🎉 Estamos muito animados para conectar profissionais experientes com jovens talentos. Quem quiser ser um mentor, entre em contato!",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    author: "Carlos Andrade",
    avatar: "https://placehold.co/100x100.png",
    time: "2 horas atrás",
    content: "Pessoal, só um lembrete de que a nossa campanha de arrecadação de agasalhos termina nesta sexta-feira. Já conseguimos 250 peças, nossa meta é 400! Vamos lá!",
    likes: 25,
    comments: 8,
  },
];

export default function FeedPage() {
    const [posts, setPosts] = useState(initialPosts);
    const [newPostContent, setNewPostContent] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        const newPost = {
            id: Date.now(),
            author: "Joana Silva", // Logged-in user
            avatar: "https://placehold.co/100x100.png",
            time: "agora mesmo",
            content: newPostContent,
            likes: 0,
            comments: 0,
        };

        setPosts([newPost, ...posts]);
        setNewPostContent("");
    };

    const handleSummarize = async () => {
        if (!newPostContent.trim()) return;
        setIsSummarizing(true);
        try {
            const result = await summarizePostAction(newPostContent);
            if (result.data) {
                setNewPostContent(result.data.summary);
            }
        } finally {
            setIsSummarizing(false);
        }
    };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Feed de Notícias</h1>
        <p className="text-muted-foreground">
          Acompanhe as últimas novidades e comunicados da sua organização.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Criar nova publicação</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePostSubmit} className="space-y-4">
                        <Textarea
                            placeholder="O que você está pensando?"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            rows={4}
                            className="text-base"
                        />
                         <div className="flex justify-between items-center">
                            <Button type="button" variant="outline" onClick={handleSummarize} disabled={isSummarizing || !newPostContent}>
                                {isSummarizing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resumindo...
                                    </>
                                ) : (
                                    <>
                                        <Bot className="mr-2 h-4 w-4" />
                                        Resumir com IA
                                    </>
                                )}
                            </Button>
                            <Button type="submit" disabled={!newPostContent}>
                                <Send className="mr-2 h-4 w-4" />
                                Publicar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                {posts.map(post => (
                    <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                           <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={post.avatar} alt={post.author} data-ai-hint="person portrait"/>
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{post.author}</p>
                                        <p className="text-sm text-muted-foreground">{post.time}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                           </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="whitespace-pre-wrap">{post.content}</p>
                        </CardContent>
                        <CardFooter className="bg-muted/50 px-4 py-2 flex items-center justify-between text-sm">
                             <div className="flex gap-4">
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span>{post.likes} Curtidas</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{post.comments} Comentários</span>
                                </Button>
                             </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>

        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center p-2 rounded-md bg-primary text-primary-foreground">
                        <span className="text-sm font-bold">JUL</span>
                        <span className="text-xl font-bold">28</span>
                    </div>
                    <div>
                        <p className="font-semibold">Festa Julina Beneficente</p>
                        <p className="text-sm text-muted-foreground">Quadra da comunidade | 18:00</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center p-2 rounded-md bg-primary text-primary-foreground">
                        <span className="text-sm font-bold">AGO</span>
                        <span className="text-xl font-bold">15</span>
                    </div>
                    <div>
                        <p className="font-semibold">Workshop de Artesanato</p>
                        <p className="text-sm text-muted-foreground">Sede da ONG | 14:00</p>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
