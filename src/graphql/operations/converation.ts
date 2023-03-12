import { gql } from "@apollo/client";
import { MessageFields } from "./message";

const ConversationFields = `
  id
  participants {
    user {
      id
      username
      image
    }
    hasSeenLatestMessage
  }
  latestMessage{
    ${MessageFields}
  }
  updatedAt
`;

const ConversationOperation = {
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
    markConversationAsRead: gql`
      mutation MarkConversationAsRead(
        $userId: String!
        $conversationId: String!
      ) {
        markConversationAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,
    deleteConversation: gql`
      mutation deleteConversation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,
    updateParticipants: gql`
      mutation UpdateParticipants(
        $conversationId: String!
        $participantIds: [String]!
      ) {
        updateParticipants(
          conversationId: $conversationId
          participantIds: $participantIds
        )
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
    conversationUpdated: gql`
    subscription ConversationUpdated {
      conversationUpdated {
        conversation {
          ${ConversationFields}
        }
        addedUserIds
        removedUserIds
      }
    }
  `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
  },
};

export default ConversationOperation;
