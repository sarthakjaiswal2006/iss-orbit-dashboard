import { useISSTracking } from '../../hooks/useISSTracking';
import { Card } from '../UI/components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';

export const SpeedChart = () => {
  const { history } = useISSTracking();

  const data = history.map(item => ({
    time: format(new Date(item.timestamp * 1000), 'HH:mm:ss'),
    speed: Math.round(item.speed)
  }));

  return (
    <Card className="h-[300px] flex flex-col gap-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Activity className="text-neon-blue" /> ISS Speed History
      </h2>
      <div className="w-full h-[220px] text-xs">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#151532', borderColor: '#3D3D8A', borderRadius: '8px', color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="speed" 
                stroke="#00F0FF" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Waiting for data...
          </div>
        )}
      </div>
    </Card>
  );
};
