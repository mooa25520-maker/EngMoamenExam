import React, { useState } from "react";
import { Search, Users, Eye } from "lucide-react";
import { ExamAttempt } from "../../types/exam";

interface SubmissionsTrackerProps {
  attempts: ExamAttempt[];
}

export const SubmissionsTracker: React.FC<SubmissionsTrackerProps> = ({
  attempts,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");
  const [detail, setDetail] = useState<ExamAttempt | null>(null);

  const filtered = attempts.filter((a) => {
    const matchSearch =
      a.studentName.includes(search) ||
      a.studentRollNo.includes(search) ||
      a.examTitle.includes(search);
    const matchFilter =
      filter === "all" ||
      (filter === "passed" && a.passed) ||
      (filter === "failed" && !a.passed);
    return matchSearch && matchFilter;
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ar-EG", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatTime = (s: number) => `${Math.floor(s / 60)}د ${s % 60}ث`;

  return (
    <div
      className="animate-in"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <div
        style={{
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.375rem", fontWeight: 800, marginBottom: 4 }}>
          نتائج الطلاب
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          مراجعة تسليمات الاختبارات
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الرقم..."
          />
        </div>
        {[
          { k: "all", l: `الكل (${attempts.length})` },
          {
            k: "passed",
            l: `ناجح (${attempts.filter((a) => a.passed).length})`,
          },
          {
            k: "failed",
            l: `راسب (${attempts.filter((a) => !a.passed).length})`,
          },
        ].map((f) => (
          <button
            key={f.k}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid var(--border-color)",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              background: filter === f.k ? "var(--primary)" : "var(--bg-card)",
              color: filter === f.k ? "white" : "var(--text-secondary)",
              transition: "all 0.15s",
            }}
            onClick={() => setFilter(f.k as any)}
          >
            {f.l}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
          <Users
            size={40}
            style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }}
          />
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>لا توجد تسليمات</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            سيظهر سجل الطلاب هنا بعد تقديم الاختبارات.
          </p>
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>الطالب</th>
                  <th>الاختبار</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                  <th>الدرجة</th>
                  <th>النتيجة</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((att) => (
                  <tr key={att.id}>
                    <td data-label="الطالب">
                      <div style={{ fontWeight: 700 }}>{att.studentName}</div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <span>
                          {att.grade || "الصف الأول الثانوي"} | كود:{" "}
                          {att.studentRollNo}
                        </span>
                        {att.parentPhone && (
                          <span
                            style={{ color: "var(--primary)", fontWeight: 600 }}
                          >
                            📞 ولي الأمر: {att.parentPhone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      data-label="الاختبار"
                      style={{ color: "var(--primary)", fontWeight: 600 }}
                    >
                      {att.examTitle}
                    </td>
                    <td
                      data-label="التاريخ"
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {formatDate(att.endTime)}
                    </td>
                    <td
                      data-label="الوقت"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {formatTime(att.timeTakenSeconds)}
                    </td>
                    <td data-label="الدرجة" style={{ fontWeight: 700 }}>
                      {att.score}/{att.maxScore} ({att.percentage}%)
                    </td>
                    <td data-label="النتيجة">
                      <span
                        className={`badge ${att.passed ? "badge-green" : "badge-red"}`}
                      >
                        {att.passed ? "ناجح" : "راسب"}
                      </span>
                    </td>
                    <td data-label="إجراء">
                      <button
                        className="btn btn-ghost"
                        style={{
                          padding: "4px 8px",
                          gap: 4,
                          fontSize: "0.8rem",
                        }}
                        onClick={() => setDetail(att)}
                      >
                        <Eye size={13} /> تفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
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
            style={{ maxWidth: 420, width: "100%", padding: "1.5rem" }}
          >
            <h3
              style={{
                fontWeight: 800,
                marginBottom: "1rem",
                fontSize: "1rem",
              }}
            >
              تفاصيل التسليم
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: "0.875rem",
              }}
            >
              {[
                {
                  l: "الطالب",
                  v: `${detail.studentName} (${detail.studentRollNo})`,
                },
                { l: "الاختبار", v: detail.examTitle },
                {
                  l: "الدرجة",
                  v: `${detail.score} من ${detail.maxScore} (${detail.percentage}%)`,
                },
                {
                  l: "الوقت المستغرق",
                  v: `${Math.floor(detail.timeTakenSeconds / 60)} دقيقة`,
                },
                { l: "النتيجة", v: detail.passed ? "ناجح ✓" : "راسب ✗" },
              ].map((row) => (
                <div
                  key={row.l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                    {row.l}
                  </span>
                  <span style={{ fontWeight: 700 }}>{row.v}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => setDetail(null)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
