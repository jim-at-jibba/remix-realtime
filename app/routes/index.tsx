import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-xl">Welcome to the chat</h1>
      <Link to="/channels">Go to the channels</Link>
    </div>
  );
}
