export function Footer() {
  return (
    <footer className="py-20 border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1">
          <span className="font-serif text-2xl font-bold tracking-tight">AURELIA</span>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Crafting intentional escapes for those who seek the extraordinary in the quiet moments.
          </p>
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest mb-6">Company</h5>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">About</a>
            <a href="#" className="hover:text-foreground">Careers</a>
            <a href="#" className="hover:text-foreground">Journal</a>
          </div>
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest mb-6">Legal</h5>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
          </div>
        </div>
        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest mb-6">Newsletter</h5>
          <div className="flex">
            <input type="email" placeholder="Your email" className="bg-transparent border-b border-border py-2 outline-none w-full text-sm" />
            <button className="border-b border-border py-2 px-4 hover:text-accent transition-colors">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aurelia Hotels. All rights reserved.
      </div>
    </footer>
  );
}
