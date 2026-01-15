import { Link, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            Takeoff.ai
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {!isHome && (
            <Link to="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
          )}
          <Link to="/analyze">
            <Button size="sm">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
