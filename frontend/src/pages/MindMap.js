import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaArrowRight, FaLink, FaBug } from 'react-icons/fa';
import { useNoteContext } from '../context/NoteContext';
import { useAuth } from '../context/AuthContext';
import { NOTES_STORAGE_KEY } from '../services/storage/localStorageUtils';

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

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const MindMapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Node = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 180px;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, isSelected }) => 
    isSelected ? 'rgba(0, 250, 220, 0.2)' : theme.colors.backgroundLight};
  border: 1px solid ${({ theme, isSelected, isConnectionSource, isConnectionTarget }) => 
    isConnectionSource ? '#ff9500' : 
    isConnectionTarget ? '#00ff9d' : 
    isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 5;
  cursor: ${props => props.connectMode ? 'pointer' : 'move'};
  user-select: none;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NodeTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NodeActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const NodeButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  margin: 0 3px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ConnectButton = styled(NodeButton)`
  color: ${({ active }) => active ? '#ff9500' : '#aaa'};
  
  &:hover {
    color: #ff9500;
  }
`;

const ConnectionLine = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const TempConnectionLine = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
`;

const ConnectionControls = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.short};
  
  &:hover:not(:disabled) {
    background-color: rgba(0, 250, 220, 0.1);
    box-shadow: 0 0 10px rgba(0, 250, 220, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectWrapper = styled.div`
  display: inline-block;
  margin: 0 ${({ theme }) => theme.spacing.md};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.primary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MindMap = () => {
  const { notes, connections, createConnection, deleteConnection, getMindMapData, createNote } = useNoteContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectMode, setConnectMode] = useState(false);
  const [sourceNode, setSourceNode] = useState(null);
  const [targetNode, setTargetNode] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [activeNodeConnection, setActiveNodeConnection] = useState(null);
  
  // Adicionar contador para forçar recarregamento
  const [refreshCounter, setRefreshCounter] = useState(0);
  
  // Função para forçar recarregamento
  const handleForceRefresh = () => {
    console.log("Forçando recarregamento do mapa mental");
    setRefreshCounter(prev => prev + 1);
  };
  
  // Inicializar posições para os nós
  useEffect(() => {
    console.log("Verificando notas:", notes);
    
    if (containerRef.current) {
      console.log("🔄 Inicializando mapa mental - notas disponíveis:", notes.length);
      console.log("🔄 Refresh counter:", refreshCounter);
      
      const container = containerRef.current;
      const containerWidth = container ? container.clientWidth : 800;
      const containerHeight = container ? container.clientHeight : 500;
      
      // Criar um array limpo de nós
      const newNodes = [];
      
      // Debug: Verificar o formato das notas
      if (notes.length > 0) {
        console.log("Exemplo de nota:", notes[0]);
      } else {
        console.log("Nenhuma nota encontrada. Usuário:", user);
      }
      
      notes.forEach(note => {
        // Check if this note belongs to the current user
        if (user && note.userId !== user.id && note.userId !== user.localId && String(note.userId) !== String(user?.id) && String(note.userId) !== String(user?.localId)) {
          console.log(`Nota ${note.id} pertence ao usuário ${note.userId}, não ao usuário atual ${user?.id || user?.localId}`);
          return;
        }
        
        // Find existing position if available
        const existingNode = nodes.find(n => n.id === note.id);
        
        if (existingNode) {
          // Keep position but update title and data
          newNodes.push({
            ...existingNode,
            title: note.title || "Sem título",
            data: note
          });
        } else {
          // Generate position for new nodes in a grid layout
          const index = newNodes.length;
          const columns = Math.floor((containerWidth - 40) / 220) || 1;
          const x = (index % columns) * 220 + 20;
          const y = Math.floor(index / columns) * 150 + 20;
          
          newNodes.push({
            id: note.id,
            title: note.title || "Sem título",
            x,
            y,
            data: note
          });
        }
      });
      
      console.log("🔄 Definindo nós:", newNodes.length, "nós");
      setNodes(newNodes);
      
      // Load connections
      if (getMindMapData) {
        const { edges } = getMindMapData();
        console.log("🔄 Definindo conexões:", edges.length, "conexões");
        setEdges(edges);
      }
    }
  }, [notes, user, getMindMapData, refreshCounter, connections]);
  
  const handleNodeMouseDown = (e, node) => {
    console.log("🖱️ Mouse down no nó:", node.id);
    e.stopPropagation();
    
    if (isCreatingConnection) {
      if (!sourceNode) {
        setSourceNode(node);
      } else if (node.id !== sourceNode.id) {
        // Criar conexão entre os nós
        try {
          createConnection(sourceNode.id, node.id);
          setSourceNode(null);
          setIsCreatingConnection(false);
          setActiveNodeConnection(null);
        } catch (error) {
          console.error("Erro ao criar conexão:", error);
          alert(error.message);
        }
      }
      return;
    }
    
    // Iniciar arrasto do nó
    setSelectedNode(node.id);
    setDraggedNode(node);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleMouseMove = (e) => {
    const container = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - container.left,
      y: e.clientY - container.top
    });
    
    if (!draggedNode) return;
    
    // Calculate new position
    const x = Math.max(0, Math.min(e.clientX - container.left - dragOffset.x, container.width - 180));
    const y = Math.max(0, Math.min(e.clientY - container.top - dragOffset.y, container.height - 100));
    
    // Atualizar apenas o nó que está sendo arrastado
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === draggedNode.id 
          ? { ...node, x, y } 
          : node
      )
    );
  };
  
  const handleMouseUp = () => {
    if (draggedNode) {
      console.log("🖱️ Parou de arrastar nó:", draggedNode.id);
      setDraggedNode(null);
      setSelectedNode(null);
    }
  };
  
  const handleEditNode = (e, noteId) => {
    e.stopPropagation();
    navigate(`/notas/${noteId}`);
  };
  
  const toggleConnectMode = () => {
    setConnectMode(!connectMode);
    setSourceNode(null);
    setTargetNode(null);
    setIsCreatingConnection(false);
    setActiveNodeConnection(null);
  };
  
  const startNodeConnection = (e, nodeId) => {
    e.stopPropagation();
    setIsCreatingConnection(true);
    const node = nodes.find(n => n.id === nodeId);
    setSourceNode(node);
    setActiveNodeConnection(nodeId);
  };
  
  const handleCreateConnection = () => {
    if (sourceNode && targetNode) {
      try {
        createConnection(sourceNode.id, targetNode.id);
        // Reset connection state
        setSourceNode(null);
        setTargetNode(null);
        setIsCreatingConnection(false);
        setActiveNodeConnection(null);
      } catch (error) {
        console.error("Erro ao criar conexão:", error);
        alert(error.message);
      }
    }
  };
  
  const handleDeleteConnection = (connectionId) => {
    deleteConnection(connectionId);
  };
  
  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: `Nota ${new Date().toLocaleTimeString()}`,
        content: 'Nova nota criada a partir do mapa mental'
      });
      console.log("Nova nota criada:", newNote);
    } catch (error) {
      console.error("Erro ao criar nota:", error);
    }
  };
  
  const debugStorage = () => {
    try {
      // Ler diretamente do localStorage
      const notesStr = localStorage.getItem(NOTES_STORAGE_KEY);
      if (notesStr) {
        const allNotes = JSON.parse(notesStr);
        console.log("DEBUG - Todas as notas no localStorage:", allNotes);
        if (user) {
          const userId = user.id || user.localId;
          const userNotes = allNotes.filter(note => 
            String(note.userId) === String(userId)
          );
          console.log(`DEBUG - Notas do usuário ${userId}:`, userNotes);
        }
      } else {
        console.log("DEBUG - Nenhuma nota encontrada no localStorage");
      }
      
      // Criar uma nota de teste diretamente no localStorage
      if (window.confirm("Deseja criar uma nota de teste diretamente no localStorage?")) {
        const testNote = {
          id: `test_${Date.now()}`,
          userId: user?.id || user?.localId || 'guest',
          title: "Nota de teste",
          content: "Esta é uma nota de teste criada diretamente no localStorage",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        let notes = [];
        try {
          const existing = localStorage.getItem(NOTES_STORAGE_KEY);
          if (existing) {
            notes = JSON.parse(existing);
          }
        } catch (e) {
          console.error("Erro ao ler notas:", e);
        }
        
        notes.push(testNote);
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
        console.log("Nota de teste criada. Recarregue a página para ver.");
        alert("Nota de teste criada. Recarregue a página para ver.");
      }
    } catch (error) {
      console.error("Erro ao debugar storage:", error);
    }
  };
  
  return (
    <div>
      <Title>Mapa Mental</Title>
      <Description>
        Visualize e conecte suas notas em um mapa mental interativo.
        {isCreatingConnection ? " Clique em outra nota para conectá-la." : " Arraste as notas para organizar ou use o botão de conexão em cada nota."}
      </Description>
      
      <ConnectionControls>
        <Button onClick={toggleConnectMode} style={{marginRight: '10px'}}>
          {connectMode ? "Sair do Modo Conexão" : "Entrar no Modo Conexão"}
        </Button>
        
        <Button onClick={handleCreateNote} style={{marginRight: '10px', background: 'rgba(0, 250, 0, 0.1)'}}>
          <FaPlus /> Criar Nova Nota
        </Button>
        
        <Button onClick={debugStorage} style={{marginRight: '10px', background: 'rgba(255, 0, 0, 0.1)'}}>
          <FaBug /> Debug Storage
        </Button>
        
        <Button onClick={handleForceRefresh} style={{marginRight: '10px', background: 'rgba(0, 0, 255, 0.1)'}}>
          Recarregar Mapa
        </Button>
        
        {connectMode && sourceNode && targetNode && (
          <Button 
            onClick={handleCreateConnection}
            disabled={!sourceNode || !targetNode}
          >
            <FaArrowRight /> Criar Conexão
          </Button>
        )}
      </ConnectionControls>
      
      <MindMapContainer 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {notes.length === 0 ? (
          <EmptyState>
            <p>Você ainda não possui notas para visualizar no mapa mental.</p>
            <p>Crie algumas notas para começar!</p>
            <Button onClick={() => navigate('/notas')}>
              <FaPlus /> Criar Notas
            </Button>
          </EmptyState>
        ) : (
          <>
            <ConnectionLine>
              {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source);
                const target = nodes.find(n => n.id === edge.target);
                
                if (!source || !target) return null;
                
                // Calculate center points of nodes
                const sourceX = source.x + 90;
                const sourceY = source.y + 30;
                const targetX = target.x + 90;
                const targetY = target.y + 30;
                
                return (
                  <g key={edge.id}>
                    <line 
                      x1={sourceX}
                      y1={sourceY}
                      x2={targetX}
                      y2={targetY}
                      stroke="#00FADc"
                      strokeWidth="2"
                      strokeOpacity="0.6"
                      markerEnd="url(#arrowhead)"
                    />
                    <text 
                      x={(sourceX + targetX) / 2}
                      y={(sourceY + targetY) / 2 - 5}
                      fill="#ccc"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                    {/* Delete connection button */}
                    <circle 
                      cx={(sourceX + targetX) / 2}
                      cy={(sourceY + targetY) / 2}
                      r="8"
                      fill="#333"
                      stroke="#ff3232"
                      strokeWidth="1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteConnection(edge.id)}
                    />
                    <text 
                      x={(sourceX + targetX) / 2}
                      y={(sourceY + targetY) / 2 + 3}
                      fill="#fff"
                      fontSize="10"
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      ×
                    </text>
                  </g>
                );
              })}
              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#00FADc" />
                </marker>
              </defs>
            </ConnectionLine>
            
            {/* Temporary connection line when creating a connection */}
            {isCreatingConnection && sourceNode && (
              <TempConnectionLine>
                <line 
                  x1={sourceNode.x + 90}
                  y1={sourceNode.y + 30}
                  x2={mousePosition.x}
                  y2={mousePosition.y}
                  stroke="#ff9500"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  strokeOpacity="0.8"
                />
              </TempConnectionLine>
            )}
            
            {nodes.map(node => (
              <Node 
                key={node.id}
                x={node.x}
                y={node.y}
                isSelected={node.id === selectedNode}
                isConnectionSource={sourceNode && node.id === sourceNode.id}
                isConnectionTarget={targetNode && node.id === targetNode.id}
                connectMode={isCreatingConnection}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
              >
                <NodeTitle>{node.title || "Sem título"}</NodeTitle>
                <NodeActions>
                  <NodeButton 
                    onClick={(e) => handleEditNode(e, node.id)}
                    title="Editar nota"
                  >
                    <FaEdit />
                  </NodeButton>
                  <ConnectButton 
                    onClick={(e) => startNodeConnection(e, node.id)}
                    title="Conectar esta nota com outra"
                    active={activeNodeConnection === node.id}
                  >
                    <FaLink />
                  </ConnectButton>
                </NodeActions>
              </Node>
            ))}
          </>
        )}
      </MindMapContainer>
    </div>
  );
};

export default MindMap; 