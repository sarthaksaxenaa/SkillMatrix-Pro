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
    <div className="glass-card p-6 w-full h-[400px] mb-8">
      <h3 className="text-xl font-bold text-slate-200 mb-6 border-l-4 border-indigo-500 pl-3 uppercase tracking-wider">
        Skill Growth Analysis
      </h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15,15,30,0.9)',
              color: '#f1f5f9',
              fontWeight: 600
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 600 }} />

          <Line
            type="monotone"
            dataKey="Average"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, stroke: '#050510' }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="You"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, stroke: '#050510' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;