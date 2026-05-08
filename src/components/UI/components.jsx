import { motion } from 'framer-motion';

export const Loader = () => (
  <div className="flex items-center justify-center h-full w-full py-8">
    <motion.div
      className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-space-700 rounded-lg ${className}`}></div>
);

export const Card = ({ children, className = "" }) => (
  <div className={`glass p-6 rounded-2xl ${className}`}>
    {children}
  </div>
);
