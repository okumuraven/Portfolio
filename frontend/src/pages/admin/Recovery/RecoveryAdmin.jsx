import React, { useState, useEffect, useRef } from 'react';
import { useRecovery } from '../../../features/recovery/useRecovery';
import styles from './RecoveryAdmin.module.css';
import TerminalLoader from '../../../components/feedback/TerminalLoader';
import InlineTacticalLoader from '../../../components/feedback/InlineTacticalLoader';
import Typewriter from '../../../components/feedback/Typewriter';

const SobrietyClock = ({ lastReset }) => {
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!lastReset) return;

    const calculate = () => {
      const start = new Date(lastReset);
      const now = new Date();
      const diff = Math.max(0, now - start);

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
    if (!lastReset) return '#555';
    if (elapsed.days < 7) return '#ff3333'; // Critical
    if (elapsed.days < 30) return '#ffcc00'; // Warning
    if (elapsed.days < 90) return '#00ccff'; // Stable
    return '#00ff00'; // Optimal
  };

  const color = getStatusColor();

  return (
    <div className={styles.clockContainer}>
      <div className={styles.clockTime} style={{ color, textShadow: `0 0 20px ${color}33` }}>
        <div className={styles.clockUnit}>
          <span className={styles.clockValue}>{elapsed.days}</span>
          <span className={styles.clockLabel}>Days</span>
        </div>
        <div className={styles.clockSeparator}>:</div>
        <div className={styles.clockUnit}>
          <span className={styles.clockValue}>{String(elapsed.hours).padStart(2, '0')}</span>
          <span className={styles.clockLabel}>Hrs</span>
        </div>
        <div className={styles.clockSeparator}>:</div>
        <div className={styles.clockUnit}>
          <span className={styles.clockValue}>{String(elapsed.minutes).padStart(2, '0')}</span>
          <span className={styles.clockLabel}>Min</span>
        </div>
        <div className={styles.clockSeparator}>:</div>
        <div className={styles.clockUnit}>
          <span className={styles.clockValue}>{String(elapsed.seconds).padStart(2, '0')}</span>
          <span className={styles.clockLabel}>Sec</span>
        </div>
      </div>
      <div className={styles.statusIndicator}>
        <div className={styles.statusDot} style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
        <span className={styles.statusText}>SYSTEM_STATUS: {elapsed.days < 7 ? 'CRITICAL_VULNERABILITY' : 'NOMINAL_STABILITY'}</span>
      </div>
    </div>
  );
};

