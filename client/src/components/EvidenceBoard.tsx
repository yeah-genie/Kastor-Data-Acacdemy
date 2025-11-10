import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, BarChart3, MessageSquare, Image as ImageIcon, FileText, X, List } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useDetectiveGame, Evidence } from "@/lib/stores/useDetectiveGame";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface EvidenceNodeProps {
  evidence: Evidence;
  position: { x: number; y: number };
  boardWidth: number;
  boardHeight: number;
  onClick: (evidence: Evidence) => void;
  isDragging?: boolean;
}

function EvidenceNode({ evidence, position, boardWidth, boardHeight, onClick, isDragging }: EvidenceNodeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: evidence.id,
    data: { evidence },
  });

  const style = {
    position: 'absolute' as const,
    left: `${position.x * boardWidth}px`,
    top: `${position.y * boardHeight}px`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const getNodeColor = () => {
    switch (evidence.type) {
      case "CHARACTER": return "bg-gradient-to-br from-blue-400 to-blue-600 text-white";
      case "DATA": return "bg-gradient-to-br from-green-400 to-green-600 text-white";
      case "DIALOGUE": return "bg-gradient-to-br from-purple-400 to-purple-600 text-white";
      case "PHOTO": return "bg-gradient-to-br from-pink-400 to-pink-600 text-white";
      case "DOCUMENT": return "bg-gradient-to-br from-orange-400 to-orange-600 text-white";
      default: return "bg-gradient-to-br from-slate-400 to-slate-600 text-white";
    }
  };

  const getIcon = () => {
    switch (evidence.type) {
      case "CHARACTER": return <Users className="w-4 h-4" />;
      case "DATA": return <BarChart3 className="w-4 h-4" />;
      case "DIALOGUE": return <MessageSquare className="w-4 h-4" />;
      case "PHOTO": return <ImageIcon className="w-4 h-4" />;
      case "DOCUMENT": return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick(evidence);
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.08, y: -2 }}
      className={`w-32 md:w-40 cursor-move select-none ${getNodeColor()} rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all border-2 border-white/20`}
    >
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <span className="text-xs font-bold opacity-90">{evidence.type}</span>
      </div>
      <p className="text-sm font-medium line-clamp-2">{evidence.title}</p>
    </motion.div>
  );
}

interface ConnectionLayerProps {
  connections: Array<{ id: string; from: string; to: string; label?: string }>;
  nodePositions: Record<string, { evidenceId: string; x: number; y: number }>;
  boardWidth: number;
  boardHeight: number;
  onRemoveConnection: (connectionId: string) => void;
}

