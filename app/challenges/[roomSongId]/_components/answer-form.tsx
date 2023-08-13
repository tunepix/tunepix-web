"use client";

import { use, useState } from "react";
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

          const { result, error } = await resp.json();

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
            <div className="space-y-2">
              <span>Your answer is {song.title}</span>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const { data: roomSongData, error: roomSongError } =
                    await supabase
                      .from("room_songs")
                      .select()
                      .eq("id", roomSongId);

                  if (roomSongData) {
                    const { data: songData, error: songError } = await supabase
                      .from("songs")
                      .select()
                      .eq("id", roomSongData[0].song_id);

                    if (songData) {
                      if (song.title === songData[0].title) {
                        const {
                          data: { user },
                        } = await supabase.auth.getUser();

                        const {
                          data: leaderboardData,
                          error: leaderboardError,
                        } = await supabase
                          .from("leaderboard")
                          .select()
                          .eq("user_id", user?.id);

                        console.log({ leaderboardData, leaderboardError });

                        const {
                          data: leaderboardUpsertData,
                          error: leaderboardUpsertError,
                        } = await supabase.from("leaderboard").upsert({
                          id: leaderboardData?.[0]?.id,
                          user_id: user?.id,
                          score: (leaderboardData?.[0]?.score ?? 0) + 1,
                        });

                        console.log({
                          leaderboardUpsertData,
                          leaderboardUpsertError,
                        });

                        alert("You get it!!");
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
