
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from 'date-fns/locale';
import { type Booking, type Room } from "./data";

interface NewBookingDialogProps {
    rooms: Room[];
    bookings: Booking[];
    onBookingCreate: (booking: Omit<Booking, 'id' | 'user' | 'avatar' | 'status'>) => void;
    trigger: React.ReactNode;
}

export function NewBookingDialog({ rooms, bookings, onBookingCreate, trigger }: NewBookingDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [roomId, setRoomId] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleCreateBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !startTime || !endTime || !roomId) return;

        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const startDate = new Date(date);
        startDate.setHours(startHours, startMinutes);

        const endDate = new Date(date);
        endDate.setHours(endHours, endMinutes);

        onBookingCreate({
            title,
            roomId,
            start: startDate,
            end: endDate,
        });

        setIsOpen(false);
        // Reset form
        setTitle("");
        setRoomId("");
        setDate(new Date());
        setStartTime("");
        setEndTime("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Nova Reserva</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateBooking} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título da Reunião</Label>
                        <Input id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="room">Sala</Label>
                        <Select name="room" required value={roomId} onValueChange={setRoomId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma sala" />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.map(room => (
                                    <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Data</Label>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            locale={ptBR}
                            className="rounded-md border"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Início</Label>
                            <Input id="startTime" name="startTime" type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">Fim</Label>
                            <Input id="endTime" name="endTime" type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                        <Button type="submit">Agendar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
