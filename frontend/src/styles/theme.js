const theme = {
  colors: {
    primary: '#00fadc',
    secondary: '#00d5bf',
    background: '#021114',
    backgroundLight: '#041a1e',
    backgroundDark: '#010c0e',
    text: '#00fadc',
    textLight: '#00fadc',
    textDark: '#00a69c',
    accent: '#00ffff',
    success: '#00ff9d',
    error: '#ff3366',
    warning: '#ffcc00',
    info: '#00ccff',
    border: '#00a69c',
    borderLight: '#00fadc',
    borderDark: '#008f89',
    shadow: 'rgba(0, 250, 220, 0.2)',
    overlay: 'rgba(2, 17, 20, 0.9)',
    neonGlow: '0 0 5px #00fadc, 0 0 10px #00fadc, 0 0 15px #00fadc',
    dotGrid: 'rgba(0, 250, 220, 0.15)'
  },
  
  fonts: {
    primary: '"Share Tech Mono", monospace',
    secondary: '"VT323", monospace',
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