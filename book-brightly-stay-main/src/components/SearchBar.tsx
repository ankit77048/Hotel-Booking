import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export function SearchBar({ floating = true }: { floating?: boolean }) {
  const nav = useNavigate();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(todayISO(1));
  const [checkOut, setCheckOut] = useState(todayISO(3));
  const [guests, setGuests] = useState(2);

  return (
    <motion.form
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={(e) => {
        e.preventDefault();
        nav({ to: "/hotels", search: { q: location, checkIn, checkOut, guests } as never });
      }}
      className={`w-full max-w-4xl bg-card text-card-foreground rounded-2xl ${floating ? "shadow-2xl" : "border border-border"} p-2 flex flex-col md:flex-row items-stretch gap-2`}
    >
      <label className="flex-1 px-6 py-3 flex flex-col items-start md:border-r md:border-border">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Location</span>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Where to?"
          className="w-full bg-transparent outline-none font-medium placeholder:text-muted-foreground/60"
        />
      </label>
      <label className="flex-1 px-6 py-3 flex flex-col items-start md:border-r md:border-border">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Check-in</span>
        <input type="date" value={checkIn} min={todayISO()} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-transparent outline-none font-medium" />
      </label>
      <label className="flex-1 px-6 py-3 flex flex-col items-start md:border-r md:border-border">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Check-out</span>
        <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-transparent outline-none font-medium" />
      </label>
      <label className="flex-1 px-6 py-3 flex flex-col items-start">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Guests</span>
        <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full bg-transparent outline-none font-medium">
          {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
        </select>
      </label>
      <button
        type="submit"
        className="w-full md:w-auto bg-primary text-primary-foreground px-10 py-5 rounded-xl font-semibold hover:bg-muted-foreground transition-all"
      >
        Search
      </button>
    </motion.form>
  );
}
