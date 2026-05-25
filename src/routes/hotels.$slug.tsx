import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getHotelBySlug } from "@/lib/hotels.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, MapPin, Check, Users } from "lucide-react";
import { formatPrice, todayISO, addDaysISO, nightsBetween } from "@/lib/format";
import { motion } from "motion/react";

const hotelQ = (slug: string) =>
  queryOptions({
    queryKey: ["hotel", slug],
    queryFn: () => getHotelBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/hotels/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(hotelQ(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.hotel.name} — Hush & Stay` },
          { name: "description", content: loaderData.hotel.description.slice(0, 160) },
          { property: "og:title", content: loaderData.hotel.name },
          { property: "og:image", content: loaderData.hotel.hero_image },
        ]
      : [],
  }),
  component: HotelDetail,
});

function HotelDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(hotelQ(slug));
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 2));
  const [guests, setGuests] = useState(2);

  if (!data) return null;
  const { hotel, rooms } = data;
  const nights = nightsBetween(checkIn, checkOut);

  return (
    <div>
      <div className="relative h-[55vh] w-full overflow-hidden">
        <img src={hotel.hero_image} alt={hotel.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4" /> {hotel.city}, {hotel.country}
              <span className="mx-2">•</span>
              <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" /> {hotel.star_rating}
            </div>
            <h1 className="mt-2 font-display text-4xl font-semibold text-white md:text-6xl">{hotel.name}</h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-lg leading-relaxed text-foreground/80">{hotel.description}</p>

          <h2 className="mt-12 font-display text-2xl font-semibold">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {hotel.gallery.map((g) => (
              <div key={g} className="overflow-hidden rounded-xl">
                <img src={g} alt="" className="h-44 w-full object-cover transition duration-700 hover:scale-105" />
              </div>
            ))}
          </div>

          <h2 className="mt-12 font-display text-2xl font-semibold">Amenities</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
            {hotel.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> {a}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-2xl font-semibold">Rooms</h2>
          <div className="mt-4 space-y-4">
            {rooms.map((r) => (
              <div key={r.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-5 md:flex-row">
                {r.images[0] && (
                  <img src={r.images[0]} alt={r.name} className="h-40 w-full rounded-xl object-cover md:w-56" />
                )}
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold">{r.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                  <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" /> Sleeps {r.capacity}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between gap-2">
                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold">{formatPrice(r.price_cents)}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                  <Button
                    onClick={() =>
                      navigate({
                        to: "/checkout",
                        search: { roomId: r.id, checkIn, checkOut, guests },
                      })
                    }
                  >
                    Book {nights} {nights === 1 ? "night" : "nights"} · {formatPrice(r.price_cents * nights)}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="sticky top-24 self-start rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-xl font-semibold">Plan your stay</h3>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="ci">Check-in</Label>
              <Input id="ci" type="date" value={checkIn} min={todayISO()} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="co">Check-out</Label>
              <Input id="co" type="date" value={checkOut} min={addDaysISO(checkIn, 1)} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="g">Guests</Label>
              <Input id="g" type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value) || 1)} />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {nights} {nights === 1 ? "night" : "nights"} · from {formatPrice((rooms[0]?.price_cents ?? hotel.base_price_cents) * nights)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Select a room below to continue.</p>
        </aside>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <Link to="/hotels" className="text-sm text-muted-foreground hover:text-foreground">← Back to all hotels</Link>
      </div>
    </div>
  );
}
