import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AnswerSongForm } from "../_components/answer-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RoomSongAnswer({
  params,
}: {
  params: { roomSongId: number; roomId: number };
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Sign in to answer</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Link href={`/rooms/${params.roomId}`}>⬅️ Back to room</Link>
      </div>
      <div className="flex flex-col gap-8 items-center p-10 border rounded-lg">
        <h1 className="text-3xl font-bold">Suggest song</h1>
        {params.roomSongId ? (
          <AnswerSongForm roomSongId={params.roomSongId} />
        ) : null}
      </div>
    </div>
  );
}
