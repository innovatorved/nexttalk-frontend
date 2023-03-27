import { useEffect } from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './ConversationList';
import SkeletonLoader from '@/components/Loader/SkeletonLoader';
import Logout from '@/components/Auth/Logout';

import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import conversationOperation from '@/graphql/operations/converation';
import MessageOperations from '@/graphql/operations/message';

import {
  ConversationsData,
  ConversationDeletedData,
  ConversationPopulated,
  ParticipantPopulated,
  ConversationUpdatedData,
  MessagesData
} from '@/util/types';
import { useRouter } from 'next/router';
import { userIdImageDict } from '@/util/functions';

import ConversationOperations from '@/graphql/operations/converation';
import { toast } from 'react-hot-toast';

interface ConversationWrapperProps {
  session: Session;
  setUserImage: React.Dispatch<React.SetStateAction<any>>;
  userImage: { [key: string]: string };
}

const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
  setUserImage,
  userImage
}) => {
  const router = useRouter();
  const { id: userId } = session.user;
  const { conversationId } = router?.query;

  const {
    data: converationsData,
    error: conversationsError,
    loading: conversationLoading,
    subscribeToMore
  } = useQuery<ConversationsData, ConversationPopulated>(
    conversationOperation.Queries.conversations
  );
  useEffect(() => {
    if (!converationsData) return;
    const imageData = userIdImageDict(converationsData);
    setUserImage(imageData);
  }, [converationsData]);

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: true },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  /**
   * Subscriptions
   */
  useSubscription<ConversationUpdatedData, any>(
    ConversationOperations.Subscription.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: {
            conversation: updatedConversation,
            addedUserIds,
            removedUserIds
          }
        } = subscriptionData;

        const { id: updatedConversationId, latestMessage } =
          updatedConversation;

        /**
         * Check if user is being removed
         */
        if (removedUserIds && removedUserIds.length) {
          const isBeingRemoved = removedUserIds.find((id) => id === userId);

          if (isBeingRemoved) {
            const conversationsData = client.readQuery<ConversationsData>({
              query: ConversationOperations.Queries.conversations
            });

            if (!conversationsData) return;

            client.writeQuery<ConversationsData>({
              query: ConversationOperations.Queries.conversations,
              data: {
                conversations: conversationsData.conversations.filter(
                  (c) => c.id !== updatedConversationId
                )
              }
            });

            if (conversationId === updatedConversationId) {
              router.replace(
                typeof process.env.NEXT_PUBLIC_BASE_URL === 'string'
                  ? process.env.NEXT_PUBLIC_BASE_URL
                  : ''
              );
            }

            /**
             * Early return - no more updates required
             */
            return;
          }
        }

        /**
         * Check if user is being added to conversation
         */
        if (addedUserIds && addedUserIds.length) {
          const isBeingAdded = addedUserIds.find((id) => id === userId);

          if (isBeingAdded) {
            const conversationsData = client.readQuery<ConversationsData>({
              query: ConversationOperations.Queries.conversations
            });

            if (!conversationsData) return;

            client.writeQuery<ConversationsData>({
              query: ConversationOperations.Queries.conversations,
              data: {
                conversations: [
                  ...(conversationsData.conversations || []),
                  updatedConversation
                ]
              }
            });
          }
        }

        /**
         * Already viewing conversation where
         * new message is received; no need
         * to manually update cache due to
         * message subscription
         */
        if (updatedConversationId === conversationId) {
          onViewConversation(conversationId, false);
          return;
        }

        const existing = client.readQuery<MessagesData>({
          query: MessageOperations.Query.messages,
          variables: { conversationId: updatedConversationId }
        });

        if (!existing) return;

        /**
         * Check if lastest message is already present
         * in the message query
         */
        const hasLatestMessage = existing.messages.find(
          (m) => m.id === latestMessage.id
        );

        /**
         * Update query as re-fetch won't happen if you
         * view a conversation you've already viewed due
         * to caching
         */
        if (!hasLatestMessage) {
          client.writeQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId: updatedConversationId },
            data: {
              ...existing,
              messages: [latestMessage, ...existing.messages]
            }
          });
        }
      }
    }
  );

  useSubscription<ConversationDeletedData, any>(
    ConversationOperations.Subscription.conversationDeleted,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const existing = client.readQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations
        });

        if (!existing) return;

        const { conversations } = existing;
        const {
          conversationDeleted: { id: deletedConversationId }
        } = subscriptionData;

        client.writeQuery<ConversationsData>({
          query: ConversationOperations.Queries.conversations,
          data: {
            conversations: conversations.filter(
              (conversation) => conversation.id !== deletedConversationId
            )
          }
        });
      }
    }
  );

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
          conversationId
        },
        optimisticResponse: {
          markConversationAsRead: true
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
            `
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
            hasSeenLatestMessage: true
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
              participants
            }
          });
        }
      });
    } catch (error) {
      console.log('onViewConversation error', error);
      toast.error('On View Conversation Error');
    }
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: conversationOperation.Subscription.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev?.conversations]
        });
      }
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
      width={{ base: '100%', md: '600px' }}
      bg="whiteAlpha.50"
      py={6}
      px={3}
      pb="30px"
      overflowY="scroll"
      display={{ base: conversationId ? 'none' : 'block', md: 'block' }}
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

      <Logout />
    </Box>
  );
};

export default ConversationWrapper;
