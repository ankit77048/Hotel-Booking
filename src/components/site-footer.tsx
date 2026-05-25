export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p className="font-display text-base text-foreground">Hush &amp; Stay</p>
        <p>© {new Date().getFullYear()} Hush &amp; Stay. Curated places to rest.</p>
      </div>
    </footer>
  );
}
