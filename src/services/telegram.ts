export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

const TELEGRAM_CONFIG_KEY = "exampulse_telegram_config_v1";

// Default Telegram configuration (preset with instructor's Telegram Bot)
export const defaultTelegramConfig: TelegramConfig = {
  botToken: "8631657441:AAFJ6jKIl2uUugAAOwTrfSrK1XJ-IqTWZOU",
  chatId: "5278153551",
  enabled: true,
};

export const getTelegramConfig = (): TelegramConfig => {
  try {
    const data = localStorage.getItem(TELEGRAM_CONFIG_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        botToken: parsed.botToken || defaultTelegramConfig.botToken,
        chatId: parsed.chatId || defaultTelegramConfig.chatId,
        enabled: parsed.enabled !== undefined ? parsed.enabled : true,
      };
    }
  } catch (e) {
    console.error("Error reading Telegram config", e);
  }
  return defaultTelegramConfig;
};

export const saveTelegramConfig = (config: TelegramConfig): void => {
  try {
    localStorage.setItem(TELEGRAM_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Error saving Telegram config", e);
  }
};

export interface WrongQuestionDetail {
  questionText: string;
  studentAnswerText: string;
  correctAnswerText: string;
  explanation: string;
}

export interface TelegramResultPayload {
  studentName: string;
  grade: string;
  studentPhone?: string;
  parentPhone: string;
  studentRollNo?: string;
  examTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds: number;
  dateStr?: string;
  wrongQuestions?: WrongQuestionDetail[];
}

// ── Message 1: Short summary (always < 500 chars) ──
export const formatTelegramMessage = (data: TelegramResultPayload): string => {
  const mins = Math.floor(data.timeTakenSeconds / 60);
  const secs = data.timeTakenSeconds % 60;
  const dateStr = data.dateStr || new Date().toLocaleString("ar-EG");
  const statusEmoji = data.passed ? "✅ ناجح" : "❌ لم يجتز";

  const formatWa = (phone?: string) => {
    if (!phone) return "";
    const raw = phone.replace(/\D/g, "");
    return raw.startsWith("0") ? `2${raw}` : raw;
  };
  const parentWaUrl = formatWa(data.parentPhone)
    ? `https://wa.me/${formatWa(data.parentPhone)}`
    : "";
  const studentWaUrl = formatWa(data.studentPhone)
    ? `https://wa.me/${formatWa(data.studentPhone)}`
    : "";

  return (
    `🎓 *نتيجة اختبار جديدة*\n` +
    `👤 *${data.studentName}* — ${data.grade || ""}\n` +
    `📝 ${data.examTitle}\n` +
    `📊 ${data.score}/${data.maxScore} (${data.percentage}%) ${statusEmoji}\n` +
    `⏱ ${mins}د ${secs}ث | � ${dateStr}\n` +
    `📱 الطالب: \`${data.studentPhone || "—"}\`\n` +
    `👨‍👩‍👦 ولي الأمر: \`${data.parentPhone || "—"}\`\n` +
    (parentWaUrl ? `📲 واتساب ولي الأمر: ${parentWaUrl}\n` : "") +
    (studentWaUrl ? `📲 واتساب الطالب: ${studentWaUrl}\n` : "") +
    (data.wrongQuestions && data.wrongQuestions.length > 0
      ? `\n❌ أسئلة خاطئة: ${data.wrongQuestions.length} سؤال — شرح مفصل يلي هذه الرسالة`
      : `\n🎉 أجاب على جميع الأسئلة بشكل صحيح!`) +
    `\n\n⚡ منصة م. مؤمن أحمد التعليمية`
  );
};

// ── Helper: send one raw message via Telegram API ──
const sendOneMessage = async (
  botToken: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean; description?: string }> => {
  const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId.trim(), text, parse_mode: "Markdown" }),
    });
    const json = await res.json();
    // If Markdown parse fails, retry as plain text
    if (!json.ok && json.error_code === 400) {
      const res2 = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId.trim(), text }),
      });
      return res2.json();
    }
    return json;
  } catch (err) {
    return { ok: false, description: String(err) };
  }
};

