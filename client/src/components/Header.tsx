import { useState } from "react";
import { Settings, Bell } from "lucide-react";
import { format } from "date-fns";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface HeaderProps {
  lastUpdated?: string;
}

export default function Header({ lastUpdated }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const formattedDate = lastUpdated 
    ? format(new Date(lastUpdated), "MMM d, yyyy HH:mm:ss")
    : format(new Date(), "MMM d, yyyy HH:mm:ss");

  return (
    <header className="bg-background border-b border-border shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          <h1 className="ml-2 text-xl font-semibold">Market Lens</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <span className="text-sm text-muted-foreground">Last Updated:</span>
            <span className="ml-1 text-sm font-mono">{formattedDate}</span>
          </div>
          <ThemeSwitcher />
          <button 
            className="p-2 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-5 w-5 text-foreground" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-foreground" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            MS
          </div>
        </div>
      </div>
    </header>
  );
}
