import { 
  CONNECTIONS_STORAGE_KEY, 
  safeGetItem, 
  safeSetItem, 
  getUserIdForStorage,
  debugLog
} from './localStorageUtils';

/**
 * Load connections for a specific user from localStorage
 */
export const loadUserConnections = (user) => {
  const userId = getUserIdForStorage(user);

  if (!userId) {
    debugLog('No user ID available, returning empty connections');
    return [];
  }

  let userConnections = [];
  try {
    const allConnections = safeGetItem(CONNECTIONS_STORAGE_KEY);
    if (allConnections) {
      userConnections = allConnections.filter(conn => 
        String(conn.userId) === String(userId) || 
        (user?.localId && String(conn.userId) === String(user.localId))
      );
      
      debugLog(`Found ${userConnections.length} connections for user:`, userId);
    }
  } catch (err) {
    console.error('Error parsing connections from localStorage:', err);
    userConnections = [];
  }
  
  return userConnections;
};

/**
 * Save connections to localStorage
 */
export const saveUserConnections = (connections, user) => {
  const userId = getUserIdForStorage(user);
  
  if (!userId) {
    debugLog("Cannot save connections: missing userId");
    return false;
  }
  
  if (!Array.isArray(connections)) {
    console.error("Connections is not an array:", connections);
    return false;
  }
  
  try {
    // Get all connections from all users
    const allConnections = safeGetItem(CONNECTIONS_STORAGE_KEY) || [];
    
    // Filter out current user's connections and add the updated ones
    const otherUsersConnections = allConnections.filter(conn => 
      conn && conn.userId && String(conn.userId) !== String(userId)
    );
    
    // Normalize connections
    const normalizedConnections = connections.map(conn => ({
      ...conn,
      id: String(conn.id),
      userId: String(userId),
      sourceId: String(conn.sourceId),
      targetId: String(conn.targetId),
      label: conn.label || '',
      createdAt: conn.createdAt || new Date().toISOString()
    }));
    
    const updatedAllConnections = [...otherUsersConnections, ...normalizedConnections];
    
    safeSetItem(CONNECTIONS_STORAGE_KEY, updatedAllConnections);
    debugLog(`Saved ${normalizedConnections.length} connections for user ${userId}. Total: ${updatedAllConnections.length}`);
    return true;
  } catch (err) {
    console.error('Error saving connections:', err);
    return false;
  }
};

/**
 * Validate and repair connections storage
 */
export const validateAndRepairConnectionStorage = () => {
  debugLog('Validating connections storage integrity');
  
  try {
    let connectionsNeedRepair = false;
    let connectionsData = [];
    
    try {
      const storedConnectionsStr = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
      if (storedConnectionsStr) {
        connectionsData = JSON.parse(storedConnectionsStr);
        
        if (!Array.isArray(connectionsData)) {
          console.error('Connections storage is not an array, resetting');
          connectionsNeedRepair = true;
          connectionsData = [];
        }
      }
    } catch (err) {
      console.error('Error parsing connections storage, resetting:', err);
      connectionsNeedRepair = true;
      connectionsData = [];
    }
    
    // Validate connections - check for required fields
    if (Array.isArray(connectionsData) && connectionsData.length > 0) {
      const validConnections = connectionsData.filter(conn => 
        conn && typeof conn === 'object' && 
        conn.id && conn.userId && conn.sourceId && conn.targetId
      );
      
      if (validConnections.length !== connectionsData.length) {
        debugLog(`Removed ${connectionsData.length - validConnections.length} invalid connections`);
        connectionsNeedRepair = true;
        connectionsData = validConnections;
      }
    }
    
    // Save repaired connections if needed
    if (connectionsNeedRepair) {
      debugLog('Saving repaired connections to localStorage');
      localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(connectionsData));
    }
    
    return !connectionsNeedRepair;
  } catch (err) {
    console.error('Error in validateAndRepairConnectionStorage:', err);
    return false;
  }
}; 