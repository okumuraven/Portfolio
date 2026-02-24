import React, { useState } from 'react';
import TimelineEventForm from '../forms/TimelineEventForm';

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

  if (!items.length) {
    return <div>No timeline events found.</div>;
  }

  return (
    <table className="timeline-admin-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Start Date</th>
          <th>Visible</th>
          <th>Reviewed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          editingId === item.id ? (
            <tr key={item.id}>
              <td colSpan={6}>
                <TimelineEventForm
                  initialValues={editValues}
                  onSubmit={handleEditSubmit}
                  loading={loadingIds.updating}
                  submitText="Update"
                />
                <button type="button" onClick={stopEdit} style={{ marginTop: 8 }}>
                  Cancel
                </button>
              </td>
            </tr>
          ) : (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.type}</td>
              <td>{item.date_start}</td>
              <td>{item.visible ? 'Yes' : 'No'}</td>
              <td>{item.reviewed ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => startEdit(item)} disabled={loadingIds.updating}>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  disabled={loadingIds.deleting}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );
};

export default TimelineAdminTable;