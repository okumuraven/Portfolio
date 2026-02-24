import React from 'react';
import TimelineEventForm from '../forms/TimelineEventForm';
import styles from './TimelineForm.module.css';

const TimelineForm = ({
  mode = 'create',
  initialValues,
  onSubmit,
  isLoading = false,
  onCancel,
  extraFields
}) => {
  // Debug wrapper
  const debugOnSubmit = data => {
    console.log('[DEBUG] TimelineForm onSubmit called with:', data);
    if (typeof onSubmit === "function") onSubmit(data);
    else console.warn('onSubmit prop in TimelineForm not a function!');
  };

  return (
    <div className={styles.formPanel}>
      <h3 className={styles.panelHeader}>
        {mode === 'edit' ? 'MODIFY_EVENT_RECORD' : 'INITIALIZE_NEW_EVENT'}
      </h3>
      <TimelineEventForm
        initialValues={initialValues}
        onSubmit={debugOnSubmit}
        loading={isLoading}
        submitText={mode === 'edit' ? 'UPDATE_RECORD' : 'DEPLOY_EVENT'}
        onCancel={onCancel}
        extraFields={extraFields}
      />
    </div>
  );
};

export default TimelineForm;