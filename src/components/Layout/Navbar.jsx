import { Moon, Sun, Rocket } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass rounded-none border-t-0 border-x-0 border-b border-white/20 dark:border-white/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Rocket className="w-8 h-8 text-neon-blue" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
          ISS Orbit Dashboard
        </h1>
      </div>
      
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-space-700 transition-colors"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-slate-700" />
        )}
      </button>
    </nav>
  );
};
