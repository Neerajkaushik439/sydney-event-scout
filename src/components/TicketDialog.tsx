import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { SydneyEvent } from '@/types/event';
import { useToast } from '@/hooks/use-toast';

interface TicketDialogProps {
  event: SydneyEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TicketDialog({ event, open, onOpenChange }: TicketDialogProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;

    setLoading(true);
    // Simulate saving — replace with real DB call when Cloud is connected
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);

    toast({
      title: 'Redirecting you!',
      description: `Your email has been saved. Opening ${event.source}...`,
    });

    setEmail('');
    setConsent(false);
    onOpenChange(false);

    setTimeout(() => {
      window.open(event.originalUrl, '_blank');
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Get Tickets</DialogTitle>
          <DialogDescription className="font-body">
            Enter your email to continue to <span className="font-semibold text-foreground">{event.title}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="font-body"
          />
          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(c) => setConsent(c === true)}
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground font-body leading-snug cursor-pointer">
              I agree to receive event updates and promotional emails. You can unsubscribe at any time.
            </label>
          </div>
          <Button type="submit" className="w-full font-body font-semibold" disabled={!consent || loading}>
            {loading ? 'Saving...' : 'Continue to Tickets →'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
