import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listHotels } from "@/lib/hotels.functions";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Star, MapPin, Search } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { motion } from "motion/react";

const searchSchema = z.object({
  q: z.string().optional(),
  minStars: z.number().optional(),
  maxPrice: z.number().optional(),
});

const hotelsQ = queryOptions({
  queryKey: ["hotels", "all"],
  queryFn: () => listHotels({ data: {} }),
});

export const Route = createFileRoute("/hotels")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse hotels — Hush & Stay" },
      { name: "description", content: "Search and filter boutique hotels by price, rating, and location." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(hotelsQ),
  component: HotelsPage,
});

function HotelsPage() {
  const { data: allHotels } = useSuspenseQuery(hotelsQ);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const minStars = search.minStars ?? 0;
  const maxPrice = search.maxPrice ?? 60000;

  const filtered = allHotels.filter((h) => {
    if (minStars && h.star_rating < minStars) return false;
    if (maxPrice && h.base_price_cents > maxPrice) return false;
    if (q) {
      const n = q.toLowerCase();
      if (!h.name.toLowerCase().includes(n) && !h.city.toLowerCase().includes(n) && !h.country.toLowerCase().includes(n)) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-semibold">All hotels</h1>
      <p className="mt-2 text-muted-foreground">{filtered.length} of {allHotels.length} stays match your filters.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 self-start rounded-2xl border bg-card p-6">
          <div>
            <label className="text-sm font-medium">Search</label>
            <div className="mt-2 flex items-center gap-2 rounded-md border bg-background px-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  navigate({ search: (s) => ({ ...s, q: e.target.value || undefined }), replace: true });
                }}
                placeholder="City, country, name"
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Min rating: {minStars || "any"}</label>
            <Slider
              value={[minStars]}
              max={5}
              step={0.5}
              onValueChange={([v]) => navigate({ search: (s) => ({ ...s, minStars: v || undefined }), replace: true })}
              className="mt-3"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max price/night: {formatPrice(maxPrice)}</label>
            <Slider
              value={[maxPrice]}
              min={10000}
              max={60000}
              step={1000}
              onValueChange={([v]) => navigate({ search: (s) => ({ ...s, maxPrice: v }), replace: true })}
              className="mt-3"
            />
          </div>
        </aside>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link
                to="/hotels/$slug"
                params={{ slug: h.slug }}
                className="group block overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)]"
              >
                <div className="aspect-[16/10] overflow-hidden">
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
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{h.description}</p>
                  <p className="mt-4">
                    <span className="font-display text-2xl font-semibold">{formatPrice(h.base_price_cents)}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
