import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { hotelImage } from "@/lib/hotel-images";

export interface HotelCardData {
  id: string;
  name: string;
  location: string;
  image_url: string;
  rating: number;
  amenities: string[];
  price_per_night: number;
}

export function HotelCard({ hotel, index = 0 }: { hotel: HotelCardData; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/hotels/$hotelId" params={{ hotelId: hotel.id }} className="group block cursor-pointer">
        <div className="relative overflow-hidden rounded-3xl mb-4 bg-muted">
          <img
            src={hotelImage(hotel.image_url)}
            alt={hotel.name}
            loading="lazy"
            width={800}
            height={1000}
            className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star size={12} fill="currentColor" /> {hotel.rating.toFixed(1)}
          </div>
        </div>
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-xl group-hover:text-accent transition-colors truncate">{hotel.name}</h3>
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2 truncate">{hotel.location}</p>
            <div className="flex gap-2 flex-wrap">
              {hotel.amenities.slice(0, 2).map((a) => (
                <span key={a} className="text-[10px] bg-secondary px-2 py-0.5 rounded">{a}</span>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-lg">${hotel.price_per_night}</p>
            <p className="text-[10px] text-muted-foreground">per night</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
