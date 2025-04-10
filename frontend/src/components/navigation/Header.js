import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.primary};
  box-shadow: 0 1px 10px rgba(0, 250, 220, 0.15);
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
  
  &::before {
    top: 10px;
    left: 10px;
    border-right: none;
    border-bottom: none;
  }
  
  &::after {
    top: 10px;
    right: 10px;
    border-left: none;
    border-bottom: none;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    text-shadow: ${({ theme }) => theme.boxShadow.neon};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const Username = styled.span`
  margin-left: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const UserLevel = styled.span`
  margin-left: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.8rem;
  font-family: ${({ theme }) => theme.fonts.primary};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.5;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  padding: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.textLight};
    text-shadow: ${({ theme }) => theme.boxShadow.neon};
    border: 1px dashed ${({ theme }) => theme.colors.primary};
  }
`;

const UserAvatar = styled(Link)`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textLight};
  margin-right: ${({ theme }) => theme.spacing.sm};
  transition: ${({ theme }) => theme.transition.short};
  position: relative;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.sm};
    color: ${({ theme }) => theme.colors.accent};
  }
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: transparent;
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

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();
  
  // Se não estiver autenticado, não exibir o cabeçalho
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <HeaderContainer>
      <ToggleButton onClick={toggleSidebar} aria-label="Toggle sidebar">
        <FaBars />
      </ToggleButton>
      
      <UserSection>
        <UserAvatar to="/perfil">
          <FaUser />
        </UserAvatar>
        <UserInfo>
          <div>
            <Username>{user?.username || 'Usuário'}</Username>
            <div>
              <UserLevel>Nível {user?.level || 1}</UserLevel>
            </div>
          </div>
        </UserInfo>
        <ActionButton onClick={logout} aria-label="Logout">
          <FaSignOutAlt />
        </ActionButton>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header; 