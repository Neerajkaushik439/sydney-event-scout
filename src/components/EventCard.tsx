import { SydneyEvent } from '@/types/event';
import { StatusBadge } from './StatusBadge';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface EventCardProps {
  event: SydneyEvent;
  onGetTickets: (event: SydneyEvent) => void;
}

export function EventCard({ event, onGetTickets }: EventCardProps) {
  const formattedDate = format(parseISO(event.date), 'EEE, MMM d');

  return (
    <div className="group rounded-lg overflow-hidden bg-card shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={event.status} />
        </div>
        {event.category && (
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-body font-medium text-card-foreground">
            {event.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold text-card-foreground leading-tight mb-2 line-clamp-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{formattedDate} · {event.time}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{event.venue}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {event.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            {event.source}
          </span>
          <button
            onClick={() => onGetTickets(event)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-body font-semibold hover:opacity-90 transition-opacity"
          >
            GET TICKETS
          </button>
        </div>
      </div>
    </div>
  );
}
