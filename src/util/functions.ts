import {
  ConversationsData,
  ParticipantPopulated,
  ConversationPopulated,
} from "@/util/types";

export const checkIsUserIsFromMobile = (): boolean => {
  const isMobile = window.innerWidth <= 768;
  return isMobile;
};

export const formatLatestMessage = (message: string): string => {
  return message.length > 30 ? message.slice(0, 28) + "..." : message;
};

export const formatUsernames_forFeed = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  let formattedUsernames = usernames.join(", ").slice(0, 20);

  if (usernames.join(", ").length > 20) {
    formattedUsernames += "...";
  }

  return formattedUsernames;
};

export const formatUsernames_forConversation = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);
  let formattedUsernames = usernames.join(", ");

  if (checkIsUserIsFromMobile()) {
    let SliceUsernames = formattedUsernames.slice(0, 15);
    if (formattedUsernames.length > 15) {
      SliceUsernames += "..";
    }
    return SliceUsernames;
  }

  return formattedUsernames;
};
export const userIdImageDict = (
  data: ConversationsData
): Record<string, string> => {
  return data.conversations.reduce(
    (acc: Record<string, string>, conversation) => {
      conversation.participants.forEach((participant) => {
        const { user } = participant;
        if (user.image) {
          acc[user.id] = user?.image;
        }
      });
      return acc;
    },
    {}
  );
};

export const userIdImageDict_optimized = (
  data: ConversationsData
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const conversation of data.conversations) {
    for (const participant of conversation.participants) {
      const { user } = participant;
      if (user?.image) {
        result[user.id] = user.image;
      }
    }
  }
  return result;
};

export const findRecipientImage = (
  conversation: ConversationPopulated,
  userId: string,
  userImage: { [key: string]: string }
): string | null => {
  if (conversation.participants.length !== 2) return null;
  const [
    {
      user: { id: id1 },
    },
    {
      user: { id: id2 },
    },
  ] = conversation.participants;
  const recipientId = id1 === userId ? id2 : id1;
  return recipientId in userImage ? userImage[recipientId] : null;
};

export const findRecipientImages = (
  conversation: ConversationPopulated | undefined,
  userId: string,
  userImage: { [key: string]: string }
): string[] => {
  if (conversation === undefined) return [];
  const participantIds = conversation.participants.map(
    (participant) => participant.user.id
  );
  const recipientIds = participantIds.filter((id) => id !== userId);

  return recipientIds
    .map((id) => userImage[id])
    .filter((image) => image !== undefined);
};
