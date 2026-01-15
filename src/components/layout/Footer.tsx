import { Building2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-foreground">Takeoff.ai</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </nav>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Takeoff.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
