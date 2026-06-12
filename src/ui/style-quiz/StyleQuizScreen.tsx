"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs } from "@/src/ui/design-system/icons";
import { BRAND_LOGO } from "@/src/ui/design-system/art";
import { Button } from "@/src/ui/design-system/Button";
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
      <header style={{ minHeight: 100, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <Image src={BRAND_LOGO} alt="ChessHeroQuest" width={1478} height={418} priority style={{ height: 72, width: "auto" }} />
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
        {question.kind === "archetype" ? "Your style" : "Your profile"} · {index + 1}/{total}
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
  const router = useRouter();
  const mounted = useHydrated();
  const reduced = useReducedMotion();
  const index = useStyleQuiz((s) => s.index);
  const finished = useStyleQuiz((s) => s.finished);
  const result = useStyleQuiz((s) => s.result);
  const select = useStyleQuiz((s) => s.select);
  const back = useStyleQuiz((s) => s.back);
  const reset = useStyleQuiz((s) => s.reset);

  // Interlude after Q8: style answers are in; frame the 8 profile questions
  // before they start (once per visit — local state, no persistence needed).
  const [interludeDone, setInterludeDone] = useState(false);

  // Fresh arrival from the DNA test (?fresh=1): clear any stale persisted run so
  // the player is ALWAYS asked the questions — never shown last week's result.
  const [freshHandled, setFreshHandled] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("fresh") === "1") {
      reset();
      window.history.replaceState(null, "", "/style-quiz");
    }
    // Deferred — avoids a synchronous setState-in-effect cascade.
    const t = window.setTimeout(() => setFreshHandled(true), 0);
    return () => window.clearTimeout(t);
  }, [reset]);

  // Quiz done → straight to the profile reveal (/result carries the funnel:
  // test + quiz → profile → hero-select). No duplicate card, no retake here.
  useEffect(() => {
    if (mounted && freshHandled && finished && result) router.replace("/result");
  }, [mounted, freshHandled, finished, result, router]);

  if (!mounted || !freshHandled) {
    return (
      <QuizShell>
        <span style={{ color: "var(--chq-text-muted)" }}>Loading…</span>
      </QuizShell>
    );
  }

  if (finished && result) {
    return (
      <QuizShell>
        <span style={{ color: "var(--chq-text-muted)" }}>Revealing your Chess DNA…</span>
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

  // First profile question reached → one-line interlude before continuing.
  if (question.kind === "profile" && index === 8 && !interludeDone) {
    return (
      <QuizShell>
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            border: "1px solid var(--chq-line)",
            borderRadius: "var(--chq-r-panel)",
            background: "var(--chq-panel)",
            padding: "26px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--chq-text-1)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Style locked. 8 quick profile questions left — they tune your Road to Elo.
          </p>
          <Button onClick={() => setInterludeDone(true)}>Continue</Button>
        </div>
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
