import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ storageId: string }> }
) {
  const { storageId } = await context.params;

  if (!storageId) {
    return NextResponse.json({ error: "Storage ID required" }, { status: 400 });
  }

  try {
    const url = await convex.query(api.files.getFileUrl, { storageId });

    if (!url) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.redirect(url);
  } catch {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
  }
}