import { useEffect } from "react";
import supabase from "~/utils/supabase";

export default () => {
  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
    };

    logout();
  }, []);
  return <p>Logging out</p>;
};
