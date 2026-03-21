"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { ModuleVideoPlayer } from "@/components/employee/module-video-player";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

type Props = {
  module: Doc<"learning_path_modules">;
};

const TAB_OPTIONS = ["notes", "video", "qa"] as const;

type ListState = {
  items: string[];
  ordered: boolean;
  start: number;
};

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code key={`${keyPrefix}-${match.index}`} className="db-markdown-inline-code">
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-${match.index}`} className="font-semibold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(
        <em key={`${keyPrefix}-${match.index}`} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }

    lastIndex = match.index + token.length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderHeading(level: number, text: string, key: string) {
  const content = renderInlineMarkdown(text, `${key}-heading`);

  if (level === 1) {
    return (
      <h1 key={key} className="db-markdown-h1">
        {content}
      </h1>
    );
  }

  if (level === 2) {
    return (
      <h2 key={key} className="db-markdown-h2">
        {content}
      </h2>
    );
  }

  if (level === 3) {
    return (
      <h3 key={key} className="db-markdown-h3">
        {content}
      </h3>
    );
  }

  return (
    <h4 key={key} className="db-markdown-h4">
      {content}
    </h4>
  );
}

function renderList(listState: ListState, key: string) {
  if (listState.ordered) {
    return (
      <ol key={key} className="db-markdown-list db-markdown-list-ordered" start={listState.start}>
        {listState.items.map((item, index) => (
          <li key={`${key}-${index}`}>{renderInlineMarkdown(item, `${key}-${index}`)}</li>
        ))}
      </ol>
    );
  }

  return (
    <ul key={key} className="db-markdown-list db-markdown-list-unordered">
      {listState.items.map((item, index) => (
        <li key={`${key}-${index}`}>{renderInlineMarkdown(item, `${key}-${index}`)}</li>
      ))}
    </ul>
  );
}

function renderMarkdownNotes(content?: string) {
  if (!content) {
    return [] as ReactNode[];
  }

  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listState: ListState | null = null;
  let isInCodeFence = false;
  let codeFenceLanguage = "";
  let codeFenceLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;

    const text = paragraphLines.join(" ").trim();
    if (text) {
      blocks.push(
        <p key={`paragraph-${blocks.length}`} className="db-markdown-paragraph">
          {renderInlineMarkdown(text, `paragraph-${blocks.length}`)}
        </p>,
      );
    }

    paragraphLines = [];
  };

  const flushList = () => {
    if (!listState) return;
    blocks.push(renderList(listState, `list-${blocks.length}`));
    listState = null;
  };

  const flushCodeFence = () => {
    blocks.push(
      <pre key={`code-${blocks.length}`} className="db-markdown-pre">
        <code className="db-markdown-code" data-language={codeFenceLanguage || undefined}>
          {codeFenceLines.join("\n")}
        </code>
      </pre>,
    );
    codeFenceLanguage = "";
    codeFenceLines = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      flushParagraph();
      flushList();

      if (isInCodeFence) {
        flushCodeFence();
        isInCodeFence = false;
      } else {
        isInCodeFence = true;
        codeFenceLanguage = line.trim().slice(3).trim();
      }
      continue;
    }

    if (isInCodeFence) {
      codeFenceLines = [...codeFenceLines, line];
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push(
        renderHeading(
          Math.min(headingMatch[1].length, 4),
          headingMatch[2].trim(),
          `heading-${blocks.length}`,
        ),
      );
      continue;
    }

    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push(<hr key={`rule-${blocks.length}`} className="db-markdown-hr" />);
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      const start = Number(orderedMatch[1]);
      if (!listState || !listState.ordered) {
        flushList();
        listState = { items: [orderedMatch[2]], ordered: true, start };
      } else {
        listState = {
          ordered: true,
          start: listState.start,
          items: [...listState.items, orderedMatch[2]],
        };
      }
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (!listState || listState.ordered) {
        flushList();
        listState = { items: [unorderedMatch[1]], ordered: false, start: 1 };
      } else {
        listState = {
          ordered: false,
          start: 1,
          items: [...listState.items, unorderedMatch[1]],
        };
      }
      continue;
    }

    paragraphLines = [...paragraphLines, trimmed];
  }

  flushParagraph();
  flushList();

  if (isInCodeFence || codeFenceLanguage || codeFenceLines.length > 0) {
    flushCodeFence();
  }

  return blocks;
}

function pillStyles() {
  return {
    border: "1px solid var(--db-border)",
    color: "var(--db-text-soft)",
    background: "color-mix(in srgb, var(--db-card) 86%, transparent)",
  };
}

function panelToggleStyles(isActive: boolean) {
  return {
    border: "1px solid var(--db-border)",
    color: isActive ? "var(--db-text)" : "var(--db-text-muted)",
    background: isActive
      ? "color-mix(in srgb, var(--rellax-sage) 10%, var(--db-card))"
      : "color-mix(in srgb, var(--db-card) 86%, transparent)",
    borderColor: isActive
      ? "color-mix(in srgb, var(--rellax-sage) 30%, var(--db-border))"
      : "var(--db-border)",
  };
}

export function ModuleDetailContent({ module: serverModule }: Props) {
  const clientModule = useQuery(api.employeeLearning.getModuleById, {
    moduleId: serverModule._id,
  });
  const startModule = useMutation(api.employeeLearning.startModule);
  const completeModule = useMutation(api.employeeLearning.completeModule);

  const learningModule = clientModule ?? serverModule;
  const [openPanel, setOpenPanel] = useState<"notes" | "qa" | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const isNotStarted = learningModule.status === "not_started";
  const isCompleted = learningModule.status === "completed";
  const isModuleReady = learningModule.generationStatus === "ready";
  const isGenerating =
    learningModule.generationStatus === "pending" ||
    learningModule.generationStatus === "processing" ||
    learningModule.generationStatus === "partial";

  useEffect(() => {
    if (isNotStarted && isModuleReady) {
      void startModule({ moduleId: serverModule._id });
    }
  }, [isModuleReady, isNotStarted, serverModule._id, startModule]);

  const slides = learningModule.slides ?? [];
  const objectives = learningModule.learningObjectives ?? [];
  const qaPairs = learningModule.qaPairs ?? [];

  const availableTabs = useMemo(
    () =>
      TAB_OPTIONS.filter((tab) => {
        if (tab === "notes") return Boolean(learningModule.notesContent);
        if (tab === "video") return slides.length > 0;
        return qaPairs.length > 0;
      }),
    [learningModule.notesContent, qaPairs.length, slides.length],
  );

  const renderedNotes = useMemo(
    () => renderMarkdownNotes(learningModule.notesContent),
    [learningModule.notesContent],
  );

  const hasNotes = availableTabs.includes("notes");
  const hasQA = availableTabs.includes("qa");

  function togglePanel(panel: "notes" | "qa") {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  }

  return (
    <div
      className="w-full"
      style={{
        background:
          "radial-gradient(circle at top, color-mix(in srgb, var(--rellax-sage) 10%, transparent) 0%, transparent 34%), linear-gradient(180deg, color-mix(in srgb, var(--db-card) 45%, var(--db-bg)) 0%, var(--db-bg) 28%, var(--db-bg) 100%)",
        color: "var(--db-text)",
      }}
    >
      {/* ── Header ── */}
      <section
        className="w-full border-b"
        style={{
          borderColor: "var(--db-border)",
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--rellax-gold) 16%, transparent) 0%, transparent 42%), linear-gradient(180deg, color-mix(in srgb, var(--db-card) 96%, transparent), color-mix(in srgb, var(--db-bg) 84%, transparent))",
        }}
      >
        <div className="px-6 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="max-w-5xl">
              <h1
                className="font-display text-3xl leading-tight sm:text-4xl xl:text-[3rem]"
                style={{ letterSpacing: "-0.03em" }}
              >
                {learningModule.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {isCompleted ? (
                <span
                  className="inline-flex items-center px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em]"
                  style={{
                    ...pillStyles(),
                    color: "var(--rellax-sage)",
                    border: "1px solid color-mix(in srgb, var(--rellax-sage) 30%, transparent)",
                    background: "color-mix(in srgb, var(--rellax-sage) 10%, var(--db-card))",
                  }}
                >
                  Completed
                </span>
              ) : null}
              {isGenerating ? (
                <span
                  className="inline-flex items-center px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em]"
                  style={pillStyles()}
                >
                  Generating
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ── Generating state ── */}
      {!isModuleReady ? (
        <section className="px-6 py-10 sm:px-8 lg:px-10 xl:px-14">
          <div
            className="max-w-3xl border-l-2 pl-5"
            style={{
              borderColor: "var(--rellax-sage)",
              color: "var(--db-text-soft)",
            }}
          >
            <p
              className="font-mono text-[0.65rem] uppercase tracking-[0.24em]"
              style={{ color: "var(--db-text-muted)" }}
            >
              Generation in progress
            </p>
            <p className="mt-4 text-base leading-8">
              The lesson will unlock after notes, video, spoken narration, and Q&amp;A are ready.
            </p>
          </div>
        </section>
      ) : null}

      {/* ── Main content ── */}
      {isModuleReady ? (
        <section className="w-full px-6 pb-16 pt-0 sm:px-8 lg:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-6xl">

            {/* Video player — full width, primary focus */}
            <div className="py-8">
              {slides.length > 0 ? (
                <ModuleVideoPlayer
                  slides={slides}
                />
              ) : (
                <p className="text-sm" style={{ color: "var(--db-text-muted)" }}>
                  Slide video content is still being generated.
                </p>
              )}
            </div>

            {/* ── Action bar: Notes / Q&A toggles + downloads ── */}
            <div
              className="flex flex-wrap items-center gap-3 border-t pt-5"
              style={{ borderColor: "var(--db-border)" }}
            >
              {hasNotes ? (
                <button
                  type="button"
                  onClick={() => togglePanel("notes")}
                  className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-colors"
                  style={panelToggleStyles(openPanel === "notes")}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    aria-hidden="true"
                    style={{ opacity: 0.7 }}
                  >
                    <rect x="1" y="1" width="11" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="1" y="4.5" width="8" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="1" y="8" width="9.5" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="1" y="11" width="6" height="1.5" rx="0.75" fill="currentColor" />
                  </svg>
                  Notes
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                    style={{
                      transform: openPanel === "notes" ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 200ms",
                      opacity: 0.5,
                    }}
                  >
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : null}

              {hasQA ? (
                <button
                  type="button"
                  onClick={() => togglePanel("qa")}
                  className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-colors"
                  style={panelToggleStyles(openPanel === "qa")}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    aria-hidden="true"
                    style={{ opacity: 0.7 }}
                  >
                    <circle cx="6.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M6.5 7.5v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M6.5 10.5v0.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Q&amp;A
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                    style={{
                      transform: openPanel === "qa" ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 200ms",
                      opacity: 0.5,
                    }}
                  >
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : null}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Download links */}
              {learningModule.slideDeckUrl ? (
                <a
                  href={learningModule.slideDeckUrl}
                  className="inline-flex items-center px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em]"
                  style={{ ...pillStyles(), textDecoration: "none", color: "var(--db-text)" }}
                >
                  Download PPT
                </a>
              ) : null}
              {learningModule.transcriptUrl ? (
                <a
                  href={learningModule.transcriptUrl}
                  className="inline-flex items-center px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em]"
                  style={{ ...pillStyles(), textDecoration: "none", color: "var(--db-text)" }}
                >
                  Transcript
                </a>
              ) : null}
            </div>

            {/* ── Collapsible panel ── */}
            {openPanel !== null ? (
              <div
                className="mt-0 border-x border-b"
                style={{
                  borderColor: "var(--db-border)",
                  background: "color-mix(in srgb, var(--db-card) 60%, var(--db-bg))",
                }}
              >
                {/* Panel header */}
                <div
                  className="flex items-center justify-between border-b px-6 py-4"
                  style={{ borderColor: "var(--db-border)" }}
                >
                  <p
                    className="font-mono text-[0.62rem] uppercase tracking-[0.22em]"
                    style={{ color: "var(--db-text-muted)" }}
                  >
                    {openPanel === "notes" ? "Notes" : "Q&A"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpenPanel(null)}
                    className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-60"
                    style={{ color: "var(--db-text-muted)" }}
                    aria-label="Close panel"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Panel content */}
                <div className="px-6 py-8 lg:px-10">
                  {openPanel === "notes" ? (
                    learningModule.notesContent ? (
                      <article className="db-markdown" style={{ maxWidth: "72ch" }}>
                        {renderedNotes}
                      </article>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--db-text-muted)" }}>
                        Notes are still being generated.
                      </p>
                    )
                  ) : null}

                  {openPanel === "qa" ? (
                    qaPairs.length > 0 ? (
                      <div className="divide-y" style={{ borderColor: "var(--db-border)" }}>
                        {qaPairs.map((pair, index) => {
                          const options =
                            "options" in pair && Array.isArray(pair.options) ? pair.options : [];
                          const correctAnswer =
                            "correctAnswer" in pair && typeof pair.correctAnswer === "string"
                              ? pair.correctAnswer
                              : undefined;
                          const explanation =
                            "explanation" in pair && typeof pair.explanation === "string"
                              ? pair.explanation
                              : undefined;
                          const legacyAnswer =
                            "answer" in pair && typeof pair.answer === "string"
                              ? pair.answer
                              : undefined;
                          const selectedAnswer = selectedAnswers[index];
                          const hasAnswered = Boolean(selectedAnswer);
                          const isCorrect = selectedAnswer === correctAnswer;

                          return (
                            <section key={`${pair.question}-${index}`} className="py-8">
                              <p
                                className="font-mono text-[0.62rem] uppercase tracking-[0.22em]"
                                style={{ color: "var(--db-text-muted)" }}
                              >
                                Question {index + 1}
                              </p>
                              <h3
                                className="mt-3 text-lg font-semibold leading-8"
                                style={{ color: "var(--db-text)" }}
                              >
                                {pair.question}
                              </h3>

                              {options.length === 4 && correctAnswer ? (
                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                  {options.map((option) => {
                                    const isSelected = selectedAnswer === option;
                                    const isCorrectOption = correctAnswer === option;
                                    const showCorrect = hasAnswered && isCorrectOption;
                                    const showWrong = hasAnswered && isSelected && !isCorrectOption;

                                    return (
                                      <button
                                        key={option}
                                        type="button"
                                        onClick={() =>
                                          setSelectedAnswers((current) => ({
                                            ...current,
                                            [index]: option,
                                          }))
                                        }
                                        disabled={hasAnswered}
                                        className="block w-full border px-4 py-4 text-left text-sm leading-7 transition-colors disabled:cursor-default"
                                        style={{
                                          background: showCorrect
                                            ? "color-mix(in srgb, var(--rellax-sage) 8%, var(--db-card))"
                                            : showWrong
                                              ? "rgba(239,68,68,0.06)"
                                              : isSelected
                                                ? "color-mix(in srgb, var(--rellax-sage) 4%, var(--db-card))"
                                                : "transparent",
                                          borderColor: showCorrect
                                            ? "color-mix(in srgb, var(--rellax-sage) 32%, transparent)"
                                            : showWrong
                                              ? "rgba(239,68,68,0.22)"
                                              : "var(--db-border)",
                                          color: "var(--db-text-soft)",
                                        }}
                                      >
                                        {option}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : legacyAnswer ? (
                                <div
                                  className="mt-5 border-l-2 pl-4 text-sm leading-7"
                                  style={{
                                    borderColor: "var(--db-border)",
                                    color: "var(--db-text-soft)",
                                  }}
                                >
                                  {legacyAnswer}
                                </div>
                              ) : null}

                              {hasAnswered && correctAnswer ? (
                                <div
                                  className="mt-5 border-l-2 pl-4 text-sm leading-7"
                                  style={{
                                    borderColor: isCorrect
                                      ? "var(--rellax-sage)"
                                      : "rgba(239,68,68,0.65)",
                                    color: "var(--db-text-soft)",
                                  }}
                                >
                                  <p
                                    className="font-semibold"
                                    style={{
                                      color: isCorrect ? "var(--rellax-sage)" : "rgb(185,28,28)",
                                    }}
                                  >
                                    {isCorrect
                                      ? "Correct"
                                      : `Incorrect. Correct answer: ${correctAnswer}`}
                                  </p>
                                  <p className="mt-2">{explanation}</p>
                                </div>
                              ) : null}
                            </section>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--db-text-muted)" }}>
                        Q&amp;A content is still being generated.
                      </p>
                    )
                  ) : null}
                </div>
              </div>
            ) : null}

            {/* ── Learning objectives ── */}
            {objectives.length > 0 ? (
              <section className="mt-10">
                <div
                  className="mb-4 border-b pb-3"
                  style={{ borderColor: "var(--db-border)" }}
                >
                  <p
                    className="font-mono text-[0.62rem] uppercase tracking-[0.22em]"
                    style={{ color: "var(--db-text-muted)" }}
                  >
                    Learning objectives
                  </p>
                </div>

                <div
                  className="grid gap-0 border sm:grid-cols-2"
                  style={{ borderColor: "var(--db-border)" }}
                >
                  {objectives.map((objective, index) => (
                    <div
                      key={objective}
                      className="grid grid-cols-[3rem_minmax(0,1fr)] border-b px-4 py-4 last:border-b-0 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
                      style={{ borderColor: "var(--db-border)" }}
                    >
                      <span
                        className="font-mono text-[0.72rem] uppercase tracking-[0.16em]"
                        style={{ color: "var(--rellax-sage)" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm leading-7" style={{ color: "var(--db-text-soft)" }}>
                        {objective}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* ── Complete button ── */}
            {!isCompleted && learningModule.generationStatus === "ready" ? (
              <div className="mt-10">
                <button
                  type="button"
                  onClick={() => void completeModule({ moduleId: learningModule._id })}
                  className="inline-flex items-center px-5 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white"
                  style={{ background: "var(--rellax-sage)" }}
                >
                  Mark Module Complete
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
