import { findRecipientImage } from "@/util/functions";
import { ConversationPopulated } from "@/util/types";
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
  onViewConversation: (conversationId: string) => void;
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
        <Text textAlign="center" color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
        <ConversationModal
          isOpen={isOpen}
          session={session}
          onClose={onClose}
        />
      </Box>
      {conversations.map((conversation) => {
        let recipitentImage = findRecipientImage(
          conversation,
          userId,
          userImage
        );
        return (
          <ConversationItem
            conversation={conversation}
            userId={userId}
            recipitentImage={recipitentImage}
            key={conversation.id}
            onClick={() => onViewConversation(conversation.id)}
            isSelected={conversation.id === router.query.conversationId}
            selectedConversationId={router.query.conversationId as string}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
