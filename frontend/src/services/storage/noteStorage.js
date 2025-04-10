import { 
  NOTES_STORAGE_KEY, 
  safeGetItem, 
  safeSetItem, 
  getUserIdForStorage,
  debugLog
} from './localStorageUtils';

/**
 * Load notes for a specific user from localStorage
 */
export const loadUserNotes = (user) => {
  const userId = getUserIdForStorage(user);
  console.log('Loading notes for user ID:', userId);

  if (!userId) {
    console.warn('No user ID available, returning empty notes');
    return [];
  }

  let userNotes = [];
  try {
    const storedNotesStr = localStorage.getItem(NOTES_STORAGE_KEY);
    if (storedNotesStr) {
      const allNotes = JSON.parse(storedNotesStr);
      console.log('All stored notes:', allNotes.length);
      
      if (!Array.isArray(allNotes)) {
        console.error('Notes storage is not an array, treating as empty');
        return [];
      }
      
      // Find notes belonging to this user
      userNotes = allNotes.filter(note => 
        String(note.userId) === userId || 
        (user?.localId && String(note.userId) === String(user.localId))
      );
      
      console.log(`Found ${userNotes.length} notes for user:`, userId);
      
      // Normalize all note data
      userNotes = userNotes.map(note => normalizeNote(note, userId));
    }
  } catch (err) {
    console.error('Error parsing notes from localStorage:', err);
    return [];
  }
  
  return userNotes;
};

/**
 * Save notes to localStorage
 */
export const saveUserNotes = (notes, user) => {
  const userId = getUserIdForStorage(user);
  
  if (!userId) {
    console.warn("Cannot save notes: missing userId");
    return false;
  }
  
  if (!Array.isArray(notes)) {
    console.error("Notes is not an array:", notes);
    return false;
  }
  
  console.log(`Saving ${notes.length} notes to localStorage for user ${userId}`);
  
  try {
    // Get all existing notes from storage
    let allStoredNotes = [];
    try {
      const storedNotesStr = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotesStr) {
        allStoredNotes = JSON.parse(storedNotesStr);
        if (!Array.isArray(allStoredNotes)) {
          console.error('Notes storage is corrupted, resetting');
          allStoredNotes = [];
        }
      }
    } catch (parseErr) {
      console.error('Failed to parse notes from localStorage:', parseErr);
      allStoredNotes = [];
    }
    
    // Filter out notes that belong to the current user, we'll replace them
    const otherUsersNotes = allStoredNotes.filter(note => 
      note && note.userId && String(note.userId) !== userId
    );
    
    // Ensure all notes have proper formatting
    const normalizedUserNotes = notes.map(note => normalizeNote(note, userId));
    
    // Combine other users' notes with current user's notes
    const combinedNotes = [...otherUsersNotes, ...normalizedUserNotes];
    
    // Save to localStorage
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(combinedNotes));
    console.log(`Saved ${normalizedUserNotes.length} notes for user ${userId}. Total in storage: ${combinedNotes.length}`);
    return true;
  } catch (err) {
    console.error('Error saving notes:', err);
    return false;
  }
};

/**
 * Normalize a note object to ensure all fields are properly set
 */
export const normalizeNote = (note, userId) => {
  return {
    ...note,
    id: String(note.id),
    userId: String(userId || note.userId),
    title: note.title || 'Nota sem título',
    content: note.content || '',
    tasks: Array.isArray(note.tasks) ? note.tasks : [],
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: note.updatedAt || new Date().toISOString(),
    has_checkboxes: !!note.has_checkboxes,
    all_checked: !!note.all_checked,
    xp_value: note.xp_value || 5
  };
};

/**
 * Validate and repair notes storage
 */
export const validateAndRepairNoteStorage = () => {
  console.log('Validating localStorage notes integrity');
  
  try {
    let notesNeedRepair = false;
    let notesData = [];
    
    try {
      const storedNotesStr = localStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotesStr) {
        notesData = JSON.parse(storedNotesStr);
        
        if (!Array.isArray(notesData)) {
          console.error('Notes storage is not an array, resetting');
          notesNeedRepair = true;
          notesData = [];
        }
      }
    } catch (err) {
      console.error('Error parsing notes storage, resetting:', err);
      notesNeedRepair = true;
      notesData = [];
    }
    
    // Validate and normalize each note
    if (Array.isArray(notesData) && notesData.length > 0) {
      // Deduplicate notes by ID within each user's notes
      const seenIds = new Map();
      const validatedNotes = [];
      
      for (const note of notesData) {
        // Must have valid ID and userId
        if (note && typeof note === 'object' && note.id && note.userId) {
          const noteId = String(note.id);
          const userId = String(note.userId);
          const key = `${userId}-${noteId}`;
          
          // Only keep the first occurrence of each note ID per user
          if (!seenIds.has(key)) {
            seenIds.set(key, true);
            validatedNotes.push(normalizeNote(note));
          } else {
            console.warn(`Duplicate note found and removed: User ${userId}, Note ${noteId}`);
            notesNeedRepair = true;
          }
        } else {
          console.warn('Invalid note found and removed');
          notesNeedRepair = true;
        }
      }
      
      // Check if some notes were invalid and filtered out
      if (validatedNotes.length !== notesData.length) {
        console.warn(`Repaired notes storage: removed ${notesData.length - validatedNotes.length} duplicate/invalid notes`);
        notesNeedRepair = true;
        notesData = validatedNotes;
      }
    }
    
    // Save repaired data if needed
    if (notesNeedRepair) {
      console.log('Saving repaired notes to localStorage');
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notesData));
    }
    
    return !notesNeedRepair;
  } catch (err) {
    console.error('Error in validateAndRepairNoteStorage:', err);
    return false;
  }
}; 