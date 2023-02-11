import {
  Avatar,
  Button,
  Center,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";

import { useEffect, useState } from "react";

import UserOperations from "../../graphql/operations/user";
import { useMutation } from "@apollo/client";

import { toast } from "react-hot-toast";

import {
  IAuthProps,
  CreateUsernameData,
  CreateUsernameVariables,
} from "../../util/types";

const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {
  const [username, setUsername] = useState<string>("");

  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;
    try {
      // GraphQl mutation for username
      const { data } = await createUsername({ variables: { username } });
      if (!data?.createUsername) {
        throw new Error("Error Occurred in Saving Username");
      }
      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      // reload session to add new Username
      reloadSession();
      toast.success("Username Added!");
    } catch (error: any) {
      toast.error(error?.message);
      console.log(error?.message);
    }
  };
  return (
    <Center height="100vh">
      <Stack align="center" spacing={8}>
        {session ? (
          <>
            <Text fontSize="3xl">
              Create a Username
              <Avatar
                ml={2}
                src={`https://images.weserv.nl/?url=${session?.user?.image}`}
                referrerPolicy="no-referrer"
              />
            </Text>
            <Input
              placeholder="Enter a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button width="100%" onClick={onSubmit} isLoading={loading}>
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
