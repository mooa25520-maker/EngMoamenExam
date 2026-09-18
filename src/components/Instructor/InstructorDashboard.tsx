import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Copy,
  Power,
  BookOpen,
  HelpCircle,
  Users,
  Award,
  ArrowLeft,
} from "lucide-react";
import { Exam, ExamAttempt } from "../../types/exam";
import { ExamCreatorWizard } from "./ExamCreatorWizard";

interface InstructorDashboardProps {
  exams: Exam[];
  attempts: ExamAttempt[];
  onSaveExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
  onToggleActive: (id: string) => void;
  onGoToSubmissions: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  exams,
  attempts,
  onSaveExam,
  onDeleteExam,
  onToggleActive,
  onGoToSubmissions,
}) => {
  const [showWizard, setShowWizard] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const passRate =
    attempts.length > 0
      ? Math.round(
          (attempts.filter((a) => a.passed).length / attempts.length) * 100,
        )
      : 0;

  const handleDuplicate = (exam: Exam) => {
    onSaveExam({
      ...exam,
      id: `exam-${Date.now()}`,
      title: `${exam.title} (نسخة)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div
      className="animate-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {/* Header */}
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
            لوحة تحكم المدرس
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            م. مؤمن أحمد — أولى ثانوي برمجة
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingExam(null);
            setShowWizard(true);
          }}
        >
          <Plus size={15} /> اختبار جديد
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
        }}
      >
        {[
          {
            icon: <BookOpen size={20} color="var(--primary)" />,
            val: exams.length,
            label: "إجمالي الاختبارات",
            bg: "var(--primary-light)",
          },
          {
            icon: <HelpCircle size={20} color="#8b5cf6" />,
            val: exams.reduce((a, e) => a + e.questions.length, 0),
            label: "إجمالي الأسئلة",
            bg: "rgba(139, 92, 246, 0.14)",
          },
          {
            icon: <Users size={20} color="#0891b2" />,
            val: attempts.length,
            label: "تسليمات الطلاب",
            bg: "rgba(8, 145, 178, 0.14)",
            onClick: onGoToSubmissions,
          },
          {
            icon: <Award size={20} color="var(--accent-green)" />,
            val: `${passRate}%`,
            label: "نسبة النجاح",
            bg: "var(--accent-green-bg)",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="card"
            onClick={s.onClick}
            style={{
              padding: "1.125rem",
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              cursor: s.onClick ? "pointer" : "default",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900 }}>{s.val}</div>
              <div
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exams Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: 800, fontSize: "0.95rem" }}>الاختبارات</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table-base">
            <thead>
              <tr>
                <th>عنوان الاختبار</th>
                <th>المستوى</th>
                <th>المدة</th>
                <th>الأسئلة</th>
                <th>الحالة</th>
                <th style={{ textAlign: "left" }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{exam.title}</div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      للنجاح: {exam.passingPercentage}%
                    </div>
                  </td>
                  <td>
                    {exam.difficulty === "Beginner"
                      ? "مبتدئ"
                      : exam.difficulty === "Intermediate"
                        ? "متوسط"
                        : "متقدم"}
                  </td>
                  <td>{exam.durationMinutes} دقيقة</td>
                  <td style={{ fontWeight: 700 }}>{exam.questions.length}</td>
                  <td>
                    <button
                      onClick={() => onToggleActive(exam.id)}
                      className={`badge ${exam.isActive ? "badge-green" : "badge-gray"}`}
                      style={{
                        cursor: "pointer",
                        border: "none",
                        fontFamily: "inherit",
                      }}
                    >
                      <Power size={10} /> {exam.isActive ? "نشط" : "متوقف"}
                    </button>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "5px 8px" }}
                        title="تعديل"
                        onClick={() => {
                          setEditingExam(exam);
                          setShowWizard(true);
                        }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: "5px 8px" }}
                        title="نسخ"
                        onClick={() => handleDuplicate(exam)}
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        className="btn btn-ghost"
                        style={{
                          padding: "5px 8px",
                          color: "var(--accent-red)",
                        }}
                        title="حذف"
                        onClick={() => onDeleteExam(exam.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showWizard && (
        <ExamCreatorWizard
          initialExam={editingExam}
          onClose={() => {
            setShowWizard(false);
            setEditingExam(null);
          }}
          onSaveExam={(saved) => {
            onSaveExam(saved);
            setShowWizard(false);
            setEditingExam(null);
          }}
        />
      )}
    </div>
  );
};
