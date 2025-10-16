// src/app/dashboard/rooms/page.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { allRooms, initialBookings, type Booking } from '@/components/rooms/data';
import { CalendarView } from '@/components/rooms/calendar-view';
import { BookingList } from '@/components/rooms/booking-list';
import { NewBookingDialog } from '@/components/rooms/new-booking-dialog';

export default function RoomsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  // Memoize filtered bookings for performance
  const dailyBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (!date) return false;
      const bookingDate = new Date(booking.start);
      return bookingDate.toDateString() === date.toDateString();
    }).sort((a,b) => a.start.getTime() - b.start.getTime());
  }, [bookings, date]);

  const handleCreateBooking = (newBookingData: Omit<Booking, 'id' | 'user' | 'avatar' | 'status'>) => {
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      ...newBookingData,
      user: 'Joana Silva', // Logged-in user
      avatar: 'https://placehold.co/100x100.png',
      status: 'Aprovado', // Auto-approved for simplicity
    };
    setBookings(prev => [...prev, newBooking]);
    setDate(newBooking.start); // Switch calendar to the new booking's date
  }

  const handleBookingStatusChange = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  }
  
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Reserva de Salas</h1>
                <p className="text-muted-foreground">
                Agende e gerencie o uso das salas de reunião da sua organização.
                </p>
            </div>
             <NewBookingDialog
                rooms={allRooms}
                bookings={bookings}
                onBookingCreate={handleCreateBooking}
                trigger={
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Reserva
                    </Button>
                }
             />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <CalendarView 
                selectedDate={date} 
                onDateChange={setDate} 
                bookings={bookings} 
                rooms={allRooms}
            />
        </div>
        <div className="lg:col-span-1">
            <BookingList 
                selectedDate={date} 
                bookings={dailyBookings} 
                rooms={allRooms}
                onStatusChange={handleBookingStatusChange}
            />
        </div>
      </div>
    </div>
  );
}
