import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Container = styled.div`
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.primary};
  position: relative;
  display: inline-block;
  white-space: pre-wrap;
  line-height: 1.5;
  letter-spacing: 1px;
`;

const Cursor = styled.span`
  position: absolute;
  right: -0.6em;
  width: 0.5em;
  height: 1em;
  background-color: ${({ theme }) => theme.colors.primary};
  display: ${({ typing }) => (typing ? 'block' : 'none')};
  animation: ${blink} 1s step-end infinite;
`;

const TerminalText = ({ 
  children, 
  typingSpeed = 30, 
  startDelay = 0,
  className,
  showCursor = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const text = children || '';

  useEffect(() => {
    let timer;
    
    // Reset if the text changes
    setDisplayedText('');
    setIsTyping(true);
    
    const startTyping = () => {
      let currentIndex = 0;
      
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(prev => prev + text.charAt(currentIndex));
          currentIndex++;
          timer = setTimeout(typeNextChar, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };
      
      timer = setTimeout(typeNextChar, typingSpeed);
    };
    
    const delayTimer = setTimeout(startTyping, startDelay);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(delayTimer);
    };
  }, [text, typingSpeed, startDelay]);

  return (
    <Container className={className}>
      {displayedText}
      {showCursor && <Cursor typing={isTyping} />}
    </Container>
  );
};

export default TerminalText; 