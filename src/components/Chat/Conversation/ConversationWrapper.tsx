import { Box, Button, Stack } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import SkeletonLoader from "@/components/Loader/SkeletonLoader";

import { signOut } from "next-auth/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import conversationOperation from "@/graphql/operations/converation";
import { useEffect } from "react";
import {
  ConversationsData,
  ConversationPopulated,
  ParticipantPopulated,
} from "@/util/types";
import { useRouter } from "next/router";
import { userIdImageDict } from "@/util/functions";

import ConversationOperations from "@/graphql/operations/converation";
import { toast } from "react-hot-toast";

interface ConversationWrapperProps {
  session: Session;
  setUserImage: React.Dispatch<React.SetStateAction<any>>;
  userImage: { [key: string]: string };
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
  setUserImage,
  userImage,
}) => {
  const {
    data: converationsData,
    error: conversationsError,
    loading: conversationLoading,
    subscribeToMore,
  } = useQuery<ConversationsData, ConversationPopulated>(
    conversationOperation.Queries.conversations
  );
  useEffect(() => {
    if (!converationsData) return;
    const imageData = userIdImageDict(converationsData);
    setUserImage(imageData);
  }, [converationsData]);

  const router = useRouter();

  const { id: userId } = session.user;

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: true },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    router.push({ query: { conversationId } });

    /**
     * Only mark as read if conversation is unread
     */
    if (hasSeenLatestMessage) return;

    /**
     * 1. push the conversationId to the router query string
     * 2. Mark the conversation as read
     */

    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants
           * from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          /**
           * Create copy to
           * allow mutation
           */
          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          /**
           * Should always be found
           * but just in case
           */
          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update user to show latest
           * message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipants on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error) {
      console.log("onViewConversation error", error);
      toast.error("On View Conversation Error");
    }
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

  /**
   * Execute Subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      width={{ base: "100%", md: "600px" }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
      overflowY="scroll"
      display={{ base: conversationId ? "none" : "block", md: "block" }}
    >
      {conversationLoading ? (
        <Stack m={2}>
          <SkeletonLoader count={7} height="80px" width="360px" />
        </Stack>
      ) : (
        <ConversationList
          onViewConversation={onViewConversation}
          session={session}
          userImage={userImage}
          conversations={converationsData?.conversations || []}
        />
      )}

      <Button
        onClick={() => signOut()}
        width="100%"
        textAlign="center"
        mt={8}
        color="whiteAlpha.800"
        fontWeight={100}
      >
        Logout
      </Button>
    </Box>
  );
};

export default ConversationWrapper;
