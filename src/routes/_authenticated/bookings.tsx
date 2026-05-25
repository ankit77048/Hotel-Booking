import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listMyBookings, cancelBooking } from "@/lib/bookings.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/bookings")({
  head: () => ({ meta: [{ title: "My bookings — Hush & Stay" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const fetchFn = useServerFn(listMyBookings);
  const cancelFn = useServerFn(cancelBooking);
  const qc = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: () => fetchFn(),
  });
  const m = useMutation({
    mutationFn: cancelFn,
    onSuccess: () => {
      toast.success("Booking cancelled. Refund processed and email sent.");
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold">My bookings</h1>
      <p className="mt-2 text-muted-foreground">Your reservation history.</p>

      {isLoading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : !bookings?.length ? (
        <div className="mt-12 rounded-2xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">No bookings yet.</p>
          <Button asChild className="mt-4"><Link to="/hotels">Browse hotels</Link></Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b: any) => (
            <div key={b.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] md:flex-row">
              <img src={b.hotels?.hero_image} alt="" className="h-32 w-full rounded-xl object-cover md:w-48" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{b.hotels?.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {b.hotels?.city}, {b.hotels?.country}
                    </p>
                  </div>
                  <Badge variant={b.status === "cancelled" ? "destructive" : b.status === "confirmed" ? "default" : "secondary"}>
                    {b.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm">{b.rooms?.name}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {b.check_in} → {b.check_out} · {b.guests} {b.guests === 1 ? "guest" : "guests"}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between gap-2">
                <div className="text-right">
                  <p className="font-display text-xl font-semibold">{formatPrice(b.total_cents)}</p>
                  <p className="text-xs text-muted-foreground">{b.payment_status}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/hotels/$slug" params={{ slug: b.hotels?.slug }}>View hotel</Link>
                  </Button>
                  {b.status === "confirmed" && (
                    <Button
                      variant="outline" size="sm" disabled={m.isPending}
                      onClick={() => {
                        if (confirm("Cancel this booking? A refund will be issued.")) {
                          m.mutate({ data: { bookingId: b.id } });
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
