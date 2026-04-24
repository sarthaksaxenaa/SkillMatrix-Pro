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
    <div className="surface p-6 w-full h-[400px]">
      <p className="label mb-6">Skill Growth Analysis</p>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717a', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: '#111113',
              color: '#fafafa',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#a1a1aa' }} />

          <Line
            type="monotone"
            dataKey="Average"
            stroke="#52525b"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, stroke: '#09090b', fill: '#52525b' }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="You"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2, stroke: '#09090b', fill: '#3b82f6' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;