import h1 from "@/assets/hotel-1.jpg";
import h2 from "@/assets/hotel-2.jpg";
import h3 from "@/assets/hotel-3.jpg";
import h4 from "@/assets/hotel-4.jpg";
import h5 from "@/assets/hotel-5.jpg";
import h6 from "@/assets/hotel-6.jpg";

const map: Record<string, string> = {
  "hotel-1": h1,
  "hotel-2": h2,
  "hotel-3": h3,
  "hotel-4": h4,
  "hotel-5": h5,
  "hotel-6": h6,
};

export const hotelImage = (key: string): string => map[key] ?? h1;
