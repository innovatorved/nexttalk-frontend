import { Session } from "next-auth";
import { Prisma } from "@prisma/client";

/**
 * User types
 */
export interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

export interface CreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
  image: string;
}

/**
 * Conversation Types
 */

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

export interface ConversationsData {
  conversations: Array<ConversationPopulated>;
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationProps {
  participantsIds: Array<string>;
}

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

/**
 * Message
 */
export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;

export interface MessagesData {
  messages: Array<MessagePopulated>;
}
export interface MessagesVariables {
  conversationId: string;
}

export interface SendMessageArguments {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}
