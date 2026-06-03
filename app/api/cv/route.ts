import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const fileName = "CV-Akhyar.pdf";
const owner = "Akhyarrrrr";
const repo = "CV";
const cvPath = "cv_akhyar.pdf";
const branch = "main";

function pdfResponse(
  buffer: ArrayBuffer | Buffer,
  source: "github" | "local",
  reason?: string
) {
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-CV-Source": source,
      ...(reason ? { "X-CV-Fallback-Reason": reason } : {}),
    },
  });
}

async function getLocalCV(reason?: string) {
  const localPath = path.join(process.cwd(), "public", fileName);
  const buffer = await readFile(localPath);
  return pdfResponse(buffer, "local", reason);
}

export async function GET() {
  const token = process.env.GITHUB_CV_TOKEN;
  const cvUrl =
    process.env.GITHUB_CV_RAW_URL ??
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cvPath}`;

  if (!cvUrl) {
    return getLocalCV("missing-cv-url");
  }

  try {
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${cvPath}?ref=${branch}`;
    const response = await fetch(token ? githubApiUrl : cvUrl, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: token
          ? "application/vnd.github.raw"
          : "application/octet-stream",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`GitHub CV fetch failed with status ${response.status}`);
      return getLocalCV(`github-${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    return pdfResponse(buffer, "github");
  } catch (error) {
    console.error("CV download error:", error);
    return getLocalCV("github-error");
  }
}
