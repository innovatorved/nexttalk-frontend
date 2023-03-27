import { Avatar, Button, Flex, Stack, Text } from '@chakra-ui/react';
import { SearchedUser } from '../../../util/types';

interface UserSearchListProps {
  participants: Array<SearchedUser>;
  users: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
}

const UserSearchList: React.FC<UserSearchListProps> = ({
  participants,
  users,
  addParticipant
}) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text>No User Found!</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              key={user.id}
              direction="row"
              align="center"
              spacing={4}
              py={2}
              px={4}
              borderRadius={4}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              <Avatar
                src={
                  user?.image && `https://images.weserv.nl/?url=${user?.image}`
                }
                referrerPolicy="no-referrer"
              />
              <Flex justify="space-between" align="center" width="100%">
                <Text color="whiteAlpha.700">{user.username}</Text>
                {participants.some((u) => u.id === user.id) ? (
                  <Button
                    bg="brand.100"
                    _hover={{ bg: 'brand.100' }}
                    cursor="initial"
                    disabled={true}
                  >
                    Selected
                  </Button>
                ) : (
                  <Button
                    bg="brand.100"
                    _hover={{ bg: 'brand.100' }}
                    onClick={() => {
                      addParticipant(user);
                    }}
                  >
                    Select
                  </Button>
                )}
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};

export default UserSearchList;
