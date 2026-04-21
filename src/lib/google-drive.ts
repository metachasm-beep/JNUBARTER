import { google } from "googleapis";
import { Readable } from "stream";

/**
 * Uploads a base64 encoded image to a specific Google Drive folder.
 * Requires GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_DRIVE_FOLDER_ID.
 */
export async function uploadToDrive(base64Image: string, fileName: string) {
  try {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!email || !key || !folderId) {
      console.warn("[GOOGLE_DRIVE] Missing credentials, falling back to local simulation");
      return `https://simulation.barter.jnu/id-photos/${fileName}`;
    }

    const auth = new google.auth.JWT(
      email,
      undefined,
      key,
      ["https://www.googleapis.com/auth/drive.file"]
    );

    const drive = google.drive({ version: "v3", auth });

    // Extract base64 data
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
        mimeType: "image/jpeg",
      },
      media: {
        mimeType: "image/jpeg",
        body: stream,
      },
      fields: "id, webViewLink",
    });

    console.log("[GOOGLE_DRIVE] Upload successful:", response.data.id);
    return response.data.webViewLink || response.data.id;
  } catch (error) {
    console.error("[GOOGLE_DRIVE] Upload failed:", error);
    throw new Error("Failed to store ID photo in secure cloud storage.");
  }
}
