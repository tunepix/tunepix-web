"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export function AnswerSongForm({ roomSongId }: { roomSongId: number }) {
  const [song, setSong] = useState<{
    title: string;
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

          const resp = await fetch("/songs/search", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ q }),
          });

          const { result } = await resp.json();

          if (result) {
            setSong(result);
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
            <span>Searching...</span>
          ) : (
            <div className="space-y-4">
              <span>Your answer is {song.title}</span>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const { data: roomSongData } = await supabase
                    .from("room_songs")
                    .select()
                    .eq("id", roomSongId);

                  if (roomSongData) {
                    const { data: songData } = await supabase
                      .from("songs")
                      .select()
                      .eq("id", roomSongData[0].song_id);

                    if (songData) {
                      if (song.title === songData[0].title) {
                        const {
                          data: { user },
                        } = await supabase.auth.getUser();

                        const userScore = await supabase
                          .from("scores")
                          .select()
                          .eq("profile_id", user?.id)
                          .eq("room_song_id", roomSongId);

                        if (userScore.data) {
                          if (Boolean(userScore.data[0]?.score)) {
                            return alert("you already guessed it!");
                          }

                          const insertedScore = await supabase
                            .from("scores")
                            .insert({
                              profile_id: user?.id,
                              room_song_id: roomSongId,
                              score: 1,
                            });

                          alert("You get it!!");
                          router.push(`/rooms/${roomSongData?.[0].room_id}`);
                        }
                      } else {
                        alert("wrong ser!!");
                      }
                    }
                  } else {
                    console.error();
                  }
                }}
              >
                <button
                  type="submit"
                  className={
                    "bg-foreground py-3 px-6 rounded-lg text-background "
                  }
                >
                  Answer
                </button>
              </form>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
