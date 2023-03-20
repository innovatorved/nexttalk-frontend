import { findRecipientImages } from "@/util/functions";
import {
  ConversationPopulated,
  ParticipantPopulated,
  DeleteConversationResponse,
  DeleteConversationVariables,
  UpdateParticipantsResponse,
  UpdateParticipantsVariables,
} from "@/util/types";
import { useMutation } from "@apollo/client";
import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import ConversationModal from "../Modal/ConversationModal";

import ConversationOperation from "@/graphql/operations/converation";

import ConversationItem from "./ConversationItem";
import { toast } from "react-hot-toast";

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

  const [deleteConversation] = useMutation<
    DeleteConversationResponse,
    DeleteConversationVariables
  >(ConversationOperation.Mutations.deleteConversation);

  const [updateParticipants, { loading: updateParticipantsLoading }] =
    useMutation<UpdateParticipantsResponse, UpdateParticipantsVariables>(
      ConversationOperation.Mutations.updateParticipants
    );

  const onDeleteConversation = async (conversationId: string) => {
    try {
      await toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            // If Susccessfully Deleted then redirect to home page
            router.push("/");
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation deleted successfully.",
          error: "Failed to delete conversation. Please try again later.",
        }
      );
    } catch (error) {
      console.error("Failed to delete conversation: ", error);
    }
  };

  const onLeaveConversation = async (conversation: ConversationPopulated) => {
    const participantIds = conversation.participants
      .filter((p) => p.user.id !== userId)
      .map((p) => p.user.id);

    try {
      const { data, errors } = await updateParticipants({
        variables: {
          conversationId: conversation.id,
          participantIds,
        },
      });

      if (errors) {
        throw new Error("Failed to update participants");
      }

      if (!data?.updateParticipants) {
        throw new Error("Failed to update participants");
      }

      toast.success("Left conversation successfully");
    } catch (error: any) {
      console.log("onUpdateConversation error", error);
      toast.error(error?.message);
    }
  };

  const onEditConversation = (conversation: ConversationPopulated) => {
    toast.error("Not implemented yet");
  };

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
            onEditConversation={() => onEditConversation(conversation)}
            onDeleteConversation={onDeleteConversation}
            onLeaveConversation={onLeaveConversation}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
