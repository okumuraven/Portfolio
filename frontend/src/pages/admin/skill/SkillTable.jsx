// src/features/skills/SkillTable.jsx
import React from 'react';
import styles from './SkillTable.module.css';

export default function SkillTable({
  skills = [],
  onEdit,
  onDelete,
  loading = false
}) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Skill Name</th>
            <th>Category</th>
            <th>Proficiency</th>
            <th>Exp (Yrs)</th>
            <th>Status</th>
            <th>Superpower</th>
            <th>Sort Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Empty State */}
          {skills.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                {/* REGISTRY EMPTY: NO SKILL NODES FOUND */}
              </td>
            </tr>
          )}

          {/* Skill Rows */}
          {skills.map(skill => (
            <tr key={skill.id}>
              {/* Name */}
              <td>
                <span className={styles.skillName}>{skill.name}</span>
              </td>

              {/* Category */}
              <td>
                <span className={styles.categoryBadge}>{skill.category}</span>
              </td>

              {/* Level */}
              <td>{skill.level}</td>

              {/* Years */}
              <td>{skill.years || 0}y</td>

              {/* Active Status */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={`${styles.activeDot} ${skill.active ? styles.on : ''}`}></span>
                  <span style={{ fontSize: '0.8rem', color: skill.active ? '#fff' : '#666' }}>
                    {skill.active ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              </td>

              {/* Superpower */}
              <td>
                {skill.superpower && <span className={styles.superpower}>★</span>}
              </td>

              {/* Order */}
              <td style={{ fontFamily: 'monospace', color: '#666' }}>
                #{skill.order ?? "-"}
              </td>

              {/* Actions */}
              <td>
                <button
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  onClick={() => onEdit(skill)}
                  disabled={loading}
                >
                  [ EDIT ]
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => {
                    if (window.confirm(`WARNING: Deleting node "${skill.name}". Confirm?`)) {
                      onDelete(skill.id);
                    }
                  }}
                  disabled={loading}
                >
                  [ X ]
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}