function ConnectionLayer({ connections, nodePositions, boardWidth, boardHeight, onRemoveConnection }: ConnectionLayerProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={boardWidth}
      height={boardHeight}
      style={{ zIndex: 1 }}
    >
      {connections.map((conn) => {
        const fromPos = nodePositions[conn.from];
        const toPos = nodePositions[conn.to];
        
        if (!fromPos || !toPos) return null;

        const nodeWidth = 160;
        const nodeHeight = 80;
        
        const centerX1 = fromPos.x * boardWidth + nodeWidth / 2;
        const centerY1 = fromPos.y * boardHeight + nodeHeight / 2;
        const centerX2 = toPos.x * boardWidth + nodeWidth / 2;
        const centerY2 = toPos.y * boardHeight + nodeHeight / 2;

        const dx = centerX2 - centerX1;
        const dy = centerY2 - centerY1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return null;
        
        const dirX = dx / distance;
        const dirY = dy / distance;
        
        const nodeRadius = Math.sqrt((nodeWidth / 2) ** 2 + (nodeHeight / 2) ** 2) * 0.7;
        
        const x1 = centerX1 + dirX * nodeRadius;
        const y1 = centerY1 + dirY * nodeRadius;
        const x2 = centerX2 - dirX * nodeRadius;
        const y2 = centerY2 - dirY * nodeRadius;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const offset = distance * 0.2;
        const cx = midX + (dy / distance) * offset;
        const cy = midY - (dx / distance) * offset;
        
        const pathD = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;

        return (
          <g key={conn.id}>
            <path
              d={pathD}
              stroke="#64748b"
              strokeWidth="3"
              fill="none"
              className="drop-shadow-md"
            />
            <circle
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              r="10"
              fill="white"
              stroke="#64748b"
              strokeWidth="2"
              className="pointer-events-auto cursor-pointer hover:fill-red-100"
              onClick={() => onRemoveConnection(conn.id)}
            />
            <text
              x={(x1 + x2) / 2}
              y={(y1 + y2) / 2 + 4}
              fill="#64748b"
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
              className="pointer-events-none"
            >
              ×
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface EvidenceBoardProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToList?: () => void;
}

export function EvidenceBoard({ isOpen, onClose, onSwitchToList }: EvidenceBoardProps) {
  const { evidenceCollected, evidenceBoardPositions, evidenceBoardConnections, setNodePosition, addEvidenceConnection, removeEvidenceConnection, score, hintsUsed, maxHints } = useDetectiveGame();
  
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [connectMode, setConnectMode] = useState(false);
  const [firstSelectedId, setFirstSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardDimensions, setBoardDimensions] = useState({ width: 800, height: 500 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;
    const evidenceId = active.id as string;
    const currentPos = evidenceBoardPositions[evidenceId];

    if (!currentPos || !boardRef.current) {
      setActiveId(null);
      return;
    }

    const newX = Math.max(0, Math.min(1, currentPos.x + delta.x / boardDimensions.width));
    const newY = Math.max(0, Math.min(1, currentPos.y + delta.y / boardDimensions.height));

    setNodePosition(evidenceId, newX, newY);
    setActiveId(null);
  }, [evidenceBoardPositions, boardDimensions, setNodePosition]);

  const handleNodeClick = useCallback((evidence: Evidence) => {
    if (connectMode) {
      if (!firstSelectedId) {
        setFirstSelectedId(evidence.id);
      } else if (firstSelectedId !== evidence.id) {
        addEvidenceConnection(firstSelectedId, evidence.id);
        setFirstSelectedId(null);
        setConnectMode(false);
      }
    } else {
      setSelectedEvidence(evidence);
    }
  }, [connectMode, firstSelectedId, addEvidenceConnection]);

  const activeEvidence = useMemo(() => {
    if (!activeId) return null;
    return evidenceCollected.find(e => e.id === activeId);
  }, [activeId, evidenceCollected]);

  useEffect(() => {
    const updateBoardDimensions = () => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        setBoardDimensions({
          width: rect.width || 800,
          height: rect.height || 500,
        });
      }
    };

    updateBoardDimensions();
    const resizeObserver = new ResizeObserver(updateBoardDimensions);
    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />
          
          <div
            className="fixed inset-3 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:h-[85vh] md:max-w-6xl bg-white rounded-2xl z-50 overflow-hidden flex flex-col shadow-2xl border border-gray-200"
          >
            <div className="bg-white px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2 md:gap-3">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Evidence Board</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-4 text-sm">
                  <div className="px-3 py-1 bg-gray-100 rounded-lg">
                    <span className="text-gray-600">Score: </span>
                    <span className="font-bold text-gray-900">{score}</span>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 rounded-lg">
                    <span className="text-gray-600">Evidence: </span>
                    <span className="font-bold text-gray-900">{evidenceCollected.length}</span>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 rounded-lg">
                    <span className="text-gray-600">Hints: </span>
                    <span className="font-bold text-gray-900">{hintsUsed}/{maxHints}</span>
                  </div>
                </div>
                {onSwitchToList && (
                  <button
                    onClick={onSwitchToList}
                    className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-200"
                    title="Switch to List View"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden md:inline">List View</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setConnectMode(!connectMode);
                    setFirstSelectedId(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    connectMode
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {connectMode ? '✓ Connect Mode' : '🔗 Connect Evidence'}
                </button>
                {firstSelectedId && (
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                    Select second evidence to connect
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {evidenceCollected.length} evidence • {evidenceBoardConnections.length} connections
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden bg-gray-50">
              <div
                ref={boardRef}
                className="absolute inset-4 md:inset-8"
                style={{
                  backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              >
                <DndContext
                  sensors={sensors}
                  onDragStart={(event) => setActiveId(event.active.id as string)}
                  onDragEnd={handleDragEnd}
                >
                  <ConnectionLayer
                    connections={evidenceBoardConnections}
                    nodePositions={evidenceBoardPositions}
                    boardWidth={boardDimensions.width}
                    boardHeight={boardDimensions.height}
                    onRemoveConnection={removeEvidenceConnection}
                  />

                  <div className="relative" style={{ width: boardDimensions.width, height: boardDimensions.height }}>
                    {evidenceCollected.map((evidence) => {
                      const position = evidenceBoardPositions[evidence.id];
                      if (!position) return null;

                      return (
                        <EvidenceNode
                          key={evidence.id}
                          evidence={evidence}
                          position={position}
                          boardWidth={boardDimensions.width}
                          boardHeight={boardDimensions.height}
                          onClick={handleNodeClick}
                          isDragging={activeId === evidence.id}
                        />
                      );
                    })}
                  </div>

                  <DragOverlay>
                    {activeEvidence ? (
                      <div className="w-40 bg-white border-4 border-blue-500 rounded-lg p-3 shadow-2xl opacity-80">
                        <p className="text-sm font-semibold">{activeEvidence.title}</p>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </div>
          </div>

          <Drawer open={!!selectedEvidence} onOpenChange={(open) => !open && setSelectedEvidence(null)}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{selectedEvidence?.title}</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 max-h-96 overflow-y-auto">
                {selectedEvidence && selectedEvidence.type === "CHARACTER" && (
                  <div className="space-y-3">
                    <p className="text-sm"><strong>Role:</strong> {(selectedEvidence as any).role}</p>
                    <p className="text-sm">{(selectedEvidence as any).description}</p>
                  </div>
                )}
                {selectedEvidence && selectedEvidence.type === "DATA" && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Data Type:</strong> {(selectedEvidence as any).dataType}</p>
                  </div>
                )}
                {selectedEvidence && selectedEvidence.type === "DIALOGUE" && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>With:</strong> {(selectedEvidence as any).character}</p>
                    <p className="text-sm font-semibold">Key Points:</p>
                    <ul className="list-disc list-inside text-sm">
                      {(selectedEvidence as any).keyPoints?.map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
}
