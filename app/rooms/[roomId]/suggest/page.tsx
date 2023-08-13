import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { SuggestSongForm } from "./_components/suggest-form";

export const dynamic = "force-dynamic";

export default async function RoomSuggest({
  params,
}: {
  params: { roomId: number };
}) {
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
        <h1 className="text-3xl font-bold ">Suggest song</h1>
        {params.roomId ? <SuggestSongForm roomId={params.roomId} /> : null}
      </div>
    </div>
  );
}
