import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getChatbotStatus } from '../../api/chatbot.api';
import styles from './ChatWidget.module.css';
import InlineTacticalLoader from '../feedback/InlineTacticalLoader';
import Typewriter from '../feedback/Typewriter';

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
              className={styles.contactTab}
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
      content: 'SYSTEM ONLINE. I am the Virtual Operative proxy for Okumu Joseph. State your query regarding operational capacity, stack experience, or deployment costs.'
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
        content: "ERR_CONNECTION_REFUSED: Uplink to main AI core failed. Please try again or use the Contact secure comms."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isActive) return null;

  return (
    <div className={styles.widgetContainer}>
      {!isOpen ? (
        <button className={styles.bubbleBtn} onClick={() => setIsOpen(true)}>
          <span className={styles.ping}></span>
          [ SYS.COMMS ]
        </button>
      ) : (
        <div className={styles.chatWindow}>
          <div className={styles.scanline} />

          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.headerStatusDot} />
              <h4 className={styles.headerTitle}>
                VIRTUAL_OPERATIVE <span>[ONLINE]</span>
              </h4>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} title="Close Terminal">×</button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.msgWrapper} ${msg.role === 'ai' ? styles.ai : styles.user}`}>
                <span className={styles.msgLabel}>
                  {msg.role === 'ai' ? 'SYS.AGENT //' : 'GUEST_USER //'}
                </span>
                <div className={msg.role === 'ai' ? styles.msgAi : styles.msgUser}>
                  {msg.role === 'ai' ? (
                    <AiMessageContent content={msg.content} isNew={msg.isNew} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Tactical Loading State */}
            {isLoading && (
              <div className={styles.loaderWrapper}>
                <InlineTacticalLoader />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className={styles.chatFooter}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputPrefix}>&gt;_</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Execute command or ask..."
                className={styles.chatInput}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
            <button type="submit" disabled={isLoading || !input.trim()} className={styles.sendBtn}>
              EXE
            </button>
          </form>
        </div>
      )}
    </div>
  );
}