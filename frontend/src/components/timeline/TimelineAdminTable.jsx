// src/components/timeline/TimelineAdminTable.jsx
import React, { useState } from 'react';
import TimelineEventForm from '../forms/TimelineEventForm';
import styles from './TimelineAdminTable.module.css'; // Import styles

const TimelineAdminTable = ({ items = [], onEdit, onDelete, loadingIds = {} }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState(null);

  function startEdit(item) {
    setEditingId(item.id);
    setEditValues(item);
  }
  
  function stopEdit() {
    setEditingId(null);
    setEditValues(null);
  }
  
  function handleEditSubmit(values) {
    onEdit({ id: editingId, ...values });
    stopEdit();
  }

  // Simple date formatter to keep logs clean
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (!items.length) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.emptyState}>[ NO_TIMELINE_EVENTS_FOUND ]</div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Init Date</th>
            <th>Visibility</th>
            <th>Review Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            editingId === item.id ? (
              // --- INLINE EDIT MODE ---
              <tr key={item.id} className={styles.editRow}>
                <td colSpan={6} className={styles.editCell}>
                  {/* Notice we pass stopEdit directly to onCancel! */}
                  <TimelineEventForm
                    initialValues={editValues}
                    onSubmit={handleEditSubmit}
                    loading={loadingIds.updating}
                    submitText="UPDATE_RECORD"
                    onCancel={stopEdit} 
                  />
                </td>
              </tr>
            ) : (
              // --- STANDARD DISPLAY MODE ---
              <tr key={item.id}>
                <td data-label="Title" className={styles.cellTitle}>
                  {item.title}
                </td>
                
                <td data-label="Type" className={styles.cellType}>
                  {item.type || '—'}
                </td>
                
                <td data-label="Init Date" style={{fontFamily: 'monospace'}}>
                  {formatDate(item.date_start)}
                </td>
                
                <td data-label="Visibility">
                  <span className={styles.statusBadge}>
                    <span className={`${styles.dot} ${item.visible ? styles.active : styles.inactive}`}></span>
                    {item.visible ? 'PUBLIC' : 'HIDDEN'}
                  </span>
                </td>
                
                <td data-label="Review Status">
                  <span className={styles.statusBadge}>
                    <span className={`${styles.dot} ${item.reviewed ? styles.reviewed : styles.pending}`}></span>
                    {item.reviewed ? 'VERIFIED' : 'PENDING'}
                  </span>
                </td>
                
                <td data-label="Actions">
                  <button 
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    onClick={() => startEdit(item)} 
                    disabled={loadingIds.updating || loadingIds.deleting}
                  >
                    EDIT
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => {
                      if(window.confirm('[ WARNING ]: Confirm deletion of this event record?')) {
                        onDelete(item.id);
                      }
                    }}
                    disabled={loadingIds.updating || loadingIds.deleting}
                  >
                    DEL
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimelineAdminTable;