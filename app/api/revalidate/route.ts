import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ??
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
  "ahyar12324@gmail.com";

export async function POST(req: NextRequest) {
  // Auth: only admin can trigger revalidation
  const session = req.cookies.get("portfolio_session")?.value ?? "";
  if (session !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { paths } = (await req.json()) as { paths?: string[] };
    const targets = paths?.length ? paths : ["/"];

    for (const p of targets) {
      revalidatePath(p);
    }

    return NextResponse.json({ revalidated: targets });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
