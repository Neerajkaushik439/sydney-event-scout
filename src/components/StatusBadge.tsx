import { Badge } from '@/components/ui/badge';
import { EventStatus } from '@/types/event';
import { cn } from '@/lib/utils';

const statusConfig: Record<EventStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-success text-success-foreground' },
  updated: { label: 'Updated', className: 'bg-warning text-warning-foreground' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground' },
  imported: { label: 'Imported', className: 'bg-info text-info-foreground' },
};

export function StatusBadge({ status }: { status: EventStatus }) {
  const config = statusConfig[status];
  return (
    <Badge className={cn('text-xs font-body font-medium border-0', config.className)}>
      {config.label}
    </Badge>
  );
}
