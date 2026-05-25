import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// One-shot demo seeder. Safe to call multiple times (idempotent).
export const Route = createFileRoute("/api/public/seed-demo")({
  server: {
    handlers: {
      GET: async () => {
        const email = "demo@hushandstay.com";
        const password = "DemoStay2026!";

        // Try to create; if exists, that's fine.
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: "Demo Guest" },
        });

        if (error && !/already/i.test(error.message)) {
          return new Response(JSON.stringify({ ok: false, error: error.message }), {
            status: 500, headers: { "content-type": "application/json" },
          });
        }

        return new Response(
          JSON.stringify({ ok: true, email, password, userId: data?.user?.id ?? "existing" }),
          { headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
