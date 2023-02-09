import { Session } from "next-auth";

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

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationProps {
  participantsIds: Array<string>;
}
