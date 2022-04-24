import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import supabase from "~/utils/supabase";
import withAuthRequired from "~/withAuthRequired";

type LoaderData = { channels: Array<{ id: number; title: string }> };

export const loader: LoaderFunction = async ({ request }) => {
  const { supabase, redirect } = await withAuthRequired({ request });
  if (redirect) return redirect;
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
  const location = useLocation();
  console.log(supabase.auth.user(), location);
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
        {location.pathname === "/channels" ||
        location.pathname === "/channels/" ? (
          <div className="flex-1 flex items-center justify-center text-center">
            Chose a channel
          </div>
        ) : null}
        <Outlet />
      </div>
    </div>
  );
}
