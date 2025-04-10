import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      
      <div style={{ 
        marginTop: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '20px',
        maxWidth: '600px'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#e0e0e0', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            {user ? user.username?.charAt(0).toUpperCase() || 'U' : 'U'}
          </div>
          
          <div>
            <h2>{user ? user.username || 'Usuário' : 'Usuário'}</h2>
            <p>{user ? user.email || 'email@exemplo.com' : 'email@exemplo.com'}</p>
            <p style={{ color: '#777' }}>Membro desde: 09/04/2025</p>
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h3>Estatísticas do RPG</h3>
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Nível:</span>
              <span>1</span>
            </div>
            <div style={{ marginBottom: '5px' }}>XP: 0/100</div>
            <div style={{ 
              height: '10px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '0%', 
                height: '100%', 
                backgroundColor: '#4CAF50'
              }}></div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Atributos</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
              <div>
                <div>Inteligência</div>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ 
                      width: '20px', 
                      height: '10px', 
                      backgroundColor: i < 5 ? '#4CAF50' : '#e0e0e0',
                      marginRight: '2px'
                    }}></div>
                  ))}
                </div>
              </div>
              
              <div>
                <div>Força</div>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ 
                      width: '20px', 
                      height: '10px', 
                      backgroundColor: i < 3 ? '#4CAF50' : '#e0e0e0',
                      marginRight: '2px'
                    }}></div>
                  ))}
                </div>
              </div>
              
              <div>
                <div>Agilidade</div>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ 
                      width: '20px', 
                      height: '10px', 
                      backgroundColor: i < 4 ? '#4CAF50' : '#e0e0e0',
                      marginRight: '2px'
                    }}></div>
                  ))}
                </div>
              </div>
              
              <div>
                <div>Saúde</div>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} style={{ 
                      width: '20px', 
                      height: '10px', 
                      backgroundColor: i < 6 ? '#4CAF50' : '#e0e0e0',
                      marginRight: '2px'
                    }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <button style={{ 
            backgroundColor: '#f44336', 
            color: 'white', 
            padding: '10px 15px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 