import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

import { Session } from "next-auth";
import { useState } from "react";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState("");
  const onSubmit = async () => {
    try {
      // GraphQl mutation for username
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Center height="100vh">
      <Stack align="center" spacing={8}>
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Enter a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button width="100%" onClick={onSubmit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">NextTalk</Text>
            <Button
              onClick={() => {
                signIn("google");
              }}
              leftIcon={<Image height="20px" src="/images/google.png" />}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
