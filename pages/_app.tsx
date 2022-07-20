import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import Login from "./login";
import { useEffect } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Spinner from "../components/Spinner";

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, _error] = useAuthState(auth);

  useEffect(() => {
    const setUserInfo = async () => {
      try {
        await setDoc(
          doc(db, "users", loggedInUser?.email as string),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            avatarURL: loggedInUser?.photoURL,
          },
          { merge: true }
        );
      } catch (error) {
        console.log("Error setting user infor", error);
      }
    };
    if (loggedInUser) {
      setUserInfo();
    }
  }, [loggedInUser]);

  if (loading) return <Spinner />
  if (!loggedInUser) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
