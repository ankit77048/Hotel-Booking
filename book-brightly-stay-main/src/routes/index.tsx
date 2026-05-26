import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { HotelCard, type HotelCardData } from "@/components/HotelCard";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia — Boutique Hotel Sanctuaries" },
      { name: "description", content: "Book hand-selected boutique hotels worldwide. Real-time availability, secure payments, instant confirmation." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: hotels, isLoading } = useQuery({
    queryKey: ["featured-hotels"],
    queryFn: async (): Promise<HotelCardData[]> => {
      const { data, error } = await supabase
        .from("hotels")
        .select("id,name,location,image_url,rating,amenities,price_per_night")
        .order("rating", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <header className="relative h-[85vh] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Boutique hotel in a misty pine forest at dusk"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/30" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-7xl text-background mb-10 max-w-3xl"
          >
            Escape into the <br /><em className="italic">Unseen Ordinary</em>
          </motion.h1>
          <SearchBar />
        </div>
      </header>

      {/* Hotel grid */}
      <main className="max-w-7xl mx-auto px-6 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-12 flex-wrap gap-4"
        >
          <div>
            <h2 className="font-serif text-4xl mb-2">Featured Sanctuaries</h2>
            <p className="text-muted-foreground">Hand-selected retreats for the discerning traveler.</p>
          </div>
          <Link
            to="/hotels"
            className="text-sm font-medium underline underline-offset-4 decoration-border hover:decoration-accent"
          >
            View all retreats →
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted rounded-3xl mb-4" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hotels?.map((h, i) => <HotelCard key={h.id} hotel={h} index={i} />)}
          </div>
        )}
      </main>

      {/* Trust band */}
      <section className="bg-primary text-primary-foreground py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="font-serif text-5xl mb-8 leading-tight">Instant confirmation. <br />Zero complications.</h2>
            <ul className="space-y-6">
              {[
                "Select your preferred sanctuary and room type.",
                "Secure checkout via Razorpay encrypted payment gateway.",
                "Receive instant digital keys and itinerary via email.",
              ].map((t, i) => (
                <li key={i} className="flex items-center gap-4">
                  <div className="size-10 rounded-full border border-background/20 flex items-center justify-center font-serif italic">{i + 1}</div>
                  <p className="text-lg">{t}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card text-card-foreground rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-border">
              <h4 className="font-bold uppercase tracking-widest text-xs">Booking Summary</h4>
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between"><span className="text-muted-foreground">Glass Pavilion · 3 nights</span><span className="font-medium">$1,260.00</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Cleaning & Taxes</span><span className="font-medium">$84.50</span></div>
              <div className="flex justify-between pt-4 border-t border-border"><span className="font-bold">Total</span><span className="font-bold text-xl">$1,344.50</span></div>
            </div>
            <Link to="/hotels" className="block w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold text-center hover:brightness-105 transition-all">
              Browse Sanctuaries
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
