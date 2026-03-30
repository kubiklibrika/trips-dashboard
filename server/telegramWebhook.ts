import axios from "axios";
import { addTelegramUser } from "./db";

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
    entities?: Array<{
      offset: number;
      length: number;
      type: string;
    }>;
  };
}

function getTelegramConfig() {
  return {
    token: process.env.TELEGRAM_BOT_TOKEN,
  };
}

function getTelegramApiUrl() {
  const { token } = getTelegramConfig();
  return `https://api.telegram.org/bot${token}`;
}

/**
 * Handle Telegram webhook updates
 */
export async function handleTelegramUpdate(update: TelegramUpdate): Promise<void> {
  try {
    if (!update.message) {
      return;
    }

    const { message } = update;
    const chatId = message.chat.id.toString();
    const text = message.text || "";
    const firstName = message.from.first_name;
    const username = message.from.username;

    console.log(`[Telegram Webhook] Received message from ${firstName} (${chatId}): ${text}`);

    // Handle /start command
    if (text === "/start") {
      // Save user to database
      await addTelegramUser({
        chatId: chatId,
        firstName: firstName,
        username: username,
      });

      // Send welcome message
      await sendTelegramMessage(
        chatId,
        `🎉 Добро пожаловать, ${firstName}!\n\nВы подписались на уведомления о выездах. Теперь вы будете получать сообщения о новых участниках, изменениях статуса оплаты и других обновлениях.\n\n📊 <a href="${process.env.APP_URL || 'https://tripsdash-y478acgk.manus.space'}">Открыть дашборд</a>`
      );

      console.log(`[Telegram Webhook] User ${firstName} (${chatId}) registered successfully`);
    }
  } catch (error) {
    console.error("[Telegram Webhook] Error handling update:", error);
  }
}

/**
 * Send message to Telegram user
 */
async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  const { token } = getTelegramConfig();

  if (!token) {
    console.warn("[Telegram] Bot token not configured");
    return false;
  }

  try {
    const apiUrl = getTelegramApiUrl();

    await axios.post(
      `${apiUrl}/sendMessage`,
      {
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
      },
      {
        timeout: 10000,
      }
    );

    console.log(`[Telegram] Message sent to ${chatId}`);
    return true;
  } catch (error) {
    console.error(`[Telegram] Error sending message to ${chatId}:`, error);
    return false;
  }
}

/**
 * Set Telegram webhook
 */
export async function setTelegramWebhook(webhookUrl: string): Promise<boolean> {
  const { token } = getTelegramConfig();

  if (!token) {
    console.warn("[Telegram] Bot token not configured");
    return false;
  }

  try {
    const apiUrl = getTelegramApiUrl();

    const response = await axios.post(`${apiUrl}/setWebhook`, {
      url: webhookUrl,
    });

    console.log("[Telegram] Webhook set successfully:", response.data);
    return true;
  } catch (error) {
    console.error("[Telegram] Error setting webhook:", error);
    return false;
  }
}
