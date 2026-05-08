import { Navbar } from '../components/Layout/Navbar';
import { ISSTrackerMap } from '../components/ISS/ISSTrackerMap';
import { AstronautsList } from '../components/ISS/AstronautsList';
import { NewsDashboard } from '../components/News/NewsDashboard';
import { SpeedChart } from '../components/Charts/SpeedChart';
import { NewsChart } from '../components/Charts/NewsChart';
import { Chatbot } from '../components/Chatbot/Chatbot';
import { Toaster } from 'react-hot-toast';

export const Dashboard = () => {
  return (
    <div className="min-h-screen pb-10 font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-6 flex flex-col gap-6">
        {/* Top Row: Map and Speed Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ISSTrackerMap />
          </div>
          <div className="flex flex-col gap-6">
            <SpeedChart />
            <AstronautsList />
          </div>
        </div>

        {/* Bottom Row: News and News Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NewsDashboard />
          </div>
          <div>
            <NewsChart />
          </div>
        </div>
      </main>

      <Chatbot />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'dark:bg-space-800 dark:text-white',
        }}
      />
    </div>
  );
};
