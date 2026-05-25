import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listHotels = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({
      q: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      minStars: z.number().optional(),
    }).parse(input ?? {}),
  )
  .handler(async ({ data }) => {
    let q = supabaseAdmin.from("hotels").select("*").order("star_rating", { ascending: false });
    if (data.minPrice) q = q.gte("base_price_cents", data.minPrice);
    if (data.maxPrice) q = q.lte("base_price_cents", data.maxPrice);
    if (data.minStars) q = q.gte("star_rating", data.minStars);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    let filtered = rows ?? [];
    if (data.q) {
      const needle = data.q.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(needle) ||
          h.city.toLowerCase().includes(needle) ||
          h.country.toLowerCase().includes(needle),
      );
    }
    return filtered;
  });

export const getHotelBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const { data: hotel, error } = await supabaseAdmin
      .from("hotels").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!hotel) return null;
    const { data: rooms, error: rErr } = await supabaseAdmin
      .from("rooms").select("*").eq("hotel_id", hotel.id).order("price_cents");
    if (rErr) throw new Error(rErr.message);
    return { hotel, rooms: rooms ?? [] };
  });

export const getRoomById = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ roomId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: room, error } = await supabaseAdmin
      .from("rooms").select("*, hotels(*)").eq("id", data.roomId).maybeSingle();
    if (error) throw new Error(error.message);
    return room;
  });
