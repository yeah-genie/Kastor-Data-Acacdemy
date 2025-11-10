import { useCallback, useMemo, useEffect, useRef } from "react";
import { 
  ReactFlow, 
  MiniMap, 
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
  useReactFlow,
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

function EvidenceNode({ data }: { data: EvidenceNodeData }) {
  const { evidence } = data;
  
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      
      <div className="bg-white rounded-lg shadow-lg">
        {evidence.type === "CHARACTER" && <CharacterCard evidence={evidence as CharacterEvidence} />}
        {evidence.type === "DATA" && <DataCard evidence={evidence as DataEvidence} />}
        {evidence.type === "DIALOGUE" && <DialogueCard evidence={evidence as DialogueEvidence} />}
        {evidence.type === "PHOTO" && <PhotoCard evidence={evidence as PhotoEvidence} />}
        {evidence.type === "DOCUMENT" && <DocumentCard evidence={evidence as DocumentEvidence} />}
      </div>
      
      <Handle type="source" position={Position.Bottom} />
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
      type: 'smoothstep',
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
      <div className="bg-slate-800/90 border-b border-slate-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-100">Evidence Board</h2>
          <span className="text-sm text-slate-400">마인드맵</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToList}
            className="px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 flex items-center gap-2"
            title="Switch to List View"
          >
            <List className="w-5 h-5" />
            <span className="hidden md:inline">List View</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-slate-100"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-900"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#475569" />
          <Controls className="bg-slate-800 border-slate-700" />
          <MiniMap 
            className="bg-slate-800 border-slate-700" 
            nodeColor={(node) => {
              const evidence = (node.data as unknown as EvidenceNodeData).evidence;
              switch (evidence.type) {
                case 'CHARACTER': return '#3b82f6';
                case 'DATA': return '#22c55e';
                case 'DIALOGUE': return '#a855f7';
                case 'PHOTO': return '#ec4899';
                case 'DOCUMENT': return '#f97316';
                default: return '#64748b';
              }
            }}
          />
          <Panel position="top-left" className="bg-slate-800/80 text-slate-200 px-3 py-2 rounded-lg text-sm">
            <p>💡 노드를 드래그해서 배치하고, 연결점을 드래그해서 증거 연결</p>
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
