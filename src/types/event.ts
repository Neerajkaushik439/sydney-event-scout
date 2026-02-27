export type EventStatus = 'new' | 'updated' | 'inactive' | 'imported';

export interface SydneyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  city: string;
  description: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  source: string;
  originalUrl: string;
  lastScraped: string;
  status: EventStatus;
  importedAt?: string;
  importedBy?: string;
  importNotes?: string;
}

export interface TicketRequest {
  email: string;
  consent: boolean;
  eventId: string;
}
