import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React from "react";
import { MessagePopulated } from "@/util/types";

interface MessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
  userImage: { [key: string]: string };
}

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: "p",
  other: "MM/dd/yy",
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  sentByMe,
  userImage,
}) => {
  return (
    <Stack
      direction="row"
      p={4}
      spacing={4}
      _hover={{ bg: "whiteAlpha.200" }}
      justify={sentByMe ? "flex-end" : "flex-start"}
      wordBreak="break-word"
    >
      {!sentByMe && (
        <Flex align="flex-end">
          <Avatar
            size="sm"
            src={`https://images.weserv.nl/?url=${
              userImage[message?.senderId]
            }`}
            referrerPolicy="no-referrer"
          />
        </Flex>
      )}
      <Stack spacing={1} width="100%">
        <Stack
          direction="row"
          align="center"
          justify={sentByMe ? "flex-end" : "flex-start"}
        >
          {!sentByMe && (
            <Text fontWeight={100} textAlign={sentByMe ? "right" : "left"}>
              {message.sender.username}
            </Text>
          )}
          <Text fontSize={10} color="whiteAlpha.700">
            {formatRelative(message.createdAt, new Date(), {
              locale: {
                ...enUS,
                formatRelative: (token) =>
                  formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                  ],
              },
            })}
          </Text>
        </Stack>
        <Flex direction="row" justify={sentByMe ? "flex-end" : "flex-start"}>
          <Box
            bg={sentByMe ? "brand.100" : "whiteAlpha.300"}
            px={2}
            py={1}
            borderRadius={9}
            maxWidth="65%"
          >
            <Text>{message.body}</Text>
          </Box>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default MessageItem;
