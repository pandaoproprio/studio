// src/components/rooms/calendar-view.tsx
"use client";

import { DayPicker } from "react-day-picker";
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
        const bookedDays: Record<string, {
            style: React.CSSProperties
        }> = {};
        
        for(const day in bookingsByDay) {
            const uniqueRoomColors = [...new Set(bookingsByDay[day].map(b => rooms.find(r => r.id === b.roomId)?.color).filter(Boolean))];
            
            bookedDays[day] = {
                style: {
                    background: `linear-gradient(to right, ${uniqueRoomColors.join(',')})`,
                    backgroundClip: 'padding-box',
                    borderBottom: '4px solid',
                    borderColor: 'transparent',
                    borderImageSlice: 1,
                    borderImageSource: `linear-gradient(to right, ${uniqueRoomColors.join(',')})`,
                }
            }
        }

        return bookedDays
    }, [bookingsByDay, rooms]);


    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            locale={ptBR}
            className="rounded-md border w-full h-auto"
            modifiers={modifiers}
            classNames={{
                day: 'h-14 w-14 text-lg',
                head_cell: 'w-14'
            }}
        />
    );
}
