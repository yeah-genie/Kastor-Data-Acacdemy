import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Link as LinkIcon } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

interface DraggableNodeProps {
  node: EvidenceNode;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
  submitted: boolean;
  getConnectionsForNode: (nodeId: string) => Connection[];
}

function DraggableNode({ node, selectedNode, onNodeClick, submitted, getConnectionsForNode }: DraggableNodeProps) {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: node.id,
    disabled: submitted,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: node.id,
    disabled: submitted,
  });

  const nodeConnections = getConnectionsForNode(node.id);
  const isSelected = selectedNode === node.id;
  const isConnected = nodeConnections.length > 0;

  const setRef = (element: HTMLDivElement | null) => {
    setDragRef(element);
    setDropRef(element);
  };

  return (
    <motion.div
      ref={setRef}
      {...attributes}
      {...listeners}
      whileHover={{ scale: submitted ? 1 : 1.02 }}
      whileTap={{ scale: submitted ? 1 : 0.98 }}
      onClick={() => onNodeClick(node.id)}
      className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
        isDragging
          ? 'opacity-50 border-blue-500 bg-blue-100'
          : isOver
          ? 'border-green-500 bg-green-50 shadow-lg'
          : isSelected
          ? 'border-blue-500 bg-blue-100 shadow-md'
          : isConnected
          ? 'border-purple-300 bg-purple-50'
          : 'border-gray-300 bg-white hover:border-gray-400'
      }`}
      style={{
        borderColor: isDragging ? '#3b82f6' : isOver ? '#10b981' : isSelected ? '#3b82f6' : isConnected ? node.color : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">{node.label}</p>
        {isConnected && (
          <div className="flex items-center gap-1">
            <LinkIcon className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600">
              {nodeConnections.length}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface EvidenceNode {
  id: string;
  label: string;
  type: 'evidence' | 'data' | 'conclusion';
  color: string;
}

interface Connection {
  from: string;
  to: string;
}

interface EvidenceConnectionBoardProps {
  nodes: EvidenceNode[];
  correctConnections: Connection[];
  title: string;
  instructions: string;
  onComplete: (correct: boolean) => void;
}

export function EvidenceConnectionBoard({
  nodes,
  correctConnections,
  title,
  instructions,
  onComplete,
}: EvidenceConnectionBoardProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );

  const handleNodeClick = (nodeId: string) => {
    if (submitted) return;

    if (selectedNode === null) {
      setSelectedNode(nodeId);
    } else {
      if (selectedNode !== nodeId) {
        const newConnection: Connection = {
          from: selectedNode,
          to: nodeId,
        };

        const alreadyExists = connections.some(
          (conn) =>
            (conn.from === selectedNode && conn.to === nodeId) ||
            (conn.from === nodeId && conn.to === selectedNode)
        );

        if (!alreadyExists) {
          setConnections([...connections, newConnection]);
        }
      }
      setSelectedNode(null);
    }
  };

  const removeConnection = (index: number) => {
    if (!submitted) {
      setConnections(connections.filter((_, i) => i !== index));
    }
  };

  const checkConnections = () => {
    const normalizedUserConnections = connections.map((conn) => ({
      from: conn.from,
      to: conn.to,
    }));

    const allCorrect = correctConnections.every((correctConn) =>
      normalizedUserConnections.some(
        (userConn) =>
          (userConn.from === correctConn.from && userConn.to === correctConn.to) ||
          (userConn.from === correctConn.to && userConn.to === correctConn.from)
      )
    );

    const noExtraConnections = normalizedUserConnections.length === correctConnections.length;

    return allCorrect && noExtraConnections;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = checkConnections();

    if (isCorrect) {
      setTimeout(() => {
        onComplete(true);
      }, 2000);
    }
  };

  const getNodeById = (id: string) => nodes.find((node) => node.id === id);

  const getConnectionsForNode = (nodeId: string) => {
    return connections.filter((conn) => conn.from === nodeId || conn.to === nodeId);
  };

  const groupedNodes = {
    evidence: nodes.filter((n) => n.type === 'evidence'),
    data: nodes.filter((n) => n.type === 'data'),
    conclusion: nodes.filter((n) => n.type === 'conclusion'),
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-2">{title}</h3>
        <p className="text-sm text-blue-800">{instructions}</p>
        <p className="text-xs text-blue-700 mt-2">
          💡 Click one card, then click another to connect them. Create all the connections to solve the puzzle!
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(event.active.id as string)}
        onDragEnd={(event) => {
          const { active, over } = event;
          setActiveId(null);
          
          if (!over || active.id === over.id || submitted) return;
          
          const fromId = active.id as string;
          const toId = over.id as string;
          
          const newConnection: Connection = {
            from: fromId,
            to: toId,
          };

          const alreadyExists = connections.some(
            (conn) =>
              (conn.from === fromId && conn.to === toId) ||
              (conn.from === toId && conn.to === fromId)
          );

          if (!alreadyExists) {
            setConnections([...connections, newConnection]);
          }
        }}
      >
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(groupedNodes).map(([type, typeNodes]) => (
            <div key={type} className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 capitalize mb-3">
                {type === 'evidence' ? '🔍 Evidence' : type === 'data' ? '📊 Data' : '💡 Conclusions'}
              </h4>
              <div className="space-y-2">
                {typeNodes.map((node) => <DraggableNode key={node.id} node={node} selectedNode={selectedNode} onNodeClick={handleNodeClick} submitted={submitted} getConnectionsForNode={getConnectionsForNode} />)}
              </div>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="p-3 bg-white border-2 border-blue-500 rounded-lg shadow-lg">
              {getNodeById(activeId)?.label}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {connections.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Connections Made:</h4>
          <div className="space-y-1">
            {connections.map((conn, index) => {
              const fromNode = getNodeById(conn.from);
              const toNode = getNodeById(conn.to);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium" style={{ color: fromNode?.color }}>
                      {fromNode?.label}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-medium" style={{ color: toNode?.color }}>
                      {toNode?.label}
                    </span>
                  </div>
                  {!submitted && (
                    <button
                      onClick={() => removeConnection(index)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {connections.length >= correctConnections.length && !submitted && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          ✓ Submit Connections
        </motion.button>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg ${
              checkConnections()
                ? 'bg-green-100 border border-green-300'
                : 'bg-red-100 border border-red-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {checkConnections() ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <span className="font-semibold text-gray-900">
                {checkConnections()
                  ? '🎉 Perfect! All connections are correct!'
                  : 'Not quite right. Try again!'}
              </span>
            </div>
            {!checkConnections() && (
              <>
                <p className="text-sm text-gray-700 mb-2">
                  Review your connections and think about how the evidence relates to the data and conclusions.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setConnections([]);
                  }}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg"
                >
                  Reset and Try Again
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
