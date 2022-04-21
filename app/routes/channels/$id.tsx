import type { LoaderFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Form, useLoaderData, useFetcher } from "@remix-run/react";
import supabase from "~/utils/supabase";

type LoaderData = {
  channel: {
    id: number;
    title: string;
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
    <div>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
      <Form method="post">
        <input name="content" />
        <input type="hidden" name="channelId" value={channel.id} />
        <button>Send!</button>
      </Form>
    </div>
  );
};
