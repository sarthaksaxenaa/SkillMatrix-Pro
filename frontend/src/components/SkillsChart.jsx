import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', You: 40, Average: 65 },
  { name: 'Feb', You: 45, Average: 55 },
  { name: 'Mar', You: 35, Average: 60 },
  { name: 'Apr', You: 50, Average: 58 },
  { name: 'May', You: 65, Average: 56 },
  { name: 'Jun', You: 55, Average: 45 },
  { name: 'Jul', You: 30, Average: 35 },
  { name: 'Aug', You: 60, Average: 55 },
  { name: 'Sep', You: 50, Average: 35 },
  { name: 'Oct', You: 80, Average: 75 },
  { name: 'Nov', You: 85, Average: 50 },
  { name: 'Dec', You: 60, Average: 40 },
];

const SkillsChart = () => {
  return (
    <div className="bg-white p-6 w-full h-[400px] mb-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-indigo-600 pl-3 uppercase tracking-wider">
        Skill Growth Analysis
      </h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="0" stroke="#e2e8f0" /> {/* Solid grid lines for sharpness */}
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} 
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '0px', 
              border: '2px solid #1e293b', 
              boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
              fontWeight: 'bold'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
          
          {/* Average Line (Green) */}
          <Line 
            type="linear" // "linear" makes it sharp, "monotone" makes it smooth
            dataKey="Average" 
            stroke="#65a30d" // Green
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
          
          {/* My Skills Line (Red) */}
          <Line 
            type="linear" 
            dataKey="You" 
            stroke="#dc2626" // Red
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;