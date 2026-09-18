import React, { useState, useMemo } from "react";
import {
  Search,
  Clock,
  HelpCircle,
  ArrowLeft,
  BookOpen,
  Plus,
  Filter,
} from "lucide-react";
import { Exam, ExamAttempt, Difficulty } from "../../types/exam";

interface ExamCatalogProps {
  exams: Exam[];
  attempts?: ExamAttempt[];
  onSelectExam: (exam: Exam) => void;
}

export const ExamCatalog: React.FC<ExamCatalogProps> = ({
  exams,
  attempts = [],
  onSelectExam,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("الكل");

  const difficulties = ["الكل", "Beginner", "Intermediate", "Advanced"];
  const difficultyLabel: Record<string, string> = {
    Beginner: "عملي",
    Intermediate: "نظري",
    Advanced: "متقدم",
    الكل: "الكل",
  };

  const activeExams = useMemo(
    () =>
      exams.filter(
        (e) =>
          e.isActive &&
          (selectedDifficulty === "الكل" ||
            e.difficulty === selectedDifficulty) &&
          (e.title.includes(searchTerm) ||
            e.description.includes(searchTerm) ||
            searchTerm === ""),
      ),
    [exams, searchTerm, selectedDifficulty],
  );

  const getDiffBadge = (d: Difficulty) => {
    if (d === "Beginner")
      return <span className="badge badge-green">مبتدئ</span>;
    if (d === "Intermediate")
      return <span className="badge badge-amber">متوسط</span>;
    return <span className="badge badge-red">متقدم</span>;
  };

  return (
    <div
      className="animate-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {/* Page Title */}
      <div
        style={{
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, marginBottom: 4 }}>
          الاختبارات المتاحة
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          اختر اختباراً لبدء التقييم — م. مؤمن أحمد | أولى ثانوي برمجة
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            className="form-input"
            style={{ paddingRight: 38 }}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الاختبار..."
          />
        </div>

        {/* Difficulty Filter */}
        <div
          style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            paddingBottom: 4,
            maxWidth: "100%",
          }}
        >
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background:
                  selectedDifficulty === d
                    ? "var(--primary)"
                    : "var(--bg-card)",
                color:
                  selectedDifficulty === d ? "white" : "var(--text-secondary)",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {difficultyLabel[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Exam Grid */}
      {activeExams.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <BookOpen
            size={40}
            style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }}
          />
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>
            لا توجد اختبارات متاحة
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              maxWidth: 360,
              margin: "0 auto",
            }}
          >
            لم يتم نشر أي اختبارات بعد. يمكن للمدرس إضافة اختبارات من لوحة
            التحكم.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {activeExams.map((exam) => (
            <div
              key={exam.id}
              className="card"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {/* Top */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.625rem",
                  }}
                >
                  {getDiffBadge(exam.difficulty)}
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    {exam.author}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    marginBottom: 6,
                    lineHeight: 1.4,
                  }}
                >
                  {exam.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {exam.description}
                </p>
              </div>

              {/* Stats Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  textAlign: "center",
                  background: "var(--bg-main)",
                  borderRadius: 8,
                  padding: "0.625rem 0",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginBottom: 2,
                    }}
                  >
                    <Clock size={11} /> المدة
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800 }}>
                    {exam.durationMinutes} دقيقة
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginBottom: 2,
                    }}
                  >
                    <HelpCircle size={11} /> الأسئلة
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800 }}>
                    {exam.questions.length}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginBottom: 2,
                    }}
                  >
                    للنجاح
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      color: "var(--accent-green)",
                    }}
                  >
                    {exam.passingPercentage}%
                  </div>
                </div>
              </div>

              {/* CTA */}
              {attempts.some((a) => a.examId === exam.id) ? (
                <button
                  className="btn btn-outline"
                  disabled
                  style={{
                    width: "100%",
                    padding: "0.625rem",
                    opacity: 0.7,
                    cursor: "not-allowed",
                    borderColor: "var(--accent-green)",
                    color: "var(--accent-green)",
                  }}
                >
                  تم أداء الاختبار بنجاح ✓
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "0.625rem" }}
                  onClick={() => onSelectExam(exam)}
                >
                  بدء الاختبار <ArrowLeft size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
