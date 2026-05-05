import React, { useState, useEffect } from 'react';

/**
 * Typewriter - A utility component that renders text one character at a time.
 * Helps with perceived performance and matches the terminal aesthetic.
 */
const Typewriter = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text.charAt(index));
        setIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <span>{displayedText}</span>;
};

export default Typewriter;
