import React, { useState } from "react";
import { X, Plus, Trash2, Check, Save, Code } from "lucide-react";
import {
  Exam,
  Question,
  Category,
  Difficulty,
  QuestionType,
} from "../../types/exam";

interface ExamCreatorWizardProps {
  initialExam?: Exam | null;
  onClose: () => void;
  onSaveExam: (exam: Exam) => void;
}

export const ExamCreatorWizard: React.FC<ExamCreatorWizardProps> = ({
  initialExam,
  onClose,
  onSaveExam,
}) => {
  const [title, setTitle] = useState(initialExam?.title || "");
  const [description, setDescription] = useState(
    initialExam?.description || "",
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialExam?.difficulty || "Beginner",
  );
  const [durationMinutes, setDurationMinutes] = useState(
    initialExam?.durationMinutes || 20,
  );
  const [passingPercentage, setPassingPercentage] = useState(
    initialExam?.passingPercentage || 50,
  );
  const [questions, setQuestions] = useState<Question[]>(
    initialExam?.questions || [createBlankQ(1)],
  );

  function createBlankQ(n: number): Question {
    return {
      id: `q-${Date.now()}-${n}`,
      type: "single",
      text: "",
      options: [
        { id: `opt-${Date.now()}-1`, text: "" },
        { id: `opt-${Date.now()}-2`, text: "" },
        { id: `opt-${Date.now()}-3`, text: "" },
        { id: `opt-${Date.now()}-4`, text: "" },
      ],
      correctAnswers: [],
      points: 5,
      explanation: "",
    };
  }

  const handleAddQ = () =>
    setQuestions((prev) => [...prev, createBlankQ(prev.length + 1)]);
  const handleRemoveQ = (idx: number) =>
    setQuestions((prev) => prev.filter((_, i) => i !== idx));

  const handleQChange = (idx: number, patch: Partial<Question>) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    );

  const handleOptText = (qIdx: number, optIdx: number, text: string) => {
    const q = questions[qIdx];
    const updatedOpts = q.options.map((o, i) =>
      i === optIdx ? { ...o, text } : o,
    );
    handleQChange(qIdx, { options: updatedOpts });
  };

  const handleToggleCorrect = (qIdx: number, optId: string) => {
    const q = questions[qIdx];
    if (q.type === "multiple") {
      const current = q.correctAnswers;
      handleQChange(qIdx, {
        correctAnswers: current.includes(optId)
          ? current.filter((id) => id !== optId)
          : [...current, optId],
      });
    } else {
      handleQChange(qIdx, { correctAnswers: [optId] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPoints = questions.reduce((a, q) => a + q.points, 0);
    const exam: Exam = {
      id: initialExam?.id || `exam-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "اختبار برمجة",
      category: "Web Development",
      difficulty,
      durationMinutes: Number(durationMinutes),
      passingPercentage: Number(passingPercentage),
      totalPoints,
      questions,
      createdAt: initialExam?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: initialExam?.isActive ?? true,
      author: "م. مؤمن أحمد",
    };
    onSaveExam(exam);
  };

  const letters = ["أ", "ب", "ج", "د", "هـ"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div
        className="card animate-in"
        style={{
          maxWidth: 800,
          width: "100%",
          margin: "1rem auto",
          padding: "1.75rem",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            borderBottom: "1px solid var(--border-color)",
            paddingBottom: "1rem",
          }}
        >
          <h2 style={{ fontWeight: 900, fontSize: "1.1rem" }}>
            {initialExam ? "تعديل الاختبار" : "إنشاء اختبار جديد"}
          </h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Exam Metadata */}
          <div
            style={{
              background: "var(--bg-main)",
              border: "1px solid var(--border-color)",
              borderRadius: 10,
              padding: "1.125rem",
              marginBottom: "1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "var(--primary)",
                textTransform: "uppercase",
                marginBottom: "0.875rem",
              }}
            >
              بيانات الاختبار
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.875rem",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">عنوان الاختبار *</label>
                <input
                  className="form-input"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: اختبار وحدة البرمجة — أولى ثانوي"
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">وصف مختصر</label>
                <textarea
                  className="form-input"
                  style={{ resize: "vertical", minHeight: 60 }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="موضوع الاختبار ونطاقه..."
                />
              </div>
              <div>
                <label className="form-label">المستوى</label>
                <select
                  className="form-input"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                  <option value="Beginner">مبتدئ</option>
                  <option value="Intermediate">متوسط</option>
                  <option value="Advanced">متقدم</option>
                </select>
              </div>
              <div>
                <label className="form-label">درجة النجاح (%)</label>
                <input
                  className="form-input"
                  type="number"
                  min={10}
                  max={100}
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="form-label">مدة الاختبار (بالدقائق)</label>
                <input
                  className="form-input"
                  type="number"
                  min={1}
                  max={180}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  textTransform: "uppercase",
                }}
              >
                الأسئلة ({questions.length})
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddQ}
                style={{ gap: 5, padding: "5px 12px" }}
              >
                <Plus size={14} /> إضافة سؤال
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 10,
                    padding: "1.125rem",
                  }}
                >
                  {/* Q Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.875rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        color: "var(--primary)",
                        fontSize: "0.85rem",
                      }}
                    >
                      سؤال #{qIdx + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{
                          color: "var(--accent-red)",
                          padding: "3px 8px",
                          gap: 4,
                          fontSize: "0.8rem",
                        }}
                        onClick={() => handleRemoveQ(qIdx)}
                      >
                        <Trash2 size={13} /> حذف
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: "0.75rem",
                      marginBottom: "0.875rem",
                      alignItems: "end",
                    }}
                  >
                    <div>
                      <label className="form-label">نص السؤال *</label>
                      <input
                        className="form-input"
                        required
                        value={q.text}
                        onChange={(e) =>
                          handleQChange(qIdx, { text: e.target.value })
                        }
                        placeholder="اكتب السؤال هنا..."
                      />
                    </div>
                    <div>
                      <label className="form-label">النوع</label>
                      <select
                        className="form-input"
                        value={q.type}
                        onChange={(e) =>
                          handleQChange(qIdx, {
                            type: e.target.value as QuestionType,
                            correctAnswers: [],
                          })
                        }
                        style={{ minWidth: 140 }}
                      >
                        <option value="single">اختيار واحد</option>
                        <option value="multiple">اختيار متعدد</option>
                        <option value="true_false">صح / خطأ</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">الدرجة</label>
                      <input
                        className="form-input"
                        type="number"
                        min={1}
                        value={q.points}
                        onChange={(e) =>
                          handleQChange(qIdx, {
                            points: Number(e.target.value),
                          })
                        }
                        style={{ width: 80 }}
                      />
                    </div>
                  </div>

                  {/* Code Snippet */}
                  <div style={{ marginBottom: "0.875rem" }}>
                    <label
                      className="form-label"
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Code size={12} /> كود برمجي (اختياري)
                    </label>
                    <textarea
                      value={q.codeSnippet || ""}
                      onChange={(e) =>
                        handleQChange(qIdx, { codeSnippet: e.target.value })
                      }
                      placeholder="ضع كود برمجي هنا إن وجد..."
                      style={{
                        width: "100%",
                        minHeight: 60,
                        padding: "0.625rem",
                        fontFamily: "monospace",
                        fontSize: "0.8rem",
                        background: "#0f172a",
                        color: "#94a3b8",
                        border: "1px solid #1e293b",
                        borderRadius: 8,
                        resize: "vertical",
                        direction: "ltr",
                        textAlign: "left",
                      }}
                    />
                  </div>

                  {/* Options */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label className="form-label">
                      الاختيارات (اضغط ✓ لتحديد الإجابة الصحيحة)
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = q.correctAnswers.includes(opt.id);
                        return (
                          <div
                            key={opt.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleToggleCorrect(qIdx, opt.id)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                border: `2px solid ${isCorrect ? "var(--accent-green)" : "var(--border-color)"}`,
                                background: isCorrect
                                  ? "var(--accent-green)"
                                  : "transparent",
                                color: isCorrect
                                  ? "white"
                                  : "var(--text-muted)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                fontWeight: 800,
                                fontFamily: "inherit",
                              }}
                            >
                              {isCorrect ? (
                                <Check size={15} />
                              ) : (
                                letters[optIdx]
                              )}
                            </button>
                            <input
                              className="form-input"
                              value={opt.text}
                              onChange={(e) =>
                                handleOptText(qIdx, optIdx, e.target.value)
                              }
                              placeholder={`الاختيار ${letters[optIdx]}`}
                              required
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="form-label">
                      شرح الإجابة (يظهر بعد الاختبار)
                    </label>
                    <input
                      className="form-input"
                      value={q.explanation}
                      onChange={(e) =>
                        handleQChange(qIdx, { explanation: e.target.value })
                      }
                      placeholder="اشرح سبب الإجابة الصحيحة..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              borderTop: "1px solid var(--border-color)",
              paddingTop: "1rem",
            }}
          >
            <button type="button" className="btn btn-outline" onClick={onClose}>
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-success"
              style={{ gap: 6 }}
            >
              <Save size={15} /> حفظ ونشر الاختبار
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
