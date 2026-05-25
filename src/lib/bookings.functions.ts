import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      roomId: z.string().uuid(),
      checkIn: isoDate,
      checkOut: isoDate,
      guests: z.number().int().min(1).max(10),
      guestName: z.string().trim().min(1).max(100),
      guestEmail: z.string().trim().email().max(255),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context;
    if (new Date(data.checkOut) <= new Date(data.checkIn)) {
      throw new Error("Check-out must be after check-in.");
    }

    // Get room + hotel
    const { data: room, error: rErr } = await supabaseAdmin
      .from("rooms").select("*").eq("id", data.roomId).maybeSingle();
    if (rErr) throw new Error(rErr.message);
    if (!room) throw new Error("Room not found");
    if (data.guests > room.capacity) throw new Error("Too many guests for this room.");

    // Availability: count overlapping non-cancelled bookings
    const { count, error: cErr } = await supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("room_id", data.roomId)
      .neq("status", "cancelled")
      .lt("check_in", data.checkOut)
      .gt("check_out", data.checkIn);
    if (cErr) throw new Error(cErr.message);
    if ((count ?? 0) >= room.total_units) {
      throw new Error("This room is fully booked for the selected dates.");
    }

    const nights = Math.max(1, Math.round(
      (new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / 86400000,
    ));
    const total = room.price_cents * nights;

    // Mock payment reference (replace with real Stripe in a follow-up)
    const paymentRef = `mock_${crypto.randomUUID().slice(0, 12)}`;

    const { data: booking, error: bErr } = await supabaseAdmin
      .from("bookings")
      .insert({
        user_id: userId,
        room_id: data.roomId,
        hotel_id: room.hotel_id,
        check_in: data.checkIn,
        check_out: data.checkOut,
        guests: data.guests,
        total_cents: total,
        status: "confirmed",
        payment_status: "paid",
        guest_email: data.guestEmail,
        guest_name: data.guestName,
        payment_reference: paymentRef,
      })
      .select()
      .single();
    if (bErr) throw new Error(bErr.message);

    return { booking, paymentRef };
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("bookings")
      .select("*, hotels(name, city, country, hero_image, slug), rooms(name, room_type)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ bookingId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: updated, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled", payment_status: "refunded", updated_at: new Date().toISOString() })
      .eq("id", data.bookingId)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });
