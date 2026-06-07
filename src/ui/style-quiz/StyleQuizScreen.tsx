"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark } from "@/src/ui/design-system/icons";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { Button } from "@/src/ui/design-system/Button";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { QUIZ_QUESTIONS } from "@/src/domain/style-quiz/questions";
import type { QuizQuestion } from "@/src/domain/style-quiz/types";
import { useStyleQuiz } from "./useStyleQuiz";

const ADVANCE_MS = 200; // wireframe §2: tap → gold border → auto-advance 200ms

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--chq-text-muted)" } as const;

function QuizShell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <header style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <LogoMark size={26} />
        <span className="chq-display chq-gold-text" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
          Chess DNA · Style
        </span>
      </header>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "24px 20px" }}>
        {children}
      </main>
    </div>
  );
}

function Dots({ index, total }: { index: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: 520, marginBottom: 24 }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i <= index ? "var(--chq-gold-3)" : "var(--chq-line)",
          }}
        />
      ))}
    </div>
  );
}

function QuestionView({
  question,
  index,
  total,
  reduced,
  onSelect,
  onBack,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  reduced: boolean;
  onSelect: (optionIndex: number) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    window.setTimeout(() => onSelect(i), reduced ? 0 : ADVANCE_MS);
  };

  return (
    <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ ...eyebrow, color: "var(--chq-text-2)", marginBottom: 10 }}>
        Question {index + 1} / {total}
      </p>
      <Dots index={index} total={total} />
      <h2 className="chq-display" style={{ fontSize: 24, lineHeight: 1.2, color: "var(--chq-text-1)", textAlign: "center", maxWidth: 520, margin: "0 0 24px" }}>
        {question.prompt}
      </h2>
      <div className="chq-options-grid">
        {question.options.map((o, i) => (
          <button key={o.label} type="button" className="chq-option" data-selected={selected === i} disabled={selected !== null} onClick={() => choose(i)}>
            {o.label}
          </button>
        ))}
      </div>
      {index > 0 && (
        <button
          type="button"
          onClick={onBack}
          disabled={selected !== null}
          style={{ marginTop: 18, background: "transparent", border: 0, color: "var(--chq-text-muted)", fontSize: 13, cursor: selected !== null ? "default" : "pointer" }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}

export function StyleQuizScreen() {
  const mounted = useHydrated();
  const reduced = useReducedMotion();
  const index = useStyleQuiz((s) => s.index);
  const finished = useStyleQuiz((s) => s.finished);
  const result = useStyleQuiz((s) => s.result);
  const select = useStyleQuiz((s) => s.select);
  const back = useStyleQuiz((s) => s.back);
  const reset = useStyleQuiz((s) => s.reset);

  if (!mounted) {
    return (
      <QuizShell>
        <span style={{ color: "var(--chq-text-muted)" }}>Loading…</span>
      </QuizShell>
    );
  }

  if (finished && result) {
    const accent = HERO_ACCENTS[result.primary];
    return (
      <QuizShell>
        <OrnateFrame variant="hero" hero={result.primary} style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ padding: 28, textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <p style={eyebrow}>Your Chess DNA</p>
            <h1 className="chq-display" style={{ fontSize: 28, fontWeight: 700, color: accent.base, margin: 0, textTransform: "uppercase" }}>
              The {accent.label.replace("Aggressive ", "")}
            </h1>
            <p style={{ ...eyebrow, color: "var(--chq-text-2)" }}>
              {result.matchPercent}% match{result.secondary ? ` · also ${HERO_ACCENTS[result.secondary].label}` : ""}
            </p>
            {result.reasons.length > 0 && (
              <ul style={{ listStyle: "none", padding: 0, margin: "4px 0", display: "flex", flexDirection: "column", gap: 6 }}>
                {result.reasons.map((r) => (
                  <li key={r} style={{ color: "var(--chq-text-2)", fontSize: 14 }}>
                    <span style={{ color: accent.base }}>◆</span> {r}
                  </li>
                ))}
              </ul>
            )}
            <p style={{ color: "var(--chq-text-muted)", fontSize: 12, lineHeight: 1.6 }}>
              Next: your shareable DNA Card with Opening IQ + this archetype (coming in the next module). Saved on this device.
            </p>
            <Button variant="primary" onClick={reset}>
              Retake the quiz
            </Button>
          </div>
        </OrnateFrame>
      </QuizShell>
    );
  }

  const question = QUIZ_QUESTIONS[index];
  if (!question) {
    return (
      <QuizShell>
        <Button onClick={reset}>Restart</Button>
      </QuizShell>
    );
  }

  return (
    <QuizShell>
      <QuestionView
        key={index}
        question={question}
        index={index}
        total={QUIZ_QUESTIONS.length}
        reduced={reduced}
        onSelect={select}
        onBack={back}
      />
    </QuizShell>
  );
}
