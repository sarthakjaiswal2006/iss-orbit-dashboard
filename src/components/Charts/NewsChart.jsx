import { useDashboard } from '../../context/DashboardContext';
import { Card } from '../UI/components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#00F0FF', '#B000FF', '#FF0055', '#00FF88', '#FFaa00', '#4444FF'];

export const NewsChart = () => {
  const { news } = useDashboard();

  // Aggregate news by source
  const sourceCount = news.reduce((acc, article) => {
    acc[article.news_site] = (acc[article.news_site] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(sourceCount).map(key => ({
    name: key,
    value: sourceCount[key]
  }));

  return (
    <Card className="h-[300px] flex flex-col gap-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <PieChartIcon className="text-neon-purple" /> News Sources
      </h2>
      <div className="w-full h-[220px] text-xs">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#151532', borderColor: '#3D3D8A', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
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
