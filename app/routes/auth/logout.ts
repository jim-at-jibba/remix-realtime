import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/utils/cookies";

export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const cookie = await destroySession(session);

  return redirect("/login", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
};
