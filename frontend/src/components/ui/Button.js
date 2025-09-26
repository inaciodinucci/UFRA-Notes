import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`;
      case 'secondary':
        return 'transparent';
      case 'danger':
        return `linear-gradient(135deg, ${theme.colors.error}, #ff6b6b)`;
      case 'success':
        return `linear-gradient(135deg, ${theme.colors.success}, #00ff9d)`;
      default:
        return 'transparent';
    }
  }};
  
  border: 1px solid ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.border;
      case 'danger':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.border;
    }
  }};
  
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.background;
      case 'secondary':
        return theme.colors.text;
      case 'danger':
        return theme.colors.background;
      case 'success':
        return theme.colors.background;
      default:
        return theme.colors.text;
    }
  }};
  
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'large':
        return `${theme.spacing.md} ${theme.spacing.lg}`;
      default:
        return `${theme.spacing.sm} ${theme.spacing.md}`;
    }
  }};
  
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'large':
        return '1.125rem';
      default:
        return '1rem';
    }
  }};
  
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}
  
  ${({ loading }) => loading && `
    pointer-events: none;
    opacity: 0.8;
  `}
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  loading = false, 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      <ButtonContent>
        {loading && <LoadingSpinner />}
        {children}
      </ButtonContent>
    </StyledButton>
  );
};

export default Button;
