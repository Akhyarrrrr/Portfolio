const CLOUDINARY_CLOUD_NAME = "dwixbreak";
const CLOUDINARY_UPLOAD_PRESET = "portfolio_unsigned";

type CloudinaryUploadResponse = {
  secure_url?: string;
};

export async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await fetch(url, { method: "POST", body: formData });
    if (!res.ok) throw new Error(`Cloudinary returned ${res.status}`);
    const data = (await res.json()) as CloudinaryUploadResponse;
    return data.secure_url ?? "";
  } catch (error) {
    console.error("uploadToCloudinary failed:", error);
    throw error;
  }
}
