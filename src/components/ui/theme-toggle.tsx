
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Candy, Leaf, Sunset } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'candy' | 'forest' | 'sunset';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Initialize theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }, []);

  const setThemeAndSave = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Remove all theme classes and add the new one
    document.documentElement.classList.remove('light', 'dark', 'candy', 'forest', 'sunset');
    document.documentElement.classList.add(newTheme);
  };

  // Icon mapping based on current theme
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'candy':
        return <Candy className="h-4 w-4" />;
      case 'forest':
        return <Leaf className="h-4 w-4" />;
      case 'sunset':
        return <Sunset className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setThemeAndSave('light')}>
          <Sun className="h-4 w-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeAndSave('dark')}>
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeAndSave('candy')}>
          <Candy className="h-4 w-4 mr-2" />
          Candy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeAndSave('forest')}>
          <Leaf className="h-4 w-4 mr-2" />
          Forest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setThemeAndSave('sunset')}>
          <Sunset className="h-4 w-4 mr-2" />
          Sunset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
