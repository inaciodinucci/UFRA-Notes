const theme = {
  colors: {
    primary: '#00fadc',
    secondary: '#00d5bf',
    background: '#0a1a1c',
    backgroundLight: '#1a2a2c',
    backgroundDark: '#0f1f21',
    text: '#e0f8f5',
    textLight: '#f0f8f7',
    textDark: '#a0c8c5',
    accent: '#00ffff',
    success: '#00ff9d',
    error: '#ff6b6b',
    warning: '#ffd93d',
    info: '#4ecdc4',
    border: '#2a4a4c',
    borderLight: '#3a5a5c',
    borderDark: '#1a3a3c',
    shadow: 'rgba(0, 250, 220, 0.3)',
    overlay: 'rgba(10, 26, 28, 0.95)',
    neonGlow: '0 0 5px #00fadc, 0 0 10px #00fadc, 0 0 15px #00fadc',
    dotGrid: 'rgba(0, 250, 220, 0.2)'
  },
  
  fonts: {
    primary: '"Share Tech Mono", "Fira Code", "JetBrains Mono", monospace',
    secondary: '"Inter", "Roboto", "Segoe UI", sans-serif',
    display: '"Orbitron", "Exo 2", "Rajdhani", sans-serif',
  },
  
  spacing: {
    xxs: '0.25rem',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '16px',
    round: '50%',
  },
  
  boxShadow: {
    sm: '0 0 5px rgba(0, 250, 220, 0.3)',
    md: '0 0 10px rgba(0, 250, 220, 0.4)',
    lg: '0 0 15px rgba(0, 250, 220, 0.5)',
    neon: '0 0 5px #00fadc, 0 0 10px #00fadc, 0 0 15px #00fadc',
  },
  
  transition: {
    short: 'all 0.2s ease',
    medium: 'all 0.3s ease',
    long: 'all 0.5s ease',
  },
  
  zIndex: {
    base: 1,
    menu: 10,
    modal: 100,
    toast: 1000,
  },
};

export default theme; 