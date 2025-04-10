import React from 'react';
import styled, { keyframes } from 'styled-components';

const flicker = keyframes`
  0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
    opacity: 1;
  }
  20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
    opacity: 0.8;
  }
`;

const LogoContainer = styled.pre`
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  line-height: 1;
  white-space: pre;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-shadow: ${({ theme }) => theme.boxShadow.neon};
  animation: ${flicker} 5s linear infinite;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.7rem;
  }
`;

const NeonLogo = () => {
  return (
    <LogoContainer>
{`
  _    _ ______ _____              _   _  ____ _______ ______  _____ 
 | |  | |  ____|  __ \\     /\\     | \\ | |/ __ \\__   __|  ____|/ ____|
 | |  | | |__  | |__) |   /  \\    |  \\| | |  | | | |  | |__  | (___  
 | |  | |  __| |  _  /   / /\\ \\   | . \` | |  | | | |  |  __|  \\___ \\ 
 | |__| | |    | | \\ \\  / ____ \\  | |\\  | |__| | | |  | |____ ____) |
  \\____/|_|    |_|  \\_\\/_/    \\_\\ |_| \\_|\\____/  |_|  |______|_____/ 
                                                                     
`}
    </LogoContainer>
  );
};

export default NeonLogo; 