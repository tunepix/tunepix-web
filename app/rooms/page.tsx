import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export interface Room {
  id: number;
  name: string;
  desc: string;
  createdAt: Date;
  members: string[];
}

export default async function Rooms() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase.from("rooms").select();

    const rooms = data?.map((r) => ({ ...r, members: [] })) as Room[];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-3 w-full gap-8">
          {rooms.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
        <footer className="flex items-center justify-center">
          <Link href={"/rooms/new"}>
            <button className="bg-foreground py-3 px-6 rounded-lg text-background">
              Create a <strong>room</strong>
            </button>
          </Link>
        </footer>
      </div>
    );
  }

  return <div>Sign in to view rooms</div>;
}

function Room({ room }: { room: Room }) {
  return (
    <div className="rounded shadow px-6 py-4 border space-y-2 flex-1">
      <Link href={`/rooms/${room.id}`}>
        <h2 className="font-medium text-lg">{room.name}</h2>
      </Link>
      <p>{room.desc}</p>
    </div>
  );
}
