import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "@/lib/cloudinary";

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const ALLOWED_EXTENSIONS = new Set(["heic", "heif", "jpg", "jpeg", "png", "webp"]);

export function isAllowedImage(file: File): boolean {
  if (ALLOWED_MIME_TYPES.has(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return Boolean(ext && ALLOWED_EXTENSIONS.has(ext));
}

export function uploadImageToCloudinary(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, format: "jpg" }, (error, result) => {
      if (error || !result) return reject(error ?? new Error("Upload failed"));
      resolve(result);
    });
    stream.end(buffer);
  });
}
