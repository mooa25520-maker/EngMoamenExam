import React, { useState } from "react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
  Award,
} from "lucide-react";
import { Exam, ExamAttempt, UserAnswer } from "../../types/exam";
import { CertificateModal } from "./CertificateModal";
import { sendTelegramResult } from "../../services/telegram";

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

    // Send Telegram report with wrong questions list & explanation
    sendTelegramResult({
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
    });
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m} دقيقة ${r} ثانية`;
  };

  return (
    <div
      className="animate-in"
      style={{
        maxWidth: 680,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        paddingBottom: "3rem",
      }}
    >
      {/* Result Banner */}
      <div
        className="card"
        style={{
          padding: "2.5rem 2rem",
          borderRight: `5px solid ${passed ? "var(--accent-green)" : "var(--accent-red)"}`,
          textAlign: "center",
        }}
      >
        {passed ? (
          <CheckCircle
            size={60}
            color="var(--accent-green)"
            style={{ margin: "0 auto 1rem" }}
          />
        ) : (
          <XCircle
            size={60}
            color="var(--accent-red)"
            style={{ margin: "0 auto 1rem" }}
          />
        )}

        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: 8 }}>
          {passed ? "مبروك! اجتزت الاختبار ✓" : "لم تجتز الاختبار في هذه المرة"}
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginBottom: "1.75rem",
          }}
        >
          الطالب: <strong>{candidateName}</strong> | الصف:{" "}
          <strong>{candidateGrade}</strong>
        </p>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            background: "var(--bg-main)",
            padding: "1.25rem",
            borderRadius: 12,
            border: "1px solid var(--border-color)",
            maxWidth: 480,
            margin: "0 auto 2rem",
          }}
        >
          {[
            {
              label: "الدرجة",
              val: `${earned} / ${exam.totalPoints}`,
              color: undefined,
            },
            {
              label: "النسبة المئوية",
              val: `${percentage}%`,
              color: passed ? "var(--accent-green)" : "var(--accent-red)",
            },
            {
              label: "الوقت المستغرق",
              val: formatTime(timeTakenSeconds),
              color: undefined,
            },
          ].map((item) => (
            <div key={item.label}>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  color: item.color,
                }}
              >
                {item.val}
              </div>
            </div>
          ))}
        </div>

        {/* درجة النجاح */}
        <div
          style={{
            display: "inline-block",
            padding: "0.4rem 1rem",
            borderRadius: 20,
            fontSize: "0.8rem",
            fontWeight: 700,
            marginBottom: "1.75rem",
            background: passed ? "rgba(5,122,85,0.1)" : "rgba(224,36,36,0.1)",
            color: passed ? "var(--accent-green)" : "var(--accent-red)",
            border: `1px solid ${passed ? "var(--accent-green)" : "var(--accent-red)"}`,
          }}
        >
          {passed
            ? `✅ نجحت! درجة النجاح ${exam.passingPercentage}% وأنت حصلت على ${percentage}%`
            : `❌ درجة النجاح ${exam.passingPercentage}% وأنت حصلت على ${percentage}%`}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {passed && savedAttempt && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCert(true)}
              style={{ gap: 6 }}
            >
              <Award size={15} /> عرض الشهادة وطباعتها
            </button>
          )}
          <button
            className="btn btn-outline"
            onClick={onBackToCatalog}
            style={{ gap: 6 }}
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
