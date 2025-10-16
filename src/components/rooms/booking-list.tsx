
"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Users, Video } from "lucide-react";
import { type Booking, type Room } from "./data";
import { Separator } from "@/components/ui/separator";

interface BookingListProps {
    selectedDate: Date | undefined;
    bookings: Booking[];
    rooms: Room[];
    onStatusChange: (bookingId: string, status: Booking['status']) => void;
}

const getStatusBadgeClass = (status: Booking['status']) => {
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

export function BookingList({ selectedDate, bookings, rooms, onStatusChange }: BookingListProps) {
    const formattedDate = selectedDate ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR }) : "Nenhuma data selecionada";

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Reservas do Dia</CardTitle>
                <CardDescription>{formattedDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {bookings.length > 0 ? (
                    <div className="space-y-4">
                        {bookings.map((booking, index) => {
                            const room = rooms.find(r => r.id === booking.roomId);
                            if (!room) return null;
                            
                            return (
                                <div key={booking.id}>
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center gap-1 pt-1">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: room.color }} />
                                            <div className="h-full w-px bg-border" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">{booking.title}</p>
                                                    <p className="text-sm text-muted-foreground">{room.name} • {format(booking.start, 'HH:mm')} - {format(booking.end, 'HH:mm')}</p>
                                                </div>
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => onStatusChange(booking.id, 'Aprovado')}>Aprovar</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => onStatusChange(booking.id, 'Recusado')}>Recusar</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">Cancelar Reserva</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {room?.capacity}</span>
                                                {room?.hasVideo && <span className="flex items-center gap-1.5"><Video className="h-4 w-4" /> Vídeo</span>}
                                            </div>
                                             <div className="flex items-center gap-2 pt-2">
                                                 <Avatar className="h-6 w-6">
                                                    <AvatarImage src={booking.avatar} alt={booking.user} data-ai-hint="person portrait"/>
                                                    <AvatarFallback>{booking.user.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-xs text-muted-foreground">Reservado por {booking.user}</span>
                                                <Badge variant="outline" className={`ml-auto text-xs ${getStatusBadgeClass(booking.status)}`}>{booking.status}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    {index < bookings.length - 1 && <Separator className="my-4" />}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Nenhuma reserva para esta data.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
