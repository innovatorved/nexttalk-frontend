import type { NextPage, NextPageContext } from 'next';

import Chat from '@/components/Chat/Chat';
import Auth from '@/components/Auth/Auth';
import StarOnGithub from '@/components/Helper/StarOnGithub';

import { useSession, getSession } from 'next-auth/react';

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const reloadSession = () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  return (
    <div>
      <StarOnGithub repoURL="innovatorved/nexttalk-frontend" />
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
      session
    }
  };
}
