import { useState, useEffect } from 'react';

/**
 * Custom hook to produce a typewriter typing effect for a given text.
 * @param text The text string to animate.
 * @param speed Typing delay in milliseconds per character.
 * @returns The current typed substring.
 */
export const useTypewriter = (text: string, speed: number = 30) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');
    if (!text) return;
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
};
