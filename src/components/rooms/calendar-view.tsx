
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type Booking, type Room } from "./data";
import { ptBR } from 'date-fns/locale';

interface CalendarViewProps {
    selectedDate: Date | undefined;
    onDateChange: (date: Date | undefined) => void;
    bookings: Booking[];
    rooms: Room[];
}

export function CalendarView({ selectedDate, onDateChange, bookings, rooms }: CalendarViewProps) {
    const bookingsByDay = bookings.reduce((acc, booking) => {
        const day = booking.start.toDateString();
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    return (
        <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            locale={ptBR}
            className="rounded-md border"
            components={{
                DayContent: ({ date, ...props }) => {
                    const dayString = date.toDateString();
                    const dayBookings = bookingsByDay[dayString];

                    return (
                        <div className="relative h-full w-full">
                            <span {...props.children[0].props} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                {date.getDate()}
                            </span>
                             {dayBookings && dayBookings.length > 0 && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 cursor-pointer">
                                            {dayBookings.slice(0, 3).map((booking, i) => {
                                                const room = rooms.find(r => r.id === booking.roomId);
                                                return <div key={i} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: room?.color || '#ccc' }} />;
                                            })}
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-60 text-sm">
                                        <h4 className="font-semibold mb-2">Reservas do dia:</h4>
                                        <ul className="space-y-1">
                                            {dayBookings.map(b => (
                                                 <li key={b.id} className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: rooms.find(r => r.id === b.roomId)?.color }}></div>
                                                    <span>{b.title}</span>
                                                 </li>
                                            ))}
                                        </ul>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    );
                },
            }}
        />
    );
}
