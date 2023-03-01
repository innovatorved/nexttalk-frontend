import { ConversationPopulated } from "@/util/types";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import ConversationModal from "../Modal/ConversationModal";

import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

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
      {conversations.map((conversation) => (
        <ConversationItem conversation={conversation} key={conversation.id} />
      ))}
    </Box>
  );
};

export default ConversationList;
