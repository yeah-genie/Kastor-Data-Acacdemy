import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Mail, Clock } from "lucide-react";

interface DocumentViewerProps {
  title: string;
  content: string[];
  meta?: {
    from?: string;
    subject?: string;
    timestamp?: string;
  };
  onClose: () => void;
}

export function DocumentViewer({
  title,
  content,
  meta,
  onClose
}: DocumentViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#11182a] shadow-2xl overflow-hidden"
      >
        <div className="border-b border-white/10 bg-[#0c1220] px-5 py-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#00d9ff]" />
            {title}
          </h2>
          {meta && (
            <div className="mt-2 space-y-1 text-xs text-white/60">
              {meta.from && <p>From: {meta.from}</p>}
              {meta.subject && <p>Subject: {meta.subject}</p>}
              {meta.timestamp && (
                <p className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {meta.timestamp}
                </p>
              )}
            </div>
          )}
        </div>

        <ScrollArea className="max-h-[60vh] px-5 py-4">
          <div className="space-y-4 text-sm leading-relaxed text-white/80">
            {content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end border-t border-white/10 bg-[#0c1220] px-5 py-4">
          <Button onClick={onClose} className="bg-[#00d9ff] text-black">
            닫기
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
