import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { calculateSpeed } from '../utils/haversine';
import { useDashboard } from '../context/DashboardContext';

export const useISSTracking = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setIssData, setAstronauts } = useDashboard();
  const lastPositionRef = useRef(null);

  const fetchAstronauts = async () => {
    try {
      const res = await axios.get('http://api.open-notify.org/astros.json');
      setAstronauts(res.data.people || []);
    } catch (err) {
      console.error("Failed to fetch astronauts:", err);
    }
  };

  const fetchISSLocation = useCallback(async () => {
    try {
      const res = await axios.get('http://api.open-notify.org/iss-now.json');
      const { latitude, longitude } = res.data.iss_position;
      const timestamp = res.data.timestamp;
      
      const newPos = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        timestamp
      };

      let speed = 0;
      if (lastPositionRef.current) {
        const timeDiff = timestamp - lastPositionRef.current.timestamp;
        speed = calculateSpeed(
          lastPositionRef.current.lat,
          lastPositionRef.current.lng,
          newPos.lat,
          newPos.lng,
          timeDiff
        );
      } else {
        // Approximate average speed of ISS if first load
        speed = 27600; 
      }

      const dataPoint = { ...newPos, speed };
      lastPositionRef.current = newPos;

      setHistory(prev => {
        const newHistory = [...prev, dataPoint];
        if (newHistory.length > 30) newHistory.shift(); // Keep last 30
        return newHistory;
      });
      
      setIssData(dataPoint);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch ISS location:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setIssData]);

  useEffect(() => {
    fetchAstronauts();
    fetchISSLocation();
    
    const interval = setInterval(fetchISSLocation, 15000);
    return () => clearInterval(interval);
  }, [fetchISSLocation]);

  return { history, loading, error, refresh: fetchISSLocation };
};
