import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";
import supabase from "~/utils/supabase";
import styles from "~/styles/app.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
export const loader = () => {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  };
};

export default function App() {
  const { env } = useLoaderData();
  const fetcher = useFetcher();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // call auth/login
        fetcher.submit(
          {
            accessToken: session.access_token,
          },
          {
            method: "post",
            action: "/auth/login",
          }
        );
      }

      if (event === "SIGNED_OUT") {
        // call auth/logout
        fetcher.submit(null, {
          method: "post",
          action: "/auth/logout",
        });
      }
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
