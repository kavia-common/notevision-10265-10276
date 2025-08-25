import React, { useEffect, useState } from "react";
import { Login } from "./components/Auth/Login";
import { NotesPage } from "./components/Notes/NotesPage";
import { auth } from "./utils/auth";
import { getMe } from "./utils/api";

export const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(auth.isLoggedIn());

  useEffect(() => {
    (async () => {
      if (!auth.isLoggedIn()) {
        setReady(true);
        return;
      }
      const me = await getMe();
      if (me.error) {
        setLogged(false);
      } else {
        setLogged(true);
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return logged ? <NotesPage /> : <Login onSuccess={() => setLogged(true)} />;
};
