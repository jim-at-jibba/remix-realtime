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
  console.log(supabase.auth.user());
  return (
    <div className="h-screen flex">
      <div className="bg-gray-800 text-white w-40 p-8">
        {channels.map((channel) => (
          <p key={channel.id}>
            <span className="text-gray-400 mr-1">#</span>
            <Link to={`/channels/${channel.id}`}>{channel.title}</Link>
          </p>
        ))}
      </div>
      <div className="flex-1 p-8 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
