import React, { createContext, useContext } from 'react';
import { useNotes } from '../services/noteService';

// Create context
const NoteContext = createContext(null);

// Custom hook to use the note context
export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};

// Provider component
export const NoteProvider = ({ children }) => {
  // Use our custom hook with all note-related functions
  const noteService = useNotes();

  return (
    <NoteContext.Provider value={noteService}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteProvider; 