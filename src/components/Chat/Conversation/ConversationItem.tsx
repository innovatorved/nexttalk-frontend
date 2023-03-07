import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React, { useState } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { ConversationPopulated } from "@/util/types";
import { formatUsernames_forFeed } from "@/util/functions";

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

interface ConversationItemProps {
  userId: string;
  conversation: ConversationPopulated;
  onClick: () => void;
  isSelected: boolean;
  recipitentImages: string[];
  // onEditConversation?: () => void;
  hasSeenLatestMessage?: boolean;
  selectedConversationId?: string;
  // onDeleteConversation?: (conversationId: string) => void;
  // onLeaveConversation?: (conversation: ConversationPopulated) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  userId,
  conversation,
  onClick,
  recipitentImages,
  isSelected,
  selectedConversationId,
  hasSeenLatestMessage,
  // onEditConversation,
  // onDeleteConversation,
  // onLeaveConversation,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === "click") {
      onClick();
    } else if (event.type === "contextmenu") {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

  const showMenu = true;
  //   onEditConversation && onDeleteConversation && onLeaveConversation;

  return (
    <Stack
      direction="row"
      align="center"
      justify="space-between"
      mt={1}
      py={2}
      pr={2}
      pl={3}
      cursor="pointer"
      borderRadius={4}
      bg={
        conversation.id === selectedConversationId ? "whiteAlpha.200" : "none"
      }
      _hover={{ bg: "whiteAlpha.200" }}
      onClick={handleClick}
      onContextMenu={handleClick}
      position="relative"
    >
      {showMenu && (
        <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          <MenuList bg="#2d2d2d">
            <MenuItem
              icon={<AiOutlineEdit fontSize={20} />}
              onClick={(event) => {
                event.stopPropagation();
                // onEditConversation();
              }}
            >
              Edit
            </MenuItem>
            {conversation.participants.length > 2 ? (
              <MenuItem
                icon={<BiLogOut fontSize={20} />}
                onClick={(event) => {
                  event.stopPropagation();
                  // onLeaveConversation(conversation);
                }}
              >
                Leave
              </MenuItem>
            ) : (
              <MenuItem
                icon={<MdDeleteOutline fontSize={20} />}
                onClick={(event) => {
                  event.stopPropagation();
                  // onDeleteConversation(conversation.id);
                }}
              >
                Delete
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}
      <Flex position="absolute" left="-1px">
        {hasSeenLatestMessage === false && (
          <GoPrimitiveDot fontSize={14} color="#6B46C1" />
        )}
      </Flex>
      <Box minW="100px">
        <AvatarGroup size="md" max={1} border="">
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

      <Flex justify="space-between" width="80%" height="100%">
        <Flex direction="column" width="70%" height="100%">
          <Text
            fontWeight={100}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {formatUsernames_forFeed(conversation.participants, userId)}
          </Text>
          {conversation.latestMessage && (
            <Box width="70%" fontSize={14}>
              <Text
                color="whiteAlpha.700"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {conversation.latestMessage.body}
              </Text>
            </Box>
          )}
        </Flex>
        <Text color="whiteAlpha.700" textAlign="right" fontSize={12}>
          {formatRelative(conversation.updatedAt, new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token) =>
                formatRelativeLocale[
                  token as keyof typeof formatRelativeLocale
                ],
            },
          })}
        </Text>
      </Flex>
    </Stack>
  );
};

export default ConversationItem;
