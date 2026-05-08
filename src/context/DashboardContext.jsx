import { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [issData, setIssData] = useState(null);
  const [astronauts, setAstronauts] = useState([]);
  const [news, setNews] = useState([]);

  return (
    <DashboardContext.Provider value={{
      issData, setIssData,
      astronauts, setAstronauts,
      news, setNews
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
