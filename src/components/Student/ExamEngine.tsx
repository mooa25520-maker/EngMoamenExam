import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Flag,
  ChevronRight,
  ChevronLeft,
  Send,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Exam, UserAnswer } from "../../types/exam";

interface ExamEngineProps {
  exam: Exam;
  candidateName: string;
  candidateRollNo: string;
  onSubmitExam: (answers: UserAnswer[], timeTakenSeconds: number) => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  exam,
  candidateName,
  candidateRollNo,
  onSubmitExam,
}) => {
  const [shuffledExam] = useState<Exam>(() => {
    // Clone and shuffle options so 'A' is not always the correct answer
    const e = JSON.parse(JSON.stringify(exam)) as Exam;
    e.questions.forEach((q) => {
      for (let i = q.options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
      }
    });
    return e;
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [secondsLeft, setSecondsLeft] = useState(
    shuffledExam.durationMinutes * 60,
  );
  const [showSubmit, setShowSubmit] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const [timeWarning, setTimeWarning] = useState(false);
  const startRef = useRef(Date.now());

  const q = shuffledExam.questions[currentIdx];
  const total = shuffledExam.questions.length;

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          handleFinalSubmit();
          return 0;
        }
        if (prev === 180) setTimeWarning(true);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // Keyboard navigation for desktop & auto scroll top on question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting input fields if present
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))
        return;
      if (e.key === "ArrowLeft") {
        setCurrentIdx((p) => Math.min(total - 1, p + 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIdx((p) => Math.max(0, p - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIdx, total]);

  const getAns = (qId: string): UserAnswer =>
    answers[qId] || {
      questionId: qId,
      selectedOptionIds: [],
      isFlagged: false,
    };
  const curAns = getAns(q.id);

  const handleSelect = (optId: string) => {
    const existing = getAns(q.id);
    let updated;
    if (q.type === "multiple") {
      updated = existing.selectedOptionIds.includes(optId)
        ? existing.selectedOptionIds.filter((id) => id !== optId)
        : [...existing.selectedOptionIds, optId];
    } else {
      updated = [optId];
    }
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { ...existing, selectedOptionIds: updated },
    }));
  };

  const handleFlag = () => {
    const existing = getAns(q.id);
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { ...existing, isFlagged: !existing.isFlagged },
    }));
  };

  const handleClear = () => {
    const existing = getAns(q.id);
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { ...existing, selectedOptionIds: [] },
    }));
  };

  const handleFinalSubmit = () => {
    const taken = Math.round((Date.now() - startRef.current) / 1000);
    const arr: UserAnswer[] = shuffledExam.questions.map((q) => getAns(q.id));
    onSubmitExam(arr, taken);
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const answeredCount = Object.values(answers).filter(
    (a) => a.selectedOptionIds.length > 0,
  ).length;
  const flaggedCount = Object.values(answers).filter((a) => a.isFlagged).length;
  const progress = Math.round((answeredCount / total) * 100);

  const letters = ["أ", "ب", "ج", "د", "هـ"];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-main)",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-color)",
          padding: "0.75rem 1.25rem",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Student info */}
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 800 }}>
              {shuffledExam.title}
            </div>
            <div
              className="hidden sm:block"
              style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}
            >
              {candidateName} — رقم: {candidateRollNo}
            </div>
          </div>

          {/* Progress */}
          <div
            style={{ flex: 1, maxWidth: 240, display: "none" }}
            className="hidden-mobile"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              <span>الإجابات</span>
              <span style={{ fontWeight: 700 }}>
                {answeredCount}/{total}
              </span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Timer + Submit */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--bg-main)",
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
              }}
            >
              <Clock
                size={15}
                color={
                  secondsLeft < 300
                    ? "#c81e1e"
                    : secondsLeft < 600
                      ? "#d97706"
                      : "var(--primary)"
                }
              />
              <span
                className={`timer-display ${secondsLeft < 300 ? "danger" : secondsLeft < 600 ? "warning" : ""}`}
                style={{ fontSize: "1.1rem" }}
              >
                {formatTime(secondsLeft)}
              </span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowSubmit(true)}
              style={{ gap: 6, padding: "7px 16px" }}
            >
              <Send size={14} /> تسليم
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className="exam-layout-grid"
        style={{
          flex: 1,
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          padding: "1.5rem 1.25rem",
          alignItems: "start",
        }}
      >
        {/* Question Area */}
        <div>
          {/* Q Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 8,
                  background: "var(--primary)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                }}
              >
                سؤال {currentIdx + 1} / {total}
              </span>
              {q.type === "multiple" && (
                <span className="badge badge-blue">اختر أكثر من إجابة</span>
              )}
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                ({q.points} درجة)
              </span>
            </div>
            <button
              onClick={handleFlag}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 8,
                border: `1px solid ${curAns.isFlagged ? "#d97706" : "var(--border-color)"}`,
                background: curAns.isFlagged ? "#fffbeb" : "transparent",
                color: curAns.isFlagged ? "#d97706" : "var(--text-muted)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              <Flag size={13} fill={curAns.isFlagged ? "#d97706" : "none"} />
              {curAns.isFlagged ? "مؤشر للمراجعة" : "مراجعة"}
            </button>
          </div>

          {/* Q Text */}
          <div
            className="card"
            style={{ padding: "1.25rem", marginBottom: "1rem" }}
          >
            <p style={{ fontSize: "1rem", fontWeight: 600, lineHeight: 1.7 }}>
              {q.text}
            </p>
            {q.codeSnippet && (
              <pre className="code-block" style={{ marginTop: "1rem" }}>
                <code>{q.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {q.type === "multiple"
                ? "اختر جميع الإجابات الصحيحة:"
                : "اختر الإجابة الصحيحة:"}
            </p>
            {q.options.map((opt, idx) => {
              const isSelected = curAns.selectedOptionIds.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  className={`option-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(opt.id)}
                >
                  <div
                    className={`option-letter ${isSelected ? "selected" : ""}`}
                    style={{
                      background: isSelected ? "var(--primary)" : undefined,
                      borderColor: isSelected ? "var(--primary)" : undefined,
                      color: isSelected ? "white" : undefined,
                    }}
                  >
                    {letters[idx] || idx + 1}
                  </div>
                  <span
                    style={{ fontSize: "0.9rem", fontWeight: 500, flex: 1 }}
                  >
                    {opt.text}
                  </span>
                </div>
              );
            })}

            {curAns.selectedOptionIds.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  border: "none",
                  background: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                <RotateCcw size={12} /> مسح الإجابة
              </button>
            )}
          </div>

          {/* Navigation (Desktop Only) */}
          <div
            className="hidden md:flex justify-between items-center"
            style={{
              paddingTop: "1.25rem",
              marginTop: "1.25rem",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <button
              className="btn btn-outline"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              style={{ gap: 6 }}
            >
              <ChevronRight size={16} /> السابق{" "}
              <kbd
                style={{
                  fontSize: "0.7rem",
                  padding: "1px 5px",
                  borderRadius: 4,
                  background: "var(--bg-main)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-muted)",
                }}
              >
                →
              </kbd>
            </button>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
              }}
            >
              السؤال {currentIdx + 1} من {total}
            </span>
            {currentIdx < total - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentIdx((p) => p + 1)}
                style={{ gap: 6 }}
              >
                التالي{" "}
                <kbd
                  style={{
                    fontSize: "0.7rem",
                    padding: "1px 5px",
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  ←
                </kbd>
                <ChevronLeft size={16} />
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={() => setShowSubmit(true)}
                style={{ gap: 6 }}
              >
                <Send size={15} /> مراجعة وتسليم
              </button>
            )}
          </div>
        </div>

        {/* Q Palette Sidebar (Desktop Only) */}
        <div
          className="hidden md:block"
          style={{ position: "sticky", top: "5rem" }}
        >
          <div className="card" style={{ padding: "1rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "var(--text-secondary)",
                marginBottom: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              خريطة الأسئلة{" "}
              <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>
                {answeredCount}/{total}
              </span>
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: "1rem",
              }}
            >
              {shuffledExam.questions.map((question, idx) => {
                const a = getAns(question.id);
                const isAnswered = a.selectedOptionIds.length > 0;
                const isFlagged = a.isFlagged;
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={question.id}
                    className={`q-palette-btn ${isFlagged ? "flagged" : isAnswered ? "answered" : ""} ${isCurrent ? "current" : ""}`}
                    onClick={() => setCurrentIdx(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "var(--accent-green)",
                  }}
                />
                <span>أجبت ({answeredCount})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: "#f59e0b",
                  }}
                />
                <span>للمراجعة ({flaggedCount})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    border: "2px solid var(--border-color)",
                  }}
                />
                <span>لم تُجب ({total - answeredCount})</span>
              </div>
            </div>

            {/* Submit from sidebar too */}
            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1rem", padding: "0.625rem" }}
              onClick={() => setShowSubmit(true)}
            >
              <Send size={13} /> تسليم النهائي
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar (< 768px) */}
      <nav className="mobile-bottom-nav md:hidden px-4 gap-2">
        <button
          className="btn btn-outline"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
          style={{ flex: 1, minHeight: 44 }}
        >
          <ChevronRight size={16} /> السابق
        </button>

        <button
          className="btn btn-outline"
          onClick={() => setShowMobilePalette(true)}
          style={{ flex: 1, minHeight: 44 }}
        >
          الأسئلة ({answeredCount}/{total})
        </button>

        {currentIdx < total - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setCurrentIdx((p) => p + 1)}
            style={{ flex: 1, minHeight: 44 }}
          >
            التالي <ChevronLeft size={16} />
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => setShowSubmit(true)}
            style={{ flex: 1, minHeight: 44 }}
          >
            تسليم
          </button>
        )}
      </nav>

      {/* Mobile Q Palette Bottom Sheet */}
      {showMobilePalette && (
        <div
          className="bottom-sheet-backdrop md:hidden"
          onClick={() => setShowMobilePalette(false)}
        >
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>
                خريطة الأسئلة
              </h3>
              <button
                className="btn btn-ghost"
                style={{ padding: "4px 8px", minHeight: "auto" }}
                onClick={() => setShowMobilePalette(false)}
              >
                إغلاق
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 8,
                maxHeight: "50vh",
                overflowY: "auto",
                marginBottom: "1rem",
                padding: 4,
              }}
            >
              {shuffledExam.questions.map((question, idx) => {
                const a = getAns(question.id);
                const isAnswered = a.selectedOptionIds.length > 0;
                const isFlagged = a.isFlagged;
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={question.id}
                    className={`q-palette-btn ${isFlagged ? "flagged" : isAnswered ? "answered" : ""} ${isCurrent ? "current" : ""}`}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setShowMobilePalette(false);
                    }}
                    style={{ width: "100%", height: 44 }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%", minHeight: 44 }}
              onClick={() => {
                setShowMobilePalette(false);
                setShowSubmit(true);
              }}
            >
              <Send size={15} /> تسليم الاختبار النهائي
            </button>
          </div>
        </div>
      )}

      {/* Time Warning */}
      {timeWarning && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            background: "#7f1d1d",
            border: "1px solid #dc2626",
            color: "#fecaca",
            padding: "0.875rem 1.125rem",
            borderRadius: 10,
            maxWidth: 320,
            zIndex: 30,
            display: "flex",
            gap: 10,
          }}
          className="animate-in"
        >
          <AlertTriangle size={18} color="#fca5a5" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: "0.8rem", marginBottom: 2 }}>
              تحذير: الوقت ينفد!
            </p>
            <p style={{ fontSize: "0.75rem" }}>
              أقل من 3 دقائق. راجع الأسئلة غير المُجاب عليها.
            </p>
            <button
              onClick={() => setTimeWarning(false)}
              style={{
                marginTop: 6,
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "#fca5a5",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textDecoration: "underline",
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmit && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="card animate-in"
            style={{ maxWidth: 420, width: "100%", padding: "1.5rem" }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                marginBottom: "0.875rem",
              }}
            >
              تأكيد تسليم الاختبار
            </h3>

            <div
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border-color)",
                borderRadius: 10,
                padding: "0.875rem",
                marginBottom: "1rem",
              }}
            >
              {[
                { label: "إجمالي الأسئلة", val: total, color: undefined },
                {
                  label: "أُجيب عليها",
                  val: answeredCount,
                  color: "var(--accent-green)",
                },
                {
                  label: "لم يُجب عليها",
                  val: total - answeredCount,
                  color: total - answeredCount > 0 ? "#d97706" : undefined,
                },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {r.label}
                  </span>
                  <span style={{ fontWeight: 800, color: r.color }}>
                    {r.val}
                  </span>
                </div>
              ))}
            </div>

            {total - answeredCount > 0 && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fcd34d",
                  borderRadius: 8,
                  padding: "0.75rem",
                  marginBottom: "1rem",
                  display: "flex",
                  gap: 8,
                }}
              >
                <AlertTriangle
                  size={16}
                  color="#d97706"
                  style={{ flexShrink: 0 }}
                />
                <p style={{ fontSize: "0.8rem", color: "#78350f" }}>
                  لديك {total - answeredCount} سؤال غير مُجاب. هل أنت متأكد من
                  التسليم؟
                </p>
              </div>
            )}

            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button
                className="btn btn-outline"
                onClick={() => setShowSubmit(false)}
              >
                العودة للأسئلة
              </button>
              <button className="btn btn-success" onClick={handleFinalSubmit}>
                تأكيد التسليم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
