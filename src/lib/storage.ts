import imageCompression from "browser-image-compression";
import { supabase } from "./supabase";

const BUCKET_NAME = "progress-photos";
const MAX_FILE_SIZE_MB = 10;
const MAX_COMPRESSED_SIZE_KB = 500;
const MAX_WIDTH_OR_HEIGHT = 1920;

export async function compressImage(file: File, maxSizeKB: number = MAX_COMPRESSED_SIZE_KB): Promise<File> {
  const options = {
    maxSizeMB: maxSizeKB / 1024,
    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
    fileType: file.type,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Không thể nén ảnh. Vui lòng thử lại với ảnh khác.");
  }
}

export function validateImageFile(file: File): void {
  if (!file.type.startsWith("image/")) {
    throw new Error("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WebP).");
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    throw new Error(`Ảnh quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE_MB}MB.`);
  }
}

function generateStoragePath(memberId: string, date: string, originalFilename: string): string {
  const timestamp = Date.now();
  const extension = originalFilename.split(".").pop() || "jpg";
  const safeFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
  const filename = `${timestamp}-${safeFilename}`;
  return `${memberId}/${date}/${filename}`;
}

function extractStoragePath(url: string): string | null {
  try {
    if (url.includes("/") && !url.startsWith("http")) {
      return url;
    }

    const bucketIndex = url.indexOf(`/${BUCKET_NAME}/`);
    if (bucketIndex !== -1) {
      return url.substring(bucketIndex + BUCKET_NAME.length + 2);
    }

    const pathMatch = url.match(/\/storage\/v1\/object\/public\/progress-photos\/(.+)/);
    if (pathMatch) {
      return pathMatch[1];
    }

    return null;
  } catch {
    return null;
  }
}

export async function uploadProgressPhoto(memberId: string, file: File, date: string): Promise<string> {
  try {
    validateImageFile(file);

    const compressedFile = await compressImage(file);

    const filePath = generateStoragePath(memberId, date, file.name);

    let uploadData: { path: string } | null = null;
    let finalPath = filePath;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, compressedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      if (error.message.includes("already exists")) {
        const newPath = generateStoragePath(memberId, date, `${Date.now()}-${file.name}`);
        const retryUpload = await supabase.storage.from(BUCKET_NAME).upload(newPath, compressedFile, {
          cacheControl: "3600",
          upsert: false,
        });
        if (retryUpload.error) throw retryUpload.error;
        uploadData = retryUpload.data;
        finalPath = newPath;
      } else {
        throw error;
      }
    } else {
      uploadData = data;
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData?.path || finalPath);
    
    if (!urlData?.publicUrl) {
      throw new Error("Không thể lấy URL công khai của ảnh.");
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading progress photo:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Không thể upload ảnh. Vui lòng thử lại sau.");
  }
}

export async function deleteProgressPhoto(filePath: string): Promise<void> {
  try {
    const path = extractStoragePath(filePath);
    if (!path) {
      console.warn("Could not extract storage path from:", filePath);
      return;
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      if (error.message.includes("not found")) {
        console.warn("File not found for deletion:", path);
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting progress photo:", error);
  }
}

export async function listMemberPhotos(memberId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(memberId, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) throw error;

    const photoPaths: string[] = [];
    
    if (data) {
      for (const folder of data) {
        if (folder.id === null) continue;
        photoPaths.push(`${memberId}/${folder.name}`);
      }
    }

    return photoPaths;
  } catch (error) {
    console.error("Error listing member photos:", error);
    return [];
  }
}

