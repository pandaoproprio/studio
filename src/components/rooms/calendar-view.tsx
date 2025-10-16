// src/components/rooms/calendar-view.tsx
"use client";

import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { type Booking, type Room } from "./data";
import { ptBR } from 'date-fns/locale';
import { useMemo } from "react";
import { format } from "date-fns";

interface CalendarViewProps {
    selectedDate: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    bookings: Booking[];
    rooms: Room[];
}

// Componente para renderizar o conteúdo de cada dia
function DayContent(props: { date: Date; bookings: Booking[]; rooms: Room[] }) {
    const dayBookings = props.bookings.filter(
        (booking) => format(booking.start, 'yyyy-MM-dd') === format(props.date, 'yyyy-MM-dd')
    );
    const uniqueRoomColors = [...new Set(dayBookings.map(b => props.rooms.find(r => r.id === b.roomId)?.color).filter(Boolean))];

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full">
            <span>{props.date.getDate()}</span>
            {uniqueRoomColors.length > 0 && (
                <div className="absolute bottom-1 flex space-x-1">
                    {uniqueRoomColors.map((color, index) => (
                        <div key={index} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function CalendarView({ selectedDate, onDateChange, bookings, rooms }: CalendarViewProps) {
    const renderDay: CalendarProps['components'] = {
        DayContent: ({ date }) => <DayContent date={date as Date} bookings={bookings} rooms={rooms} />
    };

    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            locale={ptBR}
            className="rounded-md border w-full h-auto"
            classNames={{
                day: 'h-14 w-14 text-lg rounded-md p-0', // Aumenta o tamanho e remove o padding
                head_cell: 'w-14',
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
            }}
            components={renderDay}
        />
    );
}
