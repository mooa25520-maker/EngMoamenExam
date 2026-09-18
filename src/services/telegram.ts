export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

const TELEGRAM_CONFIG_KEY = "exampulse_telegram_config_v1";

// Default Telegram configuration
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

const formatWa = (phone?: string) => {
  if (!phone) return "";
  const raw = phone.replace(/\D/g, "");
  return raw.startsWith("0") ? `2${raw}` : raw;
};

// ── 1. رسالة ولي الأمر الجاهزة للنسخ/الإرسال ──
export const formatParentMessage = (data: TelegramResultPayload): string => {
  const mins = Math.floor(data.timeTakenSeconds / 60);
  const secs = data.timeTakenSeconds % 60;
  const timeStr = `${mins} دقيقة و ${secs} ثانية`;
  const dateStr = data.dateStr || new Date().toLocaleString("ar-EG");
  const statusEmoji = data.passed ? "✅ ناجح" : "❌ لم يجتز الاختبار";

  return (
    `السلام عليكم ورحمة الله وبركاته،\n` +
    `إلى ولي أمر الطالب: ${data.studentName} (${data.grade || ""})\n\n` +
    `نحيطكم علماً بنتيجة نجلك في اختبار:\n` +
    `📝 ${data.examTitle}\n\n` +
    `📊 الدرجة: ${data.score} من ${data.maxScore} (${data.percentage}%)\n` +
    `🏁 النتيجة: ${statusEmoji}\n` +
    `⏱️ الوقت المستغرق: ${timeStr}\n` +
    `📅 التاريخ: ${dateStr}\n\n` +
    `مع تحيات: م. مؤمن أحمد ✨`
  );
};

// ── 2. رسالة الطالب الجاهزة للنسخ/الإرسال (تحليل وشرح الأخطاء) ──
export const formatStudentMessage = (data: TelegramResultPayload): string => {
  const dateStr = data.dateStr || new Date().toLocaleString("ar-EG");
  let msg =
    `أهلاً بك يا ${data.studentName} ✨\n` +
    `إليك تقرير مراجعة إجاباتك في اختبار: ${data.examTitle}\n` +
    `📊 درجتك: ${data.score} من ${data.maxScore} (${data.percentage}%)\n` +
    `📅 التاريخ: ${dateStr}\n\n`;

  if (data.wrongQuestions && data.wrongQuestions.length > 0) {
    msg += `❌ الأسئلة التي أخطأت فيها مع الشرح والتوضيح (${data.wrongQuestions.length} سؤال):\n\n`;
    data.wrongQuestions.forEach((w, idx) => {
      msg +=
        `${idx + 1}️⃣ س: ${w.questionText}\n` +
        `• إجابتك: ${w.studentAnswerText}\n` +
        `• الإجابة الصحيحة: ${w.correctAnswerText}\n` +
        `• 💡 الشرح: ${w.explanation}\n\n`;
    });
  } else {
    msg += `🎉 ممتاز يا بطل! لقد أجبت على جميع الأسئلة بصورة صحيحة 100%.\n\n`;
  }

  msg += `نتمنى لك دوام التوفيق والتميز!\nمع تحيات: م. مؤمن أحمد 🚀`;
  return msg;
};

