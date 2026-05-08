import { useNews } from '../../hooks/useNews';
import { Card, Skeleton } from '../UI/components';
import { ExternalLink, Clock, Newspaper, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const NewsDashboard = () => {
  const { news, loading, error, refresh } = useNews();

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Newspaper className="text-neon-blue" /> Latest Space News
        </h2>
        <button 
          onClick={refresh}
          disabled={loading}
          className="p-2 rounded-full bg-slate-100 dark:bg-space-700 hover:bg-slate-200 dark:hover:bg-space-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-slate-700 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {loading && news.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            news.map((article, idx) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col bg-slate-100 dark:bg-space-700/40 rounded-xl overflow-hidden hover:shadow-lg dark:hover:shadow-neon-blue/10 transition-all border border-slate-200 dark:border-white/5"
              >
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                    {article.news_site}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <h3 className="font-bold text-sm line-clamp-2" title={article.title}>
                    {article.title}
                  </h3>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-auto pt-2 gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(article.published_at), 'MMM dd, yyyy')}
                  </div>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-neon-blue/10 text-neon-blue hover:bg-neon-blue hover:text-white rounded-lg transition-colors text-sm font-semibold"
                  >
                    Read Article <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </Card>
  );
};
