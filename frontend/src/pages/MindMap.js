import React from 'react';

const MindMap = () => {
  return (
    <div>
      <h1>Mapa Mental</h1>
      <p>Esta página exibirá o mapa mental conectando as notas do usuário.</p>
      
      <div style={{ 
        marginTop: '30px', 
        height: '500px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Visualização do Mapa Mental</p>
          <p>Aqui será exibido um grafo interativo conectando suas notas.</p>
          <p style={{ marginTop: '20px', color: '#777' }}>Crie algumas notas para começar a ver seu mapa mental!</p>
        </div>
      </div>
    </div>
  );
};

export default MindMap; 