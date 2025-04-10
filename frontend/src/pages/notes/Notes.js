import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaCalendarAlt, FaEye, FaSpinner } from 'react-icons/fa';
import { useNoteContext } from '../../context/NoteContext';

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: ${({ theme }) => theme.fonts.primary};
  text-shadow: ${({ theme }) => theme.boxShadow.neon};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ButtonContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const NewNoteButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NoteCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  position: relative;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 10px rgba(0, 250, 220, 0.1);
  }
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
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

const NoteTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  letter-spacing: 1px;
`;

const NoteContent = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoteFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px dashed ${({ theme }) => theme.colors.borderDark};
  font-size: 0.8rem;
`;

const NoteDate = styled.small`
  color: ${({ theme }) => theme.colors.textDark};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const NoteLink = styled(Link)`
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: ${({ theme }) => theme.transition.short};
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 3px rgba(0, 250, 220, 0.5);
  }
`;

const EmptyState = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const AsciiText = styled.pre`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 0.8rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textDark};
  margin: ${({ theme }) => theme.spacing.md} 0;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Notes = () => {
  const { notes, loading } = useNoteContext();
  const navigate = useNavigate();
  
  const createNewNote = () => {
    // Redirecionar para a página de criação de nova nota
    navigate('/notas/new');
  };

  return (
    <div>
      <Title>Minhas Notas</Title>
      <Description>Este é seu espaço de anotações digital. Crie e organize suas notas de estudo.</Description>
      
      <ButtonContainer>
        <NewNoteButton onClick={createNewNote} disabled={loading}>
          <FaPlus /> Nova Nota
        </NewNoteButton>
      </ButtonContainer>
      
      {loading ? (
        <LoadingSpinner>
          <FaSpinner />
        </LoadingSpinner>
      ) : notes.length > 0 ? (
        <NotesGrid>
          {notes.map(note => (
            <NoteCard key={note.id}>
              <NoteTitle>{note.title}</NoteTitle>
              <NoteContent>{note.content}</NoteContent>
              <NoteFooter>
                <NoteDate>
                  <FaCalendarAlt /> {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                </NoteDate>
                <NoteLink to={`/notas/${note.id}`}>
                  <FaEye /> Ver detalhes
                </NoteLink>
              </NoteFooter>
            </NoteCard>
          ))}
        </NotesGrid>
      ) : (
        <EmptyState>
          <AsciiText>
{`
 +----------------------------+
 |                            |
 |   Nenhuma nota encontrada  |
 |                            |
 +----------------------------+
`}
          </AsciiText>
          <p>Você ainda não possui notas. Crie uma nova nota para começar!</p>
        </EmptyState>
      )}
    </div>
  );
};

export default Notes; 