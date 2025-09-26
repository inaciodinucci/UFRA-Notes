import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono:wght@400&family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.secondary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* Cyber grid pattern for background */
    background-image: 
      radial-gradient(${({ theme }) => theme.colors.dotGrid} 1px, transparent 1px),
      radial-gradient(${({ theme }) => theme.colors.dotGrid} 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 0 0, 10px 10px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.display};
    color: ${({ theme }) => theme.colors.textLight};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    text-shadow: ${({ theme }) => theme.boxShadow.sm};
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  h1 {
    font-size: 2.5rem;
    text-shadow: ${({ theme }) => theme.boxShadow.neon};
    text-transform: uppercase;
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    transition: ${({ theme }) => theme.transition.short};
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
      text-shadow: ${({ theme }) => theme.boxShadow.sm};
    }
  }

  button, input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.secondary};
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
  }

  button {
    cursor: pointer;
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    transition: ${({ theme }) => theme.transition.short};
    text-transform: uppercase;
    letter-spacing: 1px;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.background};
      box-shadow: ${({ theme }) => theme.boxShadow.neon};
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Cyber border utility */
  .cyber-border {
    position: relative;
    border: 1px dashed ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.md};
    
    &::before, &::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      border: 1px solid ${({ theme }) => theme.colors.primary};
    }
    
    &::before {
      top: -5px;
      left: -5px;
      border-right: none;
      border-bottom: none;
    }
    
    &::after {
      bottom: -5px;
      right: -5px;
      border-left: none;
      border-top: none;
    }
  }
  
  /* Terminal text effect */
  .terminal-text {
    font-family: ${({ theme }) => theme.fonts.primary};
    color: ${({ theme }) => theme.colors.primary};
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      right: -10px;
      top: 2px;
      width: 8px;
      height: 16px;
      background-color: ${({ theme }) => theme.colors.primary};
      animation: blink 1s step-end infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  }

  /* Neon text effect */
  .neon-text {
    color: ${({ theme }) => theme.colors.textLight};
    text-shadow: ${({ theme }) => theme.colors.neonGlow};
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.backgroundLight};
    border: 1px dotted ${({ theme }) => theme.colors.primary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.secondary};
    box-shadow: ${({ theme }) => theme.boxShadow.neon};
  }

  /* Input styling */
  input, textarea, select {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textDark};
      opacity: 0.8;
    }
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: ${({ theme }) => theme.boxShadow.sm};
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`;

export default GlobalStyle; 