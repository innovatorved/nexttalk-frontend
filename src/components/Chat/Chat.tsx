import { Button, Flex } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import FeedWrapper from './Feed/FeedWrapper';
import ConversationWrapper from './Conversation/ConversationWrapper';
import { Session } from 'next-auth';
import { useState } from 'react';

interface ChatProps {
  session: Session;
}

const Chat: React.FC<ChatProps> = ({ session }) => {
  const [userImage, setUserImage] = useState<{ [key: string]: string }>({});
  return (
    <Flex height="100vh">
      <ConversationWrapper
        session={session}
        userImage={userImage}
        setUserImage={setUserImage}
      />
      <FeedWrapper session={session} userImage={userImage} />
    </Flex>
  );
};

export default Chat;
