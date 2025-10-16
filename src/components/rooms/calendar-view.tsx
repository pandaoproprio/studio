
"use client";

import { DayContentProps } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type Booking, type Room } from "./data";
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { format } from "date-fns";

interface CalendarViewProps {
    selectedDate: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    bookings: Booking[];
    rooms: Room[];
}

export function CalendarView({ selectedDate, onDateChange, bookings, rooms }: CalendarViewProps) {
    const bookingsByDay = useMemo(() => {
        return bookings.reduce((acc, booking) => {
            const day = format(booking.start, 'yyyy-MM-dd');
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(booking);
            return acc;
        }, {} as Record<string, Booking[]>);
    }, [bookings]);

    const bookedDays = Object.keys(bookingsByDay).map(dayStr => new Date(dayStr));

    const modifiers = {
        booked: bookedDays,
    };

    const DayWithBookings = (props: DayContentProps) => {
        const dayKey = format(props.date, 'yyyy-MM-dd');
        const dayBookings = bookingsByDay[dayKey];

        const uniqueRoomColors = dayBookings 
            ? [...new Set(dayBookings.map(b => rooms.find(r => r.id === b.roomId)?.color).filter(Boolean))]
            : [];

        return (
            <div className="relative flex flex-col items-center justify-center h-full w-full">
                <span>{format(props.date, 'd')}</span>
                {dayBookings && (
                    <div className="absolute bottom-1.5 flex gap-0.5">
                        {uniqueRoomColors.slice(0, 4).map((color, i) => (
                            <div key={i} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            locale={ptBR}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersClassNames={{
                booked: 'booked-day',
            }}
             components={{
                DayContent: DayWithBookings,
            }}
        />
    );
}
