import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaChartBar, FaStickyNote, FaBrain, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Header from '../navigation/Header';
import NeonLogo from '../ui/ASCIILogo';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Content = styled.div`
  display: flex;
  flex: 1;
`;

const Sidebar = styled.aside`
  width: ${({ isOpen }) => (isOpen ? '250px' : '60px')};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  transition: width 0.3s ease;
  overflow: hidden;
  border-right: 1px dashed ${({ theme }) => theme.colors.primary};
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
    opacity: 0.6;
  }
`;

const Nav = styled.nav`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.text)};
  text-decoration: none;
  transition: ${({ theme }) => theme.transition.short};
  border-left: 3px solid ${({ theme, active }) => (active ? theme.colors.primary : 'transparent')};
  background-color: ${({ theme, active }) => (active ? 'rgba(0, 250, 220, 0.05)' : 'transparent')};
  letter-spacing: 1px;
  font-family: ${({ theme }) => theme.fonts.primary};
  
  &:hover {
    background-color: rgba(0, 250, 220, 0.1);
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: ${({ theme }) => theme.boxShadow.sm};
  }
`;

const IconWrapper = styled.span`
  font-size: 1.25rem;
  margin-right: ${({ theme }) => theme.spacing.md};
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LabelWrapper = styled.span`
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  transition: opacity 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};
  overflow: auto;
  position: relative;
  
  /* Grid background */
  background-image: 
    radial-gradient(${({ theme }) => theme.colors.dotGrid} 1px, transparent 1px),
    radial-gradient(${({ theme }) => theme.colors.dotGrid} 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
  
  /* Scanlines effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 10, 12, 0.05) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 1;
  }
`;

const Footer = styled.footer`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.textDark};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  font-size: 0.9rem;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoArea = styled.div`
  max-width: 120px;
  max-height: 120px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  filter: drop-shadow(0 0 5px ${({ theme }) => theme.colors.primary});
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px ${({ theme }) => theme.colors.primary});
  }
  
  & img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;

const LogoLink = styled.a`
  display: block;
`;

const Copyright = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  font-family: ${({ theme }) => theme.fonts.primary};
  letter-spacing: 1px;
`;

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Usuário não autenticado, redirecionando para login");
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Se não estiver autenticado, nem renderizar o layout
  if (!isAuthenticated) {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarItems = [
    { path: '/', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/notas', icon: <FaStickyNote />, label: 'Notas' },
    { path: '/mapa-mental', icon: <FaBrain />, label: 'Mapa Mental' },
    { path: '/perfil', icon: <FaUser />, label: 'Perfil' },
  ];

  return (
    <Container>
      <Header toggleSidebar={toggleSidebar} sidebarOpen={isSidebarOpen} />
      
      <Content>
        <Sidebar isOpen={isSidebarOpen}>
          <Nav>
            <NavList>
              {sidebarItems.map((item) => (
                <NavItem key={item.path}>
                  <NavLink 
                    to={item.path}
                    active={location.pathname === item.path ? 1 : 0}
                  >
                    <IconWrapper>{item.icon}</IconWrapper>
                    <LabelWrapper isVisible={isSidebarOpen}>{item.label}</LabelWrapper>
                  </NavLink>
                </NavItem>
              ))}
              <NavItem>
                <NavLink as="button" onClick={logout}>
                  <IconWrapper><FaSignOutAlt /></IconWrapper>
                  <LabelWrapper isVisible={isSidebarOpen}>Sair</LabelWrapper>
                </NavLink>
              </NavItem>
            </NavList>
          </Nav>
        </Sidebar>

        <Main>
          <Outlet />
        </Main>
      </Content>

      <Footer>
        <LogoArea>
          <LogoLink href="https://novo.ufra.edu.br" target="_blank" rel="noopener noreferrer">
            <img src={process.env.PUBLIC_URL + '/ufra-logo.png'} alt="UFRA" />
          </LogoLink>
        </LogoArea>
        <Copyright>&copy; {new Date().getFullYear()} UFRA Notes - Sistema de Gerenciamento de Notas Gamificado</Copyright>
      </Footer>
    </Container>
  );
};

export default MainLayout; 