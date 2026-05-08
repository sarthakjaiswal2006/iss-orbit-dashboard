import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useISSTracking } from '../../hooks/useISSTracking';
import { Card, Loader } from '../UI/components';
import { Rocket, RefreshCw, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

// Custom ISS Icon
const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

// Component to recenter map when ISS moves
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom(), {
        animate: true,
        duration: 1
      });
    }
  }, [position, map]);
  return null;
};

export const ISSTrackerMap = () => {
  const { history, loading, error, refresh } = useISSTracking();
  
  if (loading && history.length === 0) return <Card className="h-[500px]"><Loader /></Card>;
  
  if (error) {
    return (
      <Card className="h-[500px] flex flex-col items-center justify-center text-center gap-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-semibold">{error}</p>
        <button 
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </Card>
    );
  }

  const currentPos = history[history.length - 1];
  const positions = history.map(p => [p.lat, p.lng]);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Rocket className="text-neon-blue" /> Live ISS Tracker
        </h2>
        <button 
          onClick={refresh}
          className="p-2 rounded-full bg-slate-100 dark:bg-space-700 hover:bg-slate-200 dark:hover:bg-space-600 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        <div className="p-3 bg-slate-100 dark:bg-space-700 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-400">Latitude</p>
          <p className="font-mono font-semibold">{currentPos?.lat.toFixed(4)}°</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-space-700 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-400">Longitude</p>
          <p className="font-mono font-semibold">{currentPos?.lng.toFixed(4)}°</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-space-700 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-400">Speed</p>
          <p className="font-mono font-semibold">{currentPos?.speed.toFixed(0)} km/h</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-space-700 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-400">Last Update</p>
          <p className="font-mono font-semibold">
            {currentPos ? format(new Date(currentPos.timestamp * 1000), 'HH:mm:ss') : '--'}
          </p>
        </div>
      </div>

      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-space-600 relative z-0">
        {currentPos && (
          <MapContainer 
            center={[currentPos.lat, currentPos.lng]} 
            zoom={4} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater position={currentPos} />
            <Polyline positions={positions} color="#00F0FF" weight={3} opacity={0.7} />
            <Marker position={[currentPos.lat, currentPos.lng]} icon={issIcon}>
              <Popup className="dark:bg-space-800 dark:text-white rounded-lg border-none">
                <div className="text-center">
                  <strong>ISS Location</strong><br/>
                  Lat: {currentPos.lat.toFixed(2)}<br/>
                  Lng: {currentPos.lng.toFixed(2)}<br/>
                  Speed: {currentPos.speed.toFixed(0)} km/h
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </Card>
  );
};
