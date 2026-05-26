import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/Header";

interface SP { mode?: "signin" | "signup"; redirect?: string }

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): SP => ({
    mode: s.mode === "signup" ? "signup" : "signin",
    redirect: typeof s.redirect === "string" ? s.redirect : "/",
  }),
  head: () => ({ meta: [{ title: "Sign in — Aurelia" }] }),
  component: Auth,
});

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  fullName: z.string().trim().min(1).max(100).optional(),
});

function Auth() {
  const search = Route.useSearch();
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) { nav({ to: search.redirect ?? "/" }); }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ email, password, fullName: mode === "signup" ? fullName : undefined });
    if (!result.success) { toast.error(result.error.issues[0].message); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Welcome! Account created.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
      nav({ to: search.redirect ?? "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl">
          <h1 className="font-serif text-3xl mb-2">{mode === "signup" ? "Join Aurelia" : "Welcome back"}</h1>
          <p className="text-sm text-muted-foreground mb-8">{mode === "signup" ? "Create your sanctuary account." : "Sign in to manage your bookings."}</p>

          <form onSubmit={submit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.label key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="block overflow-hidden">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Full Name</span>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} required={mode === "signup"} maxLength={100} className="w-full p-3 rounded-lg border border-border bg-background mt-1" />
                </motion.label>
              )}
            </AnimatePresence>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} className="w-full p-3 rounded-lg border border-border bg-background mt-1" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Password</span>
              <div className="relative mt-1">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={72} className="w-full p-3 pr-12 rounded-lg border border-border bg-background" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Toggle password">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:bg-muted-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            {mode === "signup" ? "Already have an account?" : "New to Aurelia?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-accent font-medium underline underline-offset-4">
              {mode === "signup" ? "Sign in" : "Create account"}
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
