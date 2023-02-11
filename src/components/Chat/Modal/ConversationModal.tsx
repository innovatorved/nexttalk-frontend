import {
  CreateConversationData,
  CreateConversationProps,
  SearchUsersData,
  SearchUsersInput,
} from "@/util/types";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Stack,
  Button,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import UserOperation from "../../../graphql/operations/user";
import ConversationOperation from "../../../graphql/operations/converation";
import UserSearchList from "./UserSearchList";

import { SearchedUser } from "../../../util/types";
import Participants from "./Participants";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const router = useRouter();

  const {
    user: { id: userId },
  } = session;
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<SearchedUser[]>([]);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationProps>(
      ConversationOperation.Mutations.createConversation
    );

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    // setUsername("");
  };
  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  const handleCreateConversation = async () => {
    const participantsIds = [userId, ...participants.map((p) => p.id)];
    try {
      const { data } = await createConversation({
        variables: {
          participantsIds,
        },
      });

      if (!data?.createConversation) {
        throw new Error("Failed to Create Conversation");
      }

      const {
        createConversation: { conversationId },
      } = data;

      /**
       * use router to add query into parameter of converationId
       */

      router.push({ query: { conversationId } });

      /**
       * Clear every state on Modal
       * And Close the Modal
       */

      setParticipants([]);
      setUsername("");
      onClose();
    } catch (error: any) {
      console.log("Error at Create Conversation", error?.message);
      toast.error("Error at Create Conversation", error?.message);
    }
  };

  const [searchUsers, { data, error, loading }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperation.Queries.searchUsers);

  useEffect(() => {
    if (error) {
      toast.error(error?.message);
    }
  }, [loading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d" pb={4}>
          <ModalHeader>Create a Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button disabled={!username} isLoading={loading} type="submit">
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                participants={participants}
                users={data.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipants={removeParticipant}
                />
                <Button
                  mt={4}
                  bg="brand.100"
                  width="100%"
                  _hover={{ bg: "brand.100" }}
                  onClick={handleCreateConversation}
                  isLoading={createConversationLoading}
                >
                  Create Conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
