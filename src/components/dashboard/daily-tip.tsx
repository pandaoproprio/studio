// src/components/dashboard/daily-tip.tsx
"use client";

import { useEffect, useState } from "react";
import { Lightbulb, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDailyTipAction } from "@/lib/actions";

export function DailyTip() {
  const [tip, setTip] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const result = await getDailyTipAction();
        if (result.data) {
          setTip(result.data);
        } else {
          setError(result.error || "A IA não conseguiu gerar uma dica no momento.");
        }
      } catch (e) {
        setError("Ocorreu um erro ao buscar a dica do dia.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTip();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          Dica do Dia
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <blockquote className="border-l-2 pl-6 italic text-muted-foreground">
            {tip}
          </blockquote>
        )}
      </CardContent>
    </Card>
  );
}
