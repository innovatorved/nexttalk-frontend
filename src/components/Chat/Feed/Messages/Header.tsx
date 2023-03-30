import { useQuery } from '@apollo/client';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Stack,
  Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import ConversationOperations from '@/graphql/operations/converation';
import {
  checkIsUserIsFromMobile,
  findRecipientImages,
  formatUsernames_forConversation
} from '@/util/functions';
import { ConversationPopulated, ConversationsData } from '@/util/types';
import SkeletonLoader from '@/components/Helper/SkeletonLoader';
import { NEXT_PUBLIC_BASE_URL } from '@/constants';

export interface MessageHeaderProps {
  userId: string;
  conversationId: string;
  userImage: { [key: string]: string };
}

const MessageHeader: React.FC<MessageHeaderProps> = ({
  userId,
  userImage,
  conversationId
}) => {
  const router = useRouter();
  const { data, loading } = useQuery<ConversationsData, any>(
    ConversationOperations.Queries.conversations
  );

  const conversation: ConversationPopulated | undefined =
    data?.conversations.find(
      (conversation) => conversation.id === conversationId
    );

  if (data?.conversations && !loading && !conversation) {
    router.replace(NEXT_PUBLIC_BASE_URL);
    return <></>;
  }
  let recipitentImages = findRecipientImages(conversation, userId, userImage);

  return (
    <Stack
      direction="row"
      align="center"
      spacing={6}
      py={4}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
      pos="sticky"
    >
      <Button
        display={{ md: 'none' }}
        onClick={() =>
          router.replace('?conversationId', '/', {
            shallow: true
          })
        }
      >
        Back
      </Button>
      {loading && <SkeletonLoader count={1} height="30px" width="320px" />}
      {!conversation && !loading && <Text>Conversation Not Found</Text>}
      {conversation && (
        <Flex direction="row" align="center" gap="10px">
          <Text color="whiteAlpha.600">To: </Text>
          <Box minW="2px">
            <AvatarGroup size={{ base: 'sm', md: 'md' }} max={3} border="">
              {recipitentImages.map((image, id) => {
                if (id > 2) return <></>;
                return (
                  <Avatar
                    border="none"
                    key={id}
                    src={`https://images.weserv.nl/?url=${image}`}
                    referrerPolicy="no-referrer"
                  />
                );
              })}
            </AvatarGroup>
          </Box>
          <Box width="70%" fontWeight={100}>
            <Text
              marginLeft={{ sm: '5px', md: '10px' }}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {formatUsernames_forConversation(
                conversation.participants,
                userId
              )}
            </Text>
          </Box>
        </Flex>
      )}
    </Stack>
  );
};

export default MessageHeader;
