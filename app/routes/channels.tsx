import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

type LoaderData = { channels: Array<{ id: number; title: string }> };

export const loader: LoaderFunction = () => {
  return {
    channels: [
      { id: 1, title: "really cool channels" },
      { id: 2, title: "more really cool channel" },
    ],
  };
};
export default function ChannelsRoute() {
  const { channels } = useLoaderData<LoaderData>();

  return channels.map((channel) => (
    <p>
      <Link to={`/channel/${channel.id}`}>{channel.title}</Link>
    </p>
  ));
}
