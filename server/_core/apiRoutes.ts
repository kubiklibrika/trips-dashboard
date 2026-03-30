import { type Express } from "express";
import { handleTelegramUpdate } from "../telegramWebhook";

/**
 * Register all API routes
 * Must be called BEFORE setupVite to ensure /api/* routes are not caught by Vite middleware
 */
export function registerApiRoutes(app: Express) {
  // Telegram webhook
  app.post("/api/telegram/webhook", async (req, res) => {
    try {
      console.log("[Telegram Webhook] Received update:", JSON.stringify(req.body, null, 2));
      const update = req.body;
      await handleTelegramUpdate(update);
      res.json({ ok: true });
    } catch (error) {
      console.error("[Telegram Webhook] Error:", error);
      res.status(500).json({ ok: false, error: "Internal server error" });
    }
  });
}
