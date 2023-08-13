import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import * as cheerio from "cheerio";
import { SuggestSongForm } from "./_components/suggest-form";

export const dynamic = "force-dynamic";

const ACCESS_TOKEN = `hn5eWt_C7kP8frKQnOY6GgHJWGbvOHiyq0LEi-4zccqwI5G1gL2i34REuJ8amcZn`;

export default async function RoomSuggest({
  params,
}: {
  params: { roomId: string };
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
        <SuggestSongForm />
      </div>
    </div>
  );
}
