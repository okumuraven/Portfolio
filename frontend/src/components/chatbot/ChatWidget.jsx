import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getChatbotStatus } from '../../api/chatbot.api';
import styles from './ChatWidget.module.css';
import Typewriter from '../feedback/Typewriter';

// A magnifying glass — the same "detective tool" mark used on the
// RedactedLink tabs elsewhere, so the widget reads as part of the case
// board rather than a leftover terminal-era icon (the old FontAwesome
// robot glyph never rendered — that font was never loaded on this site).
function MagnifierIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="10" cy="10" r="6" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" />
    </svg>
  );
}

// Parses the contact link lines from AI responses and renders them as tab buttons.
// Matches: - [LABEL](URL)
const CONTACT_LINK_RE = /^-\s+\[([^\]]+)\]\(([^)]+)\)$/;

// Splits bold markdown **text** into <strong> elements
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function AiMessageContent({ content, isNew }) {
  const [showFull, setShowFull] = useState(!isNew);

  if (!showFull) {
    return (
      <Typewriter 
        text={content} 
        speed={10} 
        onComplete={() => setShowFull(true)} 
      />
    );
  }

  const lines = content.split('\n');
  const elements = [];
  const contactLinks = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Detect contact link lines
    const contactMatch = trimmed.match(CONTACT_LINK_RE);
    if (contactMatch) {
      contactLinks.push({ label: contactMatch[1], href: contactMatch[2] });
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      elements.push(<h4 key={idx} className={styles.msgHeading}>{renderInline(trimmed.slice(4))}</h4>);
      return;
    }

    // Bullet points
    if (/^[*-]\s+/.test(trimmed)) {
      elements.push(<li key={idx} className={styles.msgBullet}>{renderInline(trimmed.replace(/^[*-]\s+/, ''))}</li>);
      return;
    }

    // Paragraphs
    if (trimmed) {
      elements.push(<p key={idx} className={styles.msgPara}>{renderInline(trimmed)}</p>);
    }
  });

  return (
    <>
      {elements}
      {contactLinks.length > 0 && (
        <div className={styles.contactTabs}>
          {contactLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.contactTab} ink`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // The professional, tactical greeting
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      isNew: false,
      content: "Case consultant standing by. I'm briefed on Okumu Joseph's full file — ask about his operational capacity, stack experience, or deployment costs."
    }
  ]);

  useEffect(() => {
    getChatbotStatus()
      .then(res => setIsActive(res.is_active))
      .catch(() => setIsActive(false));
  }, []);

  // Auto-scroll to the bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const newHistory = [...messages, { role: 'user', content: userMessage, isNew: false }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const res = await sendChatMessage(userMessage, messages.map(({role, content}) => ({role, content})));
      if (res && res.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: res.reply, isNew: true }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        isNew: true,
        content: "ERR_LINE_DOWN: Couldn't reach the case file right now. Try again, or reach out directly on the Contact page."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className={styles.widgetContainer}>
      {!isOpen ? (
        <div className={styles.triggerWrapper}>
          <div className={`${styles.helpPrompt} ink`}>
            <span>GOT A LEAD ON THIS CASE?</span>
          </div>
          <button className={styles.bubbleBtn} onClick={() => setIsOpen(true)}>
            <div className={styles.iconCircle}>
              <MagnifierIcon className={styles.triggerIcon} />
            </div>
            <span className={`${styles.bubbleLabel} ink`}>CASE_CONSULTANT</span>
            <span className={styles.ping}></span>
          </button>
        </div>
      ) : (
        <div className={`${styles.chatWindow} newsprintTexture`}>
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.headerPulse} />
              <div className={styles.headerMeta}>
                <h4 className={`${styles.headerTitle} ink`}>CASE CONSULTANT // UPLINK</h4>
                <span className={`${styles.headerSub} ink`}>ENCRYPTION: AES-256_ACTIVE</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <span className={`${styles.statusBadge} ink`}>ONLINE</span>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)} title="Close File">×</button>
            </div>
          </div>

          <div className={styles.chatBody}>
            <div className={`${styles.systemLog} ink`}>
              [CASE_LOG] Secure line established...<br/>
              [CASE_LOG] Consultant standing by.
            </div>

            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.msgWrapper} ${msg.role === 'ai' ? styles.ai : styles.user}`}>
                <div className={styles.msgMetadata}>
                  <span className={`${styles.msgLabel} ink`}>
                    {msg.role === 'ai' ? 'CONSULTANT' : 'YOU'}
                  </span>
                  <span className={`${styles.msgTimestamp} ink`}>[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                </div>
                <div className={msg.role === 'ai' ? styles.msgAi : styles.msgUser}>
                  {msg.role === 'ai' ? (
                    <AiMessageContent content={msg.content} isNew={msg.isNew} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Loading state — kept local so it doesn't touch the shared
                InlineTacticalLoader used by the (unrelated) admin area */}
            {isLoading && (
              <div className={`${styles.loaderWrapper} ink`}>
                <span className={styles.loaderDot} />
                PULLING AN ANSWER FROM THE FILE...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className={styles.chatFooter}>
            <div className={styles.inputWrapper}>
              <span className={`${styles.inputPrefix} ink`}>&gt;_</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the case..."
                className={`${styles.chatInput} ink`}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
            <button type="submit" disabled={isLoading || !input.trim()} className={`${styles.sendBtn} ink`}>
              SEND
            </button>
          </form>
        </div>
      )}
    </div>
  );
}