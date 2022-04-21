import type { LoaderFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import supabase from "~/utils/supabase";

type LoaderData = {
  channel: {
    id: number;
    title: string;
    description: string;
    messages: Array<{ id: string; content: string }>;
  };
};

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

export const action = async ({ request }) => {
  const formData = await request.formData();
  const content = formData.get("content");
  const channel_id = formData.get("channelId");
  const { data, error } = await supabase
    .from("messages")
    .insert({ content, channel_id });
  if (error) {
    console.log(error);
  }

  return null;
};

export default () => {
  const { channel } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const [messages, setMessages] = useState([...channel.messages]);

  useEffect(() => {
    console.log("In effect");
    supabase
      .from(`messages:channel_id=eq.${channel.id}`)
      .on("*", (payload) => {
        console.log(payload);
        // INFO: Instead of messing around with merging arrays.
        // Remix gives use the ability to call loaders with fetchers
        // setMessages((current) => [...current, payload.new]);

        // Pass in the route that you want to call the fetcher on
        fetcher.load(`/channels/${channel.id}`);
      })
      .subscribe();
  }, [fetcher, channel.id]);

  useEffect(() => {
    if (fetcher.data) {
      // INFO: Handles new data
      setMessages([...fetcher.data.channel.messages]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    // INFO: Handles if lodaer changes - moving to a new channel
    setMessages([...channel.messages]);
  }, [channel]);

  // INFO: This is the wrong way to do it
  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   const content = formData.get("content");
  //   const { error } = await supabase
  //     .from("messages")
  //     .insert({ content, channel_id: channel.id });
  //   if (error) {
  //     console.log(error);
  //   }
  //
  //   return null;
  // };
  return (
    <>
      <h1 className="text-2xl uppercase mb-2">{channel.title}</h1>
      <p className="text-gray-600 border-b border-gray-300 pb-6">
        {channel.description}
      </p>
      <div className="flex-1 flex flex-col p-2 overflow-auto">
        <div className="mt-auto">
          {messages.map((message) => (
            <p key={message.id} className="p-2">
              {message.content}
            </p>
          ))}
        </div>
      </div>
      <Form method="post" className="flex">
        <input name="content" className="border border-gray-200 px-2 flex-1" />
        <input type="hidden" name="channelId" value={channel.id} />
        <button className="px-4 py-2 ml-4 bg-blue-200">Send!</button>
      </Form>
    </>
  );
};
