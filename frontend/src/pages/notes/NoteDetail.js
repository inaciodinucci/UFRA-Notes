import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaCalendarAlt, FaEdit, FaSave, FaTrash, FaPlus, FaCheck, FaTrophy, FaTimes } from 'react-icons/fa';
import { useNoteContext } from '../../context/NoteContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: ${({ theme }) => theme.transition.short};
  width: fit-content;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 3px rgba(0, 250, 220, 0.5);
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: ${({ theme }) => theme.fonts.primary};
  text-shadow: ${({ theme }) => theme.boxShadow.neon};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
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

const NoteContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  transition: ${({ theme }) => theme.transition.short};
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
  }
  
  &::before {
    top: -1px;
    left: -1px;
    border-top: 2px solid ${({ theme }) => theme.colors.primary};
    border-left: 2px solid ${({ theme }) => theme.colors.primary};
  }
  
  &::after {
    bottom: -1px;
    right: -1px;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
    border-right: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoteTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.primary};
  letter-spacing: 1px;
  margin: 0;
`;

const NoteDate = styled.div`
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NoteContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.secondary};
  line-height: 1.6;
  margin-top: ${({ theme }) => theme.spacing.md};
  width: 100%;
  min-height: 300px;
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const NoteTextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.2rem;
  line-height: 1.6;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 5px rgba(0, 250, 220, 0.3);
  }
`;

const TitleInput = styled.input`
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 1.5rem;
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  letter-spacing: 1px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 5px rgba(0, 250, 220, 0.3);
  }
`;

const TaskSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const TaskTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.primary};
  letter-spacing: 1px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &::after {
    content: '';
    display: block;
    width: 50%;
    height: 1px;
    background: ${({ theme }) => theme.colors.borderDark};
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-left: ${({ theme }) => theme.spacing.md};
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  
  label {
    margin-left: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text};
    transition: ${({ theme }) => theme.transition.short};
    cursor: pointer;
    flex: 1;
  }
  
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: transparent;
    cursor: pointer;
    position: relative;
    
    &:checked {
      border-color: ${({ theme }) => theme.colors.primary};
      
      &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 6px;
        width: 4px;
        height: 8px;
        border: solid ${({ theme }) => theme.colors.primary};
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
  }
  
  input[type="checkbox"]:checked + label {
    text-decoration: line-through;
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.danger};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  margin-left: ${({ theme }) => theme.spacing.sm};
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: transparent;
  color: ${props => props.danger 
    ? props.theme.colors.danger 
    : props.theme.colors.primary};
  border: 1px solid ${props => props.danger 
    ? props.theme.colors.danger 
    : props.theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    background-color: ${props => props.danger 
      ? 'rgba(255, 50, 50, 0.1)' 
      : 'rgba(0, 250, 220, 0.1)'};
    box-shadow: ${props => props.danger 
      ? '0 0 10px rgba(255, 50, 50, 0.2)' 
      : '0 0 10px rgba(0, 250, 220, 0.2)'};
  }
`;

const AddChecklistButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.accent};
  border: 1px dashed ${({ theme }) => theme.colors.accent};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 0.9rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(0, 250, 220, 0.05);
  }
`;

const XpValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.9rem;
  margin-top: ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.primary};
  
  svg {
    color: gold;
  }
`;

const NewTaskInput = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 5px rgba(0, 250, 220, 0.3);
  }
`;

const CompleteButton = styled(Button)`
  background-color: rgba(0, 220, 130, 0.1);
  color: #00dc82;
  border-color: #00dc82;
  
  &:hover {
    background-color: rgba(0, 220, 130, 0.2);
    box-shadow: 0 0 10px rgba(0, 220, 130, 0.3);
  }
