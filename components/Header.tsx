import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  function nextTheme() {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  }
  return (
    <header className="w-full bg-[#0e59d1] dark:bg-[#092045] py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-white text-2xl font-bold">wall</h1>
      </div>
      <Button variant="outline" size="icon" onClick={nextTheme} className="cursor-pointer">
        {mounted && theme === "light" && <Sun key="sun" className="h-[1.2rem] w-[1.2rem]" />}
        {mounted && theme === "dark" && <Moon key="moon" className="h-[1.2rem] w-[1.2rem]" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
} 