const RecoveryAdmin = () => {
  const {
    status,
    isLoading,
    isPlaceholderData,
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
  
  // UX State: Control the initial full-screen terminal loader
  const [hasInitialized, setHasInitialized] = useState(false);

  // Chat state
  const chatEndRef = useRef(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Recovery_Sentinel v1.0 online. Private tactical channel secured. How can I assist with your recovery architecture today?', isNew: false }
  ]);

  // Handle loader completion
  const handleLoaderComplete = () => {
    setHasInitialized(true);
  };

  // Auto-scroll effect
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatting]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg = { role: 'user', content: chatInput, isNew: false };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');

    try {
      const res = await chat({ message: chatInput, history: chatHistory.map(({role, content}) => ({role, content})) });
      setChatHistory(prev => [...prev, { role: 'ai', content: res.data.response, isNew: true }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'SYSTEM ERROR: Failed to reach AI Agent. Maintain core stability.', isNew: true }]);
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

  // Improved stability logic:
  // Only show TerminalLoader if we haven't initialized AND (loading or no status)
  if (!hasInitialized && (isLoading || !status)) {
    return <TerminalLoader onComplete={handleLoaderComplete} />;
  }

  return (
    <div className={`${styles.container} ${isPlaceholderData ? styles.revalidating : ''}`}>
      <div className={styles.scanline} />
      
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>R</span>
            <h1 className={styles.title}>Recovery_Expert_System</h1>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.version}>v1.0.4_STABLE</span>
            <span className={styles.divider}>|</span>
            <span className={styles.sessionInfo}>SECURE_SESSION: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        {/* SOBRIETY CLOCK */}
        <div className={`${styles.card} ${styles.clockCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator}></span>
            <h3>CORE_UPTIME_TELEMETRY</h3>
          </div>
          <SobrietyClock lastReset={status?.streak?.last_reset_at} />
          <div className={styles.panicActions}>
            <button 
              className={styles.panicButton} 
              onClick={handlePanic}
              disabled={isPanicking}
            >
              {isPanicking ? 'EXECUTING REDIRECTION...' : 'OVERRIDE PROTOCOL (PANIC)'}
            </button>
          </div>
          
          {redirection && (
            <div className={styles.redirection}>
              <div className={styles.redirectionHeader}>
                <span className={styles.alertIcon}>!</span>
                <strong>VIRTUAL_OPERATIVE_AI REDIRECTION</strong>
              </div>
              <div className={styles.redirectionBody}>
                {isPanicking ? (
                  <InlineTacticalLoader message="ANALYZING THREAT VECTORS..." />
                ) : (
                  <>
                    <div className={styles.redirectionText}>
                      <Typewriter text={redirection} speed={10} />
                    </div>
                    <button onClick={() => setRedirection(null)} className={styles.closeBtn}>ACKNOWLEDGE & CLOSE</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* AI RECOVERY SENTINEL CHAT */}
        <div className={`${styles.card} ${styles.chatCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <span className={styles.cardIndicator} style={{backgroundColor: '#00ff00'}}></span>
              <h3>SENTINEL_AI (TACTICAL_ADVISOR)</h3>
            </div>
            <span className={styles.chatStatus}>ENCRYPTED_LINK_ACTIVE</span>
          </div>
          <div className={styles.chatMessages}>
            {chatHistory.map((msg, i) => (
              <div key={i} className={`${styles.message} ${msg.role === 'ai' ? styles.aiMessage : styles.userMessage}`}>
                <div className={styles.messageLabel}>{msg.role === 'ai' ? 'SENTINEL' : 'OPERATIVE'}</div>
                <div className={styles.messageContent}>
                  {msg.role === 'ai' && msg.isNew ? (
                    <Typewriter text={msg.content} speed={15} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isChatting && <InlineTacticalLoader />}
            <div ref={chatEndRef} />
          </div>
          <form className={styles.chatInputArea} onSubmit={handleChat}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputPrompt}>&gt;</span>
              <input 
                type="text" 
                className={styles.chatInput} 
                placeholder="Query specialized recovery advisor..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isChatting}
              />
            </div>
            <button type="submit" className={styles.chatSendBtn} disabled={isChatting}>
              EXEC
            </button>
          </form>
        </div>

        {/* TRIGGER TELEMETRY */}
        <div className={`${styles.card} ${styles.telemetryCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator} style={{backgroundColor: '#ffaa00'}}></span>
            <h3>TRIGGER_TELEMETRY_LOG</h3>
          </div>
          <form onSubmit={handleLogUrge} className={styles.telemetryForm}>
            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Urge Intensity</label>
                <span className={styles.intensityValue}>LVL_{urgeForm.intensity}</span>
              </div>
              <input 
                type="range" min="1" max="10" 
                className={styles.rangeInput} 
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
                className={styles.textarea} rows="2"
                placeholder="Briefly describe thoughts or triggers..."
                value={urgeForm.notes}
                onChange={(e) => setUrgeForm({...urgeForm, notes: e.target.value})}
              />
            </div>
            <button className={styles.commitBtn} disabled={isLoggingUrge}>
              {isLoggingUrge ? 'COMMITTING...' : 'COMMIT_TELEMETRY'}
            </button>
          </form>
        </div>

        {/* CORE MOTIVATION (REASONS) */}
        <div className={`${styles.card} ${styles.objectivesCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator} style={{backgroundColor: '#00aaff'}}></span>
            <h3>STRATEGIC_OBJECTIVES</h3>
          </div>
          <div className={styles.reasonsContainer}>
            <ul className={styles.reasonsList}>
              {status?.reasons?.map(reason => (
                <li key={reason.id} className={styles.reasonItem}>
                  <span className={styles.reasonText}>{reason.content}</span>
                  <button className={styles.deleteBtn} onClick={() => removeReason(reason.id)}>DEL</button>
                </li>
              ))}
            </ul>
            <div className={styles.addReasonBox}>
              <input 
                type="text" className={styles.input} placeholder="Add new objective..." 
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (addReason({content: newReason}), setNewReason(''))}
              />
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className={`${styles.card} ${styles.recentLogsCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator}></span>
            <h3>RECENT_INCIDENT_LOGS</h3>
          </div>
          <div className={styles.logs}>
            {status?.recent_logs?.map(log => (
              <div key={log.id} className={styles.logEntry}>
                <div className={styles.logHeader}>
                  <span className={styles.logType}>[{log.type}]</span>
                  <span className={styles.logMeta}>{new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {" // "} {new Date(log.created_at).toLocaleDateString()}</span>
                </div>
                <div className={styles.logBody}>
                  {log.intensity && <span className={styles.logIntensity}>LVL_{log.intensity}</span>}
                  {log.trigger_context && <span className={styles.logContext}>@{log.trigger_context}</span>}
                  {log.notes && <p className={styles.logNotes}>&quot;{log.notes}&quot;</p>}
                </div>
              </div>
            ))}
            {(!status?.recent_logs || status.recent_logs.length === 0) && (
              <div className={styles.emptyLogs}>NO_RECENT_TELEMETRY_AVAILABLE</div>
            )}
          </div>
        </div>

        {/* SYSTEM RESET */}
        <div className={`${styles.card} ${styles.resetCard}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIndicator} style={{backgroundColor: '#ff0000'}}></span>
            <h3>FAILURE_PROCEDURE</h3>
          </div>
          <p className={styles.resetWarning}>
            WARNING: Resetting the streak logs a RELAPSE incident. Use only after a complete failure of primary systems.
          </p>
          <button className={styles.resetButton} onClick={handleReset} disabled={isResetting}>
            {isResetting ? 'EXECUTING RESET...' : 'INITIATE_SYSTEM_RESET'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryAdmin;
