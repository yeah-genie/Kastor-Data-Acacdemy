import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Timer, TrendingDown, TrendingUp } from "lucide-react";
import styled, { css } from "styled-components";
import type { Choice } from "@/types";

export type ChoiceOutcome = "positive" | "negative" | "neutral";

export interface ChoiceMetadata {
  icon?: ReactNode;
  type?: "standard" | "consequence" | "timed" | "required";
  consequence?: {
    outcome: ChoiceOutcome;
    description?: string;
  };
  timed?: {
    durationSeconds: number;
  };
  evidenceRequired?: string[];
  disabledReason?: string;
}

export type RichChoice = Choice & { metadata?: ChoiceMetadata };

interface ChoiceButtonProps {
  choice: RichChoice;
  disabled?: boolean;
  onSelect: (choice: RichChoice) => void;
}

const ChoiceCard = styled(motion.button)<{ $disabled: boolean; $outcome?: ChoiceOutcome }>`
  width: 100%;
  text-align: left;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 1rem;
  background: rgba(33, 150, 243, 0.06);
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.95rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  ${({ $outcome, theme }) =>
    $outcome === "positive" &&
    css`
      border-color: ${theme.colors.success};
      background: rgba(76, 175, 80, 0.08);
    `}

  ${({ $outcome, theme }) =>
    $outcome === "negative" &&
    css`
      border-color: ${theme.colors.danger};
      background: rgba(244, 67, 54, 0.08);
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
      border-style: dashed;
    `}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      ${({ $disabled }) =>
        !$disabled &&
        css`
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(33, 150, 243, 0.18);
          background: rgba(33, 150, 243, 0.12);
        `}
    }
  }
`;

const ChoiceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const ChoiceIconWrapper = styled.span<{ $outcome?: ChoiceOutcome }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.colors.primary};

  ${({ $outcome, theme }) =>
    $outcome === "positive" &&
    css`
      color: ${theme.colors.success};
    `}

  ${({ $outcome, theme }) =>
    $outcome === "negative" &&
    css`
      color: ${theme.colors.danger};
    `}
`;

const ChoiceBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  line-height: 1.5;
`;

const ChoiceFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
`;

const Tag = styled.span<{ $variant?: "neutral" | "warning" | "error" | "success" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);

  ${({ $variant, theme }) =>
    $variant === "warning" &&
    css`
      background: rgba(255, 152, 0, 0.18);
      color: ${theme.colors.secondary};
    `}

  ${({ $variant, theme }) =>
    $variant === "error" &&
    css`
      background: rgba(244, 67, 54, 0.12);
      color: ${theme.colors.danger};
    `}

  ${({ $variant, theme }) =>
    $variant === "success" &&
    css`
      background: rgba(76, 175, 80, 0.12);
      color: ${theme.colors.success};
    `}
`;

const DisabledReason = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const ChoiceButton = ({ choice, disabled, onSelect }: ChoiceButtonProps) => {
  const metadata = choice.metadata;
  const [remaining, setRemaining] = useState<number | null>(
    metadata?.timed?.durationSeconds ?? null,
  );

  const isTimed = metadata?.type === "timed" && remaining !== null;
  const isRequirementMet =
    metadata?.type !== "required" || (metadata?.evidenceRequired?.length ?? 0) === 0;

  useEffect(() => {
    if (!isTimed || remaining === null) return;
    if (remaining <= 0) return;

    const interval = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev === null) return null;
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTimed, remaining]);

  useEffect(() => {
    if (metadata?.timed?.durationSeconds !== undefined) {
      setRemaining(metadata.timed.durationSeconds);
    } else {
      setRemaining(null);
    }
  }, [metadata?.timed?.durationSeconds]);

  const outcome = metadata?.consequence?.outcome;
  const computedDisabled = disabled || !isRequirementMet || (isTimed && remaining === 0);

  return (
    <ChoiceCard
      type="button"
      onClick={() => {
        if (!computedDisabled) {
          onSelect(choice);
        }
      }}
      $disabled={computedDisabled}
      $outcome={outcome}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <ChoiceHeader>
        <ChoiceIconWrapper $outcome={outcome}>
          {metadata?.icon ??
            (outcome === "positive" ? (
              <TrendingUp size={18} />
            ) : outcome === "negative" ? (
              <TrendingDown size={18} />
            ) : metadata?.type === "timed" ? (
              <Timer size={18} />
            ) : metadata?.type === "required" ? (
              <Lock size={18} />
            ) : (
              <span role="img" aria-label="choice">
                💡
              </span>
            ))}
        </ChoiceIconWrapper>
        <span>{choice.text}</span>
      </ChoiceHeader>

      <ChoiceBody>
        {metadata?.consequence?.description ? (
          <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>
            {metadata.consequence.description}
          </span>
        ) : null}
      </ChoiceBody>

      <ChoiceFooter>
        {metadata?.consequence?.description && (
          <Tag
            $variant={
              outcome === "positive" ? "success" : outcome === "negative" ? "error" : "neutral"
            }
          >
            {outcome === "positive" && "Relationship boost"}
            {outcome === "negative" && "Risky decision"}
            {outcome === "neutral" && "Narrative choice"}
          </Tag>
        )}

        {isTimed && remaining !== null && (
          <Tag $variant={remaining > 5 ? "neutral" : "warning"}>
            <Timer size={14} />
            {remaining > 0 ? `${remaining}s remaining` : "Time's up"}
          </Tag>
        )}

        {metadata?.evidenceRequired?.length ? (
          <Tag $variant={isRequirementMet ? "success" : "error"}>
            <Lock size={14} />
            Requires evidence: {metadata.evidenceRequired.length}
          </Tag>
        ) : null}
      </ChoiceFooter>

      {computedDisabled && metadata?.disabledReason ? (
        <DisabledReason>{metadata.disabledReason}</DisabledReason>
      ) : null}
    </ChoiceCard>
  );
};

export default ChoiceButton;
