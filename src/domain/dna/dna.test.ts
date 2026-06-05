import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { DNA_QUESTION_BANK, DNA_TEST_LENGTH } from "./question-bank";
import { nextTargetDifficulty, selectNextQuestion, START_DIFFICULTY } from "./adaptive";
import { computeCore, scoreDna } from "./scoring";
import type { DnaAnswer } from "./types";

const allCorrect = (): DnaAnswer[] =>
  DNA_QUESTION_BANK.map((q) => ({
    questionId: q.id,
    chosenMove: q.expectedMove,
    correct: true,
    latencyMs: 1000,
  }));

describe("DNA question bank (derived from certified curated lines)", () => {
  it("is non-empty and every id is unique", () => {
    expect(DNA_QUESTION_BANK.length).toBeGreaterThan(0);
    expect(new Set(DNA_QUESTION_BANK.map((q) => q.id)).size).toBe(DNA_QUESTION_BANK.length);
  });

  it("each expectedMove is LEGAL in its FEN (engine = truth, LAW #2)", () => {
    for (const q of DNA_QUESTION_BANK) {
      const game = new Chess(q.fen);
      expect(() => game.move(q.expectedMove), q.id).not.toThrow();
    }
  });

  it("covers all four archetypes", () => {
    const archetypes = new Set(DNA_QUESTION_BANK.map((q) => q.archetype));
    expect(archetypes).toEqual(new Set(["warrior", "strategist", "defender", "trickster"]));
  });

  it("DNA_TEST_LENGTH never exceeds the bank or 20", () => {
    expect(DNA_TEST_LENGTH).toBeLessThanOrEqual(DNA_QUESTION_BANK.length);
    expect(DNA_TEST_LENGTH).toBeLessThanOrEqual(20);
  });
});

describe("adaptive sequencing", () => {
  it("starts mid, climbs on correct (cap 5), eases on wrong (floor 1)", () => {
    expect(nextTargetDifficulty([])).toBe(START_DIFFICULTY);
    const correct = (n: number): DnaAnswer[] =>
      Array.from({ length: n }, (_, i) => ({
        questionId: `c${i}`,
        chosenMove: "",
        correct: true,
        latencyMs: 0,
      }));
    const wrong = (n: number): DnaAnswer[] =>
      Array.from({ length: n }, (_, i) => ({
        questionId: `w${i}`,
        chosenMove: "",
        correct: false,
        latencyMs: 0,
      }));
    expect(nextTargetDifficulty(correct(10))).toBe(5);
    expect(nextTargetDifficulty(wrong(10))).toBe(1);
  });

  it("returns null once every question has been asked", () => {
    const asked = new Set(DNA_QUESTION_BANK.map((q) => q.id));
    expect(selectNextQuestion(DNA_QUESTION_BANK, asked, [])).toBeNull();
  });

  it("serves a question nearest the target difficulty", () => {
    const q = selectNextQuestion(DNA_QUESTION_BANK, new Set(), []);
    expect(q).not.toBeNull();
    // With no history the target is START_DIFFICULTY; the pick should be a
    // closest-difficulty match across the bank.
    const best = Math.min(
      ...DNA_QUESTION_BANK.map((x) => Math.abs(x.difficulty - START_DIFFICULTY)),
    );
    expect(Math.abs(q!.difficulty - START_DIFFICULTY)).toBe(best);
  });
});

describe("scoring + IQ seeding (LAW #1)", () => {
  it("all correct → Core 1 → Opening IQ 1000", () => {
    const r = scoreDna(DNA_QUESTION_BANK, allCorrect());
    expect(r.core).toBe(1);
    expect(r.initialIq).toBe(1000);
    expect(r.rank).toBe("Opening Hero");
  });

  it("all wrong → Core 0 → Opening IQ 0", () => {
    const answers = DNA_QUESTION_BANK.map((q) => ({
      questionId: q.id,
      chosenMove: "",
      correct: false,
      latencyMs: 0,
    }));
    const r = scoreDna(DNA_QUESTION_BANK, answers);
    expect(r.core).toBe(0);
    expect(r.initialIq).toBe(0);
  });

  it("harder questions weigh more in Core", () => {
    // The derived bank spans difficulty 3–5; compare the easiest vs hardest tier.
    const easy = DNA_QUESTION_BANK.find((q) => q.difficulty === 3)!;
    const hard = DNA_QUESTION_BANK.find((q) => q.difficulty === 5)!;
    const coreEasyOnly = computeCore(DNA_QUESTION_BANK, [
      { questionId: easy.id, chosenMove: "", correct: true, latencyMs: 0 },
      { questionId: hard.id, chosenMove: "", correct: false, latencyMs: 0 },
    ]);
    const coreHardOnly = computeCore(DNA_QUESTION_BANK, [
      { questionId: easy.id, chosenMove: "", correct: false, latencyMs: 0 },
      { questionId: hard.id, chosenMove: "", correct: true, latencyMs: 0 },
    ]);
    expect(coreHardOnly).toBeGreaterThan(coreEasyOnly);
  });

  it("picks the best-performing archetype and recommends a matching path", () => {
    // Answer ONLY warrior questions correctly, everything else wrong.
    const answers: DnaAnswer[] = DNA_QUESTION_BANK.map((q) => ({
      questionId: q.id,
      chosenMove: "",
      correct: q.archetype === "warrior",
      latencyMs: 0,
    }));
    const r = scoreDna(DNA_QUESTION_BANK, answers);
    expect(r.archetype).toBe("warrior");
    expect(r.recommendedPathId).toBe("evans-gambit");
  });
});
