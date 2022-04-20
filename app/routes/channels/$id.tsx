import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import supabase from "~/utils/supabase";

type LoaderData = { channel: { id: number; title: string } };

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data: channel, error } = await supabase
    .from("channels")
    .select("id, title, description, messages(id, content)")
    .match({ id })
    .single();

  if (error) {
    console.log(error);
  }
  return {
    channel,
  };
};

export default () => {
  const { channel } = useLoaderData<LoaderData>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content");
    const { data, error } = await supabase
      .from("messages")
      .insert({ content, channel_id: channel.id });
    if (error) {
      console.log(error);
    }

    console.log(data);
  };
  return (
    <div>
      <pre>{JSON.stringify(channel, null, 2)}</pre>
      <form onSubmit={handleSubmit}>
        <input name="content" />
        <button>Send!</button>
      </form>
    </div>
  );
};
