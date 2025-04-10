import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
`;

// Hidden reset button for debugging
const DebugReset = styled.button`
  position: fixed;
  bottom: 10px;
  right: 10px;
  opacity: 0.2;
  background: none;
  border: none;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textDark};
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const NotFound = () => {
  const handleResetApp = () => {
    if (window.confirm('ATENÇÃO: Isto vai limpar TODOS os dados locais do aplicativo. Continuar?')) {
      console.log('Resetting localStorage data...');
      localStorage.clear();
      window.location.href = '/';
    }
  };
  
  return (
    <Container>
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>A página que você está tentando acessar não existe.</p>
      <Link to="/">Voltar para a página inicial</Link>
      
      <DebugReset onClick={handleResetApp}>🔄 Reset App Data</DebugReset>
    </Container>
  );
};

export default NotFound; 