import { useDashboard } from '../../context/DashboardContext';
import { Card } from '../UI/components';
import { Users, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const AstronautsList = () => {
  const { astronauts } = useDashboard();

  if (!astronauts || astronauts.length === 0) return null;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="text-neon-purple" /> People in Space
        </h2>
        <span className="bg-neon-purple/20 text-neon-purple px-3 py-1 rounded-full font-bold">
          {astronauts.length} Total
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {astronauts.map((astro, idx) => (
          <motion.div 
            key={`${astro.name}-${idx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-space-700/50 rounded-xl border border-slate-200 dark:border-white/5"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-space-600 flex items-center justify-center">
              <User className="text-slate-500 dark:text-slate-300 w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">{astro.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Craft: {astro.craft}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
