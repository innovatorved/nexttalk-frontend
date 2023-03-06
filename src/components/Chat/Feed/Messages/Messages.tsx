import { MessagesData, MessagesVariables } from "@/util/types";
import { useQuery } from "@apollo/client";
import { Box, Flex, Stack } from "@chakra-ui/react";

import MessageOperations from "@/graphql/operations/message";
import { toast } from "react-hot-toast";

import SkeletonLoader from "@/components/Loader/SkeletonLoader";
import MessageItem from "./MessageItem";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
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
          <SkeletonLoader count={4} height="60px" width="60%" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            <MessageItem
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
