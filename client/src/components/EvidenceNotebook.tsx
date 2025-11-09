import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, BarChart3, MessageSquare, Image as ImageIcon, FileText, Star } from "lucide-react";
import { useDetectiveGame, CharacterEvidence, DataEvidence, DialogueEvidence, PhotoEvidence, DocumentEvidence } from "@/lib/stores/useDetectiveGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EvidenceNotebookProps {
  isOpen: boolean;
  onClose: () => void;
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
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-4 md:inset-10 bg-white border-2 border-gray-200 rounded-2xl z-50 overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Evidence Notebook</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Score: <span className="text-blue-600 font-bold">{score}</span></span>
                  <span className="text-gray-600">Evidence: <span className="text-purple-600 font-bold">{evidenceCollected.length}</span></span>
                  <span className="text-gray-600">Hints: <span className="text-orange-600 font-bold">{hintsUsed}/{maxHints}</span></span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="characters" className="h-full flex flex-col">
                <div className="bg-white border-b border-gray-200">
                  <TabsList className="w-full grid grid-cols-4 md:grid-cols-5 bg-transparent p-2">
                    <TabsTrigger value="characters" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">Characters</span>
                      {characters.length > 0 && <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{characters.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="data" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Data</span>
                      {dataViz.length > 0 && <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{dataViz.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="conversations" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">Talks</span>
                      {dialogues.length > 0 && <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{dialogues.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Photos</span>
                      {photos.length > 0 && <span className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{photos.length}</span>}
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="hidden md:flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Docs</span>
                      {documents.length > 0 && <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{documents.length}</span>}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="characters" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-4">
                        {characters.length === 0 ? (
                          <div className="text-center text-gray-400 py-12">No character profiles yet</div>
                        ) : (
                          characters.map((char, idx) => (
                            <motion.div
                              key={char.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200"
                            >
                              <div className="flex gap-4">
                                {char.photo && (
                                  <img src={char.photo} alt={char.name} className="w-20 h-20 rounded-full object-cover border-2 border-blue-400" />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg text-gray-800">{char.name}</h4>
                                  <p className="text-sm text-blue-600 font-medium mb-2">{char.role}</p>
                                  <p className="text-sm text-gray-700">{char.description}</p>
                                  {char.suspicionLevel !== undefined && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <span className="text-xs text-gray-600">Suspicion:</span>
                                      <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-3 h-3 ${i < (char.suspicionLevel || 0) ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                                        ))}
                                      </div>
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
                      <div className="p-6 space-y-4">
                        {dataViz.length === 0 ? (
                          <div className="text-center text-gray-400 py-12">No data evidence yet</div>
                        ) : (
                          dataViz.map((data, idx) => (
                            <motion.div
                              key={data.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-gray-800">{data.title}</h4>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">Type: {data.dataType}</p>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="conversations" className="h-full m-0">
                    <ScrollArea className="h-full">
                      <div className="p-6 space-y-4">
                        {dialogues.length === 0 ? (
                          <div className="text-center text-gray-400 py-12">No conversations yet</div>
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
                                <h4 className="font-semibold text-gray-800">{dialogue.title}</h4>
                              </div>
                              <p className="text-sm font-medium text-purple-700 mb-2">With: {dialogue.character}</p>
                              <p className="text-sm text-gray-700 mb-3">{dialogue.summary}</p>
                              <div className="border-t border-purple-200 pt-2">
                                <p className="text-xs text-gray-600 font-medium mb-1">Key Points:</p>
                                <ul className="text-xs text-gray-700 space-y-1">
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
