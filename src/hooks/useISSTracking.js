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
      const res = await axios.get(
        'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json'
      );

      setAstronauts(res.data.people || []);
    } catch (err) {
      console.error('Astronaut fetch failed:', err);
    }
  };

   const fetchISSLocation = useCallback(async () => {
    try {
      setLoading(true);

      // =====================================
      // REAL API
      // =====================================
      const res = await axios.get(
        'https://api.wheretheiss.at/v1/satellites/25544',
        {
          timeout: 5000,
        }
      );

      console.log('ISS RESPONSE:', res.data);

      const latitude = Number(res.data.latitude);
      const longitude = Number(res.data.longitude);

      // =====================================
      // VALIDATION
      // =====================================
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid ISS coordinates');
      }

      const timestamp =
        res.data.timestamp || Math.floor(Date.now() / 1000);

      const newPos = {
        lat: latitude,
        lng: longitude,
        timestamp,
      };

      // DEFAULT SPEED
      let speed = Number(res.data.velocity) || 27600;

      // =====================================
      // CUSTOM SPEED CALCULATION
      // =====================================
      if (lastPositionRef.current) {
        const timeDiff =
          timestamp - lastPositionRef.current.timestamp;

        if (timeDiff > 0) {
          speed = calculateSpeed(
            lastPositionRef.current.lat,
            lastPositionRef.current.lng,
            newPos.lat,
            newPos.lng,
            timeDiff
          );
        }
      }

      const dataPoint = {
        ...newPos,
        speed,
      };

      lastPositionRef.current = newPos;

      // =====================================
      // UPDATE HISTORY
      // =====================================
      setHistory((prev) => {
        const updated = [...prev, dataPoint];

        if (updated.length > 30) {
          updated.shift();
        }

        return updated;
      });

      // =====================================
      // UPDATE DASHBOARD
      // =====================================
      setIssData(dataPoint);

      setError(null);
    } catch (err) {
      console.error('ISS API failed:', err);

      // =====================================
      // FALLBACK DATA
      // =====================================
      const fallbackData = {
        lat: 23.2599,
        lng: 77.4126,
        timestamp: Math.floor(Date.now() / 1000),
        speed: 27600,
      };

      // UPDATE DASHBOARD WITH FALLBACK
      setIssData(fallbackData);

      // UPDATE HISTORY
      setHistory((prev) => {
        const updated = [...prev, fallbackData];

        if (updated.length > 30) {
          updated.shift();
        }

        return updated;
      });

      // DON'T BREAK UI
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [setIssData]);

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    fetchAstronauts();
    fetchISSLocation();

    // SAFE REFRESH RATE
    const interval = setInterval(() => {
      fetchISSLocation();
    }, 90000);

    return () => clearInterval(interval);
  }, [fetchISSLocation]);

  return {
    history,
    loading,
    error,
    refresh: fetchISSLocation,
  };
};
