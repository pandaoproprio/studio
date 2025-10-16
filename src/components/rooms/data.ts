
import { addDays, addHours, startOfHour } from 'date-fns';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  hasVideo: boolean;
  color: string;
}

export type BookingStatus = 'Aprovado' | 'Pendente' | 'Recusado';

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  start: Date;
  end: Date;
  user: string;
  avatar: string;
  status: BookingStatus;
}

export const allRooms: Room[] = [
  { id: 'sala-1', name: 'Sala de Reunião 1', capacity: 8, hasVideo: true, color: '#8b5cf6' }, // primary
  { id: 'sala-2', name: 'Sala de Foco 2', capacity: 4, hasVideo: false, color: '#3b82f6' }, // blue
  { id: 'sala-3', name: 'Sala de Brainstorm 3', capacity: 12, hasVideo: true, color: '#10b981' }, // green
];

const now = new Date();
const todayStartHour = startOfHour(now);

export const initialBookings: Booking[] = [
  {
    id: 'b1',
    roomId: 'sala-1',
    title: 'Reunião de Planejamento Semanal',
    start: addHours(todayStartHour, 2),
    end: addHours(todayStartHour, 3),
    user: 'Joana Silva',
    avatar: 'https://placehold.co/100x100.png',
    status: 'Aprovado'
  },
  {
    id: 'b2',
    roomId: 'sala-3',
    title: 'Brainstorm Nova Campanha',
    start: addHours(todayStartHour, 5),
    end: addHours(todayStartHour, 6.5),
    user: 'Carlos Andrade',
    avatar: 'https://placehold.co/100x100.png',
    status: 'Pendente'
  },
  {
    id: 'b3',
    roomId: 'sala-1',
    title: 'Alinhamento com Parceiros',
    start: addHours(todayStartHour, 7),
    end: addHours(todayStartHour, 8),
    user: 'Beatriz Costa',
    avatar: 'https://placehold.co/100x100.png',
    status: 'Aprovado'
  },
   {
    id: 'b5',
    roomId: 'sala-2',
    title: 'Sessão de Foco: Relatório Anual',
    start: addHours(addDays(todayStartHour, 1), 1),
    end: addHours(addDays(todayStartHour, 1), 4),
    user: 'Ricardo Souza',
    avatar: 'https://placehold.co/100x100.png',
    status: 'Aprovado'
  },
   {
    id: 'b6',
    roomId: 'sala-3',
    title: 'Workshop de Design Thinking',
    start: addHours(addDays(todayStartHour, 2), 0),
    end: addHours(addDays(todayStartHour, 2), 8),
    user: 'Fernanda Lima',
    avatar: 'https://placehold.co/100x100.png',
    status: 'Pendente'
  }
];
