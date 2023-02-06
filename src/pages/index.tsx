import type { NextPage } from "next";
import { useEffect, useMemo } from "react";

import { signIn, useSession, signOut } from "next-auth/react";

const Home: NextPage = () => {
  const { data, status } = useSession();

  return (
    <div>
      {data?.user?.name}
      {data?.user ? (
        <button onClick={() => signOut()}>Logout</button>
      ) : (
        <button onClick={() => signIn("google")}>SignIn</button>
      )}
    </div>
  );
};

export default Home;
