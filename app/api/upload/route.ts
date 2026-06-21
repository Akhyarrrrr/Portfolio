import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ??
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
  "ahyar12324@gmail.com";

/**
 * POST /api/upload
 *
 * Accepts a multipart/form-data body with a single "file" field.
 * Signs the upload server-side so we never expose the API secret to the client,
 * then proxies the file to Cloudinary and returns { secure_url }.
 *
 * Required env vars:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("portfolio_session")?.value ?? "";

  if (session !== ADMIN_EMAIL) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Cloudinary credentials are not configured." },
      { status: 500 }
    );
  }

  // Parse the uploaded file from multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }

  // Build signed params
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "portfolio";

  // Sign: alphabetical order, no file param
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha256")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  // Forward to Cloudinary
  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("timestamp", String(timestamp));
  uploadForm.append("signature", signature);
  uploadForm.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: uploadForm }
  );

  let data: { secure_url?: string; error?: { message?: string } };
  try {
    data = await res.json();
  } catch {
    return NextResponse.json(
      { message: "Cloudinary returned an unexpected response." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { message: data?.error?.message ?? "Cloudinary upload failed." },
      { status: res.status }
    );
  }

  return NextResponse.json({ secure_url: data.secure_url });
}
