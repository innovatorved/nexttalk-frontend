import { useMutation } from "@apollo/client";
import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { ObjectId } from "bson";

import MessageOperations from "@/graphql/operations/message";

import { MessagesData, SendMessageArguments } from "@/util/types";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  session,
  conversationId,
}) => {
  const [message, setMessage] = useState<string>("");
  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageArguments
  >(MessageOperations.Mutation.sendMessage);

  const onSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const regex_check: RegExp = /^[^\s\0]+$/;
    if (!regex_check.test(message)) {
      toast.error("Write Something...");
      return;
    }
    try {
      const { id: senderId } = session.user;
      const messageId = new ObjectId().toString();

      const newMessage: SendMessageArguments = {
        id: messageId,
        senderId,
        conversationId,
        body: message,
      };
      setMessage("");

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: message,
                  senderId: session.user.id,
                  conversationId,
                  sender: {
                    id: session.user.id,
                    username: session.user.username,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Failed to Send Messages");
      }
    } catch (error: any) {
      console.log("On Send Message", error?.message);
      toast.error(error?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Message"
          size="md"
          resize="none"
          _focus={{
            border: "1px solid",
            borderColor: "whiteAlpha.300",
            boxShadow: "none",
          }}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
