import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  errorMessage?: string;
}

interface TextInputInteractionProps {
  prompt: string;
  validation?: ValidationRules;
  onSubmit: (value: string) => void;
  onCancel?: () => void;
}

export function TextInputInteraction({
  prompt,
  validation,
  onSubmit,
  onCancel
}: TextInputInteractionProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (validation?.minLength && trimmed.length < validation.minLength) {
      setError(
        validation.errorMessage ??
          `이름은 최소 ${validation.minLength}자 이상이어야 합니다.`
      );
      return;
    }
    if (validation?.maxLength && trimmed.length > validation.maxLength) {
      setError(
        validation.errorMessage ??
          `이름은 최대 ${validation.maxLength}자 이하이어야 합니다.`
      );
      return;
    }
    if (trimmed.length === 0) {
      setError("값을 입력해 주세요.");
      return;
    }
    onSubmit(trimmed);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121829] p-6 shadow-2xl"
      >
        <h3 className="text-lg font-bold text-white mb-3">탐정 호칭 입력</h3>
        <p className="text-sm text-white/70 mb-4">{prompt}</p>

        <Input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="이름을 입력하세요"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
        />
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} className="text-white/70">
              취소
            </Button>
          )}
          <Button onClick={handleSubmit} className="bg-[#00d9ff] text-black">
            확인
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
