import { generateImage } from "@/utils/generate-image";
import { scrapeSong } from "@/utils/scrape-song";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const json = (await request.json()) as { q: string };

  const { q } = json;

  const output = await generateImage(q);

  const song = await scrapeSong(q);

  if (Array.isArray(output) && output.length > 0) {
    return NextResponse.json({ result: { ...song, src: output[0] } });
  } else {
    return NextResponse.json({ error: "error generating image" });
  }
}
