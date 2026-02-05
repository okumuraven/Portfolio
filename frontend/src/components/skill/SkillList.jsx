import React from 'react';
import SkillBadge from './SkillBadge';

/**
 * @param {Array} skills - Array of skill objects
 * @param {Boolean} showCategory - Show category label before skills (default: false)
 * @param {Function} onSelect - Callback when a skill is clicked (optional, for interactivity)
 */
export default function SkillList({ skills = [], showCategory = false, onSelect }) {
  if (!Array.isArray(skills) || skills.length === 0) {
    return <div>No skills to show.</div>;
  }

  return (
    <div className="skill-list">
      {showCategory ? (
        Object.entries(skills.reduce((acc, s) => {
          const cat = s.category || 'Other';
          acc[cat] = acc[cat] || [];
          acc[cat].push(s);
          return acc;
        }, {}))
          .map(([category, catSkills]) => (
            <div key={category} className="skill-category-group">
              <span className="category-label">{category}:</span>
              {catSkills.map(skill => (
                <SkillBadge
                  key={skill.id}
                  skill={skill}
                  onClick={onSelect ? () => onSelect(skill) : undefined}
                  style={{ cursor: onSelect ? 'pointer' : 'auto' }}
                />
              ))}
            </div>
          ))
      ) : (
        skills.map(skill => (
          <SkillBadge
            key={skill.id}
            skill={skill}
            onClick={onSelect ? () => onSelect(skill) : undefined}
            style={{ cursor: onSelect ? 'pointer' : 'auto' }}
          />
        ))
      )}
    </div>
  );
}