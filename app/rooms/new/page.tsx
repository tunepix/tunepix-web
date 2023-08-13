import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function NewRoom() {
  const addRoom = async (formData: FormData) => {
    "use server";
    const name = formData.get("name");
    const desc = formData.get("desc");

    if (name) {
      // Create a Supabase client configured to use cookies
      const supabase = createServerActionClient({ cookies });

      // This assumes you have a `todos` table in Supabase. Check out
      // the `Create Table and seed with data` section of the README 👇
      // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
      await supabase.from("rooms").insert({ name, desc });

      redirect("/rooms");
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center p-10 border rounded-lg">
      <h1 className="text-3xl font-bold ">Create room</h1>
      <form action={addRoom}>
        <div className="flex flex-col gap-8 items-start ">
          <div className="flex flex-col gap-2 w-72">
            <label htmlFor="name">name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="enter room name"
              className="px-3 py-2 border shadow-inner rounded text-slate-950"
            />
          </div>
          <div className="flex flex-col gap-2 w-72">
            <label htmlFor="desc">description</label>
            <input
              type="text"
              id="desc"
              name="desc"
              placeholder="enter room description"
              className="px-3 py-2 border shadow-inner rounded text-slate-950"
            />
          </div>
          <button
            type="submit"
            className="bg-foreground py-3 px-6 rounded-lg text-background"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
