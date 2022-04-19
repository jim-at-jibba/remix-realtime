import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import channelData from "~/data/channels.json";

type LoaderData = { channels: Array<{ id: number; title: string }> };

export const loader: LoaderFunction = () => {
  return {
    channels: channelData,
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
