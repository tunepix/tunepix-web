// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import { generateImage } from "@/utils/generate-image";
import { scrapeLyrics, scrapeTitle } from "@/utils/scrape-song";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Create a Supabase client configured to use cookies
  const supabase = createRouteHandlerClient({ cookies });

  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const json = (await request.json()) as { q: string };

  const { q } = json;

  const output = await generateImage(q);

  const title = await scrapeTitle(q);

  if (Array.isArray(output) && output.length > 0) {
    return NextResponse.json({ result: { title, src: output[0] } });
  } else {
    return NextResponse.json({ error: "error generating image" });
  }
}