// ── Main send function: 1 summary + chunked wrong-questions messages ──
export const sendTelegramResult = async (
  payload: TelegramResultPayload,
  configOverride?: TelegramConfig
): Promise<{ success: boolean; message: string }> => {
  const config = configOverride || getTelegramConfig();

  if (!config.enabled) {
    return { success: false, message: "إرسال التليجرام معطل حالياً." };
  }
  if (!config.botToken || !config.chatId) {
    return {
      success: false,
      message: "لم يتم ضبط رمز البوت (Bot Token) أو معرف الشات (Chat ID).",
    };
  }

  try {
    // ── رسالة 1: ملخص النتيجة ──
    const res1 = await sendOneMessage(
      config.botToken,
      config.chatId,
      formatTelegramMessage(payload)
    );
    if (!res1.ok) {
      console.error("Telegram Msg1 Error:", res1);
      return { success: false, message: res1.description || "فشل إرسال رسالة النتيجة." };
    }

    // ── رسالة 2+: شرح الأسئلة الخاطئة مقسمة على أجزاء ──
    if (payload.wrongQuestions && payload.wrongQuestions.length > 0) {
      const CHUNK_LIMIT = 3500;
      const headerPart1 =
        `👨‍🎓 *شرح الأسئلة الخاطئة*\n` +
        `الطالب: ${payload.studentName} | ${payload.examTitle}\n` +
        `عدد الأخطاء: ${payload.wrongQuestions.length} سؤال\n\n`;

      let currentChunk = headerPart1;
      let chunkNum = 1;
      let questionsInChunk = 0;

      for (let i = 0; i < payload.wrongQuestions.length; i++) {
        const w = payload.wrongQuestions[i];
        const entry =
          `${i + 1}. ${w.questionText}\n` +
          `   اجابتك: ${w.studentAnswerText}\n` +
          `   الصواب: ${w.correctAnswerText}\n` +
          `   الشرح: ${w.explanation}\n\n`;

        if ((currentChunk + entry).length > CHUNK_LIMIT && questionsInChunk > 0) {
          await sendOneMessage(config.botToken, config.chatId, currentChunk.trim());
          chunkNum++;
          currentChunk = `(تابع — جزء ${chunkNum})\n\n` + entry;
          questionsInChunk = 1;
        } else {
          currentChunk += entry;
          questionsInChunk++;
        }
      }

      if (currentChunk.trim()) {
        await sendOneMessage(
          config.botToken,
          config.chatId,
          currentChunk.trim() + "\n\n🚀 مع تحيات م. مؤمن أحمد"
        );
      }
    }

    return { success: true, message: "تم إرسال النتيجة إلى التليجرام بنجاح!" };
  } catch (err: any) {
    console.error("Network / Telegram Error:", err);
    return {
      success: false,
      message: err.message || "حدث خطأ في الاتصال بخدمة التليجرام.",
    };
  }
};

export const testTelegramConfig = async (
  botToken: string,
  chatId: string
): Promise<{ success: boolean; message: string }> => {
  if (!botToken || !chatId) {
    return { success: false, message: "الرجاء إدخال توكن البوت ومعرف المحادثة." };
  }

  const testText =
    `🤖 *اختبار اتصال منصة الامتحانات*\n\n` +
    `تم الاتصال بنجاح مع بوت التليجرام الخاص بم. مؤمن أحمد! ✨\n` +
    `تاريخ الاتصال: ${new Date().toLocaleString("ar-EG")}`;

  try {
    const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId.trim(), text: testText, parse_mode: "Markdown" }),
    });

    const result = await response.json();
    if (result.ok) {
      return { success: true, message: "تم الاتصال بنجاح وإرسال رسالة التجربة!" };
    } else {
      return {
        success: false,
        message: result.description || "فشل الاتصال بالبوت. تأكد من صحة التوكن والـ Chat ID.",
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "تعذر الاتصال بسيرفر التليجرام.",
    };
  }
};
