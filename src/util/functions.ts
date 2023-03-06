import {
  ConversationsData,
  ParticipantPopulated,
  ConversationPopulated,
} from "@/util/types";

export const formatUsernames = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const usernames = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.username);

  return usernames.join(", ");
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
