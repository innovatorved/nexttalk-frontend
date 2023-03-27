import {
  MessagesData,
  MessagesVariables,
  MessagesSubscriptionData,
} from "@/util/types";
import { useQuery } from "@apollo/client";
import { Box, Flex, Stack } from "@chakra-ui/react";

import MessageOperations from "@/graphql/operations/message";
import { toast } from "react-hot-toast";

import SkeletonLoader from "@/components/Loader/SkeletonLoader";
import MessageItem from "./MessageItem";
import { useEffect } from "react";

interface MessagesProps {
  userId: string;
  conversationId: string;
  userImage: { [key: string]: string };
}

const Messages: React.FC<MessagesProps> = ({
  userId,
  conversationId,
  userImage,
}) => {
  const subscribeToMoreMessages = (conversationId: string) => {
    return subscribeToMore({
      document: MessageOperations.Subscription.messageSend,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSend;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };
  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);

    return () => unsubscribe();
  }, [conversationId]);

  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  if (error) {
    return null;
  }

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack m={2}>
          <SkeletonLoader count={10} height="60px" width="60%" />
        </Stack>
      )}

      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            <MessageItem
              userImage={userImage}
              key={message.id}
              message={message}
              sentByMe={message.senderId === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
