import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 80%, 100% { 
    transform: scale(0);
  } 
  40% { 
    transform: scale(1);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: ${({ fullHeight }) => fullHeight ? '100vh' : '200px'};
`;

const Spinner = styled.div`
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '20px';
      case 'large':
        return '60px';
      default:
        return '40px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '20px';
      case 'large':
        return '60px';
      default:
        return '40px';
    }
  }};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${({ delay }) => delay}s;
`;

const PulseCircle = styled.div`
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '30px';
      case 'large':
        return '80px';
      default:
        return '50px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '30px';
      case 'large':
        return '80px';
      default:
        return '50px';
    }
  }};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
`;

const Loading = ({ 
  type = 'spinner', 
  size = 'medium', 
  text, 
  fullHeight = false 
}) => {
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <DotsContainer>
            <Dot delay={-0.32} />
            <Dot delay={-0.16} />
            <Dot delay={0} />
          </DotsContainer>
        );
      
      case 'pulse':
        return <PulseCircle size={size} />;
      
      case 'spinner':
      default:
        return <Spinner size={size} />;
    }
  };

  return (
    <LoadingContainer fullHeight={fullHeight}>
      {renderLoader()}
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default Loading;
