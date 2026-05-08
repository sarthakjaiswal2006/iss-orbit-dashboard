import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDashboard } from '../context/DashboardContext';

export const useNews = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { news, setNews } = useDashboard();

  const fetchNews = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const cached = localStorage.getItem('space_news');
      const cachedTime = localStorage.getItem('space_news_time');
      
      if (!forceRefresh && cached && cachedTime) {
        const now = new Date().getTime();
        // 15 minutes = 15 * 60 * 1000 = 900000 ms
        if (now - parseInt(cachedTime) < 900000) {
          setNews(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const res = await axios.get('https://api.spaceflightnewsapi.net/v4/articles/?limit=10');
      const articles = res.data.results;
      
      setNews(articles);
      localStorage.setItem('space_news', JSON.stringify(articles));
      localStorage.setItem('space_news_time', new Date().getTime().toString());
      
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, loading, error, refresh: () => fetchNews(true) };
};
