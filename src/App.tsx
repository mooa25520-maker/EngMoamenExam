import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ExamCatalog } from "./components/Student/ExamCatalog";
import { PreExamModal } from "./components/Student/PreExamModal";
import { ExamEngine } from "./components/Student/ExamEngine";
import { ExamResult } from "./components/Student/ExamResult";
import { StudentHistory } from "./components/Student/StudentHistory";
import { StudentRegistration } from "./components/Student/StudentRegistration";
import { InstructorDashboard } from "./components/Instructor/InstructorDashboard";
import { SubmissionsTracker } from "./components/Instructor/SubmissionsTracker";
import { TelegramSettingsModal } from "./components/Instructor/TelegramSettingsModal";

import { Exam, ExamAttempt, UserAnswer, UserProfile } from "./types/exam";
import {
  getExams,
  saveExams,
  saveExam,
  deleteExam,
  resetExamsToDefault,
  getAttempts,
  saveAttempt,
  getUserProfile,
  saveUserProfile,
} from "./services/storage";

export function App() {
  const [currentRole, setCurrentRole] = useState<"student" | "instructor">(
    "student",
  );
  const [activeTab, setActiveTab] = useState<string>("catalog");
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
  const [showTelegramModal, setShowTelegramModal] = useState<boolean>(false);

  // Data state
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [user, setUser] = useState<UserProfile>(getUserProfile());

  // Exam taking state
  const [selectedExamForModal, setSelectedExamForModal] = useState<Exam | null>(
    null,
  );
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [candidateInfo, setCandidateInfo] = useState<{
    name: string;
    rollNo: string;
    grade: string;
    studentPhone: string;
    parentPhone: string;
  }>({
    name: user.name,
    rollNo: user.rollNo,
    grade: user.grade || "الصف الأول الثانوي",
    studentPhone: user.studentPhone || "",
    parentPhone: user.parentPhone || "",
  });

  const [completedResult, setCompletedResult] = useState<{
    exam: Exam;
    answers: UserAnswer[];
    timeTakenSeconds: number;
    candidateName: string;
    candidateRollNo: string;
    candidateGrade: string;
    candidateStudentPhone: string;
    candidateParentPhone: string;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    setExams(getExams());
    setAttempts(getAttempts());
    const u = getUserProfile();
    setUser(u);
    setCandidateInfo({
      name: u.name,
      rollNo: u.rollNo,
      grade: u.grade || "الصف الأول الثانوي",
      studentPhone: u.studentPhone || "",
      parentPhone: u.parentPhone || "",
    });
  }, []);

  // Sync theme attribute to HTML tag
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkTheme]);

  const handleToggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const handleUserUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUserProfile(updatedUser);
    setCandidateInfo({
      name: updatedUser.name,
      rollNo: updatedUser.rollNo,
      grade: updatedUser.grade || "الصف الأول الثانوي",
      studentPhone: updatedUser.studentPhone || "",
      parentPhone: updatedUser.parentPhone || "",
    });
  };

  const handleRegisterStudent = (registeredUser: UserProfile) => {
    handleUserUpdate(registeredUser);
    setActiveTab("catalog");
  };

  const handleResetData = () => {
    const defaultExams = resetExamsToDefault();
    setExams(defaultExams);
  };

  // Exam actions
  const handleSaveExam = (exam: Exam) => {
    saveExam(exam);
    setExams(getExams());
  };

  const handleDeleteExam = (id: string) => {
    deleteExam(id);
    setExams(getExams());
  };

  const handleToggleActive = (id: string) => {
    const updated = exams.map((e) =>
      e.id === id ? { ...e, isActive: !e.isActive } : e,
    );
    saveExams(updated);
    setExams(updated);
  };

  // Exam Execution Flow
  const handleStartExam = (
    candidateName: string,
    candidateRollNo: string,
    grade?: string,
    parentPhone?: string,
    studentPhone?: string,
  ) => {
    if (!selectedExamForModal) return;
    const finalGrade = grade || candidateInfo.grade || "الصف الأول الثانوي";
    const finalStudentPhone = studentPhone || candidateInfo.studentPhone || "";
    const finalParentPhone = parentPhone || candidateInfo.parentPhone || "";

    setCandidateInfo({
      name: candidateName,
      rollNo: candidateRollNo,
      grade: finalGrade,
      studentPhone: finalStudentPhone,
      parentPhone: finalParentPhone,
    });

    // Also update user profile with latest entered info
    handleUserUpdate({
      ...user,
      name: candidateName,
      rollNo: candidateRollNo,
      grade: finalGrade,
      studentPhone: finalStudentPhone,
      parentPhone: finalParentPhone,
      registered: true,
    });

    setActiveExam(selectedExamForModal);
    setSelectedExamForModal(null);
  };

  const handleSubmitExamEngine = (
    answers: UserAnswer[],
    timeTakenSeconds: number,
  ) => {
    if (!activeExam) return;
    setCompletedResult({
      exam: activeExam,
      answers,
      timeTakenSeconds,
      candidateName: candidateInfo.name,
      candidateRollNo: candidateInfo.rollNo,
      candidateGrade: candidateInfo.grade,
      candidateStudentPhone: candidateInfo.studentPhone,
      candidateParentPhone: candidateInfo.parentPhone,
    });
    setActiveExam(null);
  };

  const handleSaveAttemptRecord = (attempt: ExamAttempt) => {
    saveAttempt(attempt);
    setAttempts(getAttempts());
  };

  const handleRetakeExam = () => {
    if (completedResult) {
      const examToRetake = completedResult.exam;
      setCompletedResult(null);
      setSelectedExamForModal(examToRetake);
    }
  };

  // If student is currently taking an exam in live ExamEngine, render full-screen engine
  if (activeExam) {
    return (
      <ExamEngine
        exam={activeExam}
        candidateName={candidateInfo.name}
        candidateRollNo={candidateInfo.rollNo}
        onSubmitExam={handleSubmitExamEngine}
      />
    );
  }

  // Check if student needs registration (first time visitor or unregistered)
  const isStudentUnregistered =
    currentRole === "student" &&
    (!user.registered || !user.parentPhone || user.name === "Alex Morgan");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors">
      {/* App Header (Hidden on Registration/Login screen) */}
      {!isStudentUnregistered && (
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          user={user}
          onUserUpdate={handleUserUpdate}
          onResetData={handleResetData}
          isDarkTheme={isDarkTheme}
          onToggleTheme={handleToggleTheme}
          onOpenTelegramSettings={() => setShowTelegramModal(true)}
        />
      )}

      {/* Main App Container */}
      <main
        className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-6 md:pb-10 relative z-10"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        {/* If student is not registered, force registration screen first */}
        {isStudentUnregistered && !completedResult ? (
          <StudentRegistration
            initialUser={user}
            onRegister={handleRegisterStudent}
          />
        ) : (
          <>
            {/* Render Result Screen if exam completed */}
            {completedResult ? (
              <ExamResult
                exam={completedResult.exam}
                answers={completedResult.answers}
                timeTakenSeconds={completedResult.timeTakenSeconds}
                candidateName={completedResult.candidateName}
                candidateRollNo={completedResult.candidateRollNo}
                candidateGrade={completedResult.candidateGrade}
                candidateStudentPhone={completedResult.candidateStudentPhone}
                candidateParentPhone={completedResult.candidateParentPhone}
                onRetake={handleRetakeExam}
                onBackToCatalog={() => {
                  setCompletedResult(null);
                  setActiveTab("catalog");
                }}
                onSaveAttempt={handleSaveAttemptRecord}
              />
            ) : (
              <>
                {/* Student Portal Views */}
                {currentRole === "student" && (
                  <>
                    {activeTab === "catalog" && (
                      <ExamCatalog
                        exams={exams}
                        attempts={attempts}
                        onSelectExam={(exam) => {
                          if (!attempts.some((a) => a.examId === exam.id)) {
                            setSelectedExamForModal(exam);
                          }
                        }}
                      />
                    )}

                    {activeTab === "history" && (
                      <StudentHistory
                        attempts={attempts}
                        exams={exams}
                        onSelectExamForRetake={() => {}}
                        onGoToCatalog={() => setActiveTab("catalog")}
                      />
                    )}
                  </>
                )}

                {/* Instructor Portal Views */}
                {currentRole === "instructor" && (
                  <>
                    {activeTab === "dashboard" && (
                      <InstructorDashboard
                        exams={exams}
                        attempts={attempts}
                        onSaveExam={handleSaveExam}
                        onDeleteExam={handleDeleteExam}
                        onToggleActive={handleToggleActive}
                        onGoToSubmissions={() => setActiveTab("submissions")}
                      />
                    )}

                    {activeTab === "submissions" && (
                      <SubmissionsTracker attempts={attempts} />
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Pre-Exam Instructions Modal */}
      {selectedExamForModal && (
        <PreExamModal
          exam={selectedExamForModal}
          user={user}
          onCancel={() => setSelectedExamForModal(null)}
          onStartExam={handleStartExam}
        />
      )}

      {/* App Footer */}
      {!isStudentUnregistered && (
        <footer className="footer-layout mt-auto py-8  mb-16 md:mb-0 text-center text-sm border-t border-[var(--border-color)]">
          <div className="container max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div
              style={{
                color: "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.825rem",
              }}
            >
              <span style={{ color: "var(--primary) " }}>
                ExamPulse Platform
              </span>{" "}
              © 2026. م. مؤمن أحمد
            </div>
            <div
              className="flex flex-wrap items-center justify-center gap-4 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="hover:text-[var(--primary)] transition-colors cursor-pointer font-bold">
                شروط الاستخدام
              </span>
              <span className="hover:text-[var(--primary)] transition-colors cursor-pointer font-bold">
                النزاهة الأكاديمية
              </span>
              <span className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-colors cursor-pointer font-bold">
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--accent-green)",
                    display: "inline-block",
                  }}
                ></span>
                حالة النظام
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
