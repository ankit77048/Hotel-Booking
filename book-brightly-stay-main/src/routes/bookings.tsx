import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { hotelImage } from "@/lib/hotel-images";

interface SP { highlight?: string }

export const Route = createFileRoute("/bookings")({
  validateSearch: (s: Record<string, unknown>): SP => ({ highlight: typeof s.highlight === "string" ? s.highlight : undefined }),
  head: () => ({ meta: [{ title: "My Bookings — Aurelia" }] }),
  component: Bookings,
});

function Bookings() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const search = Route.useSearch();

  useEffect(() => {
    if (!authLoading && !user) nav({ to: "/auth", search: { redirect: "/bookings" } as never });
  }, [user, authLoading, nav]);

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, hotels(name, location, image_url), rooms(name, room_type)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const cancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Booking cancelled");
    qc.invalidateQueries({ queryKey: ["bookings"] });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-16 w-full flex-1">
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-4xl mb-2">My Bookings</motion.h1>
        <p className="text-muted-foreground mb-10">Your reservations and stay history.</p>

        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}</div>
        ) : !data?.length ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground mb-4">No bookings yet.</p>
            <Link to="/hotels" className="inline-flex bg-accent text-accent-foreground px-6 py-3 rounded-full font-medium">Browse sanctuaries</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((b, i) => {
              const hotel = b.hotels as { name: string; location: string; image_url: string } | null;
              const room = b.rooms as { name: string; room_type: string } | null;
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`bg-card border rounded-2xl overflow-hidden flex flex-col md:flex-row gap-6 ${search.highlight === b.id ? "border-accent ring-2 ring-accent/30" : "border-border"}`}
                >
                  <div className="md:w-56 aspect-[4/3] md:aspect-auto bg-muted shrink-0">
                    {hotel && <img src={hotelImage(hotel.image_url)} alt={hotel.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{room?.room_type}</p>
                      <h3 className="font-serif text-xl mb-1">{hotel?.name} — {room?.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2"><MapPin size={12} /> {hotel?.location}</p>
                      <p className="text-sm flex items-center gap-1"><Calendar size={12} /> {b.check_in} → {b.check_out} · {b.guests} guest{b.guests>1?"s":""}</p>
                      <p className="text-xs text-muted-foreground mt-1">Txn: {b.transaction_id ?? "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">${Number(b.total_amount).toFixed(2)}</p>
                      <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded mt-1 ${b.status === "cancelled" ? "bg-destructive/10 text-destructive" : "bg-accent/20 text-accent-foreground"}`}>
                        {b.status} · {b.payment_status}
                      </span>
                      {b.status === "confirmed" && (
                        <button onClick={() => cancel(b.id)} className="block text-xs text-destructive mt-3 underline underline-offset-2">Cancel</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
