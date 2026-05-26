import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Users, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { hotelImage } from "@/lib/hotel-images";

export const Route = createFileRoute("/hotels/$hotelId")({
  component: HotelDetail,
});

function todayISO(off = 0) {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return d.toISOString().slice(0, 10);
}

function HotelDetail() {
  const { hotelId } = Route.useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [checkIn, setCheckIn] = useState(todayISO(1));
  const [checkOut, setCheckOut] = useState(todayISO(3));
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  const { data: hotel, isLoading } = useQuery({
    queryKey: ["hotel", hotelId],
    queryFn: async () => {
      const { data, error } = await supabase.from("hotels").select("*").eq("id", hotelId).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: rooms } = useQuery({
    queryKey: ["rooms", hotelId],
    queryFn: async () => {
      const { data, error } = await supabase.from("rooms").select("*").eq("hotel_id", hotelId).order("price_per_night");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: bookedCounts } = useQuery({
    queryKey: ["availability", hotelId, checkIn, checkOut],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("room_id")
        .eq("hotel_id", hotelId)
        .eq("status", "confirmed")
        .lt("check_in", checkOut)
        .gt("check_out", checkIn);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data ?? []).forEach((b) => { counts[b.room_id] = (counts[b.room_id] ?? 0) + 1; });
      return counts;
    },
    enabled: !!hotelId,
  });

  const nights = Math.max(1, Math.round((+new Date(checkOut) - +new Date(checkIn)) / 86400000));
  const selectedRoomObj = rooms?.find((r) => r.id === selectedRoom);
  const subtotal = selectedRoomObj ? Number(selectedRoomObj.price_per_night) * nights : 0;
  const taxes = subtotal * 0.07;
  const total = subtotal + taxes;

  const handleBook = async () => {
    if (!user) { nav({ to: "/auth", search: { redirect: `/hotels/${hotelId}` } as never }); return; }
    if (!selectedRoomObj) { toast.error("Please select a room"); return; }
    setBooking(true);
    const { error, data } = await supabase.from("bookings").insert({
      user_id: user.id,
      room_id: selectedRoomObj.id,
      hotel_id: hotelId,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      total_amount: total,
      payment_status: "paid", // payment integration pending; mark paid for demo
      transaction_id: `DEMO_${Date.now()}`,
    }).select().single();
    setBooking(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Booking confirmed!");
    nav({ to: "/bookings", search: { highlight: data.id } as never });
  };

  if (isLoading || !hotel) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-24 w-full animate-pulse">
          <div className="h-96 bg-muted rounded-3xl mb-8" />
          <div className="h-8 bg-muted rounded w-1/3 mb-4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12 w-full">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="aspect-[16/9] overflow-hidden rounded-3xl mb-8 bg-muted">
            <img src={hotelImage(hotel.image_url)} alt={hotel.name} width={1600} height={900} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-wrap justify-between items-start gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{hotel.location}</p>
              <h1 className="font-serif text-5xl mb-4">{hotel.name}</h1>
              <div className="flex items-center gap-2 text-sm">
                <Star size={16} fill="currentColor" className="text-accent" />
                <span className="font-medium">{Number(hotel.rating).toFixed(1)}</span>
                <span className="text-muted-foreground">· 248 reviews</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${hotel.price_per_night}</p>
              <p className="text-xs text-muted-foreground">starting per night</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_400px] gap-12">
          <div>
            <section className="mb-12">
              <h2 className="font-serif text-2xl mb-4">About this sanctuary</h2>
              <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
            </section>
            <section className="mb-12">
              <h2 className="font-serif text-2xl mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {hotel.amenities.map((a: string) => (
                  <div key={a} className="flex items-center gap-2 text-sm"><Check size={16} className="text-accent" />{a}</div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="font-serif text-2xl mb-4">Available rooms</h2>
              <div className="space-y-4">
                {rooms?.map((r) => {
                  const booked = bookedCounts?.[r.id] ?? 0;
                  const available = r.total_units - booked;
                  const isSelected = selectedRoom === r.id;
                  return (
                    <motion.button
                      key={r.id}
                      whileHover={{ y: -2 }}
                      onClick={() => available > 0 && setSelectedRoom(r.id)}
                      disabled={available <= 0}
                      className={`w-full text-left p-6 rounded-2xl border transition-all ${isSelected ? "border-accent bg-accent/10" : "border-border bg-card"} ${available <= 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-serif text-xl mb-1">{r.name}</h3>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{r.room_type}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Users size={14} /> Up to {r.capacity} guests</div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${Number(r.price_per_night).toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                          <p className={`text-xs mt-2 font-medium ${available > 0 ? "text-[var(--color-muted-foreground)]" : "text-destructive"}`}>
                            {available > 0 ? `${available} left` : "Sold out"}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="md:sticky md:top-28 h-fit">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-3xl p-6 shadow-xl">
              <h3 className="font-serif text-xl mb-4">Reserve your stay</h3>
              <div className="space-y-3 mb-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Check-in</span>
                  <input type="date" value={checkIn} min={todayISO()} onChange={(e) => setCheckIn(e.target.value)} className="w-full p-3 rounded-lg border border-border bg-background mt-1" />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Check-out</span>
                  <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="w-full p-3 rounded-lg border border-border bg-background mt-1" />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Guests</span>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full p-3 rounded-lg border border-border bg-background mt-1">
                    {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
                  </select>
                </label>
              </div>

              {selectedRoomObj && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2 py-4 border-t border-border text-sm overflow-hidden">
                  <div className="flex justify-between"><span className="text-muted-foreground">{selectedRoomObj.name} × {nights} night{nights>1?"s":""}</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Taxes & fees</span><span>${taxes.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </motion.div>
              )}

              <button
                onClick={handleBook}
                disabled={!selectedRoomObj || booking}
                className="w-full mt-4 bg-accent text-accent-foreground py-4 rounded-xl font-bold hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? "Confirming..." : selectedRoomObj ? `Confirm & Pay — $${total.toFixed(2)}` : "Select a room"}
              </button>
              <p className="text-[10px] text-center text-muted-foreground mt-3">Secure encrypted transaction. Razorpay integration pending.</p>
            </motion.div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
