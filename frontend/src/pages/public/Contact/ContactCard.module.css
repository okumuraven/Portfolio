/* src/pages/public/Contact/ContactCard.module.css */

.contactCard {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-left: 3px solid #00ff88; /* Neon Green Operative Line */
  padding: 3rem 4rem;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* --- AVATAR --- */
.avatarWrapper {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  border: 1px solid #333;
  object-fit: cover;
  filter: grayscale(20%) contrast(120%);
}

/* --- TEXT & HEADINGS --- */
.realName {
  font-family: 'Inter', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #fff;
  margin: 0.5rem 0 2rem 0;
  line-height: 1.1;
  word-wrap: break-word; /* Prevents overflow */
}

/* --- METADATA GRID (The Location/Directive block) --- */
.metadata {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Space between rows */
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px dashed #222;
}

.metaItem {
  display: flex;
  align-items: flex-start;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  color: #aaa;
  line-height: 1.5;
}

/* The Label (Left Side) */
.label {
  color: #666;
  width: 140px; /* Fixed width so all labels align perfectly on PC */
  flex-shrink: 0;
  text-transform: uppercase;
}

/* Specific Field Colors */
.coreDirective { color: #00e5ff; }

/* --- SUMMARIES --- */
.summary, .humanLayer {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #ccc;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.humanLayerLabel {
  display: block;
  font-family: 'Courier New', monospace;
  color: #888;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

/* --- PHILOSOPHY BOX --- */
.philosophy, .workPhilosophy {
  background: rgba(255, 85, 0, 0.03);
  border: 1px solid #1a1a1a;
  border-left: 2px solid #ff5500; /* Orange Tactical Line */
  padding: 1.5rem 2rem;
  font-family: 'Courier New', monospace;
  color: #888;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.philosophyLabel, .workPhilosophyLabel {
  display: block;
  color: #ff5500;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
  font-weight: 600;
}

/* =========================================
   MOBILE RESPONSIVENESS (The Fix)
   ========================================= */
@media (max-width: 768px) {
  
  /* Shrink the card padding to utilize mobile screen width */
  .contactCard {
    padding: 2rem 1.5rem;
    border-left-width: 2px;
  }

  /* Shrink the massive name to fit the screen */
  .realName {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  /* CRITICAL: Stack the labels ABOVE the text on mobile, instead of side-by-side */
  .metaItem {
    flex-direction: column;
    gap: 0.25rem;
  }

  /* Remove fixed width on mobile so text flows naturally */
  .label {
    width: auto; 
    font-size: 0.8rem;
  }

  /* Shrink text sizing slightly for readability */
  .metaItem, .coreDirective {
    font-size: 0.85rem;
  }

  .summary {
    font-size: 0.9rem;
  }

  .philosophy, .workPhilosophy {
    padding: 1rem 1.25rem;
    font-size: 0.8rem;
  }
}
