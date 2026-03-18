import { google } from "googleapis";
import * as XLSX from "xlsx";

interface Participant {
  name: string;
  paymentStatus: string;
}

interface Trip {
  id: number;
  title: string;
  date: string;
  participants: number;
  participantsList: Participant[];
}

const FOLDER_ID = "11NZB4E7mk20dOGrmakIs4DBpt4BtPhrm";

export async function getGoogleDriveAuth() {
  const credentialsJson = process.env.GOOGLE_DRIVE_CREDENTIALS;
  
  if (!credentialsJson) {
    throw new Error("GOOGLE_DRIVE_CREDENTIALS environment variable not set");
  }

  const credentials = JSON.parse(credentialsJson);
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return auth;
}

export async function listFoldersInFolder(): Promise<any[]> {
  const auth = await getGoogleDriveAuth();
  const drive = google.drive({ version: "v3", auth });

  const result = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    spaces: "drive",
    fields: "files(id, name)",
    orderBy: "name",
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  return result.data.files || [];
}

export async function listFilesInFolder(folderId: string): Promise<any[]> {
  const auth = await getGoogleDriveAuth();
  const drive = google.drive({ version: "v3", auth });

  const result = await drive.files.list({
    q: `'${folderId}' in parents and (mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' OR mimeType='application/vnd.google-apps.spreadsheet') and trashed=false`,
    spaces: "drive",
    fields: "files(id, name, mimeType)",
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  return result.data.files || [];
}

export async function downloadFileContent(fileId: string): Promise<Buffer> {
  const auth = await getGoogleDriveAuth();
  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    { responseType: "arraybuffer" }
  );

  return Buffer.from(response.data as ArrayBuffer);
}

export async function exportGoogleSheetAsXlsx(fileId: string): Promise<Buffer> {
  const auth = await getGoogleDriveAuth();
  const drive = google.drive({ version: "v3", auth });

  const response = await drive.files.export(
    {
      fileId,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    { responseType: "arraybuffer" }
  );

  return Buffer.from(response.data as ArrayBuffer);
}

export async function parseExcelFile(buffer: Buffer): Promise<Participant[]> {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
  if (!sheet) {
    return [];
  }

  const rows = XLSX.utils.sheet_to_json<any>(sheet);
  const participants: Participant[] = [];

  for (const row of rows) {
    // Skip header rows and empty rows
    if (!row || typeof row !== "object") continue;

    // Get the first column value (name)
    const firstCol = Object.values(row)[0];
    
    if (!firstCol || typeof firstCol !== "string") continue;
    
    const name = firstCol.trim();
    
    // Skip service rows
    if (
      name.toLowerCase().includes("дата") ||
      name.toLowerCase().includes("место") ||
      name.toLowerCase().includes("расход") ||
      name.toLowerCase().includes("зарплат") ||
      name.toLowerCase().includes("проживан") ||
      name.toLowerCase().includes("итого") ||
      name === ""
    ) {
      continue;
    }

    // Look for payment status in other columns
    let paymentStatus = "unknown";
    const rowValues = Object.values(row).join(" ").toLowerCase();
    
    if (rowValues.includes("оплачено") || rowValues.includes("да")) {
      paymentStatus = "paid";
    } else if (rowValues.includes("не оплачено") || rowValues.includes("нет")) {
      paymentStatus = "unpaid";
    }

    participants.push({
      name,
      paymentStatus,
    });
  }

  return participants;
}

export async function extractTripInfo(folderName: string): Promise<{ title: string; date: string } | null> {
  // Expected format: "1. Турция - Анталья+Олю - 20-29 марта"
  // Remove leading number and dot
  const withoutNumber = folderName.replace(/^\d+\.\s*/, "").trim();
  
  if (!withoutNumber) {
    return null;
  }

  // Split by the last dash to separate location from date
  // Format: "Страна - Место - дата" or "Страна - Место/дата"
  const parts = withoutNumber.split(" - ");
  
  let title = "";
  let date = "";

  if (parts.length >= 2) {
    // Join all parts except the last as title, last part is date
    title = parts.slice(0, -1).join(" - ").trim();
    date = parts[parts.length - 1].trim();
  } else {
    // If no dash, use whole string as title
    title = withoutNumber;
    date = "";
  }

  return { title, date };
}

export async function loadTripsFromGoogleDrive(): Promise<Trip[]> {
  try {
    const folders = await listFoldersInFolder();
    const trips: Trip[] = [];

    for (let i = 0; i < folders.length; i++) {
      const folder = folders[i];
      
      if (!folder.id || !folder.name) continue;

      try {
        // Extract trip info from folder name
        const tripInfo = await extractTripInfo(folder.name);
        if (!tripInfo) continue;

        // List files in this folder
        const files = await listFilesInFolder(folder.id);
        
        if (files.length === 0) {
          console.log(`No files found in folder: ${folder.name}`);
          continue;
        }

        // Find first valid file and download it
        let buffer: Buffer | null = null;
        let selectedFile: any = null;

        for (const file of files) {
          if (!file.id) continue;

          try {
            if (file.mimeType === "application/vnd.google-apps.spreadsheet") {
              // Export Google Sheet as XLSX
              buffer = await exportGoogleSheetAsXlsx(file.id);
              selectedFile = file;
              break;
            } else if (file.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
              // Download XLSX file directly
              buffer = await downloadFileContent(file.id);
              selectedFile = file;
              break;
            }
          } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            continue;
          }
        }

        if (!buffer || !selectedFile) {
          console.log(`Could not download any file from folder: ${folder.name}`);
          continue;
        }

        const participants = await parseExcelFile(buffer);

        trips.push({
          id: i + 1,
          title: tripInfo.title,
          date: tripInfo.date,
          participants: participants.length,
          participantsList: participants,
        });

        console.log(`Loaded trip: ${tripInfo.title} with ${participants.length} participants`);
      } catch (error) {
        console.error(`Error processing folder ${folder.name}:`, error);
        continue;
      }
    }

    console.log(`Total trips loaded: ${trips.length}`);
    return trips;
  } catch (error) {
    console.error("Error loading trips from Google Drive:", error);
    throw error;
  }
}
