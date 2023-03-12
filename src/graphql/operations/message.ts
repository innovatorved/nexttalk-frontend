import { gql } from "@apollo/client";

export const MessageFields = `
    id
    sender{
        id
        username
    }
    senderId
    body
    createdAt
`;

const MessageOperation = {
  Query: {
    messages: gql`
        query Messages($conversationId : String!){
            messages(conversationId : $conversationId){
                ${MessageFields}
            }
        }
    `,
  },
  Mutation: {
    sendMessage: gql`
      mutation SendMessage(
        $id: String!
        $conversationId: String!
        $senderId: String!
        $body: String!
      ) {
        sendMessage(
          id: $id
          conversationId: $conversationId
          senderId: $senderId
          body: $body
        )
      }
    `,
  },
  Subscription: {
    messageSend: gql`
      subscription MessageSend($conversationId: String!) {
        messageSend(conversationId: $conversationId){
            ${MessageFields}
        }
      }
    `,
  },
};

export default MessageOperation;
