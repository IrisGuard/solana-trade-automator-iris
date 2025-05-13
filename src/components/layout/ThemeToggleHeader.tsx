
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export function ThemeToggleHeader() {
  return (
    <div className="flex items-center space-x-2">
      <Link to="/">
        <Button variant="ghost" size="icon" className="mr-2" title="Αρχική σελίδα">
          <Home className="h-4 w-4" />
        </Button>
      </Link>
      <ThemeToggle />
    </div>
  );
}
