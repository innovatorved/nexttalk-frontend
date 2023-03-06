import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessageHeader from "./Messages/Header";
import MessageInput from "./Messages/Input";
import Messages from "./Messages/Messages";

interface FeedWrapperProps {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const {
    user: { id: userId },
  } = session;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
    >
      {conversationId && typeof conversationId === "string" ? (
        <>
          <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            <MessageHeader userId={userId} conversationId={conversationId} />
          </Flex>
          <Messages userId={userId} conversationId={conversationId} />
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <div>No Conversation Selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;
