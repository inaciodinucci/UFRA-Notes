import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: ${({ theme }) => theme.fonts.primary};
  text-shadow: ${({ theme }) => theme.boxShadow.neon};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const Welcome = styled.div`
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
  }
  
  &::before {
    top: -2px;
    left: -2px;
    border-top: 1px solid ${({ theme }) => theme.colors.primary};
    border-left: 1px solid ${({ theme }) => theme.colors.primary};
  }
  
  &::after {
    bottom: -2px;
    right: -2px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
    border-right: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.accent};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 1.5rem;
  letter-spacing: 1px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "+";
    position: absolute;
    top: 5px;
    left: 5px;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.5;
  }
  
  &::after {
    content: "+";
    position: absolute;
    bottom: 5px;
    right: 5px;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.5;
  }
`;

const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.primary};
  letter-spacing: 1px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  text-align: right;
  font-family: ${({ theme }) => theme.fonts.primary};
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
    opacity: 0.3;
  }
`;

const AsciiText = styled.pre`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 0.8rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textDark};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const Dashboard = () => {
  return (
    <div>
      <Title>DASHBOARD</Title>
      
      <Welcome>
        <AsciiText>
{`
+----------------------------------------------------+
|                                                    |
|  Bem-vindo ao UFRA Notes! Sistema Gamificado       |
|  de Gerenciamento de Notas para Estudantes.        |
|                                                    |
+----------------------------------------------------+
`}
        </AsciiText>
      </Welcome>
      
      <SectionTitle>Resumo</SectionTitle>
      
      <CardGrid>
        <Card>
          <CardTitle>Notas Recentes</CardTitle>
          <AsciiText>
{`
 +-----------------+
 | Sem registros   |
 +-----------------+
`}
          </AsciiText>
          <p>Você ainda não tem notas cadastradas.</p>
        </Card>
        
        <Card>
          <CardTitle>Status do Usuário</CardTitle>
          <StatGrid>
            <StatLabel>Nível:</StatLabel>
            <StatValue>1</StatValue>
            
            <StatLabel>XP:</StatLabel>
            <StatValue>0/100</StatValue>
            
            <StatLabel>Inteligência:</StatLabel>
            <StatValue>10</StatValue>
            
            <StatLabel>Força:</StatLabel>
            <StatValue>10</StatValue>
            
            <StatLabel>Agilidade:</StatLabel>
            <StatValue>10</StatValue>
            
            <StatLabel>Saúde:</StatLabel>
            <StatValue>10</StatValue>
          </StatGrid>
        </Card>
      </CardGrid>
    </div>
  );
};

export default Dashboard; 