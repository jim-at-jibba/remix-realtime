import { createClient } from "@supabase/supabase-js";

const isServer = typeof window === "undefined";

// process is only available on the server
// these can be made available in the browser in a loader
const supabaseUrl = isServer
  ? process.env.SUPABASE_URL
  : window.env.SUPABASE_URL;
const supabaseKey = isServer
  ? process.env.SUPABASE_KEY
  : window.env.SUPABASE_KEY;

export default createClient(supabaseUrl, supabaseKey);