// ── 3. رسالة الملخص الكاملة لإشعارات تليجرام للبوت ──
export const formatTelegramMessage = (data: TelegramResultPayload): string => {
  const mins = Math.floor(data.timeTakenSeconds / 60);
  const secs = data.timeTakenSeconds % 60;
  const dateStr = data.dateStr || new Date().toLocaleString("ar-EG");
  const statusEmoji = data.passed ? "✅ ناجح" : "❌ لم يجتز";

  const parentWaUrl = formatWa(data.parentPhone)
    ? `https://wa.me/${formatWa(data.parentPhone)}`
    : "";
  const studentWaUrl = formatWa(data.studentPhone)
    ? `https://wa.me/${formatWa(data.studentPhone)}`
    : "";

  return (
    `🎓 *إشعار نتيجة اختبار جديد*\n\n` +
    `👤 *الطالب:* ${data.studentName} (${data.grade || ""})\n` +
    `📝 *الاختبار:* ${data.examTitle}\n` +
    `📊 *الدرجة:* ${data.score}/${data.maxScore} (${data.percentage}%) ${statusEmoji}\n` +
    `⏱ *الوقت:* ${mins}د ${secs}ث | 📅 ${dateStr}\n` +
    `📱 *هاتف الطالب:* \`${data.studentPhone || "غير مسجل"}\`\n` +
    `👨‍👩‍👦 *هاتف ولي الأمر:* \`${data.parentPhone || "غير مسجل"}\`\n` +
    (parentWaUrl ? `📲 *واتساب ولي الأمر:* ${parentWaUrl}\n` : "") +
    (studentWaUrl ? `📲 *واتساب الطالب:* ${studentWaUrl}\n` : "") +
    `--------------------------------\n` +
    `👨‍👩‍👦 1. *رسالة ولي الأمر:* \n${formatParentMessage(data)}\n` +
    `--------------------------------\n` +
    `👨‍🎓 2. *رسالة الطالب:* \n${formatStudentMessage(data)}\n` +
    `--------------------------------\n` +
    `⚡ *منصة م. مؤمن أحمد التعليمية*`
  );
};

// Helper: send raw message to Telegram
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
    // إرسال الرسالة الرئيسية الملخصة
    const parentWaUrl = formatWa(payload.parentPhone) ? `https://wa.me/${formatWa(payload.parentPhone)}` : "";
    const studentWaUrl = formatWa(payload.studentPhone) ? `https://wa.me/${formatWa(payload.studentPhone)}` : "";

    const summaryText =
      `🎓 *إشعار نتيجة اختبار جديد*\n\n` +
      `👤 *الطالب:* ${payload.studentName} (${payload.grade || ""})\n` +
      `📝 *الاختبار:* ${payload.examTitle}\n` +
      `📊 *الدرجة:* ${payload.score}/${payload.maxScore} (${payload.percentage}%) ${payload.passed ? "✅ ناجح" : "❌ لم يجتز"}\n` +
      `📱 *هاتف الطالب:* \`${payload.studentPhone || "—"}\`\n` +
      `👨‍👩‍👦 *هاتف ولي الأمر:* \`${payload.parentPhone || "—"}\`\n` +
      (parentWaUrl ? `📲 *واتساب ولي الأمر:* ${parentWaUrl}\n` : "") +
      (studentWaUrl ? `📲 *واتساب الطالب:* ${studentWaUrl}\n` : "");

    await sendOneMessage(config.botToken, config.chatId, summaryText);

    // إرسال نص رسالة ولي الأمر
    const parentMsg = `👨‍👩‍👦 *[رسالة موجهة لولي الأمر]*\n\n` + formatParentMessage(payload);
    await sendOneMessage(config.botToken, config.chatId, parentMsg);

    // إرسال رسالة الطالب (تكون مقسمة إن كانت طويلة)
    const studentMsgHeader = `👨‍🎓 *[رسالة موجهة للطالب - الشرح والأخطاء]*\n\n`;
    const studentMsgBody = formatStudentMessage(payload);

    const fullStudentText = studentMsgHeader + studentMsgBody;
    if (fullStudentText.length <= 3800) {
      await sendOneMessage(config.botToken, config.chatId, fullStudentText);
    } else {
      // إذا كانت رسالة الطالب طويلة، يتم تقسيمها
      const CHUNK_LIMIT = 3500;
      let currentChunk = studentMsgHeader;
      const lines = studentMsgBody.split("\n");
      for (const line of lines) {
        if ((currentChunk + line + "\n").length > CHUNK_LIMIT) {
          await sendOneMessage(config.botToken, config.chatId, currentChunk.trim());
          currentChunk = `(تابع رسالة الطالب):\n` + line + "\n";
        } else {
          currentChunk += line + "\n";
        }
      }
      if (currentChunk.trim()) {
        await sendOneMessage(config.botToken, config.chatId, currentChunk.trim());
      }
    }

    return { success: true, message: "تم إرسال النتيجة والتفاصيل بنجاح!" };
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
        message: result.description || "فشل الاتصال بالبوت.",
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "تعذر الاتصال بسيرفر التليجرام.",
    };
  }
};
