import { motion } from "framer-motion";
import { BookOpen, Users, BarChart3, MessageSquare, Image as ImageIcon, FileText, Star, Bookmark, Layout, List } from "lucide-react";
import { useDetectiveGame, CharacterEvidence, DataEvidence, DialogueEvidence, PhotoEvidence, DocumentEvidence } from "@/lib/stores/useDetectiveGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { EvidenceBoard } from "@/components/EvidenceBoard";

interface EvidenceNotebookProps {
  isOpen: boolean;
  onClose: () => void;
}

function DataEvidenceCard({ data, idx }: { data: DataEvidence; idx: number }) {
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);

  const toggleHighlight = (index: number) => {
    setHighlightedIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-base md:text-lg text-gray-900">{data.title}</h4>
      </div>
      
      {data.dataType === "log" && data.data?.entries && (
        <div className="space-y-2">
          <div className="text-xs md:text-sm text-gray-600 mb-2 flex items-center gap-2">
            <Bookmark className="w-3 h-3" />
            <span>Click on log entries to highlight important ones</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs md:text-sm overflow-x-auto border border-gray-200">
            {data.data.entries.map((entry: any, entryIdx: number) => (
              <div
                key={entryIdx}
                onClick={() => toggleHighlight(entryIdx)}
                className={`py-1 px-2 rounded cursor-pointer transition-colors ${
                  highlightedIndices.includes(entryIdx)
                    ? "bg-yellow-100 text-yellow-900 border-l-2 border-yellow-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-blue-600">{entry.time}</span>
                {" | "}
                <span className="text-green-600">{entry.user}</span>
                {" | "}
                <span className="text-purple-600">{entry.action}</span>
                {entry.ip && (
                  <>
                    {" | "}
                    <span className="text-orange-600">{entry.ip}</span>
                  </>
                )}
                {highlightedIndices.includes(entryIdx) && (
                  <span className="ml-2 text-yellow-600">★</span>
                )}
              </div>
            ))}
          </div>
          {highlightedIndices.length > 0 && (
            <div className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 p-2 rounded">
              ✓ {highlightedIndices.length} important {highlightedIndices.length === 1 ? "entry" : "entries"} highlighted
            </div>
          )}
        </div>
      )}

      {data.dataType === "table" && data.data?.headers && data.data?.rows && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-50">
                {data.data.headers.map((header: string, i: number) => (
                  <th key={i} className="border border-gray-200 px-3 py-2 text-left font-semibold text-green-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.rows.map((row: string[], i: number) => (
                <tr key={i} className="hover:bg-gray-50">
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-200 px-3 py-2 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.dataType === "chart" && (
        <p className="text-sm text-gray-600">Chart visualization (view in chat for interactive display)</p>
      )}

      {!["log", "table", "chart"].includes(data.dataType || "") && (
        <p className="text-sm text-gray-600">Type: {data.dataType}</p>
      )}
    </motion.div>
  );
}

export function EvidenceNotebook({ isOpen, onClose }: EvidenceNotebookProps) {
  const { evidenceCollected, score, hintsUsed, maxHints } = useDetectiveGame();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const characters = evidenceCollected.filter(e => e.type === "CHARACTER") as CharacterEvidence[];
  const dataViz = evidenceCollected.filter(e => e.type === "DATA") as DataEvidence[];
  const dialogues = evidenceCollected.filter(e => e.type === "DIALOGUE") as DialogueEvidence[];
  const photos = evidenceCollected.filter(e => e.type === "PHOTO") as PhotoEvidence[];
  const documents = evidenceCollected.filter(e => e.type === "DOCUMENT") as DocumentEvidence[];

  if (viewMode === 'board') {
    return <EvidenceBoard isOpen={isOpen} onClose={onClose} onSwitchToList={() => setViewMode('list')} />;
  }

  return (
    <>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />
          
          <div
            className="fixed inset-3 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[85vw] md:h-[85vh] md:max-w-5xl bg-white border-2 border-gray-200 rounded-2xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="bg-white px-4 py-3 md:px-6 md:py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-2 md:gap-3">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Evidence Notebook</h2>
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
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-900 text-3xl md:text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="bg-white px-4 py-2 md:px-6 md:py-3 border-b border-gray-200">
              <div className="flex items-center justify-between text-sm md:text-base">
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  <span className="text-gray-600">Score: <span className="text-blue-600 font-bold">{score}</span></span>
                  <span className="text-gray-600">Evidence: <span className="text-gray-800 font-bold">{evidenceCollected.length}</span></span>
                  <span className="text-gray-600">Hints: <span className="text-amber-600 font-bold">{hintsUsed}/{maxHints}</span></span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-50">
              <Tabs defaultValue="characters" className="h-full flex flex-col">
                <div className="bg-white border-b border-gray-200 overflow-x-auto">
                  <TabsList className="w-full flex md:grid md:grid-cols-5 bg-transparent p-2 gap-1 min-w-max md:min-w-0">
                    <TabsTrigger value="characters" className="flex items-center gap-1.5 md:gap-2 px-3 py-2.5 text-sm whitespace-nowrap">
                      <Users className="w-4 h-4" />
                      <span>Characters</span>
                      {characters.length > 0 && <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{characters.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="data" className="flex items-center gap-1.5 md:gap-2 px-3 py-2.5 text-sm whitespace-nowrap">
                      <BarChart3 className="w-4 h-4" />
                      <span>Data</span>
                      {dataViz.length > 0 && <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{dataViz.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="conversations" className="flex items-center gap-1.5 md:gap-2 px-3 py-2.5 text-sm whitespace-nowrap">
                      <MessageSquare className="w-4 h-4" />
                      <span>Talks</span>
                      {dialogues.length > 0 && <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{dialogues.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="flex items-center gap-1.5 md:gap-2 px-3 py-2.5 text-sm whitespace-nowrap">
                      <ImageIcon className="w-4 h-4" />
                      <span>Photos</span>
                      {photos.length > 0 && <span className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{photos.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-1.5 md:gap-2 px-3 py-2.5 text-sm whitespace-nowrap">
                      <FileText className="w-4 h-4" />
                      <span>Docs</span>
                      {documents.length > 0 && <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{documents.length}</span>}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="characters" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 md:p-6 space-y-4">
                        {characters.length === 0 ? (
                          <div className="text-center text-gray-500 py-12 text-base">No character profiles yet</div>
                        ) : (
                          characters.map((char, idx) => (
                            <motion.div
                              key={char.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                            >
                              <div className="flex flex-col">
                                <div className="flex gap-3 md:gap-4 mb-3">
                                  {char.photo && (
                                    <img src={char.photo} alt={char.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover object-center border-2 border-blue-400 shadow-lg" />
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-1">{char.name}</h4>
                                    <p className="text-sm md:text-base text-blue-600 font-semibold mb-2">{char.role}</p>
                                    {char.suspicionLevel !== undefined && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs md:text-sm text-gray-600 font-medium">Suspicion Level:</span>
                                        <div className="flex gap-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < (char.suspicionLevel || 0) ? 'fill-red-400 text-red-400' : 'text-gray-300'}`} />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
                                    <p className="text-xs md:text-sm font-bold text-blue-600 mb-1.5">PROFILE</p>
                                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">{char.description}</p>
                                  </div>
                                  
                                  {char.personality && (
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
                                      <p className="text-xs md:text-sm font-bold text-purple-600 mb-1.5">PERSONALITY</p>
                                      <p className="text-sm md:text-base text-gray-700 leading-relaxed">{char.personality}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="data" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 md:p-6 space-y-4">
                        {dataViz.length === 0 ? (
                          <div className="text-center text-gray-500 py-12 text-base">No data evidence yet</div>
                        ) : (
                          dataViz.map((data, idx) => (
                            <DataEvidenceCard key={data.id} data={data} idx={idx} />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="conversations" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-4 md:p-6 space-y-4">
                        {dialogues.length === 0 ? (
                          <div className="text-center text-gray-500 py-12 text-base">No conversations yet</div>
                        ) : (
                          dialogues.map((dialogue, idx) => (
                            <motion.div
                              key={dialogue.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-5 h-5 text-purple-600" />
                                <h4 className="font-semibold text-base md:text-lg text-gray-900">{dialogue.title}</h4>
                              </div>
                              <p className="text-sm md:text-base font-medium text-purple-600 mb-3">With: {dialogue.character}</p>
                              <ul className="text-sm md:text-base text-gray-700 space-y-2">
                                {dialogue.keyPoints.map((point, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-purple-600 font-bold">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="photos" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-4">
                        {photos.length === 0 ? (
                          <div className="text-center text-gray-500 py-12">No photos yet</div>
                        ) : (
                          photos.map((photo, idx) => (
                            <motion.div
                              key={photo.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                            >
                              <img src={photo.imageUrl} alt={photo.caption} className="w-full h-48 object-cover" />
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-800 mb-1">{photo.title}</h4>
                                <p className="text-sm text-gray-600">{photo.caption}</p>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="documents" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-4">
                        {documents.length === 0 ? (
                          <div className="text-center text-gray-500 py-12">No documents yet</div>
                        ) : (
                          documents.map((doc, idx) => (
                            <motion.div
                              key={doc.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-5 h-5 text-orange-600" />
                                <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-line">{doc.content}</p>
                            </motion.div>
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
      )}
    </>
  );
}
