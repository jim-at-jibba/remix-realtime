import type { LoaderFunction } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import {
  Form,
  useLoaderData,
  useFetcher,
  useTransition,
} from "@remix-run/react";
import supabase from "~/utils/supabase";
import withAuthRequired from "~/withAuthRequired";

type LoaderData = {
  channel: {
    id: number;
    title: string;
    description: string;
    messages: Array<{
      id: string;
      content: string;
      like: number;
      profiles: { email: string; username: string };
    }>;
  };
};

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  const { supabase, redirect, user } = await withAuthRequired({ request });
  if (redirect) return redirect;
  const { data: channel, error } = await supabase
    .from("channels")
    .select(
      "id, title, description, messages(id, content, likes, profiles(id, email, username))"
    )
    .match({ id })
    .order("created_at", { foreignTable: "messages" })
    .single();

  if (error) {
    console.log(error);
  }
  return {
    channel,
    user,
  };
};

export const action = async ({ request }) => {
  const { supabase, redirect, user } = await withAuthRequired({ request });
  if (redirect) return redirect;
  const formData = await request.formData();
  const content = formData.get("content");
  const channel_id = formData.get("channelId");
  const { error } = await supabase
    .from("messages")
    .insert({ content, channel_id: Number(channel_id), user_id: user?.id });

  if (error) {
    console.log(error);
  }

  return null;
};

export default () => {
  const { channel, user } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const transition = useTransition();
  const formRef = useRef();
  const messagesRef = useRef();
  const [messages, setMessages] = useState([...channel.messages]);
  useEffect(() => {
    // INFO: transition tells you the state of your form
    if (transition.state !== "submitting") {
      formRef.current?.reset();
    }
  }, [transition.state]);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    // This is our realtime
    supabase
      .from(`messages:channel_id=eq.${channel.id}`)
      .on("*", (payload) => {
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

  const handleIncrementLikes = (id) => async () => {
    const { error } = await supabase.rpc("increment_likes", {
      message_id: id,
    });

    if (error) {
      console.error(error);
    }
  };

  // INFO: This is clientside only as it comes from LocalStorage.
  // Get it from the loader
  // console.log(supabase.auth.user(), user);

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
        <div className="mt-auto" ref={messagesRef}>
          {messages.length > 0 ? (
            messages.map((message) => (
              <p
                key={message.id}
                className={`p-2 ${
                  user.id === message.profiles.id ? "text-right" : ""
                }`}
              >
                {message.content}
                <span className="block text-xs text-gray-500 px-2">
                  {message.profiles.username ?? message.profiles.email}
                </span>
                <span className="block text-xs text-gray-500 px-2">
                  {message.likes} likes{" "}
                  <button onClick={handleIncrementLikes(message.id)}>
                    like
                  </button>
                </span>
              </p>
            ))
          ) : (
            <p className="font-bold text-center">Be the first to message</p>
          )}
        </div>
      </div>
      <Form method="post" className="flex" ref={formRef}>
        <input name="content" className="border border-gray-200 px-2 flex-1" />
        <input type="hidden" name="channelId" value={channel.id} />
        <button className="px-4 py-2 ml-4 bg-blue-200">Send!</button>
      </Form>
    </>
  );
};
