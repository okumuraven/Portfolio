import React, { useState, useEffect, useRef } from 'react';
import { useRecovery } from '../../../features/recovery/useRecovery';
import styles from './RecoveryAdmin.module.css';

// ... (SobrietyClock component stays the same) ...

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
    removeReason,
    chat,
    isChatting
  } = useRecovery();

  const [urgeForm, setUrgeForm] = useState({ intensity: 5, context: '', notes: '' });
  const [newReason, setNewReason] = useState('');
  const [redirection, setRedirection] = useState(null);
  
  // Chat state
  const chatEndRef = useRef(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Recovery_Sentinel v1.0 online. Private tactical channel secured. How can I assist with your recovery architecture today?' }
  ]);

  // Auto-scroll effect
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatting]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');

    try {
      const res = await chat({ message: chatInput, history: chatHistory });
      setChatHistory(prev => [...prev, { role: 'ai', content: res.data.response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'SYSTEM ERROR: Failed to reach AI Agent. Maintain core stability.' }]);
    }
  };

  const handleLogUrge = async (e) => {
    e.preventDefault();
    await logUrge(urgeForm);
    setUrgeForm({ intensity: 5, context: '', notes: '' });
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

  if (isLoading) return <div className={styles.loadingOverlay}>INITIALIZING RECOVERY SYSTEMS...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Recovery_Expert_System</h1>
          <span className={styles.version}>v1.0.4_STABLE</span>
        </div>
      </header>

      <div className={styles.grid}>
        {/* SOBRIETY CLOCK */}
        <div className={`${styles.card} ${styles.clockCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator}></span>
            <h3>CURRENT_UPTIME_STREAK</h3>
          </div>
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
              <div className={styles.redirectionHeader}>
                <span className={styles.alertIcon}>!</span>
                <strong>VIRTUAL_OPERATIVE_AI REDIRECTION</strong>
              </div>
              <p className={styles.redirectionText}>{redirection}</p>
              <button onClick={() => setRedirection(null)} className={styles.closeBtn}>ACKNOWLEDGE & CLOSE</button>
            </div>
          )}
        </div>

        {/* AI RECOVERY SENTINEL CHAT */}
        <div className={`${styles.card} ${styles.chatCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator} style={{backgroundColor: '#00ff00'}}></span>
            <h3>RECOVERY_SENTINEL_AI (TACTICAL_ADVISOR)</h3>
          </div>
          <div className={styles.chatMessages}>
            {chatHistory.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'ai' ? styles.aiMessage : styles.userMessage}`}>
                <div className={styles.messageLabel}>{msg.role === 'ai' ? 'SENTINEL' : 'OPERATIVE'}</div>
                {msg.content}
              </div>
            ))}
            {isChatting && <div className={styles.typing}>Sentinel is analyzing threat vectors...</div>}
            <div ref={chatEndRef} />
          </div>
          <form className={styles.chatInputArea} onSubmit={handleChat}>
            <input 
              type="text" 
              className={styles.chatInput} 
              placeholder="Query specialized recovery advisor..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatting}
            />
            <button type="submit" className={styles.chatSendBtn} disabled={isChatting}>
              EXEC
            </button>
          </form>
        </div>

        {/* TRIGGER TELEMETRY */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator} style={{backgroundColor: '#ffaa00'}}></span>
            <h3>TRIGGER_TELEMETRY_LOG</h3>
          </div>
          <form onSubmit={handleLogUrge}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Urge Intensity (1-10)</label>
              <div className={styles.rangeWrapper}>
                <input 
                  type="range" min="1" max="10" 
                  className={styles.input} 
                  value={urgeForm.intensity}
                  onChange={(e) => setUrgeForm({...urgeForm, intensity: parseInt(e.target.value)})}
                />
                <span className={styles.intensityValue}>{urgeForm.intensity}</span>
              </div>
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
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator} style={{backgroundColor: '#00aaff'}}></span>
            <h3>STRATEGIC_OBJECTIVES (REASONS)</h3>
          </div>
          <ul className={styles.reasonsList}>
            {status?.reasons?.map(reason => (
              <li key={reason.id} className={styles.reasonItem}>
                <span>{reason.content}</span>
                <button className={styles.deleteBtn} onClick={() => removeReason(reason.id)}>DEL</button>
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
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator}></span>
            <h3>RECENT_INCIDENT_LOGS</h3>
          </div>
          <div className={styles.logs}>
            {status?.recent_logs?.map(log => (
              <div key={log.id} className={styles.logEntry}>
                <div className={styles.logHeader}>
                  <span className={styles.logType}>{log.type}</span>
                  <span className={styles.logMeta}>{new Date(log.created_at).toLocaleString()}</span>
                </div>
                <div className={styles.logContent}>
                  {log.intensity && <span className={styles.logIntensity}>LVL_{log.intensity}</span>}
                  {log.trigger_context && <span className={styles.logContext}>@{log.trigger_context}</span>}
                </div>
                {log.notes && <div className={styles.logNotes}>{log.notes}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* SYSTEM RESET */}
        <div className={`${styles.card} ${styles.resetCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator} style={{backgroundColor: '#ff0000'}}></span>
            <h3>SYSTEM_FAILURE_PROCEDURE</h3>
          </div>
          <p className={styles.resetWarning}>
            Resetting the streak logs a relapse incident. Use only after a complete failure of the primary systems.
          </p>
          <button className={styles.resetButton} onClick={handleReset} disabled={isResetting}>
            {isResetting ? 'EXECUTING RESET...' : 'INITIATE SYSTEM RESET'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryAdmin;
