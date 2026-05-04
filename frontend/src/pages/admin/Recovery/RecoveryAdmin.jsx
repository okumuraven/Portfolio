import React, { useState, useEffect } from 'react';
import { useRecovery } from '../../../features/recovery/useRecovery';
import styles from './RecoveryAdmin.module.css';

const SobrietyClock = ({ lastReset }) => {
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculate = () => {
      const start = new Date(lastReset);
      const now = new Date();
      const diff = now - start;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setElapsed({ days, hours, minutes, seconds });
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [lastReset]);

  const getStatusColor = () => {
    if (elapsed.days < 7) return '#ff3333'; // Critical
    if (elapsed.days < 30) return '#ffcc00'; // Warning
    if (elapsed.days < 90) return '#00ccff'; // Stable
    return '#00ff00'; // Optimal
  };

  return (
    <div className={styles.clockTime} style={{ color: getStatusColor(), textShadow: `0 0 10px ${getStatusColor()}88` }}>
      {elapsed.days}d {String(elapsed.hours).padStart(2, '0')}h{' '}
      {String(elapsed.minutes).padStart(2, '0')}m{' '}
      {String(elapsed.seconds).padStart(2, '0')}s
    </div>
  );
};

const RecoveryAdmin = () => {
  const {
    status,
    isLoading,
    logUrge,
    isLoggingUrge,
    resetStreak,
    isResetting,
    panic,
    isPanicking,
    addReason,
    removeReason
  } = useRecovery();

  const [urgeForm, setUrgeForm] = useState({ intensity: 5, context: '', notes: '' });
  const [newReason, setNewReason] = useState('');
  const [redirection, setRedirection] = useState(null);

  const handleLogUrge = async (e) => {
    e.preventDefault();
    await logUrge(urgeForm);
    setUrgeForm({ intensity: 5, context: '', notes: '' });
    alert('Urge telemetry logged. Stay vigilant.');
  };

  const handlePanic = async () => {
    setRedirection('ANALYZING THREAT... INITIALIZING REDIRECTION PROTOCOL...');
    try {
      const res = await panic();
      setRedirection(res.data.redirection);
    } catch (err) {
      setRedirection('CONNECTION ERROR. FOCUS ON BREATH. YOU ARE IN CONTROL.');
    }
  };

  const handleReset = async () => {
    if (window.confirm('PROTOCOL WARNING: Are you sure you want to reset the streak? This will log a relapse.')) {
      const notes = window.prompt('Provide a post-incident report (optional):');
      await resetStreak({ notes });
    }
  };

  if (isLoading) return <div className={styles.container}>INITIALIZING RECOVERY SYSTEMS...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Recovery_Expert_System v1.0</h1>
      </header>

      <div className={styles.grid}>
        {/* SOBRIETY CLOCK */}
        <div className={`${styles.card} ${styles.clockCard}`}>
          <div className={styles.clockTitle}>Current Uptime Streak</div>
          <SobrietyClock lastReset={status?.streak?.last_reset_at} />
          <button 
            className={styles.panicButton} 
            onClick={handlePanic}
            disabled={isPanicking}
          >
            {isPanicking ? 'EXECUTING REDIRECTION...' : 'OVERRIDE PROTOCOL (PANIC)'}
          </button>
          
          {redirection && (
            <div className={styles.redirection}>
              <strong>[VIRTUAL_OPERATIVE_AI]:</strong>
              <p>{redirection}</p>
              <button onClick={() => setRedirection(null)} className={styles.button} style={{marginTop: '1rem', fontSize: '0.7rem'}}>Close Protocol</button>
            </div>
          )}
        </div>

        {/* TRIGGER TELEMETRY */}
        <div className={styles.card}>
          <h3>TRIGGER_TELEMETRY_LOG</h3>
          <form onSubmit={handleLogUrge}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Urge Intensity (1-10)</label>
              <input 
                type="range" min="1" max="10" 
                className={styles.input} 
                value={urgeForm.intensity}
                onChange={(e) => setUrgeForm({...urgeForm, intensity: parseInt(e.target.value)})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Context / Environment</label>
              <input 
                type="text" className={styles.input} placeholder="e.g. Stress at work, Home alone" 
                value={urgeForm.context}
                onChange={(e) => setUrgeForm({...urgeForm, context: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Behavioral Notes</label>
              <textarea 
                className={styles.textarea} rows="3"
                value={urgeForm.notes}
                onChange={(e) => setUrgeForm({...urgeForm, notes: e.target.value})}
              />
            </div>
            <button className={styles.button} disabled={isLoggingUrge}>
              {isLoggingUrge ? 'LOGGING...' : 'COMMIT TELEMETRY'}
            </button>
          </form>
        </div>

        {/* CORE MOTIVATION (REASONS) */}
        <div className={styles.card}>
          <h3>STRATEGIC_OBJECTIVES (REASONS)</h3>
          <ul className={styles.reasonsList}>
            {status?.reasons?.map(reason => (
              <li key={reason.id} className={styles.reasonItem}>
                <span>{reason.content}</span>
                <button className={styles.deleteBtn} onClick={() => removeReason(reason.id)}>X</button>
              </li>
            ))}
          </ul>
          <div className={styles.formGroup} style={{marginTop: '1rem'}}>
            <input 
              type="text" className={styles.input} placeholder="Add new objective..." 
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (addReason({content: newReason}), setNewReason(''))}
            />
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className={styles.card}>
          <h3>RECENT_INCIDENT_LOGS</h3>
          <div className={styles.logs}>
            {status?.recent_logs?.map(log => (
              <div key={log.id} className={styles.logEntry}>
                <span className={styles.logMeta}>{new Date(log.created_at).toLocaleString()}</span>
                <div>
                  <strong>{log.type}</strong> 
                  {log.intensity && ` (Level ${log.intensity})`}
                  {log.trigger_context && ` - ${log.trigger_context}`}
                </div>
                {log.notes && <div className={styles.logMeta}>{log.notes}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM RESET */}
        <div className={`${styles.card}`} style={{borderColor: '#ff0000'}}>
          <h3>SYSTEM_FAILURE_PROCEDURE</h3>
          <p style={{fontSize: '0.8rem', color: '#888'}}>
            Resetting the streak logs a relapse incident. Use only after a complete failure of the primary systems.
          </p>
          <button className={styles.button} style={{background: '#331111', color: '#ff3333'}} onClick={handleReset} disabled={isResetting}>
            {isResetting ? 'RESETTING...' : 'INITIATE SYSTEM RESET'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryAdmin;
