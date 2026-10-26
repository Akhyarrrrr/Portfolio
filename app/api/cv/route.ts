import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const pdf = await readFile(path.join(process.cwd(), "public", "cv_akhyar.pdf"));
    if (pdf.subarray(0, 5).toString("ascii") !== "%PDF-") {
      throw new Error("Bundled CV is not a PDF");
    }
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="CV-Akhyar.pdf"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-CV-Source": "bundled",
      },
    });
  } catch (error) {
    console.error("CV download error:", error);
    return new NextResponse("CV temporarily unavailable", {
      status: 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Retry-After": "60",
      },
    });
  }
}
