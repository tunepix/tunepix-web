import { cookies } from "next/headers";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { type Room } from "../../page";
import { useState } from "react";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

const ACCESS_TOKEN = `hn5eWt_C7kP8frKQnOY6GgHJWGbvOHiyq0LEi-4zccqwI5G1gL2i34REuJ8amcZn`;

export default async function RoomSuggest({
  params,
}: {
  params: { roomId: string };
}) {
  const suggestSong = async (formData: FormData) => {
    "use server";
    const q = formData.get("q");

    const resp = await fetch(`https://api.genius.com/search?q=${q}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    const { meta, response } = await resp.json();

    if (meta.status === 200 && response) {
      const [hit] = response.hits;
      const { full_title, url } = hit.result;

      const songResp = await fetch(url);
      const songHtml = await songResp.text();

      const $ = cheerio.load(songHtml);
      const lyrics = $("[data-lyrics-container=true]").html();

      if (!lyrics) return "";

      let chorusString = "[Chorus]";
      let verseString = "[Verse";

      if (lyrics.indexOf(chorusString) === -1) {
        chorusString = "[Припев]";
        verseString = "[Куплет";
      }

      if (chorusString.indexOf(chorusString) > -1) {
        const chorusBeginIndex = lyrics.indexOf(chorusString);
        const chorusEndIndex = chorusBeginIndex + chorusString.length;

        const chorus = lyrics?.slice(
          chorusEndIndex,
          lyrics.indexOf(verseString, chorusEndIndex)
        );

        console.log({ chorus: chorus.replace(/<br>/g, " ") });
      } else {
        return lyrics;
      }

      console.log({ lyrics });
    }
  };

  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Sign in to view room</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold ">Create room</h1>
        <form action={suggestSong}>
          <div className="flex flex-col gap-4 items-start ">
            <div className="flex flex-col gap-2 w-72">
              <label htmlFor="name">Text or title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="q"
                  name="q"
                  placeholder="enter lyrics or title"
                  className="px-3 py-2 border shadow-inner rounded text-slate-950"
                />
                <button
                  type="submit"
                  className="bg-foreground py-3 px-6 rounded-lg text-background"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* <pre>{searchResult}</pre> */}
      <footer>
        <button className="bg-foreground py-3 px-6 rounded-lg text-background">
          Suggest song
        </button>
      </footer>
    </div>
  );
}
