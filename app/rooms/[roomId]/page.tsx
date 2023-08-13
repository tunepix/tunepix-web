import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { type Room } from "../page";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Room({ params }: { params: { roomId: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Sign in to view room</div>;
  }

  const { data: rooms } = await supabase
    .from("rooms")
    .select()
    .eq("id", params.roomId);

  const [room] = (rooms ?? []) as Room[];

  const { data: roomSongs } = await supabase
    .from("room_songs")
    .select()
    .eq("room_id", params.roomId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-b-foreground/10 pb-4">
        <h1 className="text-3xl">
          Welcome to <strong className="font-bold">{room.name}</strong> room
        </h1>
        <p>{room.desc}</p>
      </div>
      <div className="space-y-4 border-b border-b-foreground/10 pb-8">
        <h2 className="text-2xl font-medium">Active challenges</h2>
        <div className="grid grid-cols-5 gap-8">
          {roomSongs?.map((roomSong) => (
            <div key={roomSong.id} className="space-y-2">
              <img src={roomSong.song_image_src} alt="" className="w-40 h-40" />
              <button className="bg-background border rounded px-3 py-2">
                Guess the answer
              </button>
            </div>
          ))}
        </div>
      </div>
      <footer>
        <Link href={`/rooms/${params.roomId}/suggest`}>
          <button className="bg-foreground py-3 px-6 rounded-lg text-background">
            Create new challenge
          </button>
        </Link>
      </footer>
    </div>
  );
}