import { Box, Button } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

import { signOut } from "next-auth/react";
import { useQuery } from "@apollo/client";
import conversationOperation from "@/graphql/operations/converation";
import { useEffect } from "react";
import { ConversationsData, ConversationPopulated } from "@/util/types";
import { useRouter } from "next/router";

interface ConversationWrapperProps {
  session: Session;
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  const {
    data: converationsData,
    error: conversationsError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, ConversationPopulated>(
    conversationOperation.Queries.conversations
  );

  const router = useRouter();
  const onViewConversation = async (conversationId: string) => {
    /**
     * 1. push the conversationId to the router query string
     * 2. Mark the conversation as read
     */

    router.push({ query: { conversationId } });
  };
  const { conversationId } = router?.query;

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: conversationOperation.Subscription.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev?.conversations],
        });
      },
    });
  };

  useEffect(() => {
    console.log(converationsData);
  }, [converationsData]);

  /**
   * Execute Subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
      display={{ base: conversationId ? "none" : "block", md: "block" }}
    >
      <ConversationList
        onViewConversation={onViewConversation}
        session={session}
        conversations={converationsData?.conversations || []}
      />
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
