import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquare, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      name: "Testimonials",
      path: "/testimonials",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      name: "Form",
      path: "/send-form",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold gradient-text">InstaGlow</div>
        </Link>
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
        <Button variant="ghost" onClick={handleSignOut}>
          Sign Out
        </Button>
      </nav>
      <div className="flex md:hidden">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
          <span className="sr-only">Toggle menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </Button>
      </div>
    </div>
    <div className="md:hidden flex overflow-auto border-t">
      <div className="container py-2">
        <div className="flex justify-between">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors hover:text-primary py-2 px-3",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </header>
  );
};

export default Navbar;
