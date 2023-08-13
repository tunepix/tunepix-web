import { cookies } from "next/headers";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
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

  const { data } = await supabase
    .from("rooms")
    .select()
    .eq("id", params.roomId);

  const [room] = data as Room[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold ">{room.name}</h1>
        <p>{room.desc}</p>
      </div>
      <footer>
        <Link href={`/rooms/${params.roomId}/suggest`}>
          <button className="bg-foreground py-3 px-6 rounded-lg text-background">
            Suggest song
          </button>
        </Link>
      </footer>
    </div>
  );
}
