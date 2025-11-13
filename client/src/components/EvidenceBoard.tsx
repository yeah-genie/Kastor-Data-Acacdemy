import { useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ReactFlow, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
  Panel,
  NodeChange,
  EdgeChange,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { List } from "lucide-react";
import { 
  useDetectiveGame, 
  Evidence,
  CharacterEvidence,
  DataEvidence,
  DialogueEvidence,
  PhotoEvidence,
  DocumentEvidence
} from "@/lib/stores/useDetectiveGame";
import { 
  CharacterCard,
  DataCard,
  DialogueCard,
  PhotoCard,
  DocumentCard
} from "@/components/evidence-cards";
import { Handle, Position } from '@xyflow/react';

interface EvidenceBoardProps {
  onClose: () => void;
  onSwitchToList: () => void;
}

interface EvidenceNodeData extends Record<string, unknown> {
  evidence: Evidence;
}

function EvidenceNode({ data, id }: { data: EvidenceNodeData; id: string }) {
  const { evidence } = data;
  const { selectedNodeId, isNodeCollapsed, selectNode, toggleNodeCollapse } = useDetectiveGame();
  
  const isSelected = selectedNodeId === id;
  const isCollapsed = isNodeCollapsed(id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(id);
    toggleNodeCollapse(id);
  };
  
  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-6 !h-6 !border-3 !border-white !shadow-md" />
      
      <motion.div 
        className={`rounded-2xl shadow-xl ${
          isSelected 
            ? "bg-blue-50 border-3 border-blue-500" 
            : "bg-white border-2 border-gray-300"
        }`}
        initial={false}
        animate={{ 
          scale: isSelected ? 1.08 : 1,
          boxShadow: isSelected 
            ? "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)" 
            : "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25 
        }}
      >
        {evidence.type === "CHARACTER" && <CharacterCard evidence={evidence as CharacterEvidence} collapsed={isCollapsed} />}
        {evidence.type === "DATA" && <DataCard evidence={evidence as DataEvidence} collapsed={isCollapsed} />}
        {evidence.type === "DIALOGUE" && <DialogueCard evidence={evidence as DialogueEvidence} collapsed={isCollapsed} />}
        {evidence.type === "PHOTO" && <PhotoCard evidence={evidence as PhotoEvidence} collapsed={isCollapsed} />}
        {evidence.type === "DOCUMENT" && <DocumentCard evidence={evidence as DocumentEvidence} collapsed={isCollapsed} />}
      </motion.div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-6 !h-6 !border-3 !border-white !shadow-md" />
    </div>
  );
}

const nodeTypes = {
  evidenceNode: EvidenceNode,
};

const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 2000;

function toPixels(normalized: number, canvasSize: number): number {
  return normalized * canvasSize;
}

function toNormalized(pixels: number, canvasSize: number): number {
  return pixels / canvasSize;
}

function EvidenceBoardInner({ onClose, onSwitchToList }: EvidenceBoardProps) {
  const { 
    evidenceCollected, 
    evidenceBoardPositions,
    evidenceBoardConnections,
    setNodePosition,
    addEvidenceConnection,
    removeEvidenceConnection,
  } = useDetectiveGame();

  const initialNodes: Node[] = useMemo(() => {
    return evidenceCollected.map((evidence, index) => {
      const savedPosition = evidenceBoardPositions[evidence.id];
      
      let pixelX, pixelY;
      
      if (savedPosition) {
        pixelX = toPixels(savedPosition.x, CANVAS_WIDTH);
        pixelY = toPixels(savedPosition.y, CANVAS_HEIGHT);
      } else {
        const col = index % 4;
        const row = Math.floor(index / 4);
        pixelX = col * 400 + 50;
        pixelY = row * 300 + 50;
      }
      
      return {
        id: evidence.id,
        type: 'evidenceNode',
        position: { x: pixelX, y: pixelY },
        data: { evidence } as EvidenceNodeData,
      };
    });
  }, [evidenceCollected, evidenceBoardPositions]);

  const initialEdges: Edge[] = useMemo(() => {
    return evidenceBoardConnections.map((conn) => ({
      id: conn.id,
      source: conn.from,
      target: conn.to,
      label: conn.label,
      style: { stroke: '#3b82f6', strokeWidth: 4 },
      labelStyle: { fontSize: 14, fontWeight: 600 },
      labelBgStyle: { fill: '#dbeafe', fillOpacity: 0.9 },
      animated: true,
    }));
  }, [evidenceBoardConnections]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && !change.dragging) {
          const normalizedX = toNormalized(change.position.x, CANVAS_WIDTH);
          const normalizedY = toNormalized(change.position.y, CANVAS_HEIGHT);
          setNodePosition(change.id, normalizedX, normalizedY);
        }
      });
    },
    [onNodesChange, setNodePosition]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      
      changes.forEach((change) => {
        if (change.type === 'remove') {
          removeEvidenceConnection(change.id);
        }
      });
    },
    [onEdgesChange, removeEvidenceConnection]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        addEvidenceConnection(params.source, params.target);
      }
    },
    [addEvidenceConnection]
  );

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">Evidence Board</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToList}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 flex items-center gap-2"
            title="Switch to List View"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-2xl transition-colors text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-100"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
          <Controls className="!bg-white !border-gray-200 shadow-lg" />
            <Panel position="bottom-center" className="bg-white/95 text-gray-700 px-4 py-2 rounded-2xl text-sm border border-gray-200 shadow-sm mb-4 hidden md:block">
              <p>💡 Drag nodes to reposition them and pull from the handles to connect evidence.</p>
            </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export function EvidenceBoard(props: EvidenceBoardProps) {
  return (
    <ReactFlowProvider>
      <EvidenceBoardInner {...props} />
    </ReactFlowProvider>
  );
}
