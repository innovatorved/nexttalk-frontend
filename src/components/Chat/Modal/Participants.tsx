import { CloseButton, Flex, Stack, Text } from '@chakra-ui/react';
import { SearchedUser } from '../../../util/types';

interface ParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipants: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  removeParticipants
}) => {
  return (
    <Flex mt={6} gap="10px" flexWrap="wrap">
      {participants.map((participant) => {
        return (
          <Stack
            key={participant.id}
            direction="row"
            align="center"
            bg="whiteAlpha.200"
            borderRadius={4}
            p={2}
          >
            <Text>{participant.username}</Text>
            <CloseButton
              size="xl"
              onClick={() => removeParticipants(participant.id)}
            />
          </Stack>
        );
      })}
    </Flex>
  );
};

export default Participants;
