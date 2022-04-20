import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import supabase from "~/utils/supabase";

type LoaderData = { channels: Array<{ id: number; title: string }> };

export const loader: LoaderFunction = async () => {
  const { data: channels, error } = await supabase
    .from("channels")
    .select("id, title");

  if (error) {
    console.log(error.message);
  }

  return {
    channels,
  };
};

export default function ChannelsRoute() {
  const { channels } = useLoaderData<LoaderData>();
  return (
    <div>
      {channels.map((channel) => (
        <p key={channel.id}>
          <Link to={`/channels/${channel.id}`}>{channel.title}</Link>
        </p>
      ))}
      <Outlet />
    </div>
  );
}
