import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HotelCard, type HotelCardData } from "@/components/HotelCard";
import { SearchBar } from "@/components/SearchBar";

interface SearchParams {
  q?: string;
  sort?: "price" | "rating" | "popular";
  minRating?: number;
  maxPrice?: number;
}

export const Route = createFileRoute("/hotels")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : undefined,
    sort: (s.sort as SearchParams["sort"]) ?? "rating",
    minRating: s.minRating ? Number(s.minRating) : undefined,
    maxPrice: s.maxPrice ? Number(s.maxPrice) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Hotels — Aurelia" },
      { name: "description", content: "Filter and sort boutique hotel sanctuaries by price, rating, and amenities." },
    ],
  }),
  component: Hotels,
});

function Hotels() {
  const search = Route.useSearch();
  const [minRating, setMinRating] = useState(search.minRating ?? 0);
  const [maxPrice, setMaxPrice] = useState(search.maxPrice ?? 1500);
  const [sort, setSort] = useState<SearchParams["sort"]>(search.sort ?? "rating");

  const { data, isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: async (): Promise<HotelCardData[]> => {
      const { data, error } = await supabase
        .from("hotels")
        .select("id,name,location,image_url,rating,amenities,price_per_night");
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter((h) => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q));
    }
    list = list.filter((h) => h.rating >= minRating && h.price_per_night <= maxPrice);
    list = [...list].sort((a, b) => {
      if (sort === "price") return a.price_per_night - b.price_per_night;
      return b.rating - a.rating;
    });
    return list;
  }, [data, search.q, minRating, maxPrice, sort]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="bg-secondary/40 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-4xl mb-6">
            All Sanctuaries
          </motion.h1>
          <SearchBar floating={false} />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid md:grid-cols-[260px_1fr] gap-10">
          <aside className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3">Sort</h3>
              <select value={sort} onChange={(e) => setSort(e.target.value as SearchParams["sort"])} className="w-full p-3 rounded-lg border border-border bg-card">
                <option value="rating">Highest Rated</option>
                <option value="price">Lowest Price</option>
              </select>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3">Min Rating: {minRating.toFixed(1)}</h3>
              <input type="range" min={0} max={5} step={0.1} value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full accent-[var(--color-accent)]" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-3">Max Price: ${maxPrice}</h3>
              <input type="range" min={100} max={1500} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[var(--color-accent)]" />
            </div>
          </aside>

          <div>
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} retreat{filtered.length !== 1 && "s"} found</p>
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-muted rounded-3xl mb-4" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">No retreats match your filters.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {filtered.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
