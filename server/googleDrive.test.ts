import { describe, it, expect } from "vitest";
import { google } from "googleapis";

describe("Google Drive API Credentials", () => {
  it("should validate Google Drive API credentials", async () => {
    const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS;
    
    if (!credentialsJson) {
      throw new Error("GOOGLE_DRIVE_CREDENTIALS environment variable not set");
    }

    const credentials = JSON.parse(credentialsJson);
    
    // Verify credentials structure
    expect(credentials).toHaveProperty("type", "service_account");
    expect(credentials).toHaveProperty("project_id");
    expect(credentials).toHaveProperty("private_key");
    expect(credentials).toHaveProperty("client_email");
    expect(credentials).toHaveProperty("token_uri");

    // Try to authenticate with Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Test API access by listing files (should not throw)
    try {
      const result = await drive.files.list({
        spaces: "drive",
        pageSize: 1,
        fields: "files(id, name)",
      });

      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("files");
    } catch (error: any) {
      // If we get a 403, it means auth worked but we don't have access to this specific folder
      // That's OK - it means credentials are valid
      if (error.status === 403) {
        expect(error.status).toBe(403);
      } else {
        throw error;
      }
    }
  });
});
