import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '70vh', 
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '72px', margin: '0', color: '#333' }}>404</h1>
      <h2 style={{ marginTop: '20px', color: '#555' }}>Página Não Encontrada</h2>
      <p style={{ marginTop: '10px', maxWidth: '500px', color: '#777' }}>
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link 
        to="/" 
        style={{ 
          marginTop: '30px', 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '4px', 
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
};

export default NotFound; 