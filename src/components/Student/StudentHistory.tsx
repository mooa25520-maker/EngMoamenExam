import React, { useState } from "react";
import { Award, Clock, Calendar, RotateCcw, ArrowLeft } from "lucide-react";
import { ExamAttempt, Exam } from "../../types/exam";
import { CertificateModal } from "./CertificateModal";

interface StudentHistoryProps {
  attempts: ExamAttempt[];
  exams: Exam[];
  onSelectExamForRetake: (exam: Exam) => void;
  onGoToCatalog: () => void;
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({
  attempts,
  exams,
  onSelectExamForRetake,
  onGoToCatalog,
}) => {
  const [certAttempt, setCertAttempt] = useState<ExamAttempt | null>(null);

  const formatTime = (s: number) => `${Math.floor(s / 60)}د ${s % 60}ث`;
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ar-EG", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="animate-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "1rem",
        }}
      >
        <div>
          <h1
            style={{ fontSize: "1.375rem", fontWeight: 800, marginBottom: 4 }}
          >
            نتائجي
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            سجل اختباراتك وشهاداتك
          </p>
        </div>
        <button className="btn btn-primary" onClick={onGoToCatalog}>
          استعرض الاختبارات <ArrowLeft size={14} />
        </button>
      </div>

      {attempts.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <Award
            size={40}
            style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }}
          />
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
            لا توجد نتائج بعد
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              maxWidth: 340,
              margin: "0 auto 1.25rem",
            }}
          >
            ابدأ اختبارك الأول من صفحة الاختبارات لتظهر نتيجتك هنا.
          </p>
          <button className="btn btn-primary" onClick={onGoToCatalog}>
            الذهاب للاختبارات
          </button>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {attempts.map((att) => {
            const exam = exams.find((e) => e.id === att.examId);
            return (
              <div
                key={att.id}
                className="card"
                style={{
                  padding: "1.125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Status Indicator */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: att.passed
                      ? "var(--accent-green-bg)"
                      : "var(--accent-red-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {att.passed ? (
                    <Award size={22} color="var(--accent-green)" />
                  ) : (
                    <span
                      style={{ fontSize: "1.2rem", color: "var(--accent-red)" }}
                    >
                      ✗
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      className={`badge ${att.passed ? "badge-green" : "badge-red"}`}
                    >
                      {att.passed ? "ناجح" : "راسب"}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Calendar size={11} /> {formatDate(att.endTime)}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      marginBottom: 2,
                    }}
                  >
                    {att.examTitle}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <span>الطالب: {att.studentName}</span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 3 }}
                    >
                      <Clock size={11} /> {formatTime(att.timeTakenSeconds)}
                    </span>
                  </p>
                </div>

                {/* Score */}
                <div
                  style={{
                    textAlign: "center",
                    padding: "0.5rem 1.25rem",
                    borderRadius: 10,
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginBottom: 2,
                    }}
                  >
                    النتيجة
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 900,
                      color: att.passed
                        ? "var(--accent-green)"
                        : "var(--accent-red)",
                      lineHeight: 1,
                    }}
                  >
                    {att.percentage}%
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    {att.score}/{att.maxScore}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  {att.passed && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setCertAttempt(att)}
                      style={{ gap: 5 }}
                    >
                      <Award size={14} /> الشهادة
                    </button>
                  )}
                  <span
                    className="badge badge-gray"
                    style={{ padding: "6px 12px" }}
                  >
                    تم أداء الاختبار
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {certAttempt && (
        <CertificateModal
          attempt={certAttempt}
          onClose={() => setCertAttempt(null)}
        />
      )}
    </div>
  );
};
