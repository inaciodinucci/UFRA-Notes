import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaCalendarAlt, FaSpinner, FaCheck, FaTools, FaStickyNote } from 'react-icons/fa';
import { useNoteContext } from '../../context/NoteContext';
import ReactMarkdown from 'react-markdown';

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

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background-color: rgba(255, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  margin: ${({ theme }) => theme.spacing.md} 0;
  border: 1px solid ${({ theme }) => theme.colors.danger};
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
  background-color: ${({ theme, completed }) => 
    completed ? `rgba(0, 250, 220, 0.05)` : theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  position: relative;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 10px rgba(0, 250, 220, 0.1);
    transform: translateY(-2px);
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

const CompletedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #00dc82;
  font-size: 1.2rem;
`;

const NoteTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  letter-spacing: 1px;
`;

const NotePreviewContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 4.5em;
  white-space: pre-line;
  
  /* Markdown styles for preview */
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-size: inherit;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  p {
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    white-space: pre-line;
    word-break: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
    -ms-word-break: break-all;
    hyphens: auto;
  }
  
  /* Force break for very long content without spaces */
  div, span, li {
    overflow-wrap: break-word;
    word-break: break-word;
    -ms-word-break: break-all;
    hyphens: auto;
  }
  
  ul, ol {
    margin-left: ${({ theme }) => theme.spacing.md};
    padding: 0;
  }
  
  code {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0 2px;
    border-radius: 2px;
    font-family: monospace;
  }
`;

const NoteContent = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  max-height: 4.5em;
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

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-radius: 8px;
  margin-top: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 5rem;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 1.5rem;
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const EmptyStateText = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  max-width: 600px;
`;

const CreateNoteButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 250, 220, 0.1);
    text-shadow: ${({ theme }) => theme.boxShadow.sm};
    box-shadow: 0 0 10px rgba(0, 250, 220, 0.2);
  }
  
  svg {
    margin-right: 8px;
    font-size: 1.2rem;
  }
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

const DebugButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #666;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

// Add this style for the Markdown wrapper
const MarkdownWrapper = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const Notes = () => {
  const [creatingNote, setCreatingNote] = useState(false);
  const { notes, loading, error, createNote } = useNoteContext();
  const navigate = useNavigate();
  
  const createNewNote = () => {
    console.log('Criando nova nota');
    
    // Array of creative note title suggestions
    const titleSuggestions = [
      'Minhas Ideias',
      'Projeto Incrível',
      'Anotações Importantes',
      'Plano de Estudos',
      'Lista de Tarefas',
      'Brainstorming',
      'Resumo do Dia',
      'Planejamento',
      'Aprendizados',
      'Roadmap Pessoal'
    ];
    
    // Pick a random title suggestion
    const randomTitle = titleSuggestions[Math.floor(Math.random() * titleSuggestions.length)];
    
    // Usar createNote do contexto
    createNote({
      title: '', // Empty title - will use placeholder in the editor
      content: '' // The default content is provided in the noteService.js
    }).then(newNote => {
      if (newNote && newNote.id) {
        console.log(`Nota criada com sucesso, ID: ${newNote.id}`);
        // Navegar diretamente para a nota criada
        navigate(`/notas/${newNote.id}`);
      } else {
        console.error('Falha ao criar nova nota');
        alert('Erro ao criar nova nota. Por favor, tente novamente.');
      }
    }).catch(err => {
      console.error('Erro ao criar nota:', err);
      alert('Erro ao criar nova nota: ' + (err.message || 'Erro desconhecido'));
    });
  };

  const viewNoteDetails = (note) => {
    try {
      console.log('Visualizando detalhes da nota com ID:', note.id);
      
      // Garantir que temos um ID válido
      if (!note || !note.id) {
        console.error('Nota inválida ou ID ausente:', note);
        return;
      }
      
      // Navegação direta para a nota
      navigate(`/notas/${note.id}`);
    } catch (error) {
      console.error('Erro ao navegar para detalhes da nota:', error);
      alert('Erro ao abrir detalhes da nota.');
    }
  };

  const handleResetStorage = () => {
    if (window.confirm('ATENÇÃO: Isso irá apagar TODAS as notas. Tem certeza?')) {
      localStorage.clear(); // Use localStorage clear instead of undefined clearAllNotes
      window.location.reload();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <DebugButton onClick={handleResetStorage} title="Reiniciar Armazenamento">
        <FaTools /> Reset
      </DebugButton>
      
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
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : notes.length > 0 ? (
        <NotesGrid>
          {notes.map(note => (
            <div key={note.id} style={{ cursor: 'pointer' }} onClick={() => viewNoteDetails(note)}>
              <NoteCard 
                completed={note.all_checked}
              >
                {note.all_checked && (
                  <CompletedBadge>
                    <FaCheck />
                  </CompletedBadge>
                )}
                <NoteTitle>{note.title || "Nova Nota"}</NoteTitle>
                <NotePreviewContent>
                  <MarkdownWrapper>
                    <ReactMarkdown breaks>{note.content || "Sem conteúdo"}</ReactMarkdown>
                  </MarkdownWrapper>
                </NotePreviewContent>
                <NoteFooter>
                  <NoteDate>
                    <FaCalendarAlt /> {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                  </NoteDate>
                </NoteFooter>
              </NoteCard>
            </div>
          ))}
        </NotesGrid>
      ) : (
        <EmptyStateContainer>
          <EmptyStateIcon>
            <FaStickyNote />
          </EmptyStateIcon>
          <EmptyStateTitle>Comece a criar suas notas!</EmptyStateTitle>
          <EmptyStateText>
            Ainda não há notas. Crie sua primeira nota para começar a organizar suas ideias, 
            listas de tarefas e muito mais.
          </EmptyStateText>
          <CreateNoteButton to="/notas/novo">
            <FaPlus /> Criar Minha Primeira Nota
          </CreateNoteButton>
        </EmptyStateContainer>
      )}
    </div>
  );
};

export default Notes; 