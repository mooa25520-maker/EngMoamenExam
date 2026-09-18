import React, { useState } from "react";
import {
  GraduationCap,
  User,
  Phone,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Send,
  Award,
} from "lucide-react";
import { UserProfile, GradeType } from "../../types/exam";

interface StudentRegistrationProps {
  initialUser: UserProfile;
  onRegister: (registeredUser: UserProfile) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({
  initialUser,
  onRegister,
  onCancel,
  isModal = false,
}) => {
  const [name, setName] = useState(
    initialUser.name !== "Alex Morgan" ? initialUser.name : "",
  );
  const [grade, setGrade] = useState<GradeType | string>(
    initialUser.grade || "الصف الأول الثانوي",
  );
  const [studentPhone, setStudentPhone] = useState(
    initialUser.studentPhone || "",
  );
  const [parentPhone, setParentPhone] = useState(initialUser.parentPhone || "");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("الرجاء إدخال اسم الطالب الكامل");
      return;
    }
    if (!studentPhone.trim()) {
      setErrorMsg("الرجاء إدخال رقم هاتف الطالب للتواصل وإرسال الشرح");
      return;
    }
    if (!parentPhone.trim()) {
      setErrorMsg("الرجاء إدخال رقم ولي الأمر لإرسال النتيجة");
      return;
    }
    if (studentPhone.trim().length < 8 || parentPhone.trim().length < 8) {
      setErrorMsg("الرجاء إدخال أرقام هواتف صحيحة (8 أرقام على الأقل)");
      return;
    }

    const updatedUser: UserProfile = {
      ...initialUser,
      name: name.trim(),
      grade: grade,
      studentPhone: studentPhone.trim(),
      parentPhone: parentPhone.trim(),
      rollNo: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      registered: true,
      role: "student",
    };

    onRegister(updatedUser);
  };

  const containerContent = (
    <div
      className="card animate-in"
      style={{
        maxWidth: 520,
        width: "100%",
        padding: "2.5rem 2rem",
        margin: "0 auto",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        background: "var(--bg-card)",
      }}
    >
      {/* Header Banner */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 22,
            background: "linear-gradient(135deg, var(--primary), #2563eb)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
          }}
        >
          <GraduationCap size={38} color="white" />
        </div>
        <h1
          style={{
            fontSize: "1.65rem",
            fontWeight: 900,
            color: "var(--text-primary)",
            marginBottom: "0.4rem",
            letterSpacing: "-0.5px",
          }}
        >
          منصة الامتحانات الإلكترونية
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            fontWeight: 600,
          }}
        >
          إعداد المدرس:{" "}
          <span style={{ color: "var(--primary)" }}>م. مؤمن أحمد</span>
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            background: "rgba(224, 36, 36, 0.1)",
            border: "1px solid var(--accent-red)",
            color: "var(--accent-red)",
            padding: "0.85rem 1rem",
            borderRadius: 12,
            fontSize: "0.875rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          ⚠️ {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}
      >
        {/* Student Name */}
        <div>
          <label
            className="form-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: "0.5rem",
              fontWeight: 700,
            }}
          >
            <User size={16} color="var(--primary)" />
            اسم الطالب الثلاثي *
          </label>
          <input
            type="text"
            className="form-input"
            required
            placeholder="أدخل اسمك الثلاثي باللغة العربية"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMsg("");
            }}
            style={{
              fontSize: "0.95rem",
              padding: "0.85rem 1rem",
              borderRadius: 12,
            }}
          />
        </div>

        {/* Grade Selection */}
        <div>
          <label
            className="form-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: "0.5rem",
              fontWeight: 700,
            }}
          >
            <BookOpen size={16} color="var(--primary)" />
            الصف الدراسي *
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              {
                id: "الصف الأول الثانوي",
                title: "الصف الأول الثانوي",
                desc: "أولى ثانوي",
              },
              {
                id: "الصف الثاني الثانوي",
                title: "الصف الثاني الثانوي",
                desc: "تانية ثانوي",
              },
            ].map((item) => {
              const isSelected = grade === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setGrade(item.id)}
                  style={{
                    border: `2px solid ${isSelected ? "var(--primary)" : "var(--border-color)"}`,
                    background: isSelected
                      ? "rgba(37, 99, 235, 0.08)"
                      : "var(--bg-surface)",
                    borderRadius: 14,
                    padding: "0.875rem 0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {isSelected && (
                    <CheckCircle2
                      size={18}
                      color="var(--primary)"
                      style={{ position: "absolute", top: 8, left: 8 }}
                    />
                  )}
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: isSelected
                        ? "var(--primary)"
                        : "var(--text-primary)",
                    }}
                  >
                    {item.title}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Phone */}
        <div>
          <label
            className="form-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: "0.5rem",
              fontWeight: 700,
            }}
          >
            <Phone size={16} color="var(--primary)" />
            رقم هاتف الطالب (لإرسال توضيح وشرح الأخطاء) *
          </label>
          <input
            type="tel"
            className="form-input"
            required
            placeholder="010XXXXXXXX"
            value={studentPhone}
            onChange={(e) => {
              setStudentPhone(e.target.value);
              setErrorMsg("");
            }}
            style={{
              fontSize: "1rem",
              padding: "0.85rem 1rem",
              borderRadius: 12,
              direction: "ltr",
              textAlign: "right",
            }}
          />
        </div>

        {/* Parent Phone */}
        <div>
          <label
            className="form-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: "0.5rem",
              fontWeight: 700,
            }}
          >
            <Phone size={16} color="var(--primary)" />
            رقم هاتف ولي الأمر (لإرسال النتيجة والدرجة) *
          </label>
          <input
            type="tel"
            className="form-input"
            required
            placeholder="010XXXXXXXX"
            value={parentPhone}
            onChange={(e) => {
              setParentPhone(e.target.value);
              setErrorMsg("");
            }}
            style={{
              fontSize: "1rem",
              padding: "0.85rem 1rem",
              borderRadius: 12,
              direction: "ltr",
              textAlign: "right",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: 6,
              display: "block",
              lineHeight: 1.4,
            }}
          >
            📲 يتم إرسال النتيجة لولي الأمر والشرح التفصيلي للأخطاء للطالب
            تلقائياً.
          </span>
        </div>

        {/* Buttons */}
        <div style={{ marginTop: "0.75rem", display: "flex", gap: 10 }}>
          {isModal && onCancel && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              style={{ flex: 1, padding: "0.875rem", borderRadius: 12 }}
            >
              إلغاء
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              flex: 2,
              padding: "0.875rem",
              fontSize: "1.05rem",
              fontWeight: 800,
              gap: 8,
              borderRadius: 12,
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.3)",
            }}
          >
            دخول ممر الامتحانات <ArrowLeft size={18} />
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          overflowY: "auto",
        }}
      >
        {containerContent}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "82vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      {containerContent}
    </div>
  );
};
