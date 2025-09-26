import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  ${({ hoverable }) => hoverable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${({ theme }) => theme.boxShadow.lg};
      border-color: ${({ theme }) => theme.colors.primary};
    }
  `}
  
  ${({ variant }) => variant === 'outlined' && `
    background: transparent;
    border: 2px solid ${({ theme }) => theme.colors.border};
  `}
  
  ${({ variant }) => variant === 'elevated' && `
    box-shadow: ${({ theme }) => theme.boxShadow.xl};
  `}
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundDark};
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CardSubtitle = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fonts.secondary};
`;

const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundDark};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CardIcon = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const Card = ({
  children,
  title,
  subtitle,
  icon,
  footer,
  hoverable = false,
  variant = 'default',
  onClick,
  ...props
}) => {
  return (
    <CardContainer
      hoverable={hoverable}
      variant={variant}
      onClick={onClick}
      {...props}
    >
      {(title || icon) && (
        <CardHeader>
          <CardTitle>
            {icon && <CardIcon>{icon}</CardIcon>}
            {title}
          </CardTitle>
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      
      <CardBody>
        {children}
      </CardBody>
      
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};

export default Card;
