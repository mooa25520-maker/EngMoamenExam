import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  ShieldCheck,
  Play,
  AlertTriangle,
  HelpCircle,
  Award,
  BookOpen,
  UserCheck,
  Phone,
  FileText,
} from "lucide-react";
import { Exam, UserProfile } from "../../types/exam";

interface PreExamModalProps {
  exam: Exam;
  user: UserProfile;
  onCancel: () => void;
  onStartExam: (
    candidateName: string,
    candidateRollNo: string,
    grade?: string,
    parentPhone?: string,
    studentPhone?: string,
  ) => void;
}

export const PreExamModal: React.FC<PreExamModalProps> = ({
  exam,
  user,
  onCancel,
  onStartExam,
}) => {
  const [candidateName] = useState(user.name);
  const [candidateRollNo] = useState(user.rollNo);
  const [candidateGrade] = useState(user.grade || "الصف الأول الثانوي");
  const [candidateStudentPhone] = useState(user.studentPhone || "");
  const [candidateParentPhone] = useState(user.parentPhone || "");
  const [checksDone, setChecksDone] = useState(false);
  const [step1, setStep1] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep1(true), 250);
    const t2 = setTimeout(() => setChecksDone(true), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        className="card animate-in w-full max-w-lg relative"
        style={{
          maxHeight: "92vh",
          overflowY: "auto",
          borderRadius: "18px",
          border: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          padding: "1.5rem",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="btn btn-ghost"
          aria-label="إغلاق"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 34,
            height: 34,
            padding: 0,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: "1.25rem", paddingLeft: "2rem" }}>
          <span
            className="badge badge-blue mb-2.5"
            style={{
              padding: "0.35rem 0.75rem",
              fontSize: "0.78rem",
              fontWeight: 700,
              gap: 6,
            }}
          >
            <BookOpen size={13} /> تعليمات الاختبار
          </span>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              lineHeight: 1.35,
              color: "var(--text-primary)",
            }}
          >
            {exam.title}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.825rem",
              color: "var(--text-secondary)",
              marginTop: 6,
            }}
          >
            <UserCheck size={14} style={{ color: "var(--primary)" }} />
            <span>إعداد: {exam.author}</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span>{candidateGrade}</span>
          </div>
        </div>

        {/* Stats Summary Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.625rem",
            marginBottom: "1.25rem",
          }}
        >
          {/* Duration Card */}
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "12px",
              padding: "0.75rem 0.5rem",
              border: "1px solid var(--border-color)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                background: "var(--primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
              }}
            >
              <Clock size={16} />
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              مدة الاختبار
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "var(--text-primary)",
              }}
            >
              {exam.durationMinutes} دقيقة
            </div>
          </div>

          {/* Questions Count Card */}
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "12px",
              padding: "0.75rem 0.5rem",
              border: "1px solid var(--border-color)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                background: "rgba(139, 92, 246, 0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b5cf6",
              }}
            >
              <HelpCircle size={16} />
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              عدد الأسئلة
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "var(--text-primary)",
              }}
            >
              {exam.questions.length} أسئلة
            </div>
          </div>

          {/* Passing Percentage Card */}
          <div
            style={{
              background: "var(--bg-surface)",
              borderRadius: "12px",
              padding: "0.75rem 0.5rem",
              border: "1px solid var(--border-color)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                background: "var(--accent-green-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-green)",
              }}
            >
              <Award size={16} />
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              درجة النجاح
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "var(--accent-green)",
              }}
            >
              {exam.passingPercentage}%
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onStartExam(
              candidateName,
              candidateRollNo,
              candidateGrade,
              candidateParentPhone,
              candidateStudentPhone,
            );
          }}
        >
          {/* Student Info Card */}
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              borderRight: "4px solid var(--primary)",
              borderRadius: "12px",
              padding: "0.875rem 1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileText size={14} style={{ color: "var(--primary)" }} />
              بيانات الطالب المسجل:
            </div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              {candidateName}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "12px",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                marginTop: 4,
              }}
            >
              {candidateParentPhone && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Phone size={12} style={{ color: "var(--text-muted)" }} />
                  هاتف ولي الأمر:{" "}
                  <strong style={{ color: "var(--text-primary)" }}>
                    {candidateParentPhone}
                  </strong>
                </span>
              )}
            </div>
          </div>

          {/* Connection & Integrity Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck
                size={17}
                style={{
                  color: step1 ? "var(--accent-green)" : "var(--text-muted)",
                }}
              />
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                جاهزية الاتصال ونظام حظر الغش
              </span>
            </div>
            <span
              className={checksDone ? "badge badge-green" : "badge badge-gray"}
              style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
            >
              {checksDone ? "✓ جاهز للبدء" : "جاري الفحص..."}
            </span>
          </div>

          {/* Alert Notice Banner */}
          <div
            style={{
              background: "var(--accent-amber-bg)",
              border: "1px solid var(--accent-amber)",
              borderRadius: "12px",
              padding: "0.875rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.825rem",
              color: "var(--accent-amber)",
              lineHeight: 1.5,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.85rem",
              }}
            >
              <AlertTriangle size={15} style={{ flexShrink: 0 }} /> تنبيه مهم
              قبل البدء:
            </div>
            سيبدأ العداد التنازلي فور الضغط على الزر ولا يمكن إيقاف الاختبار
            مؤقتاً. يرجى التأكد من استقرار شبكة الإنترنت قبل البدء.
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              style={{ flex: 1, minHeight: "46px", borderRadius: "10px" }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!checksDone}
              style={{
                flex: 2,
                minHeight: "46px",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Play size={18} fill="currentColor" /> بدء الاختبار الآن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
