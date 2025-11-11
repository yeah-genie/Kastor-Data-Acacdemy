import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export interface MindMapNode {
  id: string;
  label: string;
  sublabel?: string;
  type: "main" | "category" | "detail";
  category?: string;
  icon?: string;
  position: { top: string; left: string };
  color: "cyan" | "orange" | "gray";
  locked?: boolean;
}

export interface MindMapConnection {
  from: string;
  to: string;
  color: string;
}

interface CaseFileMindMapProps {
  isOpen: boolean;
  onClose: () => void;
  caseTitle: string;
  nodes: MindMapNode[];
  connections: MindMapConnection[];
}

export default function CaseFileMindMap({
  isOpen,
  onClose,
  caseTitle,
  nodes,
  connections
}: CaseFileMindMapProps) {
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getColorClass = (color: "cyan" | "orange" | "gray") => {
    switch (color) {
      case "cyan":
        return {
          border: "border-[#06dcf9]",
          shadow: "shadow-[0_0_8px_rgba(6,220,249,0.4)]",
          bg: "bg-[#2a2d3a]",
          text: "text-[#06dcf9]"
        };
      case "orange":
        return {
          border: "border-[#ff8c00]",
          shadow: "shadow-[0_0_8px_rgba(255,140,0,0.4)]",
          bg: "bg-[#2a2d3a]",
          text: "text-[#ff8c00]"
        };
      case "gray":
        return {
          border: "border-[#5a5d6a]",
          shadow: "",
          bg: "bg-[#2a2d3a]/80",
          text: "text-[#5a5d6a]"
        };
    }
  };

  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !containerRef.current) return { x: 0, y: 0 };

    const element = document.getElementById(`node-${nodeId}`);
    if (!element) return { x: 0, y: 0 };

    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    return {
      x: rect.left + rect.width / 2 - containerRect.left + containerRef.current.scrollLeft,
      y: rect.top + rect.height / 2 - containerRect.top + containerRef.current.scrollTop
    };
  };

  const createCurvedPath = (fromId: string, toId: string) => {
    const start = getNodeCenter(fromId);
    const end = getNodeCenter(toId);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const bendFactor = Math.min(distance / 5, 80);

    const cp1x = start.x + bendFactor * Math.sign(dx);
    const cp1y = start.y + bendFactor * Math.sign(dy);
    const cp2x = end.x - bendFactor * Math.sign(dx);
    const cp2y = end.y - bendFactor * Math.sign(dy);

    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  };

  const updateConnections = () => {
    if (!svgRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRef.current.scrollWidth;
    const containerHeight = containerRef.current.scrollHeight;

    svgRef.current.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
    svgRef.current.style.width = `${containerWidth}px`;
    svgRef.current.style.height = `${containerHeight}px`;
  };

  useEffect(() => {
    if (isOpen) {
      updateConnections();
      const timer = setTimeout(updateConnections, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, zoom, nodes]);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));
  const handleCenter = () => {
    if (containerRef.current) {
      const mainNode = document.getElementById("node-case-file");
      if (mainNode) {
        mainNode.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0a0e27] overflow-hidden"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "2rem 2rem"
        }}
      />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between bg-[#0a0e27]/80 p-4 backdrop-blur-sm">
        <h1 className="text-center flex-1 text-2xl font-bold leading-tight tracking-tight text-white">
          {caseTitle}
        </h1>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      {/* Main Content */}
      <main
        ref={containerRef}
        className="relative z-10 flex h-[calc(100vh-120px)] items-center justify-center overflow-auto p-4"
      >
        <div
          className="relative min-h-[800px] min-w-[800px] py-8 px-4"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          {/* SVG for connections */}
          <svg
            ref={svgRef}
            className="pointer-events-none absolute left-0 top-0 z-5"
            style={{ width: "100%", height: "100%" }}
          >
            {connections.map((conn, index) => (
              <path
                key={index}
                d={createCurvedPath(conn.from, conn.to)}
                stroke={conn.color}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const colors = getColorClass(node.color);
            const isLocked = node.locked;

            if (node.type === "main") {
              return (
                <div
                  key={node.id}
                  id={`node-${node.id}`}
                  className={`absolute z-10 flex min-h-[100px] w-[180px] flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 text-center ${colors.border} ${colors.bg} ${colors.shadow}`}
                  style={{
                    top: node.position.top,
                    left: node.position.left,
                    transform: "translate(-50%, -50%)"
                  }}
                >
                  <h2 className="text-xl font-bold leading-tight text-white">
                    {node.label}
                  </h2>
                  {node.sublabel && (
                    <p className={`text-xs ${colors.text}/80`}>{node.sublabel}</p>
                  )}
                </div>
              );
            }

            if (node.type === "category") {
              return (
                <div
                  key={node.id}
                  id={`node-${node.id}`}
                  className={`absolute z-10 flex min-h-[90px] w-[160px] flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-center ${colors.border} ${colors.bg} ${colors.shadow}`}
                  style={{
                    top: node.position.top,
                    left: node.position.left
                  }}
                >
                  <h3 className="text-lg font-bold leading-tight text-white">
                    {node.label}
                  </h3>
                  {node.sublabel && (
                    <p className={`text-xs ${colors.text}/80`}>{node.sublabel}</p>
                  )}
                </div>
              );
            }

            // Detail nodes
            return (
              <div
                key={node.id}
                id={`node-${node.id}`}
                className={`absolute z-10 flex min-h-[80px] w-[140px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 p-3 text-left ${colors.border} ${colors.bg} ${colors.shadow} ${
                  isLocked ? "opacity-50" : ""
                }`}
                style={{
                  top: node.position.top,
                  left: node.position.left
                }}
              >
                <div className="flex w-full items-center gap-1">
                  {node.icon && (
                    <span className={`material-symbols-outlined text-xl ${colors.text}`}>
                      {node.icon}
                    </span>
                  )}
                  <h4 className="flex-1 text-sm font-bold leading-tight text-white">
                    {node.label}
                  </h4>
                </div>
                {node.sublabel && (
                  <p className={`text-xs ${colors.text}/80`}>{node.sublabel}</p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <div className="mx-auto flex max-w-sm items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#1c1f2b] p-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-white/50 transition-colors hover:text-white"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <div className="h-1 w-16 rounded-full bg-white/50">
              <div
                className="h-full rounded-full bg-[#06dcf9]"
                style={{ width: `${((zoom - 0.5) / 1.5) * 100}%` }}
              />
            </div>
            <button
              onClick={handleZoomIn}
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-white/50 transition-colors hover:text-white"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={handleCenter}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-transparent px-4 text-sm font-bold leading-normal text-white/80 transition-colors hover:text-white"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="truncate">Center</span>
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
