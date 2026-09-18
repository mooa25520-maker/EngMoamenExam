import React, { useState } from "react";
import {
  Moon,
  Sun,
  User,
  GraduationCap,
  RotateCcw,
  Check,
  ShieldAlert,
  BookOpen,
  BarChart2,
  Send,
  Phone,
} from "lucide-react";
import { UserProfile } from "../types/exam";

interface HeaderProps {
  currentRole: "student" | "instructor";
  onRoleChange: (role: "student" | "instructor") => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onResetData: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  onOpenTelegramSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  user,
  onUserUpdate,
  onResetData,
  isDarkTheme,
  onToggleTheme,
  onOpenTelegramSettings,
}) => {
  const [logoClicks, setLogoClicks] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editRollNo, setEditRollNo] = useState(user.rollNo);
  const [editGrade, setEditGrade] = useState(
    user.grade || "الصف الأول الثانوي",
  );
  const [editParentPhone, setEditParentPhone] = useState(
    user.parentPhone || "",
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUserUpdate({
      ...user,
      name: editName.trim() || user.name,
      rollNo: editRollNo.trim() || user.rollNo,
      grade: editGrade,
      parentPhone: editParentPhone.trim(),
      registered: true,
    });
    setShowProfileModal(false);
  };

  return (
    <>
      <header
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-color)",
        }}
        className="sticky top-0 z-30 w-full"
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.25rem",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Logo + Brand */}
          <div
            onClick={() => {
              if (currentRole === "student") {
                setLogoClicks((prev) => {
                  const num = prev + 1;
                  if (num >= 5) {
                    onRoleChange("instructor");
                    onTabChange("dashboard");
                    return 0;
                  }
                  return num;
                });
              } else {
                onTabChange("dashboard");
              }
              if (currentRole === "student" && logoClicks < 4) {
                onTabChange("catalog");
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <GraduationCap size={20} color="white" />
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                }}
              >
                منصة الاختبارات
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  lineHeight: 1,
                }}
              >
                م. مؤمن أحمد — أولى ثانوي
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Theme */}
            <button
              onClick={onToggleTheme}
              title={isDarkTheme ? "الوضع الفاتح" : "الوضع الداكن"}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: "var(--bg-main)",
                cursor: "pointer",
                color: "var(--text-primary)",
                transition: "all 0.15s ease",
              }}
            >
              {isDarkTheme ? (
                <Sun size={16} color="#fbbf24" />
              ) : (
                <Moon size={16} color="var(--primary)" />
              )}
            </button>

            {/* Reset */}
            <button
              onClick={() => setShowResetConfirm(true)}
              title="إعادة ضبط البيانات"
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                border: "1px solid var(--border-color)",
                background: "var(--bg-main)",
                cursor: "pointer",
                color: "var(--text-muted)",
                transition: "all 0.15s ease",
              }}
            >
              <RotateCcw size={16} />
            </button>

            {/* Profile */}
            <button
              onClick={() => {
                setEditName(user.name);
                setEditRollNo(user.rollNo);
                setEditGrade(user.grade || "الصف الأول الثانوي");
                setEditParentPhone(user.parentPhone || "");
                setShowProfileModal(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--bg-card-hover)",
                border: "1px solid var(--border-color)",
                borderRadius: 8,
                padding: "4px 8px",
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              <div className="hidden sm:block" style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--text-muted)",
                    lineHeight: 1,
                  }}
                >
                  {user.grade || "أولى ثانوي"}
                </div>
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0)}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="card animate-in"
            style={{ maxWidth: 460, width: "100%", padding: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={20} color="#1a56db" />
              </div>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>
                  بيانات الطالب المسجلة 🔒
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  تظهر هذه البيانات على النتيجة وتُرسل لمعلمك بطلب ولي الأمر
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              <div
                style={{
                  background: "rgba(37, 99, 235, 0.08)",
                  border: "1px solid rgba(37, 99, 235, 0.2)",
                  padding: "0.6rem 0.85rem",
                  borderRadius: 10,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#2563eb",
                  lineHeight: 1.5,
                }}
              >
                🔒 البيانات مسجلة وموثقة بنجاح. غير مسموح بتعديل بيانات الطالب
                بعد التسجيل لضمان دقة شهادات ورسائل التليجرام.
              </div>

              <div>
                <label className="form-label">الاسم الكامل</label>
                <input
                  className="form-input"
                  type="text"
                  value={user.name}
                  readOnly
                  style={{
                    background: "var(--bg-main)",
                    cursor: "not-allowed",
                    opacity: 0.85,
                  }}
                />
              </div>

              <div>
                <label className="form-label">الصف الدراسي</label>
                <input
                  className="form-input"
                  type="text"
                  value={user.grade || "الصف الأول الثانوي"}
                  readOnly
                  style={{
                    background: "var(--bg-main)",
                    cursor: "not-allowed",
                    opacity: 0.85,
                  }}
                />
              </div>

              <div>
                <label className="form-label">رقم ولي الأمر</label>
                <input
                  className="form-input"
                  type="text"
                  value={user.parentPhone || "غير مسجل"}
                  readOnly
                  style={{
                    direction: "ltr",
                    textAlign: "right",
                    background: "var(--bg-main)",
                    cursor: "not-allowed",
                    opacity: 0.85,
                  }}
                />
              </div>

              <div>
                <label className="form-label">رقم الجلوس / الكود</label>
                <input
                  className="form-input"
                  type="text"
                  value={user.rollNo}
                  readOnly
                  style={{
                    background: "var(--bg-main)",
                    cursor: "not-allowed",
                    opacity: 0.85,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowProfileModal(false)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm */}
      {showResetConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="card animate-in"
            style={{ maxWidth: 400, width: "100%", padding: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: "0.875rem",
              }}
            >
              <ShieldAlert size={22} color="#d97706" />
              <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>
                إعادة ضبط الاختبارات؟
              </h3>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                marginBottom: "1.25rem",
              }}
            >
              سيتم استعادة الاختبارات الافتراضية. سجل النتائج لن يُحذف.
            </p>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                className="btn btn-outline"
                onClick={() => setShowResetConfirm(false)}
              >
                إلغاء
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
              >
                <RotateCcw size={15} /> تأكيد الإعادة
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="mobile-bottom-nav md:hidden">
        {currentRole === "student" ? (
          <>
            <button
              onClick={() => onTabChange("catalog")}
              className={`mobile-nav-item ${activeTab === "catalog" ? "active" : ""}`}
            >
              <BookOpen size={20} />
              <span>الاختبارات</span>
            </button>
            <button
              onClick={() => onTabChange("history")}
              className={`mobile-nav-item ${activeTab === "history" ? "active" : ""}`}
            >
              <BarChart2 size={20} />
              <span>نتائجي</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onTabChange("dashboard")}
              className={`mobile-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            >
              <BookOpen size={20} />
              <span>إدارة الامتحانات</span>
            </button>
            <button
              onClick={() => onTabChange("submissions")}
              className={`mobile-nav-item ${activeTab === "submissions" ? "active" : ""}`}
            >
              <BarChart2 size={20} />
              <span>نتائج الطلاب</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
};
