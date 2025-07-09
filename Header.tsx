import { Bell, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Moon, Sun, MonitorDot } from "lucide-react";
import { useTheme } from "@/contexts/useTheme";
import { useAuth } from "@/contexts/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);

  const cycleTheme = () => {
    setCurrentTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "system";
      return "light";
    });
  };

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme}>
      {currentTheme === "light" && (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      {currentTheme === "dark" && (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      {currentTheme === "system" && (
        <MonitorDot className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="flex justify-end items-center p-4 h-16 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-4 bg-white shadow-lg rounded-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold">
                Developed by:{" "}
                <a
                  href="https://github.com/HackerDMK"
                  target="_blank"
                  rel="noreferrer"
                >
                  Danish Manzoor
                </a>
              </p>
              <p>Version: 1.0.0</p>
              <p>Other relevant info...</p>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
