import { createClient } from "@supabase/supabase-js";

/**
 * Server-side storage utility using the Supabase Service Role key.
 * This allows uploading to private buckets and creating signed URLs.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pbfkvjosccsyuzeorerd.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const storageClient = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Uploads an ID photo to the 'id-verification' bucket.
 * Returns a unique file path for the database.
 */
export async function uploadIdPhoto(base64Image: string, userId: string) {
  if (!storageClient) {
    console.warn("[STORAGE] SUPABASE_SERVICE_ROLE_KEY missing. Falling back to local ref.");
    return `local_placeholder_${userId}_${Date.now()}.jpg`;
  }

  try {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const fileName = `${userId}/${Date.now()}.jpg`;

    const { data, error } = await storageClient.storage
      .from("id-verification")
      .upload(fileName, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) throw error;
    console.log("[STORAGE] Uploaded to Supabase:", data.path);
    return data.path;
  } catch (error) {
    console.error("[STORAGE] Upload failed:", error);
    throw new Error("Cloud storage synchronization failed.");
  }
}

/**
 * Generates a temporary signed URL for admin review.
 * Expires in 1 hour.
 */
export async function getSignedUrl(path: string) {
  if (!storageClient) return null;

  const { data, error } = await storageClient.storage
    .from("id-verification")
    .createSignedUrl(path, 3600); // 1 hour

  if (error) {
    console.error("[STORAGE] Signed URL failed:", error);
    return null;
  }
  return data.signedUrl;
}

/**
 * Deletes an ID photo from the bucket.
 */
export async function deleteIdPhoto(path: string) {
  if (!storageClient) return;

  const { error } = await storageClient.storage
    .from("id-verification")
    .remove([path]);

  if (error) {
    console.error("[STORAGE] Deletion failed:", error);
  } else {
    console.log("[STORAGE] Deleted from Supabase:", path);
  }
}
