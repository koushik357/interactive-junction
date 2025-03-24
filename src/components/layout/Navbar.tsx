
import React, { useState } from 'react';
import { 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Sun, 
  Moon, 
  User,
  ChevronDown
} from 'lucide-react';
import { Avatar } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, sidebarCollapsed }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real application, you would toggle a dark mode class on the document
    // document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-9 w-64 pl-10 pr-4 rounded-full bg-secondary border-none text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleDarkMode}
          className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <button 
          className="h-9 w-9 flex items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
            <Avatar className="h-8 w-8">
              <User size={16} />
            </Avatar>
            <div className="hidden md:flex items-center">
              <span className="text-sm font-medium mr-1">John Doe</span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
