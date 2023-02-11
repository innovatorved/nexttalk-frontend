import { Box, Button } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

import { signOut } from "next-auth/react";

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      <ConversationList session={session} />
      <Button
        onClick={() => signOut()}
        width="100%"
        textAlign="center"
        mt={8}
        color="whiteAlpha.800"
        fontWeight={500}
      >
        Logout
      </Button>
    </Box>
  );
};

export default ConversationWrapper;
