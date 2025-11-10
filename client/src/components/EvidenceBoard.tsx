import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      case "CHARACTER": return "bg-blue-100 border-blue-400 text-blue-900";
      case "DATA": return "bg-green-100 border-green-400 text-green-900";
      case "DIALOGUE": return "bg-purple-100 border-purple-400 text-purple-900";
      case "PHOTO": return "bg-pink-100 border-pink-400 text-pink-900";
      case "DOCUMENT": return "bg-orange-100 border-orange-400 text-orange-900";
      default: return "bg-gray-100 border-gray-400 text-gray-900";
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
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      className={`w-32 md:w-40 cursor-move select-none ${getNodeColor()} border-2 rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <span className="text-xs font-bold uppercase tracking-wide">{evidence.type}</span>
      </div>
      <p className="text-sm font-semibold line-clamp-2">{evidence.title}</p>
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

        const x1 = fromPos.x * boardWidth + 80;
        const y1 = fromPos.y * boardHeight + 40;
        const x2 = toPos.x * boardWidth + 80;
        const y2 = toPos.y * boardHeight + 40;

        return (
          <g key={conn.id}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <circle
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              r="8"
              fill="white"
              stroke="#ef4444"
              strokeWidth="2"
              className="pointer-events-auto cursor-pointer hover:fill-red-100"
              onClick={() => onRemoveConnection(conn.id)}
            />
            <text
              x={(x1 + x2) / 2}
              y={(y1 + y2) / 2 + 3}
              fill="#ef4444"
              fontSize="12"
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-3 md:inset-8 lg:inset-12 bg-gradient-to-br from-amber-50 to-amber-100 border-8 border-amber-900 rounded-lg z-50 overflow-hidden flex flex-col shadow-2xl"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d97706" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          >
            <div className="bg-gradient-to-r from-amber-800 to-amber-900 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b-4 border-amber-950 shadow-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-inner"></div>
                <h2 className="text-lg md:text-xl font-bold text-amber-50 tracking-wide">Evidence Board</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-6 text-sm text-amber-100">
                  <span>Score: <span className="font-bold">{score}</span></span>
                  <span>Evidence: <span className="font-bold">{evidenceCollected.length}</span></span>
                  <span>Hints: <span className="font-bold">{hintsUsed}/{maxHints}</span></span>
                </div>
                {onSwitchToList && (
                  <button
                    onClick={onSwitchToList}
                    className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-amber-700 text-amber-50 hover:bg-amber-600 transition-colors"
                    title="Switch to List View"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden md:inline">List View</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-amber-100 hover:text-white text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="bg-amber-900/20 px-4 py-2 flex items-center justify-between border-b-2 border-amber-800">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setConnectMode(!connectMode);
                    setFirstSelectedId(null);
                  }}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    connectMode
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-800 text-amber-50 hover:bg-amber-700'
                  }`}
                >
                  {connectMode ? '✓ Connect Mode' : '🔗 Connect Evidence'}
                </button>
                {firstSelectedId && (
                  <span className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                    Select second evidence to connect
                  </span>
                )}
              </div>
              <div className="text-sm text-amber-900 font-medium">
                {evidenceCollected.length} evidence pieces • {evidenceBoardConnections.length} connections
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <div
                ref={boardRef}
                className="absolute inset-4 md:inset-8"
                style={{
                  backgroundImage: 'linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
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
          </motion.div>

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
    </AnimatePresence>
  );
}
