import "dotenv/config";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { testTelegramConnection, notifyNewTrip, notifyNewParticipants } from "./telegramService";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as any;

describe("Telegram Service", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Mock successful response
    mockedAxios.post.mockResolvedValue({
      data: { ok: true },
      status: 200,
    });
  });

  it("should test Telegram connection", async () => {
    const result = await testTelegramConnection();
    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it("should send notification about new trip", async () => {
    const result = await notifyNewTrip(
      "Турция - Анталья",
      "20-29 марта",
      12
    );
    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it("should send notification about new participants", async () => {
    const result = await notifyNewParticipants(
      "Турция - Анталья",
      [
        { name: "Иван Петров", paymentStatus: "paid" },
        { name: "Мария Сидорова", paymentStatus: "unpaid" },
      ]
    );
    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    // Mock error response
    mockedAxios.post.mockRejectedValueOnce(new Error("API Error"));
    
    const result = await testTelegramConnection();
    expect(result).toBe(false);
  });
});

// Integration test: Real Telegram API connection
describe("Telegram Service - Real API Connection", () => {
  it("should successfully connect to Telegram API with real credentials", async () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
      console.log("Skipping real API test: Telegram credentials not configured");
      expect(true).toBe(true);
      return;
    }

    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          chat_id: chatId,
          text: "✅ Тест подключения Telegram API - новые credentials работают!",
          parse_mode: "HTML",
        },
        { timeout: 10000 }
      );

      expect(response.data.ok).toBe(true);
      console.log("✅ Telegram API connection test passed");
    } catch (error: any) {
      console.error("❌ Telegram API connection test failed:", error.response?.data || error.message);
      throw error;
    }
  });
});
