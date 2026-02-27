import { useState, useMemo } from 'react';
import { mockEvents } from '@/data/mockEvents';
import { SydneyEvent } from '@/types/event';
import { StatusBadge } from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Calendar, MapPin, ExternalLink, Import, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const [events, setEvents] = useState<SydneyEvent[]>(mockEvents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selected, setSelected] = useState<SydneyEvent | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchDateFrom = !dateFrom || e.date >= dateFrom;
      const matchDateTo = !dateTo || e.date <= dateTo;
      return matchSearch && matchStatus && matchDateFrom && matchDateTo;
    });
  }, [events, search, statusFilter, dateFrom, dateTo]);

  const handleImport = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'imported' as const,
              importedAt: new Date().toISOString(),
              importedBy: 'admin@example.com',
              importNotes: 'Imported via dashboard',
            }
          : e
      )
    );
    if (selected?.id === eventId) {
      setSelected((prev) =>
        prev
          ? { ...prev, status: 'imported', importedAt: new Date().toISOString(), importedBy: 'admin@example.com', importNotes: 'Imported via dashboard' }
          : null
      );
    }
    toast({ title: 'Event imported', description: 'The event has been imported to the platform.' });
  };

  const statuses = ['all', 'new', 'updated', 'inactive', 'imported'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">S</span>
            </div>
            <span className="font-display font-bold text-lg text-foreground">Admin Dashboard</span>
          </div>
          <div className="text-sm text-muted-foreground font-body">
            Sydney, Australia · {events.length} events
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-border bg-card/40 px-6 py-4">
        <div className="container max-w-full mx-auto flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 font-body text-sm"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors capitalize ${
                  statusFilter === s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-body">
            <label className="text-muted-foreground">From</label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36 text-sm font-body" />
            <label className="text-muted-foreground">To</label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36 text-sm font-body" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm font-body">
            <thead className="sticky top-0 bg-secondary/80 backdrop-blur-sm">
              <tr className="text-left text-muted-foreground">
                <th className="px-6 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Venue</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => setSelected(event)}
                  className={`border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                    selected?.id === event.id ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-foreground truncate max-w-[250px]">{event.title}</div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                    {format(parseISO(event.date), 'MMM d')} · {event.time}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground truncate max-w-[150px]">{event.venue}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{event.source}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={event.status} /></td>
                  <td className="px-4 py-3.5">
                    {event.status !== 'imported' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleImport(event.id); }}
                        className="text-xs font-body gap-1"
                      >
                        <Import className="w-3 h-3" />
                        Import
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-body">No events match your filters.</div>
          )}
        </div>

        {/* Preview Panel */}
        {selected && (
          <div className="w-[400px] border-l border-border bg-card overflow-auto shrink-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <StatusBadge status={selected.status} />
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selected.imageUrl && (
                <img src={selected.imageUrl} alt={selected.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}

              <h2 className="font-display text-xl font-bold text-card-foreground mb-3">{selected.title}</h2>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {format(parseISO(selected.date), 'EEEE, MMMM d, yyyy')} at {selected.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <div>
                    <div>{selected.venue}</div>
                    {selected.address && <div className="text-xs">{selected.address}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  {selected.source}
                </div>
              </div>

              <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{selected.description}</p>

              {selected.tags && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-body">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {selected.status === 'imported' && (
                <div className="bg-info/10 border border-info/20 rounded-lg p-3 mb-4">
                  <p className="text-xs font-body text-info font-medium mb-1">Imported</p>
                  <p className="text-xs text-muted-foreground font-body">
                    By {selected.importedBy} · {selected.importedAt && format(parseISO(selected.importedAt), 'MMM d, yyyy HH:mm')}
                  </p>
                  {selected.importNotes && <p className="text-xs text-muted-foreground font-body mt-1">{selected.importNotes}</p>}
                </div>
              )}

              <div className="text-xs text-muted-foreground font-body">
                Last scraped: {format(parseISO(selected.lastScraped), 'MMM d, yyyy HH:mm')}
              </div>

              <div className="mt-4 flex gap-2">
                <a href={selected.originalUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full font-body text-sm gap-1">
                    <ExternalLink className="w-3.5 h-3.5" /> View Source
                  </Button>
                </a>
                {selected.status !== 'imported' && (
                  <Button onClick={() => handleImport(selected.id)} className="flex-1 font-body text-sm gap-1">
                    <Import className="w-3.5 h-3.5" /> Import
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
