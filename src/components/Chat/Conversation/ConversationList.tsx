import { findRecipientImages } from "@/util/functions";
import { ConversationPopulated, ParticipantPopulated } from "@/util/types";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import ConversationModal from "../Modal/ConversationModal";

import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  userImage: { [key: string]: string };
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  userImage,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const {
    user: { id: userId },
  } = session;

  const router = useRouter();

  const getUserParticipantObject = (conversation: ConversationPopulated) => {
    return conversation.participants.find(
      (p) => p.user.id === session.user.id
    ) as ParticipantPopulated;
  };

  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text
          textAlign="center"
          fontSize="14px"
          color="whiteAlpha.800"
          fontWeight={100}
        >
          Find or start a conversation
        </Text>
        <ConversationModal
          isOpen={isOpen}
          session={session}
          onClose={onClose}
        />
      </Box>
      {conversations.map((conversation) => {
        let recipitentImages = findRecipientImages(
          conversation,
          userId,
          userImage
        );
        const { hasSeenLatestMessage } = getUserParticipantObject(conversation);
        return (
          <ConversationItem
            conversation={conversation}
            hasSeenLatestMessage={hasSeenLatestMessage}
            userId={userId}
            recipitentImages={recipitentImages}
            key={conversation.id}
            onClick={() =>
              onViewConversation(conversation.id, hasSeenLatestMessage)
            }
            isSelected={conversation.id === router.query.conversationId}
            selectedConversationId={router.query.conversationId as string}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
