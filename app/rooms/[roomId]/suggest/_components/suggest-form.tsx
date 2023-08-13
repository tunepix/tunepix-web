"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export function SuggestSongForm({ roomId }: { roomId: number }) {
  const [song, setSong] = useState<{
    title: string;
    lyrics: string;
    src: string;
  }>();

  const [loading, setLoading] = useState(false);

  const supabase = createClientComponentClient();

  const router = useRouter();

  return (
    <div className="space-y-8">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);

          const formData = new FormData(e.currentTarget);
          const q = String(formData.get("q"));

          const resp = await fetch("/songs/suggest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ q }),
          });

          const { result, error } = await resp.json();

          if (result) {
            setSong({
              ...result,
            });
          }

          setLoading(false);
        }}
      >
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
                className={
                  "bg-foreground py-3 px-6 rounded-lg text-background " +
                  (loading ? "opacity-50" : "")
                }
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>
      </form>
      <div>
        {song ? (
          loading ? (
            <span>Generating...</span>
          ) : (
            <div className="space-y-2">
              <span>We've detected the song is {song.title}</span>
              <img src={song.src} alt="song cover" />
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const { data: insertedSongData, error: insertedSongError } =
                    await supabase
                      .from("songs")
                      .insert({
                        title: song.title,
                        lyrics: song.lyrics,
                      })
                      .select();

                  if (insertedSongData) {
                    const {
                      data: insertedRoomSongData,
                      error: insertedRoomSongError,
                    } = await supabase
                      .from("room_songs")
                      .insert({
                        room_id: roomId,
                        song_id: insertedSongData[0].id,
                        song_image_src: song.src,
                      })
                      .select();

                    if (insertedRoomSongData) {
                      router.push(`/rooms/${roomId}`);
                    } else {
                      console.error(insertedRoomSongError);
                    }
                  } else {
                    console.error(insertedSongError);
                  }
                }}
              >
                <button
                  type="submit"
                  className={
                    "bg-foreground py-3 px-6 rounded-lg text-background "
                  }
                >
                  Challenge friends
                </button>
              </form>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
