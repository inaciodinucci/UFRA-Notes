import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationTriangle } from 'react-icons/fa';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
`;

const AsciiTitle = styled.pre`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 0.8rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-shadow: 0 0 5px ${({ theme }) => theme.colors.primary};
`;

const FormContainer = styled.div`
  position: relative;
  max-width: 400px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LogoLink = styled.a`
  display: block;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 8px rgba(0, 250, 220, 0.5));
  }
  
  img {
    width: 120px;
    height: auto;
    object-fit: contain;
  }
`;

const LoginForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.xxs};
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.primary};
  letter-spacing: 1px;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const Input = styled(Field)`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 5px rgba(0, 250, 220, 0.3);
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xxs};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    background-color: rgba(0, 250, 220, 0.1);
    text-shadow: ${({ theme }) => theme.boxShadow.sm};
    box-shadow: 0 0 10px rgba(0, 250, 220, 0.2);
  }
  
  &:disabled {
    border-color: ${({ theme }) => theme.colors.borderDark};
    color: ${({ theme }) => theme.colors.textDark};
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.primary};
  color: ${({ theme }) => theme.colors.textDark};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px dashed ${({ theme }) => theme.colors.borderDark};
  
  a {
    margin-left: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.accent};
    transition: ${({ theme }) => theme.transition.short};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      text-shadow: 0 0 3px rgba(0, 250, 220, 0.5);
    }
  }
`;

const ErrorAlert = styled.div`
  background-color: rgba(255, 50, 50, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.sm};
    flex-shrink: 0;
  }
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .required('Senha é obrigatória')
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <FormContainer>
      <LogoContainer>
        <LogoLink href="https://novo.ufra.edu.br" target="_blank" rel="noopener noreferrer">
          <img src={process.env.PUBLIC_URL + '/ufra-logo.png'} alt="UFRA" />
        </LogoLink>
      </LogoContainer>

      <AsciiTitle>
{`
+-------------------------------------+
|                                     |
|          SISTEMA DE ACESSO          |
|                                     |
+-------------------------------------+
`}
      </AsciiTitle>

      {error && (
        <ErrorAlert>
          <FaExclamationTriangle />
          {error}
        </ErrorAlert>
      )}

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError('');
          setLoading(true);
          
          try {
            const result = await login(values.email, values.password);
            if (result.success) {
              navigate('/');
            } else {
              setError(result.error || 'Credenciais inválidas. Tente novamente.');
            }
          } catch (err) {
            setError('Falha ao fazer login. Verifique suas credenciais ou tente novamente mais tarde.');
          } finally {
            setLoading(false);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <LoginForm>
            <FormGroup>
              <Label htmlFor="email">
                <FaEnvelope /> Email
              </Label>
              <Input type="email" id="email" name="email" autoComplete="email" />
              <ErrorMessage name="email">
                {msg => (
                  <ErrorText>
                    <FaExclamationTriangle /> {msg}
                  </ErrorText>
                )}
              </ErrorMessage>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">
                <FaLock /> Senha
              </Label>
              <Input type="password" id="password" name="password" autoComplete="current-password" />
              <ErrorMessage name="password">
                {msg => (
                  <ErrorText>
                    <FaExclamationTriangle /> {msg}
                  </ErrorText>
                )}
              </ErrorMessage>
            </FormGroup>
            
            <Button type="submit" disabled={isSubmitting || loading}>
              <FaSignInAlt /> {loading ? 'Processando...' : 'Acessar Sistema'}
            </Button>
            
            <Footer>
              Não tem uma conta?
              <Link to="/cadastrar">Registre-se</Link>
            </Footer>
          </LoginForm>
        )}
      </Formik>
    </FormContainer>
  );
};

export default Login; 