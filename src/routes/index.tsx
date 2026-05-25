import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listHotels } from "@/lib/hotels.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Search } from "lucide-react";
import { formatPrice } from "@/lib/format";

const featuredQ = queryOptions({
  queryKey: ["hotels", "featured"],
  queryFn: () => listHotels({ data: {} }),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hush & Stay — Find your next stay" },
      { name: "description", content: "Search curated boutique hotels in iconic cities and remote escapes." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredQ),
  component: Home,
});

function Home() {
  const { data: hotels } = useSuspenseQuery(featuredQ);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const featured = hotels.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        <div className="container relative mx-auto px-4 py-28 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--gold)]">Curated escapes</p>
            <h1 className="font-display text-5xl font-semibold text-white md:text-7xl">
              Find your <em className="italic">quiet</em> in the world's most beautiful places.
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Hand-picked boutique hotels, transparent pricing, instant confirmation.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); navigate({ to: "/hotels", search: q ? { q } : {} }); }}
              className="mt-8 flex w-full max-w-xl rounded-full bg-white p-2 shadow-[var(--shadow-lift)]"
            >
              <div className="flex flex-1 items-center gap-2 px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by city, country, or hotel"
                  className="border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-full">Search</Button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Featured stays</h2>
            <p className="mt-2 text-muted-foreground">Loved by guests, vetted by us.</p>
          </div>
          <Button asChild variant="ghost"><Link to="/hotels">Browse all →</Link></Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to="/hotels/$slug"
                params={{ slug: h.slug }}
                className="group block overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={h.hero_image} alt={h.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold">{h.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                      <span>{h.star_rating}</span>
                    </div>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {h.city}, {h.country}
                  </p>
                  <p className="mt-4 text-sm">
                    <span className="font-display text-2xl font-semibold">{formatPrice(h.base_price_cents)}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
