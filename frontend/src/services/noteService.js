import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from './api';
import { nanoid } from 'nanoid';

// Import storage modules
import { 
  initializeStorage, 
  getUserIdForStorage,
  debugLog
} from './storage/localStorageUtils';

import {
  loadUserNotes,
  saveUserNotes,
  validateAndRepairNoteStorage,
  normalizeNote
} from './storage/noteStorage';

import {
  loadUserConnections,
  saveUserConnections,
  validateAndRepairConnectionStorage
} from './storage/connectionStorage';

/**
 * Custom hook to manage notes state
 */
export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize and validate storage on first load
  useEffect(() => {
    // Initialize storage if needed
    initializeStorage();
    
    // Validate and repair storage
    validateAndRepairNoteStorage();
    validateAndRepairConnectionStorage();
  }, []);
  
  // Load notes from local storage, filtered by current user
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        console.log("🔍 Carregando notas para usuário:", user);
        
        // Não carregar notas se não houver usuário autenticado
        if (!user) {
          console.log("Nenhum usuário autenticado. Não carregando notas.");
          setNotes([]);
          setConnections([]);
          setLoading(false);
          return;
        }
        
        // Load notes for this user
        const userNotes = loadUserNotes(user);
        console.log("🔍 Notas carregadas:", userNotes.length, userNotes);
        setNotes(userNotes);
        
        // Load connections for this user
        const userConnections = loadUserConnections(user);
        console.log("🔍 Conexões carregadas:", userConnections.length);
        setConnections(userConnections);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [user]);

  // Save notes to local storage whenever notes change
  useEffect(() => {
    if (!loading && notes && user) {
      saveUserNotes(notes, user);
    }
  }, [notes, user, loading]);
  
  // Save connections to local storage whenever connections change
  useEffect(() => {
    if (!loading && connections && connections.length > 0 && user) {
      saveUserConnections(connections, user);
    }
  }, [connections, user, loading]);

  /**
   * Create a new note
   * @param {Object} data - The note data
   * @returns {Object} - The created note
   */
  const createNote = async (data = {}) => {
    try {
      // Generate unique ID
      const newId = nanoid();
      console.log("Creating note with ID:", newId);
      
      // Get a consistent user ID
      const userId = getUserIdForStorage(user);
      console.log("Using userId for note:", userId);
      
      // Create note with minimum data - empty content
      const newNote = {
        id: newId,
        userId: String(userId),
        title: data.title || '',
        content: data.content || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tasks: [],
        has_checkboxes: false,
        all_checked: false,
        xp_value: 10
      };
      
      // Update state (this will trigger the saveUserNotes effect)
      setNotes(prev => [...prev, newNote]);
      
      console.log("Note created successfully:", newNote);
      return newNote;
    } catch (error) {
      console.error("Error creating note:", error);
      return null;
    }
  };

  /**
   * Update a note
   * @param {string} id - The note ID
   * @param {Object} updatedData - The updated note data
   * @returns {Object} - The updated note
   */
  const updateNote = async (id, updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Find the note to update
      const noteToUpdate = notes.find(note => String(note.id) === String(id));
      
      if (!noteToUpdate) {
        throw new Error(`Note with ID ${id} not found`);
      }
      
      // Create updated note object
      const updatedNote = {
        ...noteToUpdate,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      console.log("Updating note:", updatedNote);
      
      // Update local state
      setNotes(prevNotes => {
        const updated = prevNotes.map(note => 
          String(note.id) === String(id) ? updatedNote : note
        );
        return updated;
      });
      
      setLoading(false);
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      setError(`Failed to update note: ${error.message}`);
      setLoading(false);
      return null;
    }
  };

  /**
   * Delete a note
   * @param {string} id - The note ID
   */
  const deleteNote = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to delete from backend (will fail gracefully if not connected)
      try {
        await API.delete(`/api/notes/${id}/`);
        console.log('Note deleted from backend successfully');
      } catch (apiError) {
        console.error('Failed to delete note from backend, deleting from local storage only:', apiError);
      }
      
      // Delete connections related to this note
      const updatedConnections = connections.filter(
        conn => conn.sourceId !== id && conn.targetId !== id
      );
      
      if (updatedConnections.length !== connections.length) {
        setConnections(updatedConnections);
      }
      
      // Delete note from local state
      const noteExists = notes.some(note => note.id === id);
      
      if (!noteExists) {
        throw new Error(`Note with ID ${id} not found`);
      }
      
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(`Failed to delete note: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a note by ID
   * @param {string} id - The note ID
   * @returns {Object|null} - The note or null if not found
   */
  const getNote = (id) => {
    try {
      if (!id) {
        console.error("Invalid ID provided to getNote:", id);
        return null;
      }
      
      // Convert to string for consistent comparison
      const noteId = String(id);
      console.log(`Looking for note with ID: "${noteId}" in memory cache of ${notes.length} notes`);
      
      // Find note in current state
      let foundNote = notes.find(note => String(note.id) === noteId);
      
      // If found, normalize and return
      if (foundNote) {
        return normalizeNote(foundNote, foundNote.userId);
      }
      
      console.error(`Note with ID "${noteId}" not found`);
      return null;
    } catch (err) {
      console.error("Error in getNote:", err);
      return null;
    }
  };
  
  /**
   * Create a connection between two notes
   * @param {string} sourceId - The source note ID
   * @param {string} targetId - The target note ID
   * @param {string} label - Optional label for the connection
   * @returns {Object} - The created connection
   */
  const createConnection = (sourceId, targetId, label = "") => {
    const userId = getUserIdForStorage(user);
    
    if (!userId) {
      throw new Error('User ID required to create connections');
    }
    
    if (sourceId === targetId) {
      throw new Error("Cannot connect a note to itself");
    }
    
    // Check if connection already exists
    const existingConnection = connections.find(
      conn => conn.sourceId === sourceId && conn.targetId === targetId
    );
    
    if (existingConnection) {
      throw new Error("Connection already exists");
    }
    
    const newConnection = {
      id: Date.now().toString(),
      sourceId,
      targetId,
      label,
      userId: userId,
      createdAt: new Date().toISOString()
    };
    
    setConnections(prev => [...prev, newConnection]);
    return newConnection;
  };
  
  /**
   * Delete a connection
   * @param {string} connectionId - The connection ID
   */
  const deleteConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };
  
  /**
   * Get all connections for the mind map
   * @returns {Array} - Array of connections with note data
   */
  const getMindMapData = () => {
    console.log("getMindMapData chamado. Notas:", notes.length, "Conexões:", connections.length);
    
    if (!notes || !connections) {
      console.warn("Notas ou conexões não definidas");
      return { nodes: [], edges: [] };
    }
    
    const nodes = notes.map(note => ({
      id: note.id,
      label: note.title || "Sem título",
      data: note
    }));
    
    const edges = connections.map(conn => {
      // Verificar se a conexão tem IDs de origem e destino válidos
      if (!conn.sourceId || !conn.targetId) {
        console.warn("Conexão inválida encontrada:", conn);
        return null;
      }
      
      // Verificar se os nós conectados existem
      const sourceExists = notes.some(note => note.id === conn.sourceId);
      const targetExists = notes.some(note => note.id === conn.targetId);
      
      if (!sourceExists || !targetExists) {
        console.warn(`Conexão ${conn.id} refere-se a uma nota que não existe mais`);
        return null;
      }
      
      return {
        id: conn.id,
        source: conn.sourceId,
        target: conn.targetId,
        label: conn.label || ""
      };
    }).filter(Boolean); // Remove conexões inválidas (null)
    
    console.log("Dados do mapa mental gerados:", { nodes: nodes.length, edges: edges.length });
    return { nodes, edges };
  };

  // Clear all notes for testing purposes
  const clearAllNotes = () => {
    setNotes([]);
    setConnections([]);
    saveUserNotes([], user);
    saveUserConnections([], user);
  };

  return {
    notes,
    connections,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    getNote,
    createConnection,
    deleteConnection,
    getMindMapData,
    clearAllNotes
  };
};

export default useNotes; 