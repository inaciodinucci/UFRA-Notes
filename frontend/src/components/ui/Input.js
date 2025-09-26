import React, { forwardRef } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.3s ease;
  position: relative;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textDark};
    opacity: 0.8;
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: ${({ theme, hasError }) => hasError 
      ? `0 0 0 3px ${theme.colors.error}20` 
      : `0 0 0 3px ${theme.colors.primary}20`
    };
    background-color: ${({ theme }) => theme.colors.background};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.backgroundDark};
  }
  
  ${({ variant }) => variant === 'search' && `
    padding-left: 2.5rem;
  `}
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 1.125rem;
  pointer-events: none;
`;

const ErrorMessage = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fonts.secondary};
`;

const HelpText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 0.875rem;
  font-family: ${({ theme }) => theme.fonts.secondary};
`;

const Input = forwardRef(({
  label,
  error,
  helpText,
  variant = 'default',
  ...props
}, ref) => {
  const hasError = !!error;
  
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <div style={{ position: 'relative' }}>
        {variant === 'search' && (
          <SearchIcon>🔍</SearchIcon>
        )}
        <StyledInput
          ref={ref}
          hasError={hasError}
          variant={variant}
          {...props}
        />
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helpText && !error && <HelpText>{helpText}</HelpText>}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input;
