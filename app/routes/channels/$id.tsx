import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import supabase from "~/utils/supabase";

type LoaderData = { channel: { id: number; title: string } };

export const loader: LoaderFunction = async ({ params: { id } }) => {
  const { data: channel, error } = await supabase
    .from("channels")
    .select("title, description, messages(id, content)")
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
  return <p>{JSON.stringify(channel, null, 2)}</p>;
};
