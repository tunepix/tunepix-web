import { generateImage } from "@/utils/generate-image";
import { scrapeSong } from "@/utils/scrape-song";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const json = (await request.json()) as { q: string };

  const { q } = json;

  const song = await scrapeSong(q);

  if (song) {
    return NextResponse.json({ result: { title: song.title } });
  } else {
    return NextResponse.json({ error: "error searching song" });
  }
}
