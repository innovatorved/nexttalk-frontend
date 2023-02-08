import type { NextPage, NextPageContext } from "next";

import { useEffect, useMemo } from "react";
import Chat from "../components/Chat/Chat";
import Auth from "../components/Auth/Auth";

import { useSession, getSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <div>
      {session?.user?.username ? (
        <Chat session={session} />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
