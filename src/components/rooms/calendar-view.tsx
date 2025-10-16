// src/components/rooms/calendar-view.tsx
"use client";

import { Calendar } from "@/components/ui/calendar";
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

    const modifiers = useMemo(() => {
        const bookedDays: Record<string, Date> = {};
        for(const day in bookingsByDay) {
            bookedDays[day] = new Date(day);
        }
        return {
            booked: Object.values(bookedDays),
        };
    }, [bookingsByDay]);

    const modifierStyles = useMemo(() => {
         const styles: Record<string, React.CSSProperties> = {};
        for (const day in bookingsByDay) {
            const uniqueRoomColors = [...new Set(bookingsByDay[day].map(b => rooms.find(r => r.id === b.roomId)?.color).filter(Boolean))];
            if (uniqueRoomColors.length > 0) {
                 styles[day] = {
                    borderBottom: `4px solid ${uniqueRoomColors[0]}`,
                 };
                 if (uniqueRoomColors.length > 1) {
                     styles[day].borderImage = `linear-gradient(to right, ${uniqueRoomColors.join(',')}) 1`;
                 }
            }
        }
        return {
            booked: styles
        };
    }, [bookingsByDay, rooms]);


    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            locale={ptBR}
            className="rounded-md border w-full h-auto"
            modifiers={modifiers}
            modifierStyles={modifierStyles}
            classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
                day: 'h-14 w-14 text-lg rounded-md',
                head_cell: 'w-14'
            }}
        />
    );
}
