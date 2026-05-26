import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight">
            AURELIA
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <Link to="/hotels" className="hover:text-accent transition-colors">Destinations</Link>
            <Link to="/hotels" className="hover:text-accent transition-colors" search={{ sort: "rating" } as never}>Experiences</Link>
            {user && <Link to="/bookings" className="hover:text-accent transition-colors">My Bookings</Link>}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-xs text-muted-foreground hidden lg:inline truncate max-w-[180px]">{user.email}</span>
              <button
                onClick={async () => { await signOut(); nav({ to: "/" }); }}
                className="text-sm font-medium px-4 py-2 hover:text-accent transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium px-4 py-2 hover:text-accent transition-colors">Sign In</Link>
              <Link
                to="/auth"
                search={{ mode: "signup" } as never}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:bg-muted-foreground transition-all"
              >
                Join Membership
              </Link>
            </>
          )}
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <div className="flex flex-col px-6 py-4 gap-4 text-sm">
              <Link to="/hotels" onClick={() => setOpen(false)}>Destinations</Link>
              {user && <Link to="/bookings" onClick={() => setOpen(false)}>My Bookings</Link>}
              {user ? (
                <button className="text-left" onClick={async () => { await signOut(); setOpen(false); nav({ to: "/" }); }}>Sign Out</button>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)}>Sign In / Join</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
