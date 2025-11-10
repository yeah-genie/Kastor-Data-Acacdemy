import { motion } from "framer-motion";
import { Phone, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { synthesizeSpeech } from "@/lib/tts";

interface VoicemailPlayerProps {
  from: string;
  timestamp: string;
  text: string;
  index?: number;
  autoPlay?: boolean;
}

export function VoicemailPlayer({
  from,
  timestamp,
  text,
  index = 0,
  autoPlay = false
}: VoicemailPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate TTS audio on mount
  useEffect(() => {
    const generateAudio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = await synthesizeSpeech(text);

        if (url) {
          setAudioUrl(url);
        } else {
          setError("TTS not configured. Using text-only mode.");
        }
      } catch (err) {
        console.error("Failed to generate audio:", err);
        setError("Failed to generate audio");
      } finally {
        setIsLoading(false);
      }
    };

    generateAudio();
  }, [text]);

  // Auto-play if requested and audio is ready
  useEffect(() => {
    if (autoPlay && audioUrl && audioRef.current && !isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [autoPlay, audioUrl]);

  // Update time as audio plays
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.5 }}
      className="w-full max-w-2xl mx-auto my-4"
    >
      {/* Voicemail Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center gap-3">
          <motion.div
            animate={isPlaying ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Phone className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg">📞 Voicemail</div>
            <div className="text-white/80 text-sm">{from}</div>
          </div>
          <div className="text-white/70 text-xs">{timestamp}</div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center text-white/70 py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block"
              >
                ⚙️
              </motion.div>
              <div className="mt-2">Generating audio...</div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 text-yellow-200 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Transcript */}
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-600">
            <div className="text-gray-400 text-xs font-semibold mb-2">TRANSCRIPT</div>
            <div className="text-white text-base leading-relaxed">{text}</div>
          </div>

          {/* Audio Controls */}
          {audioUrl && !isLoading && (
            <div className="space-y-3">
              {/* Hidden audio element */}
              <audio ref={audioRef} src={audioUrl} />

              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm font-mono">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
                <span className="text-white/70 text-sm font-mono">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4">
                {/* Mute Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-3 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </motion.button>

                {/* Play/Pause Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="p-5 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-white" />
                  ) : (
                    <Play className="w-7 h-7 text-white ml-1" />
                  )}
                </motion.button>

                {/* Spacer for symmetry */}
                <div className="w-14"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
