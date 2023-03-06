import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessageHeader from "./Messages/Header";
import MessageInput from "./Messages/Input";
import Messages from "./Messages/Messages";
import NoConversation from "./NoConversationSelected";

interface FeedWrapperProps {
  session: Session;
  userImage: { [key: string]: string };
}

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session, userImage }) => {
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
          <Flex>
            <MessageHeader userId={userId} conversationId={conversationId} />
          </Flex>

          <Messages
            userId={userId}
            userImage={userImage}
            conversationId={conversationId}
          />
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <NoConversation />
      )}
    </Flex>
  );
};

export default FeedWrapper;
