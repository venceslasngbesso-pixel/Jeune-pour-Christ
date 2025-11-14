import { Home, Users, DollarSign, CheckSquare, Calendar, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Accueil" },
  { path: "/membres", icon: Users, label: "Membres" },
  { path: "/tresorerie", icon: DollarSign, label: "Trésorerie" },
  { path: "/presences", icon: CheckSquare, label: "Présences" },
  { path: "/activites", icon: Calendar, label: "Activités" },
  { path: "/parametres", icon: Settings, label: "Paramètres" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-7xl mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center min-w-[60px] h-full px-2 py-1 rounded-md transition-colors hover-elevate active-elevate-2",
                  isActive && "text-primary"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-0.5", isActive && "fill-current")} />
                <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
