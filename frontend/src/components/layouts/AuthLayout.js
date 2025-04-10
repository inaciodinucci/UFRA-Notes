import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import NeonLogo from '../ui/ASCIILogo';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.primary};
`;

const Tagline = styled.p`
  color: ${({ theme }) => theme.colors.textDark};
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  font-family: ${({ theme }) => theme.fonts.primary};
  letter-spacing: 1px;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
  }
  
  &::before {
    top: -2px;
    left: -2px;
    border-top: 2px solid ${({ theme }) => theme.colors.primary};
    border-left: 2px solid ${({ theme }) => theme.colors.primary};
  }
  
  &::after {
    bottom: -2px;
    right: -2px;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
    border-right: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.textDark};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  font-size: 0.9rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
`;

const AuthLayout = () => {
  return (
    <Container>
      <Header>
        <NeonLogo />
        <Tagline>Sistema de Gerenciamento de Notas Gamificado</Tagline>
      </Header>

      <Main>
        <FormContainer>
          <Outlet />
        </FormContainer>
      </Main>

      <Footer>
        <p>&copy; {new Date().getFullYear()} UFRA Notes. Todos os direitos reservados.</p>
      </Footer>
    </Container>
  );
};

export default AuthLayout; 