import { NextResponse } from "next/server";

const fileName = "CV-Akhyar.pdf";
const owner = "Akhyarrrrr";
const repo = "CV";
const cvPath = "cv_akhyar.pdf";
const branch = "main";

function pdfResponse(buffer: ArrayBuffer) {
  // ponytail: TS 5.7+'s stricter lib.dom ArrayBufferView types no longer
  // accept Buffer (or a view over ArrayBufferLike) as BodyInit — copy into
  // a fresh Uint8Array<ArrayBuffer>, which fetch's Response always accepts.
  const body: Uint8Array<ArrayBuffer> = new Uint8Array(buffer);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-CV-Source": "github",
    },
  });
}

function unavailableResponse() {
  return new NextResponse("CV temporarily unavailable", {
    status: 502,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Retry-After": "60",
      "X-CV-Source": "github",
    },
  });
}

export async function GET() {
  const token = process.env.GITHUB_CV_TOKEN;
  const cvUrl =
    process.env.GITHUB_CV_RAW_URL ??
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cvPath}`;

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
      return unavailableResponse();
    }

    const buffer = await response.arrayBuffer();
    const signature = new TextDecoder().decode(buffer.slice(0, 5));
    if (signature !== "%PDF-") {
      console.warn("GitHub CV response was not a PDF");
      return unavailableResponse();
    }

    return pdfResponse(buffer);
  } catch (error) {
    console.error("CV download error:", error);
    return unavailableResponse();
  }
}
