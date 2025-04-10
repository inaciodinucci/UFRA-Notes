import { useState, useEffect } from 'react';
import api from './api';

// Local storage keys
const NOTES_STORAGE_KEY = 'ufra_notes';

/**
 * Custom hook to manage notes state
 */
export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notes from local storage
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        // In a real app, you would get notes from the backend
        // const response = await api.get('/api/notes/');
        // setNotes(response.data);

        // For now, we'll use local storage
        const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (err) {
        console.error('Error loading notes:', err);
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Save notes to local storage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, loading]);

  /**
   * Create a new note
   * @param {Object} noteData - The note data
   * @returns {Object} - The created note
   */
  const createNote = async (noteData) => {
    try {
      // In a real app, you would send to backend
      // const response = await api.post('/api/notes/', noteData);
      // const newNote = response.data;

      const newNote = {
        id: Date.now().toString(),
        ...noteData,
        createdAt: new Date().toISOString(),
      };

      setNotes((prevNotes) => [newNote, ...prevNotes]);
      return newNote;
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note');
      throw err;
    }
  };

  /**
   * Update a note
   * @param {string} id - The note ID
   * @param {Object} noteData - The updated note data
   * @returns {Object} - The updated note
   */
  const updateNote = async (id, noteData) => {
    try {
      // In a real app, you would send to backend
      // const response = await api.put(`/api/notes/${id}/`, noteData);
      // const updatedNote = response.data;

      const updatedNote = {
        ...noteData,
        id,
        updatedAt: new Date().toISOString(),
      };

      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? updatedNote : note))
      );

      return updatedNote;
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note');
      throw err;
    }
  };

  /**
   * Delete a note
   * @param {string} id - The note ID
   */
  const deleteNote = async (id) => {
    try {
      // In a real app, you would send to backend
      // await api.delete(`/api/notes/${id}/`);

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
      throw err;
    }
  };

  /**
   * Get a note by ID
   * @param {string} id - The note ID
   * @returns {Object|null} - The note or null if not found
   */
  const getNote = (id) => {
    return notes.find((note) => note.id === id) || null;
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  };
};

export default useNotes; 