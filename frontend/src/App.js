import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { NoteProvider } from './context/NoteContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Notes from './pages/notes/Notes';
import NoteDetail from './pages/notes/NoteDetail';
import MindMap from './pages/MindMap';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Redireciona usuários autenticados da página de login para o dashboard
const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Efeito para redirecionar para login quando não autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/cadastrar') {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);
  
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={
        <RedirectIfAuthenticated>
          <AuthLayout />
        </RedirectIfAuthenticated>
      }>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Register />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <NoteProvider>
            <MainLayout />
          </NoteProvider>
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notas" element={<Notes />} />
        <Route path="/notas/new" element={<NoteDetail />} />
        <Route path="/notas/:id" element={<NoteDetail />} />
        <Route path="/mapa-mental" element={<MindMap />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
      
      {/* Rota padrão - redireciona para login se não autenticado, senão para dashboard */}
      <Route path="*" element={
        loading ? (
          <div>Carregando...</div>
        ) : isAuthenticated ? (
          <NotFound />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
};

export default App; 