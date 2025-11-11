import { BookOpen, Users, BarChart3, MessageSquare, Image as ImageIcon, FileText, Layout, Network } from "lucide-react";
import { useDetectiveGame, CharacterEvidence, DataEvidence, DialogueEvidence, PhotoEvidence, DocumentEvidence } from "@/lib/stores/useDetectiveGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect, useRef } from "react";
import { EvidenceBoard } from "@/components/EvidenceBoard";
import { CharacterCard, DataCard, DialogueCard, PhotoCard, DocumentCard } from "@/components/evidence-cards";
import CaseFileMindMap from "./CaseFileMindMap";
import { case1MindMapNodes, case1MindMapConnections } from "@/data/case1-mindmap";

interface EvidenceNotebookProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceNotebook({ isOpen, onClose }: EvidenceNotebookProps) {
  const { evidenceCollected, score, hintsUsed, maxHints, highlightedEvidenceId, clearHintHighlight, currentCase } = useDetectiveGame();
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'mindmap'>('board');
  const highlightedEvidenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedEvidenceId && highlightedEvidenceRef.current) {
      setTimeout(() => {
        highlightedEvidenceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [highlightedEvidenceId, isOpen]);

  const handleClose = () => {
    clearHintHighlight();
    onClose();
  };

  const characters = evidenceCollected.filter(e => e.type === "CHARACTER") as CharacterEvidence[];
  const dataViz = evidenceCollected.filter(e => e.type === "DATA") as DataEvidence[];
  const dialogues = evidenceCollected.filter(e => e.type === "DIALOGUE") as DialogueEvidence[];
  const photos = evidenceCollected.filter(e => e.type === "PHOTO") as PhotoEvidence[];
  const documents = evidenceCollected.filter(e => e.type === "DOCUMENT") as DocumentEvidence[];

  if (!isOpen) return null;

  if (viewMode === 'board') {
    return <EvidenceBoard onClose={handleClose} onSwitchToList={() => setViewMode('list')} />;
  }

  if (viewMode === 'mindmap') {
    return (
      <CaseFileMindMap
        isOpen={true}
        onClose={() => setViewMode('board')}
        caseTitle={currentCase === 1 ? "Episode 1: The Glitch" : `Case ${currentCase}`}
        nodes={case1MindMapNodes}
        connections={case1MindMapConnections}
      />
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-40"
        onClick={handleClose}
      />
          
          <div
            className="fixed inset-3 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[85vw] md:h-[85vh] md:max-w-5xl bg-white border-2 border-gray-200 rounded-2xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="bg-white px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2 md:gap-3">
                <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Evidence Notebook</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('board')}
                  className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  title="Switch to Board View"
                >
                  <Layout className="w-4 h-4" />
                  <span className="hidden md:inline">Board</span>
                </button>
                <button
                  onClick={() => setViewMode('mindmap')}
                  className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors"
                  title="Switch to Mind Map View"
                >
                  <Network className="w-4 h-4" />
                  <span className="hidden md:inline">Map</span>
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-900 text-3xl md:text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="bg-white px-4 py-2 md:px-6 md:py-3 border-b border-gray-200">
              <div className="flex items-center justify-between text-base md:text-lg">
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  <span className="text-gray-600 font-medium">Score: <span className="text-blue-600 font-bold">{score}</span></span>
                  <span className="text-gray-600 font-medium">Evidence: <span className="text-gray-800 font-bold">{evidenceCollected.length}</span></span>
                  <span className="text-gray-600 font-medium">Hints: <span className="text-amber-600 font-bold">{hintsUsed}/{maxHints}</span></span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-50">
              <Tabs defaultValue="characters" className="h-full flex flex-col">
                <div className="bg-white border-b border-gray-200 overflow-x-auto">
                  <TabsList className="w-full flex md:grid md:grid-cols-5 bg-transparent p-2 gap-1 min-w-max md:min-w-0">
                    <TabsTrigger value="characters" className="flex items-center gap-1.5 md:gap-2 px-3 py-3 text-base whitespace-nowrap">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Characters</span>
                      {characters.length > 0 && <span className="bg-blue-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold">{characters.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="data" className="flex items-center gap-1.5 md:gap-2 px-3 py-3 text-base whitespace-nowrap">
                      <BarChart3 className="w-5 h-5" />
                      <span className="font-medium">Data</span>
                      {dataViz.length > 0 && <span className="bg-green-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold">{dataViz.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="conversations" className="flex items-center gap-1.5 md:gap-2 px-3 py-3 text-base whitespace-nowrap">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">Talks</span>
                      {dialogues.length > 0 && <span className="bg-purple-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold">{dialogues.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="flex items-center gap-1.5 md:gap-2 px-3 py-3 text-base whitespace-nowrap">
                      <ImageIcon className="w-5 h-5" />
                      <span className="font-medium">Photos</span>
                      {photos.length > 0 && <span className="bg-pink-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold">{photos.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-1.5 md:gap-2 px-3 py-3 text-base whitespace-nowrap">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">Docs</span>
                      {documents.length > 0 && <span className="bg-orange-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold">{documents.length}</span>}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="characters" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 md:p-6 space-y-4">
                        {characters.length === 0 ? (
                          <div className="text-center text-gray-500 py-12 text-lg">No character profiles yet</div>
                        ) : (
                          characters.map((char, idx) => (
                            <CharacterCard
                              key={char.id}
                              evidence={char}
                              delay={idx * 0.1}
                              isHighlighted={highlightedEvidenceId === char.id}
                              ref={highlightedEvidenceId === char.id ? highlightedEvidenceRef : undefined}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="data" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 md:p-6 space-y-4">
                        {dataViz.length === 0 ? (
                          <div className="text-center text-gray-500 py-12 text-lg">No data evidence yet</div>
                        ) : (
                          dataViz.map((data, idx) => (
                            <DataCard 
                              key={data.id} 
                              evidence={data} 
                              delay={idx * 0.1}
                              isHighlighted={highlightedEvidenceId === data.id}
                              ref={highlightedEvidenceId === data.id ? highlightedEvidenceRef : undefined}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="conversations" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 md:p-6 space-y-4">
                        {dialogues.length === 0 ? (
                          <div className="text-center text-gray-500 py-12 text-lg">No conversations yet</div>
                        ) : (
                          dialogues.map((dialogue, idx) => (
                            <DialogueCard
                              key={dialogue.id}
                              evidence={dialogue}
                              delay={idx * 0.1}
                              isHighlighted={highlightedEvidenceId === dialogue.id}
                              ref={highlightedEvidenceId === dialogue.id ? highlightedEvidenceRef : undefined}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="photos" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 md:p-6 space-y-4">
                        {photos.length === 0 ? (
                          <div className="text-center text-gray-500 py-12 text-lg">No photos yet</div>
                        ) : (
                          photos.map((photo, idx) => (
                            <PhotoCard
                              key={photo.id}
                              evidence={photo}
                              delay={idx * 0.1}
                              isHighlighted={highlightedEvidenceId === photo.id}
                              ref={highlightedEvidenceId === photo.id ? highlightedEvidenceRef : undefined}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="documents" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 md:p-6 space-y-4">
                        {documents.length === 0 ? (
                          <div className="text-center text-gray-500 py-12 text-lg">No documents yet</div>
                        ) : (
                          documents.map((doc, idx) => (
                            <DocumentCard
                              key={doc.id}
                              evidence={doc}
                              delay={idx * 0.1}
                              isHighlighted={highlightedEvidenceId === doc.id}
                              ref={highlightedEvidenceId === doc.id ? highlightedEvidenceRef : undefined}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
    </>
  );
}