`;

const RemoveChecklistButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px dashed ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 0.9rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    background-color: rgba(255, 50, 50, 0.05);
  }
`;

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, createNote, updateNote, deleteNote } = useNoteContext();
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(id === 'new');
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  
  // Load note data
  useEffect(() => {
    const loadNote = async () => {
      try {
        setLoading(true);
        
        if (id === 'new') {
          // Creating a new note
          const newNote = {
            id: 'new',
            title: 'Nova Nota',
            content: '',
            createdAt: new Date().toISOString(),
            tasks: [],
            xp_value: 5,
            has_checkboxes: false,
            all_checked: false
          };
          setNote(newNote);
          setEditedTitle(newNote.title);
          setEditedContent(newNote.content);
        } else {
          // Load existing note
          const existingNote = getNote(id);
          if (existingNote) {
            setNote(existingNote);
            setEditedTitle(existingNote.title);
            setEditedContent(existingNote.content);
          } else {
            // Note not found, redirect to notes list
            navigate('/notas');
          }
        }
      } catch (error) {
        console.error('Error loading note:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNote();
  }, [id, getNote, navigate]);
  
  const toggleTaskCompletion = (taskId) => {
    setNote(prevNote => ({
      ...prevNote,
      tasks: prevNote.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };
  
  const handleSave = async () => {
    try {
      // Prepare updated note data
      const updatedNoteData = {
        ...note,
        title: editedTitle,
        content: editedContent
      };
      
      if (id === 'new') {
        // Create new note
        const createdNote = await createNote(updatedNoteData);
        // Navigate back to notes list
        navigate('/notas');
      } else {
        // Update existing note
        await updateNote(id, updatedNoteData);
        // Update local state
        setNote(updatedNoteData);
        setIsEditing(false);
      }
      
      // Simulate XP gain
      setXpGained(2);
      setTimeout(() => setXpGained(0), 3000);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };
  
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };
    
    const updatedNote = {
      ...note,
      tasks: [...note.tasks, newTask],
      has_checkboxes: true
    };
    
    setNote(updatedNote);
    
    // Update in storage if not a new note
    if (id !== 'new') {
      updateNote(id, updatedNote);
    }
    
    setNewTaskText('');
    setShowNewTaskInput(false);
  };
  
  const handleRemoveTask = (taskId) => {
    const updatedTasks = note.tasks.filter(task => task.id !== taskId);
    const updatedNote = {
      ...note,
      tasks: updatedTasks,
      has_checkboxes: updatedTasks.length > 0
    };
    
    setNote(updatedNote);
    
    // Update in storage if not a new note
    if (id !== 'new') {
      updateNote(id, updatedNote);
    }
  };
  
  const handleRemoveAllTasks = () => {
    const updatedNote = {
      ...note,
      tasks: [],
      has_checkboxes: false
    };
    
    setNote(updatedNote);
    
    // Update in storage if not a new note
    if (id !== 'new') {
      updateNote(id, updatedNote);
    }
  };
  
  const handleCompleteNote = () => {
    const updatedNote = {
      ...note,
      all_checked: true,
      tasks: note.tasks.map(task => ({ ...task, completed: true }))
    };
    
    setNote(updatedNote);
    
    // Update in storage if not a new note
    if (id !== 'new') {
      updateNote(id, updatedNote);
    }
    
    // Simulate XP gain
    setXpGained(note.xp_value);
    setTimeout(() => setXpGained(0), 3000);
  };
  
  const handleDelete = async () => {
    try {
      if (id !== 'new') {
        await deleteNote(id);
      }
      navigate('/notas');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>Carregando nota...</Title>
      </Container>
    );
  }
  
  if (!note) {
    return (
      <Container>
        <Title>Nota não encontrada</Title>
        <BackLink to="/notas">
          <FaArrowLeft /> Voltar para Notas
        </BackLink>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink to="/notas">
        <FaArrowLeft /> Voltar para Notas
      </BackLink>

      <Title>{id === 'new' ? 'Nova Nota' : `Detalhes da Nota #${id}`}</Title>

      <NoteContainer>
        <NoteHeader>
          {isEditing ? (
            <TitleInput 
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Título da nota"
            />
          ) : (
            <NoteTitle>{note.title}</NoteTitle>
          )}
          
          {!isEditing && (
            <NoteDate>
              <FaCalendarAlt /> {new Date(note.createdAt).toLocaleDateString('pt-BR')}
            </NoteDate>
          )}
        </NoteHeader>
        
        {isEditing ? (
          <NoteTextArea 
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Comece a escrever aqui..."
            autoFocus
          />
        ) : (
          <NoteContent>
            <p>{note.content}</p>
          </NoteContent>
        )}
        
        <XpValue>
          <FaTrophy /> Valor de XP: {note.xp_value} {xpGained > 0 && `(+${xpGained} XP ganho!)`}
        </XpValue>
        
        {note.has_checkboxes && (
          <TaskSection>
            <TaskTitle>Tarefas</TaskTitle>
            <TaskList>
              {note.tasks.map(task => (
                <TaskItem key={task.id}>
                  <input 
                    type="checkbox" 
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <label htmlFor={`task-${task.id}`}>{task.text}</label>
                  <RemoveButton 
                    onClick={() => handleRemoveTask(task.id)}
                    title="Remover tarefa"
                  >
                    <FaTimes />
                  </RemoveButton>
                </TaskItem>
              ))}
              
              {showNewTaskInput && (
                <div>
                  <NewTaskInput
                    type="text"
                    placeholder="Digite uma nova tarefa..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <Button onClick={handleAddTask}>
                    <FaPlus /> Adicionar
                  </Button>
                </div>
              )}
            </TaskList>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {!showNewTaskInput && (
                <AddChecklistButton onClick={() => setShowNewTaskInput(true)}>
                  <FaPlus /> Adicionar Checklist
                </AddChecklistButton>
              )}
              
              {note.tasks.length > 0 && (
                <RemoveChecklistButton onClick={handleRemoveAllTasks}>
                  <FaTimes /> Remover Checklist
                </RemoveChecklistButton>
              )}
            </div>
          </TaskSection>
        )}
        
        {!note.has_checkboxes && !showNewTaskInput && (
          <AddChecklistButton onClick={() => setShowNewTaskInput(true)}>
            <FaPlus /> Adicionar Checklist
          </AddChecklistButton>
        )}
        
        <ActionButtons>
          {isEditing ? (
            <Button onClick={handleSave}>
              <FaSave /> Salvar
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <FaEdit /> Editar
            </Button>
          )}
          
          {note.has_checkboxes && (
            <CompleteButton onClick={handleCompleteNote} disabled={note.all_checked}>
              <FaCheck /> {note.all_checked ? 'Completado' : 'Completar Nota'}
            </CompleteButton>
          )}
          
          <Button danger onClick={handleDelete}>
            <FaTrash /> Excluir
          </Button>
        </ActionButtons>
      </NoteContainer>
    </Container>
  );
};

export default NoteDetail; 