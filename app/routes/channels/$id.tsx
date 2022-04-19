import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import channels from "~/data/channels.json";

type LoaderData = { channel: { id: number; title: string } };

export const loader: LoaderFunction = ({ params: { id } }) => {
  const channel = channels.find((c) => c.id === Number(id));

  return {
    channel,
  };
};

export default () => {
  const { channel } = useLoaderData<LoaderData>();
  return <p>{channel.title}</p>;
};
