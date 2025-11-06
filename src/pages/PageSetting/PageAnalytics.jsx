import React from 'react';
import { Search, ThumbsUp, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PageAnalytics = () => {
  const data = [
    { name: 'Likes', feb2024: 70, feb2025: 77 },
    { name: 'Comments', feb2024: 80, feb2025: 44 },
    { name: 'Save', feb2024: 41, feb2025: 89 },
    { name: 'Share', feb2024: 36, feb2025: 85 },
  ];

  return (
    
      <div className="bg-white rounded-xl p-3.5 px-9 border border-[#d3d1d1]">
        <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-2">
          Page Analytics
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mb-8">
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-3 pl-10 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-[#212121] placeholder-[#808080]"
            />
          </div>
          
          <div className='flex items-center gap-4'>
            <div className="flex items-center space-x-2 border-2 border-[#FF0707] rounded-3xl px-4 py-2">
              <ThumbsUp className="w-5 h-5 text-[#FF0707] fill-[#FF0707]" />
              <span className="text-[#FF0707] font-medium">25k+ Likes</span>
            </div>
            
            <Download className="w-6 h-6 text-[#808080] cursor-pointer hover:text-[#808080]" />
          </div>
        </div>

        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="none" stroke="transparent" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
              />
              
              {/* Feb 2024 (Blue) */}
              <Area
                type="monotone"
                dataKey="feb2024"
                stroke="#60a5fa"
                fill="#93c5fd"
                fillOpacity={0.6}
                strokeWidth={3}
                dot={{ fill: '#60a5fa', strokeWidth: 3, r: 6, stroke: 'white' }}
              />
              
              {/* Feb 2025 (Pink/Red) */}
              <Area
                type="monotone"
                dataKey="feb2025"
                stroke="#f87171"
                fill="#fca5a5"
                fillOpacity={0.6}
                strokeWidth={3}
                dot={{ fill: '#f87171', strokeWidth: 3, r: 6, stroke: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="border-t border-dashed border-gray-300 pt-4">
          <div className="flex justify-between items-center text-sm">
           
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span>Feb 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span>Feb 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default PageAnalytics;