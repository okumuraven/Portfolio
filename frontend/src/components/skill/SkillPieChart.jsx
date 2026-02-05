import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

// Utility to group skills by category
function getPieData(skills = []) {
  const counts = {};
  for (let skill of skills) {
    const cat = skill.category || 'Other';
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

const COLORS = [
  '#4f8ef7', // Blue
  '#4ff7a3', // Green
  '#af4ff7', // Purple
  '#ffe066', // Yellow
  '#ee4f6c', // Red
  '#54e5ee', // Cyan
  '#f7c24f', // Orange
  '#888888', // Gray
];

export default function SkillPieChart({ skills = [] }) {
  const data = getPieData(skills);

  if (!data.length) return <div>No skills to visualize.</div>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={110}
            dataKey="value"
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip formatter={(v, n) => [v, n]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}