import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Award,
  Copy,
  Check,
  Send,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { Exam, ExamAttempt, UserAnswer } from "../../types/exam";
import { CertificateModal } from "./CertificateModal";
import {
  sendTelegramResult,
  formatParentMessage,
  formatStudentMessage,
  TelegramResultPayload,
} from "../../services/telegram";

interface ExamResultProps {
  exam: Exam;
  answers: UserAnswer[];
  timeTakenSeconds: number;
  candidateName: string;
  candidateRollNo: string;
  candidateGrade?: string;
  candidateStudentPhone?: string;
  candidateParentPhone?: string;
  onRetake: () => void;
  onBackToCatalog: () => void;
  onSaveAttempt: (attempt: ExamAttempt) => void;
}

export const ExamResult: React.FC<ExamResultProps> = ({
  exam,
  answers,
  timeTakenSeconds,
  candidateName,
  candidateRollNo,
  candidateGrade = "الصف الأول الثانوي",
  candidateStudentPhone = "",
  candidateParentPhone = "",
  onRetake,
  onBackToCatalog,
  onSaveAttempt,
}) => {
  const [showCert, setShowCert] = useState(false);
  const [savedAttempt, setSavedAttempt] = useState<ExamAttempt | null>(null);
  const [copiedParent, setCopiedParent] = useState(false);
  const [copiedStudent, setCopiedStudent] = useState(false);

  let earned = 0;
  const wrongQuestionsList: Array<{
    questionText: string;
    studentAnswerText: string;
    correctAnswerText: string;
    explanation: string;
  }> = [];

  exam.questions.forEach((q) => {
    const userAns = answers.find((a) => a.questionId === q.id) || {
      questionId: q.id,
      selectedOptionIds: [],
    };
    const isCorrect =
      [...userAns.selectedOptionIds].sort().join(",") ===
        [...q.correctAnswers].sort().join(",") &&
      userAns.selectedOptionIds.length > 0;

    if (isCorrect) {
      earned += q.points;
    } else {
      const studentOptTexts = q.options
        .filter((o) => userAns.selectedOptionIds.includes(o.id))
        .map((o) => o.text);
      const correctOptTexts = q.options
        .filter((o) => q.correctAnswers.includes(o.id))
        .map((o) => o.text);

      wrongQuestionsList.push({
        questionText: q.text,
        studentAnswerText: studentOptTexts.join("، ") || "لم يتم اختيار إجابة",
        correctAnswerText: correctOptTexts.join("، "),
        explanation: q.explanation || "لا يوجد شرح إضافي متوفر.",
      });
    }
  });

  const percentage = Math.round((earned / exam.totalPoints) * 100);
  const passed = percentage >= exam.passingPercentage;

  const payload: TelegramResultPayload = {
    studentName: candidateName,
    grade: candidateGrade,
    studentPhone: candidateStudentPhone,
    parentPhone: candidateParentPhone,
    studentRollNo: candidateRollNo,
    examTitle: exam.title,
    score: earned,
    maxScore: exam.totalPoints,
    percentage,
    passed,
    timeTakenSeconds,
    dateStr: new Date().toLocaleString("ar-EG"),
    wrongQuestions: wrongQuestionsList,
  };

  const parentMsgText = formatParentMessage(payload);
  const studentMsgText = formatStudentMessage(payload);

  useEffect(() => {
    if (passed)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    const attempt: ExamAttempt = {
      id: `att-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      category: exam.category,
      studentName: candidateName,
      studentRollNo: candidateRollNo,
      grade: candidateGrade,
      studentPhone: candidateStudentPhone,
      parentPhone: candidateParentPhone,
      startTime: new Date(Date.now() - timeTakenSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      timeTakenSeconds,
      score: earned,
      maxScore: exam.totalPoints,
      percentage,
      passed,
      answers,
      telegramStatus: "pending",
    };

    setSavedAttempt(attempt);
    onSaveAttempt(attempt);

    // إرسال الإشعار التلقائي للبوت
    sendTelegramResult(payload);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m} دقيقة ${r} ثانية`;
  };

  const copyToClipboard = (text: string, type: "parent" | "student") => {
    navigator.clipboard.writeText(text);
    if (type === "parent") {
      setCopiedParent(true);
      setTimeout(() => setCopiedParent(false), 2000);
    } else {
      setCopiedStudent(true);
      setTimeout(() => setCopiedStudent(false), 2000);
    }
  };

  return (
    <div
      className="animate-in"
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "1rem 0.5rem 3rem",
      }}
    >
      <div
        className="card"
        style={{
          padding: "2rem 1.25rem",
          borderRight: `5px solid ${passed ? "var(--accent-green)" : "var(--accent-red)"}`,
          textAlign: "center",
          borderRadius: 16,
        }}
      >
        {passed ? (
          <CheckCircle
            size={54}
            color="var(--accent-green)"
            style={{ margin: "0 auto 0.75rem" }}
          />
        ) : (
          <XCircle
            size={54}
            color="var(--accent-red)"
            style={{ margin: "0 auto 0.75rem" }}
          />
        )}

        <h1 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: 6 }}>
          {passed ? "مبروك! اجتزت الاختبار ✓" : "لم تجتز الاختبار في هذه المرة"}
        </h1>

        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            marginBottom: "1.5rem",
          }}
        >
          الطالب: <strong>{candidateName}</strong> | الصف:{" "}
          <strong>{candidateGrade}</strong>
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            background: "var(--bg-main)",
            padding: "1rem 0.75rem",
            borderRadius: 12,
            border: "1px solid var(--border-color)",
            maxWidth: 480,
            margin: "0 auto 1.5rem",
          }}
        >
          {[
            {
              label: "الدرجة",
              val: `${earned} / ${exam.totalPoints}`,
              color: undefined,
            },
            {
              label: "النسبة",
              val: `${percentage}%`,
              color: passed ? "var(--accent-green)" : "var(--accent-red)",
            },
            {
              label: "الوقت",
              val: formatTime(timeTakenSeconds),
              color: undefined,
            },
          ].map((item) => (
            <div key={item.label}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  marginBottom: 4,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 900,
                  color: item.color,
                }}
              >
                {item.val}
              </div>
            </div>
          ))}
        </div>

        {/* Passing percentage badge */}
        <div
          style={{
            display: "inline-block",
            padding: "0.35rem 0.9rem",
            borderRadius: 20,
            fontSize: "0.78rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            background: passed ? "rgba(5,122,85,0.1)" : "rgba(224,36,36,0.1)",
            color: passed ? "var(--accent-green)" : "var(--accent-red)",
            border: `1px solid ${passed ? "var(--accent-green)" : "var(--accent-red)"}`,
          }}
        >
          {passed
            ? `✅ نجحت! درجة النجاح ${exam.passingPercentage}% وأنت حصلت على ${percentage}%`
            : `❌ درجة النجاح ${exam.passingPercentage}% وأنت حصلت على ${percentage}%`}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {passed && savedAttempt && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCert(true)}
              style={{ gap: 6, fontSize: "0.85rem" }}
            >
              <Award size={15} /> عرض الشهادة
            </button>
          )}
          <button
            className="btn btn-outline"
            onClick={onBackToCatalog}
            style={{ gap: 6, fontSize: "0.85rem" }}
          >
            <ArrowRight size={14} /> العودة للاختبارات
          </button>
        </div>
      </div>


      {showCert && savedAttempt && (
        <CertificateModal
          attempt={savedAttempt}
          onClose={() => setShowCert(false)}
        />
      )}
    </div>
  );
};
