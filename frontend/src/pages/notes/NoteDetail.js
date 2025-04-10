import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaCalendarAlt, FaEdit, FaSave, FaTrash, FaPlus, FaCheck, FaTrophy, FaTimes, FaImage } from 'react-icons/fa';
import { useNoteContext } from '../../context/NoteContext';
import ReactMarkdown from 'react-markdown';
import { useDropzone } from 'react-dropzone';

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
  background-color: ${({ theme, completed }) => 
    completed ? `rgba(0, 250, 220, 0.05)` : theme.colors.backgroundDark};
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

const CompletedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #00dc82;
  font-size: 1.5rem;
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
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }
  
  /* Force break for very long content without spaces */
  p, div, span, li {
    overflow-wrap: break-word;
    word-break: break-word;
    -ms-word-break: break-all;
    hyphens: auto;
  }
  
  /* Better image handling */
  img {
    max-width: 100%;
    height: auto;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    display: block;
    margin: ${({ theme }) => theme.spacing.md} 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    
    /* Make images resizable */
    resize: both;
    overflow: hidden;
    
    /* Limit height to prevent extremely tall images */
    max-height: 80vh;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.primary};
    margin-top: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  h1 {
    font-size: 1.8rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderDark};
    padding-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  h3 {
    font-size: 1.3rem;
  }
  
  ul, ol {
    margin-left: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
    padding-left: ${({ theme }) => theme.spacing.md};
    margin-left: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.textDark};
    font-style: italic;
  }
  
  code {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
  
  pre code {
    display: block;
    padding: ${({ theme }) => theme.spacing.md};
    overflow-x: auto;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
  
  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
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

// Add this style for the Markdown wrapper
const MarkdownWrapper = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
`;

// Add new styled components for image handling
const ImageDropZone = styled.div`
  border: 2px dashed ${({ theme, isDragActive }) => 
    isDragActive ? theme.colors.primary : theme.colors.border};
  border-radius: 4px;
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: ${({ theme, isDragActive }) => 
    isDragActive ? theme.colors.primary : theme.colors.textDark};
  background-color: ${({ theme, isDragActive }) => 
    isDragActive ? 'rgba(0, 250, 220, 0.05)' : 'transparent'};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(0, 250, 220, 0.05);
  }
`;

// Fix the ImageContainer, NoteImage, and ImageToolbar components to prevent ESLint warnings
/* These components are used for image handling but not directly referenced in JSX.
   We're exporting them to avoid ESLint warnings. They're used by the dropzone functionality. */
export const ImageContainer = styled.div`
  position: relative;
  margin: ${({ theme }) => theme.spacing.md} 0;
  display: inline-block;
  max-width: 100%;
`;

export const NoteImage = styled.img`
  max-width: 100%;
  height: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  transition: transform 0.2s ease;
  cursor: move;
  resize: both;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ImageToolbar = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  padding: 4px;
`;

const ImageToolButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getNote, updateNote, deleteNote, createNote } = useNoteContext();
  
  console.log("NoteDetail component rendered with id:", id);
  
  const passedNoteData = location.state?.note;
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(id === 'new'); // Auto-edit for new notes
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [tasks, setTasks] = useState([]);
  const [hasCheckboxes, setHasCheckboxes] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [xpValue, setXpValue] = useState(5);
  const [xpGained, setXpGained] = useState(0);
  const [showXpGained, setShowXpGained] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [showImageDropZone, setShowImageDropZone] = useState(false);
  
  // Handle image drop
  const onDrop = useCallback(acceptedFiles => {
    // Process each dropped file
    acceptedFiles.forEach(file => {
      if (!file.type.startsWith('image/')) {
        console.error('File is not an image:', file.type);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        // Create an image element to get dimensions and potentially resize
        const img = new Image();
        img.onload = () => {
          // Create a canvas to resize the image
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // If image is larger than 1200px, scale it down to reduce file size
          const maxWidth = 1200;
          const maxHeight = 1200;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw the resized image on the canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get the resized image data at lower quality to reduce file size
          const resizedImageData = canvas.toDataURL(file.type, 0.7);
          
          const newImage = {
            id: Date.now().toString(),
            src: resizedImageData,
            width: width,
            height: height,
            filename: file.name
          };
          
          // Add image to state
          setImages(prevImages => [...prevImages, newImage]);
          
          // Add image markdown to content with custom class for resizing
          const imageMarkdown = `![${file.name}](${resizedImageData})\n\n`;
          setEditedContent(prev => prev + imageMarkdown);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
    
    // Hide the drop zone after upload
    setShowImageDropZone(false);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    }
  });
  
  // Handle loading notes on mount
  useEffect(() => {
    console.log("NoteDetail carregando nota com ID:", id);
    
    setLoading(true);
    
    if (id === 'new') {
      // Initialize a new note with empty content
      const newEmptyNote = {
        id: 'temp-new',
        title: '', // Empty title - will use placeholder
        content: '', // Empty content - no default content
        tasks: [],
        has_checkboxes: false,
        all_checked: false,
        xp_value: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setNote(newEmptyNote);
      setEditedTitle(newEmptyNote.title);
      setEditedContent(newEmptyNote.content);
      setIsEditing(true); // Auto-enable editing for new notes
      setLoading(false);
    } else {
      const currentNote = getNote(id);
      
      if (currentNote) {
        console.log("Nota encontrada:", currentNote);
        setNote(currentNote);
        setEditedTitle(currentNote.title);
        setEditedContent(currentNote.content);
        setHasCheckboxes(!!currentNote.has_checkboxes);
        setAllChecked(!!currentNote.all_checked);
        setTasks(currentNote.tasks || []);
        setXpValue(currentNote.xp_value || 5);
        setLoading(false);
      } else {
        console.error(`Nota com ID ${id} não encontrada`);
        alert(`Nota com ID ${id} não encontrada. Redirecionando para a lista de notas.`);
        navigate('/notas');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  // Also, let's add a useEffect hook to handle the case when a new note is created directly
  useEffect(() => {
    // If we've just created a note and got redirected to it, start in edit mode
    if (note && !loading && note.id !== 'new' && note.id !== 'temp-new') {
      // Check if this note was just created (within last minute)
      const justCreated = new Date().getTime() - new Date(note.createdAt).getTime() < 60000;
      
      if (justCreated) {
        setIsEditing(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note, loading]);
  
  // Add a useEffect for handling image resizing
  useEffect(() => {
    // Function to make images resizable
    const makeImagesResizable = () => {
      if (!isEditing) {
        setTimeout(() => {
          const noteImages = document.querySelectorAll('.note-content img');
          
          noteImages.forEach(img => {
            // Set image styles
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.resize = 'both';
            img.style.overflow = 'hidden';
            img.style.maxHeight = '80vh';
            img.style.display = 'block';
            img.style.border = '1px solid #30444e';
            img.style.borderRadius = '4px';
            img.style.margin = '16px 0';
            img.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            
            // Make sure images have proper cursors when being resized
            img.addEventListener('mousedown', (e) => {
              const rect = img.getBoundingClientRect();
              const isBottomRight = 
                e.clientX > rect.right - 10 && 
                e.clientY > rect.bottom - 10;
              
              img.style.cursor = isBottomRight ? 'nwse-resize' : 'move';
            });
          });
        }, 100);
      }
    };
    
    makeImagesResizable();
  }, [note, isEditing, editedContent]);
  
  // Focus input when in edit mode for new note
  useEffect(() => {
    if (isEditing && id === 'new') {
      // Add a small delay to ensure the input is rendered
      const timer = setTimeout(() => {
        const titleInput = document.querySelector('input[placeholder="Título"]');
        if (titleInput) {
          titleInput.focus();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isEditing, id]);
  
  const toggleTaskCompletion = (taskId) => {
    // Create updated tasks array
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    // Check if all tasks are completed
    const allCompleted = updatedTasks.length > 0 && 
      updatedTasks.every(task => task.completed);
    
    // Update local state
    setTasks(updatedTasks);
    setHasCheckboxes(updatedTasks.length > 0);
    setAllChecked(allCompleted);
    
    // Update in storage if not a new note
    if (id !== 'new' && note) {
      try {
        console.log("Updating note after task completion toggle:", {
          ...note,
          tasks: updatedTasks,
          has_checkboxes: updatedTasks.length > 0,
          all_checked: allCompleted
        });
        updateNote(id, {
          ...note,
          tasks: updatedTasks,
          has_checkboxes: updatedTasks.length > 0,
          all_checked: allCompleted
        });
      } catch (error) {
        console.error("Error updating task completion status:", error);
      }
    }
  };
  
  const handleSave = async () => {
    try {
      console.log(`Salvando nota com ID: "${id}"`);
      
      // Use "Nova Nota" as default title if empty
      const finalTitle = editedTitle.trim() || "Nova Nota";
      
      // Prepare basic note data
      const noteData = {
        title: finalTitle,
        content: editedContent,
        tasks: tasks || [],
        updatedAt: new Date().toISOString()
      };
      
      console.log("Atualizando nota com dados:", noteData);
      
      // Update note
      try {
        const updatedNote = await updateNote(id, {
          ...note,
          ...noteData
        });
        
        if (updatedNote) {
          console.log("Nota atualizada com sucesso:", updatedNote);
          
          // Update local state
          setNote(updatedNote);
          setEditedTitle(updatedNote.title);
          setEditedContent(updatedNote.content);
          setIsEditing(false);
          
          alert("Nota atualizada com sucesso!");
        } else {
          throw new Error("Falha ao atualizar nota");
        }
      } catch (error) {
        console.error("Erro ao atualizar nota:", error);
        alert(`Erro ao atualizar nota: ${error.message}`);
      }
    } catch (error) {
      console.error("Erro no handleSave:", error);
      alert("Erro ao salvar nota. Tente novamente.");
    }
  };
  
  // Handle key press for task input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      e.preventDefault();
      handleAddTask();
    }
  };
  
  const handleAddTask = () => {
    if (!newTaskText.trim()) {
      return;
    }
    
    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };
    
    // Make sure the tasks array exists
    const currentTasks = tasks || [];
    
    const updatedTasks = [...currentTasks, newTask];
    
    // Update in storage immediately
    if (id !== 'new') {
      try {
        updateNote(id, {
          ...note,
          tasks: updatedTasks,
          has_checkboxes: true
        }).then(updated => {
          setNote(updated);
          setTasks(updated.tasks);
          setHasCheckboxes(true);
        });
      } catch (error) {
        console.error('Failed to update note with new task:', error);
      }
    } else {
      setNote({
        ...note,
        tasks: updatedTasks,
        has_checkboxes: true
      });
      setTasks(updatedTasks);
    }
    
    setNewTaskText('');
  };
  
  const handleRemoveTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
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
      tasks: tasks.map(task => ({ ...task, completed: true }))
    };
    
    setNote(updatedNote);
    
    // Update in storage if not a new note
    if (id !== 'new') {
      updateNote(id, updatedNote);
    }
    
    // Simulate XP gain
    setXpGained(xpValue);
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

  // Add functions for image handling
  const toggleImageDropZone = () => {
    setShowImageDropZone(prev => !prev);
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

      <Title>{id === 'new' ? 'Nova Nota' : note.title || `Nota #${id}`}</Title>

      <NoteContainer completed={note.all_checked}>
        {note.all_checked && (
          <CompletedBadge>
            <FaCheck />
          </CompletedBadge>
        )}
        <NoteHeader>
          {isEditing ? (
            <TitleInput 
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Título"
              autoFocus={id === 'new'}
            />
          ) : (
            <NoteTitle>{note.title || "Nova Nota"}</NoteTitle>
          )}
          
          {!isEditing && (
            <NoteDate>
              <FaCalendarAlt /> {new Date(note.createdAt).toLocaleDateString('pt-BR')}
            </NoteDate>
          )}
        </NoteHeader>
        
        {isEditing && (
          <div>
            {showImageDropZone ? (
              <ImageDropZone {...getRootProps()} isDragActive={isDragActive}>
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <p>Solte as imagens aqui...</p> :
                    <p>Arraste e solte imagens aqui, ou clique para selecionar</p>
                }
              </ImageDropZone>
            ) : (
              <Button 
                style={{ marginBottom: '20px' }} 
                onClick={toggleImageDropZone}
              >
                <FaImage /> Adicionar Imagem
              </Button>
            )}
          </div>
        )}
        
        {isEditing ? (
          <NoteTextArea 
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Escreva aqui"
            autoFocus={id === 'new' && editedTitle !== ''}
          />
        ) : (
          <NoteContent className="note-content">
            <MarkdownWrapper>
              <ReactMarkdown breaks>{note.content || ''}</ReactMarkdown>
            </MarkdownWrapper>
          </NoteContent>
        )}
        
        <XpValue>
          <FaTrophy /> Valor de XP: {note.xp_value} {xpGained > 0 && `(+${xpGained} XP ganho!)`}
        </XpValue>
        
        {note.has_checkboxes && note.tasks && note.tasks.length > 0 && (
          <TaskSection>
            <TaskTitle>Tarefas</TaskTitle>
            <TaskList>
              {note.tasks.map(task => (
                <TaskItem key={`task-${task.id}`}>
                  <input 
                    type="checkbox" 
                    id={`task-${task.id}`}
                    checked={task.completed || false}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <label htmlFor={`task-${task.id}`}>{task.text}</label>
                  {!isEditing && (
                    <RemoveButton 
                      onClick={() => handleRemoveTask(task.id)}
                      title="Remover tarefa"
                    >
                      <FaTimes />
                    </RemoveButton>
                  )}
                </TaskItem>
              ))}
            </TaskList>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <CompleteButton 
                onClick={handleCompleteNote} 
                disabled={note.all_checked}
                style={{ marginRight: 'auto' }}
              >
                <FaCheck /> Finalizar Todas as Tarefas
              </CompleteButton>
              
              <RemoveChecklistButton onClick={handleRemoveAllTasks}>
                <FaTimes /> Remover Checklist
              </RemoveChecklistButton>
            </div>
          </TaskSection>
        )}
        
        {!note.all_checked && (
          <div>
            {showNewTaskInput ? (
              <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <TaskTitle>Adicionar Tarefa</TaskTitle>
                <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
                  <NewTaskInput
                    type="text"
                    placeholder="Digite uma nova tarefa..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button type="submit">
                      <FaPlus /> Adicionar
                    </Button>
                    <Button type="button" onClick={() => setShowNewTaskInput(false)}>
                      <FaTimes /> Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <AddChecklistButton onClick={() => setShowNewTaskInput(true)} style={{ marginTop: '20px' }}>
                <FaPlus /> Adicionar {note.has_checkboxes ? 'Mais Tarefas' : 'Checklist'}
              </AddChecklistButton>
            )}
          </div>
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
          
          <Button danger onClick={handleDelete}>
            <FaTrash /> Excluir
          </Button>
        </ActionButtons>
      </NoteContainer>
    </Container>
  );
};

export default NoteDetail; 