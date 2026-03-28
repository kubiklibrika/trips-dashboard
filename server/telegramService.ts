import axios from "axios";

function getDashboardUrl(): string {
  // Get the app URL from environment or use default
  const appUrl = process.env.APP_URL || process.env.VITE_FRONTEND_FORGE_API_URL?.replace('/api', '') || 'https://tripsdash-y478acgk.manus.space';
  return appUrl;
}

function getTelegramConfig() {
  return {
    token: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  };
}

function getTelegramApiUrl() {
  const { token } = getTelegramConfig();
  return `https://api.telegram.org/bot${token}`;
}

interface TelegramMessage {
  title: string;
  content: string;
  type: "new_trip" | "new_participant" | "added_participant" | "removed_participant" | "payment_status_changed" | "general";
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
  const { token, chatId } = getTelegramConfig();
  
  if (!token || !chatId) {
    console.warn("[Telegram] Bot token or chat ID not configured");
    return false;
  }

  try {
    const text = formatMessage(message);
    const apiUrl = getTelegramApiUrl();
    
    const response = await axios.post(`${apiUrl}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
    }, {
      timeout: 10000,
    });

    console.log(`[Telegram] Message sent successfully: ${message.title}`);
    return true;
  } catch (error) {
    console.error("[Telegram] Error sending message:", error);
    return false;
  }
}

/**
 * Format message for Telegram
 */
function formatMessage(message: TelegramMessage): string {
  let text = "";

  if (message.type === "new_trip") {
    text = `<b>🎉 Новый выезд!</b>\n\n`;
    text += `<b>${message.title}</b>\n`;
    text += `${message.content}`;
  } else if (message.type === "new_participant") {
    text = `<b>👤 Новый участник!</b>\n\n`;
    text += `<b>${message.title}</b>\n`;
    text += `${message.content}`;
  } else if (message.type === "added_participant") {
    text = `<b>➕ Добавлен участник</b>\n\n`;
    text += `<b>${message.title}</b>\n`;
    text += `${message.content}`;
  } else if (message.type === "removed_participant") {
    text = `<b>➖ Удален участник</b>\n\n`;
    text += `<b>${message.title}</b>\n`;
    text += `${message.content}`;
  } else if (message.type === "payment_status_changed") {
    text = `<b>💳 Изменен статус оплаты</b>\n\n`;
    text += `<b>${message.title}</b>\n`;
    text += `${message.content}`;
  } else {
    text = `<b>${message.title}</b>\n\n${message.content}`;
  }

  // Add dashboard link
  const dashboardUrl = getDashboardUrl();
  text += `\n\n<a href="${dashboardUrl}">📊 Открыть дашборд</a>`;

  return text;
}

/**
 * Send notification about new trip
 */
export async function notifyNewTrip(tripTitle: string, tripDate: string, participantCount: number): Promise<boolean> {
  const content = `📅 Дата: ${tripDate}\n👥 Участников: ${participantCount}`;
  
  return sendTelegramMessage({
    title: tripTitle,
    content: content,
    type: "new_trip",
  });
}

/**
 * Send notification about new participants
 */
export async function notifyNewParticipants(
  tripTitle: string,
  newParticipants: Array<{ name: string; paymentStatus: string }>
): Promise<boolean> {
  const participantsList = newParticipants
    .map(p => `• ${p.name} (${p.paymentStatus === "paid" ? "✅ Оплачено" : "❌ Не оплачено"})`)
    .join("\n");

  const content = `Новые участники в выезде "${tripTitle}":\n\n${participantsList}`;
  
  return sendTelegramMessage({
    title: `${newParticipants.length} новых участников`,
    content: content,
    type: "new_participant",
  });
}

/**
 * Send notification about added participant
 */
export async function notifyAddedParticipant(
  tripTitle: string,
  participantName: string,
  paymentStatus: string
): Promise<boolean> {
  const statusText = paymentStatus === "paid" ? "✅ Оплачено" : "❌ Не оплачено";
  const content = `${participantName}\nСтатус: ${statusText}`;
  
  return sendTelegramMessage({
    title: tripTitle,
    content: content,
    type: "added_participant",
  });
}

/**
 * Send notification about removed participant
 */
export async function notifyRemovedParticipant(
  tripTitle: string,
  participantName: string
): Promise<boolean> {
  const content = `${participantName}`;
  
  return sendTelegramMessage({
    title: tripTitle,
    content: content,
    type: "removed_participant",
  });
}

/**
 * Send notification about payment status change
 */
export async function notifyPaymentStatusChange(
  tripTitle: string,
  participantName: string,
  oldStatus: string,
  newStatus: string
): Promise<boolean> {
  const oldStatusText = oldStatus === "paid" ? "✅ Оплачено" : "❌ Не оплачено";
  const newStatusText = newStatus === "paid" ? "✅ Оплачено" : "❌ Не оплачено";
  const content = `${participantName}\n${oldStatusText} → ${newStatusText}`;
  
  return sendTelegramMessage({
    title: tripTitle,
    content: content,
    type: "payment_status_changed",
  });
}

/**
 * Test Telegram connection
 */
export async function testTelegramConnection(): Promise<boolean> {
  const { token, chatId } = getTelegramConfig();
  
  if (!token || !chatId) {
    console.warn("[Telegram] Bot token or chat ID not configured");
    return false;
  }

  try {
    const apiUrl = getTelegramApiUrl();
    const response = await axios.post(`${apiUrl}/sendMessage`, {
      chat_id: chatId,
      text: "✅ Дашборд выездов успешно подключился к Telegram!",
      parse_mode: "HTML",
    }, {
      timeout: 10000,
    });

    console.log("[Telegram] Connection test successful");
    return true;
  } catch (error) {
    console.error("[Telegram] Connection test failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
