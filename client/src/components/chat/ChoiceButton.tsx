import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import { Clock, Lock, Sparkles } from "lucide-react";
import type { Choice } from "@/types";

type ChoiceVariant = "standard" | "consequence" | "timed" | "requires-evidence";

export interface EnhancedChoice extends Choice {
  icon?: string;
  variant: ChoiceVariant;
  timerSeconds?: number;
  requiredEvidence?: string[];
}

interface ChoiceButtonProps {
  choice: EnhancedChoice;
  disabled?: boolean;
  disabledReason?: string | null;
  isSelected: boolean;
  onSelect: (choice: EnhancedChoice) => void;
  onExpire?: (choice: EnhancedChoice) => void;
  isExpired: boolean;
  relationshipMap?: Record<string, number>;
}

const Card = styled(motion.button)<{ $isSelected: boolean; $isDisabled: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
  border-radius: 1rem;
  padding: 1rem 1.15rem;
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  text-align: left;
  position: relative;
  transition: transform 0.2s ease, border 0.2s ease, box-shadow 0.2s ease;

  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.25);
      transform: translateY(-2px) scale(1.01);
    `}

  ${({ $isDisabled }) =>
    $isDisabled &&
    css`
      cursor: not-allowed;
      opacity: 0.55;
      transform: none !important;
    `}

  &:hover {
    transform: ${({ $isDisabled }) => ($isDisabled ? "none" : "translateY(-2px) scale(1.01)")};
    border-color: ${({ theme, $isDisabled }) => ($isDisabled ? theme.colors.mediumGray : theme.colors.primary)};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.35);
  }
`;

const IconWrapper = styled.span`
  font-size: 1.35rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 600;
  font-size: 1.05rem;
`;

const SubInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const Badge = styled.span<{ $tone?: "positive" | "neutral" | "warning" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  ${({ theme, $tone }) => {
    switch ($tone) {
      case "positive":
        return css`
          background: rgba(74, 189, 120, 0.15);
          color: #6be2a4;
          border: 1px solid rgba(74, 189, 120, 0.35);
        `;
      case "warning":
        return css`
          background: rgba(255, 193, 7, 0.15);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.35);
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
        `;
    }
  }}
`;

const DisabledReason = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
`;

export function ChoiceButton({
  choice,
  disabled = false,
  disabledReason,
  isSelected,
  onSelect,
  onExpire,
  isExpired,
  relationshipMap,
}: ChoiceButtonProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(choice.timerSeconds ?? null);

  // Reset countdown when the choice changes
  useEffect(() => {
    setTimeLeft(choice.timerSeconds ?? null);
  }, [choice.id, choice.timerSeconds]);

  useEffect(() => {
    if (choice.variant !== "timed" || timeLeft === null || disabled || isSelected || isExpired) {
      return;
    }

    if (timeLeft <= 0) {
      onExpire?.(choice);
      return;
    }

    const timer = window.setTimeout(() => setTimeLeft((prev) => (prev === null ? null : prev - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [choice, timeLeft, disabled, isSelected, isExpired, onExpire]);

  const consequenceBadges = useMemo(() => {
    if (!choice.consequence?.relationshipChange || !relationshipMap) return null;

    return Object.entries(choice.consequence.relationshipChange).map(([characterId, delta]) => {
      const current = relationshipMap[characterId] ?? 0;
      const preview = current + delta;
      return (
        <Badge key={characterId} $tone={delta >= 0 ? "positive" : "warning"}>
          <Sparkles size={14} />
          {characterId}: {current} → {preview}
        </Badge>
      );
    });
  }, [choice.consequence?.relationshipChange, relationshipMap]);

  const timerBadge =
    choice.variant === "timed" && timeLeft !== null ? (
        <Badge $tone={timeLeft <= 5 ? "warning" : "neutral"}>
          <Clock size={14} />
          {isExpired ? "Expired" : `${timeLeft}s`}
        </Badge>
    ) : null;

  const evidenceBadge =
    choice.variant === "requires-evidence" ? (
      <Badge $tone="neutral">
        <Lock size={14} />
        Evidence
      </Badge>
    ) : null;

  return (
    <Card
      type="button"
      $isSelected={isSelected}
      $isDisabled={disabled}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onSelect(choice);
        }
      }}
      layout
      initial={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -8 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <TitleRow>
        {choice.icon && <IconWrapper>{choice.icon}</IconWrapper>}
        <span>{choice.text}</span>
      </TitleRow>

      <SubInfo>
        {timerBadge}
        {evidenceBadge}
        {consequenceBadges}
      </SubInfo>

      {disabled && disabledReason && <DisabledReason>{disabledReason}</DisabledReason>}
    </Card>
  );
}

