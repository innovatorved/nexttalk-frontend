import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
  id
  participants {
    user {
      id
      username
    }
    hasSeenLatestMessage
  }
  latestMessage{
    ${MessageFields}
  }
  updatedAt
`;

export default {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations{
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantsIds: [String]!) {
        createConversation(participantsIds: $participantsIds) {
          conversationId
        }
      }
    `,
  },
  Subscription: {
    conversationCreated: gql`
      subscription ConversationCreated{
        conversationCreated{
          ${ConversationFields}
        }
      }
    `,
  },
};
