
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isDocumentation = location.pathname === "/documentation";
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex w-10 h-10 bg-primary rounded-full items-center justify-center">
              <span className="font-bold text-xl text-white">E</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">PreSoft</span>
          </Link>
          
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isHome ? "text-foreground" : "text-foreground/60"
              )}
            >
              Inicio
            </Link>
            <Link
              to="/documentation"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isDocumentation ? "text-foreground" : "text-foreground/60"
              )}
            >
              Documentación
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
