import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEnvelope, FaLock, FaUser, FaSignInAlt, FaCheck } from 'react-icons/fa';

const RegisterForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
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
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const Input = styled(Field)`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.secondary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.accent};
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xxs};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.md};
  font-weight: bold;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: 0.9rem;
  
  a {
    margin-left: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.accent};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  span {
    padding: 0 ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const CaptchaContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const CaptchaQuestion = styled.div`
  font-size: 0.9rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(30, 'Nome de usuário deve ter no máximo 30 caracteres')
    .required('Nome de usuário é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .required('Senha é obrigatória'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  first_name: Yup.string()
    .required('Nome é obrigatório'),
  last_name: Yup.string()
    .required('Sobrenome é obrigatório'),
  captcha: Yup.string()
    .oneOf(['5'], 'Resposta incorreta')
    .required('Por favor, resolva o CAPTCHA')
});

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    re_password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.username) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }
    
    if (formData.password !== formData.re_password) {
      newErrors.re_password = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await register(formData);
      if (success) {
        setRegistered(true);
      }
    } catch (err) {
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div>
        <h2>Cadastro Realizado!</h2>
        <p>Um email de confirmação foi enviado para o seu endereço de email.</p>
        <p>Por favor, confirme seu email para ativar sua conta.</p>
        <Button as={Link} to="/login">
          <FaSignInAlt /> Ir para o Login
        </Button>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Criar Conta</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="email" 
            style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}
          >
            Email
          </label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: errors.email ? '1px solid #f44336' : '1px solid #ccc', 
              borderRadius: '4px', 
              fontSize: '16px' 
            }}
          />
          {errors.email && (
            <div style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="username" 
            style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}
          >
            Nome de Usuário
          </label>
          <input 
            type="text" 
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: errors.username ? '1px solid #f44336' : '1px solid #ccc', 
              borderRadius: '4px', 
              fontSize: '16px' 
            }}
          />
          {errors.username && (
            <div style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>
              {errors.username}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label 
            htmlFor="password" 
            style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}
          >
            Senha
          </label>
          <input 
            type="password" 
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: errors.password ? '1px solid #f44336' : '1px solid #ccc',
              borderRadius: '4px', 
              fontSize: '16px' 
            }}
          />
          {errors.password && (
            <div style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>
              {errors.password}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="re_password" 
            style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}
          >
            Confirmar Senha
          </label>
          <input 
            type="password" 
            id="re_password"
            name="re_password"
            value={formData.re_password}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: errors.re_password ? '1px solid #f44336' : '1px solid #ccc',
              borderRadius: '4px', 
              fontSize: '16px' 
            }}
          />
          {errors.re_password && (
            <div style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>
              {errors.re_password}
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>
          Já tem uma conta?{' '}
          <Link 
            to="/login" 
            style={{ 
              color: '#4CAF50', 
              textDecoration: 'none', 
              fontWeight: 'bold' 
            }}
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 