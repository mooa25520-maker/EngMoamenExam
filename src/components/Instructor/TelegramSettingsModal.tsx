import React, { useState } from "react";
import {
  Send,
  CheckCircle,
  AlertCircle,
  X,
  Key,
  MessageSquare,
  Info,
  ShieldCheck,
} from "lucide-react";
import {
  getTelegramConfig,
  saveTelegramConfig,
  testTelegramConfig,
  TelegramConfig,
} from "../../services/telegram";

interface TelegramSettingsModalProps {
  onClose: () => void;
}

export const TelegramSettingsModal: React.FC<TelegramSettingsModalProps> = ({
  onClose,
}) => {
  const [config, setConfig] = useState<TelegramConfig>(getTelegramConfig());
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [testing, setTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveTelegramConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testTelegramConfig(config.botToken, config.chatId);
    setTesting(false);
    setTestResult(res);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div
        className="card animate-in"
        style={{
          maxWidth: 540,
          width: "100%",
          padding: "1.75rem",
          position: "relative",
          boxShadow: "0 20px 30px rgba(0,0,0,0.4)",
          borderRadius: 16,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid var(--border-color)",
            background: "var(--bg-main)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <X size={16} />
        </button>

        {/* Title */}
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
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#0088cc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Send size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              إعدادات بوت التليجرام 🤖
            </h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              ربط امتحانات الطلاب لتهيئتها لإرسال النتيجة باسم الطالب تلقائياً
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div
            style={{
              background: "rgba(5, 122, 85, 0.15)",
              border: "1px solid var(--accent-green)",
              color: "var(--accent-green)",
              padding: "0.75rem",
              borderRadius: 10,
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle size={16} /> تم حفظ إعدادات بوت التليجرام بنجاح!
          </div>
        )}

        {testResult && (
          <div
            style={{
              background: testResult.success
                ? "rgba(5, 122, 85, 0.15)"
                : "rgba(224, 36, 36, 0.15)",
              border: `1px solid ${testResult.success ? "var(--accent-green)" : "var(--accent-red)"}`,
              color: testResult.success
                ? "var(--accent-green)"
                : "var(--accent-red)",
              padding: "0.75rem",
              borderRadius: 10,
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {testResult.success ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {testResult.message}
          </div>
        )}

        <form
          onSubmit={handleSave}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              className="form-label"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Key size={14} color="#0088cc" /> توكن البوت (Bot Token) *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="مثال: 7912345678:AAHxxxxxx..."
              value={config.botToken}
              onChange={(e) =>
                setConfig({ ...config, botToken: e.target.value })
              }
              style={{
                direction: "ltr",
                textAlign: "left",
                fontFamily: "monospace",
              }}
            />
          </div>

          <div>
            <label
              className="form-label"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <MessageSquare size={14} color="#0088cc" /> معرف المحادثة أو
              القناة (Chat ID) *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="مثال: 123456789 أو @MyChannel"
              value={config.chatId}
              onChange={(e) => setConfig({ ...config, chatId: e.target.value })}
              style={{
                direction: "ltr",
                textAlign: "left",
                fontFamily: "monospace",
              }}
            />
          </div>

          {/* Toggle Enable */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-main)",
              padding: "0.75rem 1rem",
              borderRadius: 10,
              border: "1px solid var(--border-color)",
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
              تفعيل الإرسال التلقائي للنتائج عبر التليجرام
            </span>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) =>
                setConfig({ ...config, enabled: e.target.checked })
              }
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
          </div>

          {/* Guide Instructions */}
          <div
            style={{
              background: "var(--bg-main)",
              border: "1px solid var(--border-color)",
              borderRadius: 10,
              padding: "0.85rem",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <Info size={14} /> خطوات تفعيل البوت لاستلام نتائج الطلاب:
            </div>
            <ol style={{ paddingRight: "1.2rem", margin: 0 }}>
              <li>
                افتح البوت الخاص بك في التليجرام:{" "}
                <a
                  href="https://t.me/EXAM_RESULT_moamenBot"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#0088cc",
                    fontWeight: 800,
                    textDecoration: "underline",
                  }}
                >
                  @EXAM_RESULT_moamenBot 🔗
                </a>{" "}
                واضغط على زر <strong>START / إبدأ</strong>.
              </li>
              <li>
                لمعرفة الـ <strong>Chat ID</strong> الخاص بك: ابحث في تليجرام عن{" "}
                <strong>@userinfobot</strong> أو <strong>@myidbot</strong> واضغط
                Start، وسيعطيك رقم الـ Chat ID مباشرة.
              </li>
              <li>
                ادخل الـ <strong>Chat ID</strong> في الخانة أعلاه واضغط{" "}
                <strong>اختبار الاتصال</strong> ثم{" "}
                <strong>حفظ الإعدادات</strong>.
              </li>
            </ol>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: "0.5rem",
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              disabled={testing}
              onClick={handleTest}
              style={{ gap: 6, borderColor: "#0088cc", color: "#0088cc" }}
            >
              <Send size={14} />{" "}
              {testing ? "جاري التجربة..." : "اختبار الاتصال"}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ gap: 6 }}
            >
              <ShieldCheck size={16} /> حفظ الإعدادات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
