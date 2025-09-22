import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";

export default function useAuth() {
  const [user, setUser] = useState(() => getUser());

  useEffect(() => {
    const onStorage = () => setUser(getUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { user, setUser };
}
