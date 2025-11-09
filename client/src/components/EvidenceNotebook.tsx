import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, BarChart3, MessageSquare, Image as ImageIcon, FileText, Star, Bookmark } from "lucide-react";
import { useDetectiveGame, CharacterEvidence, DataEvidence, DialogueEvidence, PhotoEvidence, DocumentEvidence } from "@/lib/stores/useDetectiveGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

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
        <h4 className="font-semibold text-base md:text-lg text-gray-800">{data.title}</h4>
      </div>
      
      {data.dataType === "log" && data.data?.entries && (
        <div className="space-y-2">
          <div className="text-xs md:text-sm text-gray-600 mb-2 flex items-center gap-2">
            <Bookmark className="w-3 h-3" />
            <span>Click on log entries to highlight important ones</span>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs md:text-sm overflow-x-auto">
            {data.data.entries.map((entry: any, entryIdx: number) => (
              <div
                key={entryIdx}
                onClick={() => toggleHighlight(entryIdx)}
                className={`py-1 px-2 rounded cursor-pointer transition-colors ${
                  highlightedIndices.includes(entryIdx)
                    ? "bg-yellow-500/30 text-yellow-100 border-l-2 border-yellow-400"
                    : "text-gray-300 hover:bg-slate-800"
                }`}
              >
                <span className="text-blue-400">{entry.time}</span>
                {" | "}
                <span className="text-green-400">{entry.user}</span>
                {" | "}
                <span className="text-purple-400">{entry.action}</span>
                {entry.ip && (
                  <>
                    {" | "}
                    <span className="text-orange-400">{entry.ip}</span>
                  </>
                )}
                {highlightedIndices.includes(entryIdx) && (
                  <span className="ml-2 text-yellow-400">★</span>
                )}
              </div>
            ))}
          </div>
          {highlightedIndices.length > 0 && (
            <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
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
                  <th key={i} className="border border-green-200 px-3 py-2 text-left font-semibold text-green-800">
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
        <p className="text-sm text-gray-500">Chart visualization (view in chat for interactive display)</p>
      )}

      {!["log", "table", "chart"].includes(data.dataType || "") && (
        <p className="text-sm text-gray-500">Type: {data.dataType}</p>
      )}
    </motion.div>
  );
}

export function EvidenceNotebook({ isOpen, onClose }: EvidenceNotebookProps) {
  const { evidenceCollected, score, hintsUsed, maxHints } = useDetectiveGame();

  const characters = evidenceCollected.filter(e => e.type === "CHARACTER") as CharacterEvidence[];
  const dataViz = evidenceCollected.filter(e => e.type === "DATA") as DataEvidence[];
  const dialogues = evidenceCollected.filter(e => e.type === "DIALOGUE") as DialogueEvidence[];
  const photos = evidenceCollected.filter(e => e.type === "PHOTO") as PhotoEvidence[];
  const documents = evidenceCollected.filter(e => e.type === "DOCUMENT") as DocumentEvidence[];

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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-3 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[85vw] md:h-[85vh] md:max-w-5xl bg-white border-2 border-gray-200 rounded-2xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <h2 className="text-lg md:text-xl font-bold text-white">Evidence Notebook</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-3xl md:text-2xl font-bold min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-50 px-4 py-2 md:px-6 md:py-3 border-b border-gray-200">
              <div className="flex items-center justify-between text-sm md:text-base">
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  <span className="text-gray-700">Score: <span className="text-blue-600 font-bold">{score}</span></span>
                  <span className="text-gray-700">Evidence: <span className="text-purple-600 font-bold">{evidenceCollected.length}</span></span>
                  <span className="text-gray-700">Hints: <span className="text-orange-600 font-bold">{hintsUsed}/{maxHints}</span></span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
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
                          <div className="text-center text-gray-400 py-12 text-base">No character profiles yet</div>
                        ) : (
                          characters.map((char, idx) => (
                            <motion.div
                              key={char.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
                            >
                              <div className="flex flex-col">
                                <div className="flex gap-3 md:gap-4 mb-3">
                                  {char.photo && (
                                    <img src={char.photo} alt={char.name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover object-center border-2 border-blue-400 shadow-lg" />
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-1">{char.name}</h4>
                                    <p className="text-sm md:text-base text-blue-700 font-semibold mb-2">{char.role}</p>
                                    {char.suspicionLevel !== undefined && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs md:text-sm text-gray-700 font-medium">Suspicion Level:</span>
                                        <div className="flex gap-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < (char.suspicionLevel || 0) ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                                    <p className="text-xs md:text-sm font-bold text-gray-800 mb-1.5">PROFILE</p>
                                    <p className="text-sm md:text-base text-gray-800 leading-relaxed">{char.description}</p>
                                  </div>
                                  
                                  {char.personality && (
                                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 shadow-sm">
                                      <p className="text-xs md:text-sm font-bold text-purple-700 mb-1.5">PERSONALITY</p>
                                      <p className="text-sm md:text-base text-gray-800 leading-relaxed">{char.personality}</p>
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
                          <div className="text-center text-gray-400 py-12 text-base">No data evidence yet</div>
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
                          <div className="text-center text-gray-400 py-12 text-base">No conversations yet</div>
                        ) : (
                          dialogues.map((dialogue, idx) => (
                            <motion.div
                              key={dialogue.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-5 h-5 text-purple-600" />
                                <h4 className="font-semibold text-base md:text-lg text-gray-800">{dialogue.title}</h4>
                              </div>
                              <p className="text-sm md:text-base font-medium text-purple-700 mb-2">With: {dialogue.character}</p>
                              <p className="text-sm md:text-base text-gray-700 mb-3">{dialogue.summary}</p>
                              <div className="border-t border-purple-200 pt-2">
                                <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">Key Points:</p>
                                <ul className="text-sm text-gray-700 space-y-1">
                                  {dialogue.keyPoints.map((point, i) => (
                                    <li key={i}>• {point}</li>
                                  ))}
                                </ul>
                              </div>
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
                          <div className="text-center text-gray-400 py-12">No photos yet</div>
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
                          <div className="text-center text-gray-400 py-12">No documents yet</div>
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

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Close Notebook
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
