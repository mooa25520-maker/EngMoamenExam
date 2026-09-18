import React from "react";
import { X, Printer, Award, ShieldCheck } from "lucide-react";
import { ExamAttempt } from "../../types/exam";

interface CertificateModalProps {
  attempt: ExamAttempt;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  attempt,
  onClose,
}) => {
  const formattedDate = new Date(attempt.endTime).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div style={{ maxWidth: 700, width: "100%", margin: "1rem auto" }}>
        {/* No-print actions */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginBottom: "0.75rem",
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
            style={{
              background: "white",
              color: "#1a56db",
              border: "1px solid #1a56db",
            }}
          >
            <Printer size={15} /> طباعة / PDF
          </button>
          <button
            className="btn btn-outline"
            style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}
            onClick={onClose}
          >
            <X size={15} /> إغلاق
          </button>
        </div>

        {/* Certificate */}
        <div
          className="certificate-print"
          style={{
            background: "white",
            color: "#111827",
            padding: "3rem 3.5rem",
            border: "8px double #1e3a5f",
            position: "relative",
            fontFamily: "'Cairo', sans-serif",
            textAlign: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* Corner Decorations */}
          {[
            [
              "top:0;right:0;border-top:5px solid #c8960c;border-right:5px solid #c8960c;",
            ],
            [
              "top:0;left:0;border-top:5px solid #c8960c;border-left:5px solid #c8960c;",
            ],
            [
              "bottom:0;right:0;border-bottom:5px solid #c8960c;border-right:5px solid #c8960c;",
            ],
            [
              "bottom:0;left:0;border-bottom:5px solid #c8960c;border-left:5px solid #c8960c;",
            ],
          ].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 50,
                height: 50,
                ...(i === 0
                  ? {
                      top: 12,
                      right: 12,
                      borderTop: "4px solid #c8960c",
                      borderRight: "4px solid #c8960c",
                    }
                  : i === 1
                    ? {
                        top: 12,
                        left: 12,
                        borderTop: "4px solid #c8960c",
                        borderLeft: "4px solid #c8960c",
                      }
                    : i === 2
                      ? {
                          bottom: 12,
                          right: 12,
                          borderBottom: "4px solid #c8960c",
                          borderRight: "4px solid #c8960c",
                        }
                      : {
                          bottom: 12,
                          left: 12,
                          borderBottom: "4px solid #c8960c",
                          borderLeft: "4px solid #c8960c",
                        }),
              }}
            />
          ))}

          {/* Header */}
          <div
            style={{
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "1.25rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "0.875rem",
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "#1e3a5f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "4px solid #c8960c",
                }}
              >
                <ShieldCheck size={34} color="white" />
              </div>
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#6b7280",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              شهادة إتمام
            </div>
            <div
              style={{ fontSize: "1.2rem", fontWeight: 900, color: "#1e3a5f" }}
            >
              منصة اختبارات م. مؤمن أحمد
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 4 }}
            >
              أولى ثانوي — مادة البرمجة
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "0.5rem 0 1.25rem" }}>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              يُشهد بأن الطالب / الطالبة
            </p>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                color: "#1e3a5f",
                marginBottom: "0.25rem",
                borderBottom: "2px solid #c8960c",
                display: "inline-block",
                paddingBottom: 4,
                paddingRight: "1.5rem",
                paddingLeft: "1.5rem",
              }}
            >
              {attempt.studentName}
            </h2>
            <p
              style={{
                marginTop: "0.375rem",
                fontSize: "0.8rem",
                color: "#9ca3af",
              }}
            >
              رقم الجلوس: <strong>{attempt.studentRollNo}</strong>
            </p>

            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "0.875rem",
                color: "#374151",
              }}
            >
              قد أتمّ بنجاح اختبار
            </p>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#111827",
                marginTop: 4,
              }}
            >
              {attempt.examTitle}
            </h3>
          </div>

          {/* Score Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2.5rem",
              background: "#f9fafb",
              padding: "1rem",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              margin: "1rem 0 1.5rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#9ca3af",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                الدرجة
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: "#1e3a5f",
                }}
              >
                {attempt.score} / {attempt.maxScore}
              </div>
            </div>
            <div style={{ width: 1, background: "#e5e7eb" }} />
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#9ca3af",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                النسبة
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: "#057a55",
                }}
              >
                {attempt.percentage}%
              </div>
            </div>
            <div style={{ width: 1, background: "#e5e7eb" }} />
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#9ca3af",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                النتيجة
              </div>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  color: "#057a55",
                  marginTop: 6,
                }}
              >
                ناجح ✓
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                تاريخ الإصدار
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: "#374151",
                  fontSize: "0.875rem",
                }}
              >
                {formattedDate}
              </div>
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2rem",
                  color: "#1e3a5f",
                  borderBottom: "1px solid #374151",
                  paddingBottom: 2,
                }}
              >
                م. مؤمن أحمد
              </div>
              <div
                style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 3 }}
              >
                مدرس البرمجة
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
