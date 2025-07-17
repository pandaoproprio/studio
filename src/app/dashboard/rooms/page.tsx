
"use client";

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Video, Users, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const allRooms = [
  { id: 'sala-1', name: 'Sala de Reunião 1', capacity: 8, hasVideo: true },
  { id: 'sala-2', name: 'Sala de Foco 2', capacity: 4, hasVideo: false },
  { id: 'sala-3', name: 'Sala de Brainstorm 3', capacity: 12, hasVideo: true },
];

type BookingStatus = 'Aprovado' | 'Pendente' | 'Recusado';

interface Booking {
  id: string;
  roomId: string;
  date: Date;
  title: string;
  startTime: string;
  endTime: string;
  user: string;
  avatar: string;
  status: BookingStatus;
}


const initialBookings: Booking[] = [
  { id: 'b1', roomId: 'sala-1', date: new Date(), title: 'Reunião de Planejamento Semanal', startTime: '10:00', endTime: '11:00', user: 'Joana Silva', avatar: 'https://placehold.co/100x100.png', status: 'Aprovado' },
  { id: 'b2', roomId: 'sala-3', date: new Date(), title: 'Brainstorm Nova Campanha', startTime: '14:00', endTime: '15:30', user: 'Carlos Andrade', avatar: 'https://placehold.co/100x100.png', status: 'Pendente' },
  { id: 'b3', roomId: 'sala-1', date: new Date(), title: 'Alinhamento com Parceiros', startTime: '16:00', endTime: '17:00', user: 'Beatriz Costa', avatar: 'https://placehold.co/100x100.png', status: 'Aprovado' },
  { id: 'b4', roomId: 'sala-2', date: new Date(), title: 'Entrevista com Candidato', startTime: '11:00', endTime: '12:00', user: 'Mariana Ferreira', avatar: 'https://placehold.co/100x100.png', status: 'Recusado' },
];


export default function RoomsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedRoom, setSelectedRoom] = useState<string | 'all'>('all');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(booking => {
        if (!date) return false;
        const bookingDate = format(booking.date, 'yyyy-MM-dd');
        const selectedDate = format(date, 'yyyy-MM-dd');
        return bookingDate === selectedDate;
      })
      .filter(booking => selectedRoom === 'all' || booking.roomId === selectedRoom)
      .sort((a,b) => a.startTime.localeCompare(b.startTime));
  }, [bookings, date, selectedRoom]);
  
  const formattedDate = useMemo(() => {
    if (!date) return 'Selecione uma data';
    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  }, [date])

  const handleCreateBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      roomId: formData.get('room') as string,
      date: date || new Date(),
      title: formData.get('title') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      user: 'Joana Silva', // Logged-in user
      avatar: 'https://placehold.co/100x100.png',
      status: 'Pendente',
    };
    setBookings(prev => [...prev, newBooking]);
    setIsNewBookingOpen(false);
  }

  const handleBookingStatusChange = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  }

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Recusado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="font-headline">Agendamentos do Dia</CardTitle>
                    <CardDescription>{formattedDate}</CardDescription>
                  </div>
                   <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
                        <DialogTrigger asChild>
                           <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Nova Reserva
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Nova Reserva</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateBooking} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Título da Reunião</Label>
                                    <Input id="title" name="title" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="room">Sala</Label>
                                     <Select name="room" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma sala" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allRooms.map(room => (
                                                <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Início</Label>
                                        <Input id="startTime" name="startTime" type="time" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endTime">Fim</Label>
                                        <Input id="endTime" name="endTime" type="time" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsNewBookingOpen(false)}>Cancelar</Button>
                                    <Button type="submit">Agendar</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => {
                  const room = allRooms.find(r => r.id === booking.roomId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center w-20 text-primary">
                            <p className="font-bold text-lg">{booking.startTime}</p>
                            <p className="text-sm">às {booking.endTime}</p>
                        </div>
                         <div className="border-l pl-4">
                            <p className="font-semibold">{booking.title}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">{room?.name}</p>
                                <Badge variant="outline" className={getStatusBadgeClass(booking.status)}>{booking.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {room?.capacity}</span>
                                {room?.hasVideo && <span className="flex items-center gap-1"><Video className="h-4 w-4" /> Vídeo</span>}
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                         <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2" title={booking.user}>
                                <span className="text-sm font-medium hidden md:inline">{booking.user}</span>
                                <Avatar className="h-8 w-8">
                                <AvatarImage src={booking.avatar} alt={booking.user} data-ai-hint="person portrait"/>
                                <AvatarFallback>{booking.user.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                            </div>
                            {booking.status === 'Pendente' && (
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="outline" className="h-7 px-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleBookingStatusChange(booking.id, 'Recusado')}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 px-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" onClick={() => handleBookingStatusChange(booking.id, 'Aprovado')}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                         </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhuma reserva para {selectedRoom === 'all' ? 'esta data' : `a ${allRooms.find(r => r.id === selectedRoom)?.name}`}.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                locale={ptBR}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Filtrar por Sala</CardTitle>
            </CardHeader>
            <CardContent>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma sala" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as salas</SelectItem>
                        {allRooms.map(room => (
                            <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
