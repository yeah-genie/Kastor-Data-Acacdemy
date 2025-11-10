import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  from: string;
  subject: string;
  body: string;
}

export function EmailNotificationModal({ isOpen, onClose, from, subject, body }: EmailNotificationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          />

          {/* Email Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Email Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-7 h-7 text-white" />
                <div className="text-white font-bold text-xl">New Message</div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Email Content */}
            <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* From */}
              <div className="flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-600 min-w-[70px]">From:</span>
                <span className="text-base text-gray-900 font-medium">{from}</span>
              </div>

              {/* Subject */}
              <div className="flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-600 min-w-[70px]">Subject:</span>
                <span className="text-lg font-bold text-gray-900">{subject}</span>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-gray-200 my-5"></div>

              {/* Body */}
              <div className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                {body}
              </div>
            </div>

            {/* Footer Button */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
