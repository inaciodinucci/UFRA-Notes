// Local storage keys with version to force refresh
export const NOTES_STORAGE_KEY = 'ufra_notes_v2';
export const CONNECTIONS_STORAGE_KEY = 'ufra_connections_v2';

// Debug mode
const DEBUG = true;

// Debug log function
export const debugLog = (...args) => {
  if (DEBUG) {
    console.log('[storage]', ...args);
  }
};

/**
 * Safely get an item from localStorage with JSON parsing
 */
export const safeGetItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error(`Erro ao ler ${key} do localStorage:`, e);
    return null;
  }
};

/**
 * Safely set an item in localStorage with JSON stringification
 */
export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Erro ao salvar ${key} no localStorage:`, e);
    return false;
  }
};

/**
 * Initialize storage if it doesn't exist
 */
export const initializeStorage = () => {
  if (!localStorage.getItem(NOTES_STORAGE_KEY)) {
    console.log('Initializing notes storage');
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(CONNECTIONS_STORAGE_KEY)) {
    console.log('Initializing connections storage');
    localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify([]));
  }
};

/**
 * Get a reliable user ID for storage
 */
export const getUserIdForStorage = (user) => {
  let userId;
  
  if (user?.id) {
    userId = String(user.id);
  } else if (user?.localId) {
    userId = String(user.localId);
  } else {
    // Try to get from localStorage
    let storedId = localStorage.getItem('localUserId');
    if (storedId) {
      try {
        // If it's stored as JSON string, parse it
        const parsedId = JSON.parse(storedId);
        userId = String(parsedId);
      } catch (e) {
        // If not JSON, use as is
        userId = String(storedId);
      }
    } else {
      // Create a new ID if none exists
      userId = 'user_' + Date.now();
      localStorage.setItem('localUserId', userId);
    }
  }
  
  return userId;
}; 