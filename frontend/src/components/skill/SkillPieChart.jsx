// src/pages/public/SkillMatrix/SkillPieChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './SkillPieChart.module.css';

// 1. Data Processor
function getPieData(skills = []) {
  const counts = {};
  skills.forEach(skill => {
    // Normalize category: Title case or upper case consistency
    const cat = skill.category ? skill.category.trim() : 'Other';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  
  // Sort by value (highest first) for visual cleanlines
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

// 2. Professional "Cyber" Palette (Matches your site)
const CYBER_PALETTE = [
  '#00ff88', // Cyber Green (Primary)
  '#00e5ff', // Cyan (Frontend)
  '#ff5500', // System Orange (Backend/Admin)
  '#ab47bc', // Purple (Tools)
  '#ffd700', // Gold (Superpowers)
  '#ff0055', // Red (Security)
  '#ffffff', // White (General)
  '#444444', // Grey (Misc)
];

// 3. Custom Tooltip Component (Dark Mode)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className={styles.customTooltip}>
        <span className={styles.tooltipLabel}>{data.name}</span>
        <span className={styles.tooltipValue}>
          {data.value} NODE{data.value > 1 ? 'S' : ''}
        </span>
      </div>
    );
  }
  return null;
};

export default function SkillPieChart({ skills = [] }) {
  const data = getPieData(skills);
  const totalSkills = skills.length;

  if (!data.length) return null;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>{'// SKILL_DISTRIBUTION_METRICS'}</div>

      {/* The Chart */}
      <div style={{ width: '100%', height: 300, position: 'relative' }}>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}  // Makes it a Donut
              outerRadius={100} // Thin, elegant ring
              paddingAngle={5}  // Gaps between sections
              dataKey="value"
              stroke="none"     // Remove default white border
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CYBER_PALETTE[index % CYBER_PALETTE.length]} 
                  stroke="rgba(0,0,0,0)" // Transparent stroke
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label (The "Donut Hole" Content) */}
        <div className={styles.centerLabel}>
          <span className={styles.totalCount}>{totalSkills}</span>
          <span className={styles.totalText}>TOTAL NODES</span>
        </div>
      </div>

      {/* Custom Legend (Below Chart) */}
      <div className={styles.legendContainer}>
        {data.map((entry, index) => (
          <div key={entry.name} className={styles.legendItem}>
            <span 
              className={styles.legendDot} 
              style={{ 
                backgroundColor: CYBER_PALETTE[index % CYBER_PALETTE.length],
                boxShadow: `0 0 6px ${CYBER_PALETTE[index % CYBER_PALETTE.length]}`
              }} 
            />
            {entry.name} ({Math.round((entry.value / totalSkills) * 100)}%)
          </div>
        ))}
      </div>
    </div>
  );
}