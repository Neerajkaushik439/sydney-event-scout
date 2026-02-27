import { useState, useMemo } from 'react';
import { mockEvents } from '@/data/mockEvents';
import { EventCard } from '@/components/EventCard';
import { TicketDialog } from '@/components/TicketDialog';
import { SydneyEvent } from '@/types/event';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ['All', ...Array.from(new Set(mockEvents.map((e) => e.category).filter(Boolean))) as string[]];

const Index = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [ticketEvent, setTicketEvent] = useState<SydneyEvent | null>(null);

  const filtered = useMemo(() => {
    return mockEvents.filter((e) => {
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || e.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">Sydney Events</span>
          </div>
          <Link
            to="/dashboard"
            className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin Dashboard →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 font-body">
          <MapPin className="w-4 h-4 text-primary" />
          Sydney, Australia
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-3">
          Discover What's On
        </h1>
        <p className="text-lg text-muted-foreground font-body max-w-xl mb-8">
          Curated events happening across Sydney — automatically updated from top event platforms.
        </p>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events, venues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 font-body"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-body">
          {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
        </p>
      </section>

      {/* Events Grid */}
      <section className="container max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((event, i) => (
            <div key={event.id} style={{ animationDelay: `${i * 60}ms` }}>
              <EventCard event={event} onGetTickets={setTicketEvent} />
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg">No events match your search.</p>
          </div>
        )}
      </section>

      <TicketDialog
        event={ticketEvent}
        open={!!ticketEvent}
        onOpenChange={(open) => !open && setTicketEvent(null)}
      />
    </div>
  );
};

export default Index;
