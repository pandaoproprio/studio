
"use client";

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Video, Users } from 'lucide-react';

const rooms = [
  { id: 'sala-1', name: 'Sala de Reunião 1', capacity: 8, hasVideo: true },
  { id: 'sala-2', name: 'Sala de Foco 2', capacity: 4, hasVideo: false },
  { id: 'sala-3', name: 'Sala de Brainstorm 3', capacity: 12, hasVideo: true },
];

const bookings = [
  { id: 'b1', room: 'Sala de Reunião 1', title: 'Reunião de Planejamento Semanal', time: '10:00 - 11:00', user: 'Joana Silva', avatar: 'https://placehold.co/100x100.png' },
  { id: 'b2', room: 'Sala de Brainstorm 3', title: 'Brainstorm Nova Campanha', time: '14:00 - 15:30', user: 'Carlos Andrade', avatar: 'https://placehold.co/100x100.png' },
];

export default function RoomsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setDate(new Date());
  }, []);

  const getLocaleDateString = async () => {
    if (!date) return 'Selecione uma data';
    const ptBRLocale = (await import('date-fns/locale/pt-BR')).default;
    return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', locale: ptBRLocale });
  };
  
  const [localeDate, setLocaleDate] = useState('Carregando data...');

  useEffect(() => {
    async function loadCalendar() {
        const locale = (await import('date-fns/locale/pt-BR')).default;
        setLocaleDate(new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', locale: locale }));
    }
    loadCalendar();
  }, []);

  useEffect(() => {
    async function updateDate() {
        if (date) {
            const locale = (await import('date-fns/locale/pt-BR')).default;
            setLocaleDate(date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', locale: locale }));
        }
    }
    updateDate();
  }, [date]);
  
  const [calendarLocale, setCalendarLocale] = useState(undefined);
  
  useEffect(() => {
      async function loadLocale() {
          const locale = (await import('date-fns/locale/pt-BR')).default;
          setCalendarLocale(locale as any);
      }
      loadLocale();
  }, [])


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Reserva de Salas</h1>
        <p className="text-muted-foreground">
          Agende e gerencie o uso das salas de reunião da sua organização.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline">Agendamentos do Dia</CardTitle>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Reserva
                </Button>
              </div>
              <CardDescription>
                {localeDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center w-20">
                          <p className="font-bold text-lg">{booking.time.split(' - ')[0]}</p>
                          <p className="text-sm text-muted-foreground">às {booking.time.split(' - ')[1]}</p>
                      </div>
                       <div className="border-l pl-4">
                          <p className="font-semibold">{booking.title}</p>
                          <p className="text-sm text-muted-foreground">{booking.room}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-2" title={booking.user}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={booking.avatar} alt={booking.user} data-ai-hint="person portrait"/>
                        <AvatarFallback>{booking.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden md:inline">{booking.user}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhuma reserva para hoje.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                locale={calendarLocale}
                disabled={!calendarLocale}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Salas Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rooms.map(room => (
                <div key={room.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{room.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                       <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {room.capacity}</span>
                       {room.hasVideo && <span className="flex items-center gap-1"><Video className="h-4 w-4" /> Vídeo</span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Ver</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
