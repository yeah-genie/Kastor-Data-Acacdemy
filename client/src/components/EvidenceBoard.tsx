import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, List, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDraggable,
} from "@dnd-kit/core";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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
  CollapsedChip,
  CharacterCard,
  DataCard,
  DialogueCard,
  PhotoCard,
  DocumentCard
} from "@/components/evidence-cards";

interface EvidenceNodeProps {
  evidence: Evidence;
  position: { x: number; y: number };
  boardWidth: number;
  boardHeight: number;
  onClick: (evidence: Evidence) => void;
  isExpanded: boolean;
  isDragging?: boolean;
}

function EvidenceNode({ evidence, position, boardWidth, boardHeight, onClick, isExpanded, isDragging }: EvidenceNodeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: evidence.id,
    data: { evidence },
    disabled: isExpanded,
  });

  const style = {
    position: 'absolute' as const,
    left: `${position.x * boardWidth}px`,
    top: `${position.y * boardHeight}px`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isExpanded ? 100 : 10,
  };

  if (isExpanded) {
    return (
      <div style={style} className="max-w-xs md:max-w-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(evidence);
            }}
            className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
            title="Collapse"
          >
            <X className="w-4 h-4" />
          </button>
          {evidence.type === "CHARACTER" && <CharacterCard evidence={evidence as CharacterEvidence} />}
          {evidence.type === "DATA" && <DataCard evidence={evidence as DataEvidence} />}
          {evidence.type === "DIALOGUE" && <DialogueCard evidence={evidence as DialogueEvidence} />}
          {evidence.type === "PHOTO" && <PhotoCard evidence={evidence as PhotoEvidence} />}
          {evidence.type === "DOCUMENT" && <DocumentCard evidence={evidence as DocumentEvidence} />}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onClick(evidence);
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <CollapsedChip type={evidence.type} title={evidence.title} />
      </motion.div>
    </div>
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

        const nodeWidth = 144;
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
        const offset = distance * 0.15;
        const cx = midX + (dy / distance) * offset;
        const cy = midY - (dx / distance) * offset;
        
        const pathD = `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`;

        return (
          <g key={conn.id}>
            <path
              d={pathD}
              stroke="#94a3b8"
              strokeWidth="2.5"
              fill="none"
              className="drop-shadow-sm"
            />
            <circle
              cx={midX}
              cy={midY}
              r="8"
              fill="white"
              stroke="#94a3b8"
              strokeWidth="2"
              className="pointer-events-auto cursor-pointer hover:fill-red-100 transition-colors"
              onClick={() => onRemoveConnection(conn.id)}
            />
            <text
              x={midX}
              y={midY + 3}
              fill="#94a3b8"
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
  const { 
    evidenceCollected, 
    evidenceBoardPositions, 
    evidenceBoardConnections, 
    setNodePosition, 
    addEvidenceConnection, 
    removeEvidenceConnection, 
    score, 
    hintsUsed, 
    maxHints 
  } = useDetectiveGame();
  
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());
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
      setExpandedNodeIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(evidence.id)) {
          newSet.delete(evidence.id);
        } else {
          newSet.add(evidence.id);
        }
        return newSet;
      });
    }
  }, [connectMode, firstSelectedId, addEvidenceConnection]);

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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />
      
      <div className="fixed inset-3 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:h-[85vh] md:max-w-6xl bg-white rounded-2xl z-50 overflow-hidden flex flex-col shadow-2xl border-2 border-gray-200">
        <div className="bg-white px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b-2 border-gray-200">
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Evidence Board</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-3 text-sm">
              <div className="px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-gray-600">Score: </span>
                <span className="font-bold text-blue-600">{score}</span>
              </div>
              <div className="px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <span className="text-gray-600">Evidence: </span>
                <span className="font-bold text-green-600">{evidenceCollected.length}</span>
              </div>
              <div className="px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-gray-600">Hints: </span>
                <span className="font-bold text-amber-600">{hintsUsed}/{maxHints}</span>
              </div>
            </div>
            {onSwitchToList && (
              <button
                onClick={onSwitchToList}
                className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300"
                title="Switch to List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden md:inline">List</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              title="Close"
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
                setExpandedNodeIds(new Set());
              }}
              className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors border ${
                connectMode
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              {connectMode ? '✓ Connect Mode' : '🔗 Connect'}
            </button>
            {firstSelectedId && (
              <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs md:text-sm font-medium border border-blue-200">
                Select 2nd evidence
              </span>
            )}
          </div>
          <div className="text-xs md:text-sm text-gray-600 font-medium">
            {evidenceCollected.length} nodes • {evidenceBoardConnections.length} links
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <TransformWrapper
            initialScale={1}
            minScale={0.3}
            maxScale={2}
            centerOnInit={false}
            limitToBounds={false}
            panning={{ disabled: connectMode }}
            doubleClick={{ disabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  <button
                    onClick={() => zoomIn()}
                    className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-300"
                    title="Reset View"
                  >
                    <Maximize2 className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                <TransformComponent
                  wrapperClass="w-full h-full"
                  contentClass="w-full h-full"
                >
                  <div
                    ref={boardRef}
                    className="w-full h-full min-h-[800px] min-w-[1200px] p-8"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)',
                      backgroundSize: '30px 30px',
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
                        <AnimatePresence>
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
                                isExpanded={expandedNodeIds.has(evidence.id)}
                                isDragging={activeId === evidence.id}
                              />
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </DndContext>
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        {evidenceCollected.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400 p-8 bg-white/90 rounded-2xl border-2 border-dashed border-gray-300">
              <p className="text-lg font-semibold mb-2">No evidence collected yet</p>
              <p className="text-sm">Collect evidence during your investigation to see it here</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
