import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoomById } from "@/lib/hotels.functions";
import { createBooking } from "@/lib/bookings.functions";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice, nightsBetween } from "@/lib/format";
import { toast } from "sonner";
import { CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const search = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.coerce.number().int().min(1).max(10),
});

export const Route = createFileRoute("/_authenticated/checkout")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Checkout — Hush & Stay" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { roomId, checkIn, checkOut, guests } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const nights = nightsBetween(checkIn, checkOut);

  const fetchRoom = useServerFn(getRoomById);
  const { data: room } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => fetchRoom({ data: { roomId } }),
  });

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState(user?.email ?? "");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [success, setSuccess] = useState<{ id: string; ref: string } | null>(null);

  useEffect(() => { if (user?.email) setGuestEmail(user.email); }, [user]);

  const book = useServerFn(createBooking);
  const m = useMutation({
    mutationFn: book,
    onSuccess: (res) => {
      toast.success("Booking confirmed! Confirmation sent to " + guestEmail);
      setSuccess({ id: res.booking.id, ref: res.paymentRef });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!room) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;

  const total = room.price_cents * nights;

  if (success) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-10 text-center shadow-[var(--shadow-soft)]">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-semibold">You're booked.</h1>
          <p className="mt-2 text-muted-foreground">A confirmation email has been sent to <strong>{guestEmail}</strong>.</p>
          <div className="mt-6 rounded-xl bg-secondary/50 p-4 text-left text-sm">
            <p><span className="text-muted-foreground">Booking ID:</span> {success.id}</p>
            <p><span className="text-muted-foreground">Payment ref:</span> {success.ref}</p>
            <p><span className="text-muted-foreground">Total paid:</span> {formatPrice(total)}</p>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate({ to: "/bookings" })}>View my bookings</Button>
            <Button variant="ghost" onClick={() => navigate({ to: "/" })}>Back home</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!card || !exp || !cvc) { toast.error("Please complete card details."); return; }
    m.mutate({ data: { roomId, checkIn, checkOut, guests, guestName, guestEmail } });
  };

  return (
    <div className="container mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px]">
      <form onSubmit={submit} className="space-y-8">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-display text-2xl font-semibold">Guest details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="gn">Full name</Label>
              <Input id="gn" required value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ge">Email for confirmation</Label>
              <Input id="ge" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
            <CreditCard className="h-5 w-5" /> Payment
          </h2>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" /> Test mode — use any details. No real charges.
          </p>
          <div className="mt-4 grid gap-4">
            <div>
              <Label htmlFor="card">Card number</Label>
              <Input id="card" placeholder="4242 4242 4242 4242" value={card} onChange={(e) => setCard(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exp">Expiry</Label>
                <Input id="exp" placeholder="12/29" value={exp} onChange={(e) => setExp(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        <Button type="submit" size="lg" className="w-full" disabled={m.isPending}>
          {m.isPending ? "Processing…" : `Pay ${formatPrice(total)} and confirm`}
        </Button>
      </form>

      <aside className="self-start rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
        <img src={room.images?.[0] ?? (room as any).hotels?.hero_image} alt="" className="h-32 w-full rounded-xl object-cover" />
        <h3 className="mt-4 font-display text-xl font-semibold">{(room as any).hotels?.name}</h3>
        <p className="text-sm text-muted-foreground">{(room as any).hotels?.city}, {(room as any).hotels?.country}</p>
        <p className="mt-2 text-sm">{room.name}</p>
        <div className="mt-4 space-y-1 border-t pt-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Check-in</span><span>{checkIn}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Check-out</span><span>{checkOut}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{guests}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{nights} × {formatPrice(room.price_cents)}</span><span>{formatPrice(total)}</span></div>
        </div>
        <div className="mt-4 flex justify-between border-t pt-4 font-display text-lg font-semibold">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </aside>
    </div>
  );
}
