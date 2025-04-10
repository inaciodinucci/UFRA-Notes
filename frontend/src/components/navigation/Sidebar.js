import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaHome, FaStickyNote, FaProjectDiagram, FaUser, FaTrophy } from 'react-icons/fa';
import ASCIILogo from '../ui/ASCIILogo';

const SidebarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.md} 0;
  overflow-y: auto;
`;

const LogoWrapper = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const SidebarTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.accent};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  text-align: center;
`;

const NavItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NavItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transition.short};
  border-left: 3px solid transparent;
  
  &.active {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.accent};
    border-left-color: ${({ theme }) => theme.colors.accent};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const Icon = styled.div`
  margin-right: ${({ theme, isOpen }) => (isOpen ? theme.spacing.md : '0')};
  width: 20px;
  text-align: center;
`;

const Label = styled.span`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const UserStats = styled.div`
  margin-top: auto;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const StatTitle = styled.h4`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 0.9rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatItem = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textDark};
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  color: ${({ theme, color }) => theme.colors[color] || theme.colors.accent};
  font-weight: bold;
`;

const Sidebar = ({ isOpen }) => {
  return (
    <SidebarContainer>
      {isOpen && (
        <LogoWrapper isOpen={isOpen}>
          <ASCIILogo />
        </LogoWrapper>
      )}
      <SidebarTitle isOpen={isOpen}>UFRA Notes</SidebarTitle>
      
      <NavItems>
        <NavItem>
          <NavItemLink to="/">
            <Icon isOpen={isOpen}><FaHome /></Icon>
            <Label isOpen={isOpen}>Dashboard</Label>
          </NavItemLink>
        </NavItem>
        <NavItem>
          <NavItemLink to="/notas">
            <Icon isOpen={isOpen}><FaStickyNote /></Icon>
            <Label isOpen={isOpen}>Notas</Label>
          </NavItemLink>
        </NavItem>
        <NavItem>
          <NavItemLink to="/mapa-mental">
            <Icon isOpen={isOpen}><FaProjectDiagram /></Icon>
            <Label isOpen={isOpen}>Mapa Mental</Label>
          </NavItemLink>
        </NavItem>
        <NavItem>
          <NavItemLink to="/perfil">
            <Icon isOpen={isOpen}><FaUser /></Icon>
            <Label isOpen={isOpen}>Perfil</Label>
          </NavItemLink>
        </NavItem>
      </NavItems>
      
      <UserStats isOpen={isOpen}>
        <StatTitle>Atributos</StatTitle>
        <StatGrid>
          <StatItem>
            <StatLabel>Saúde</StatLabel>
            <StatValue color="success">5</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Inteligência</StatLabel>
            <StatValue color="info">7</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Força</StatLabel>
            <StatValue color="warning">3</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Agilidade</StatLabel>
            <StatValue color="accent">4</StatValue>
          </StatItem>
        </StatGrid>
        
        <StatTitle style={{ marginTop: '1rem' }}>
          <FaTrophy style={{ marginRight: '0.5rem' }} />
          XP: 250 / 300
        </StatTitle>
      </UserStats>
    </SidebarContainer>
  );
};

export default Sidebar; 