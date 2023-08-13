import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AnswerSongForm } from "../_components/answer-form";

export const dynamic = "force-dynamic";

export default async function RoomSongAnswer({
  params,
}: {
  params: { roomSongId: number };
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Sign in to view room</div>;
  }

  return (
    <div className="space-y-8 text-foreground">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold ">Suggest song</h1>
        {params.roomSongId ? (
          <AnswerSongForm roomSongId={params.roomSongId} />
        ) : null}
      </div>
    </div>
  );
}
