import { Text , Link } from "@chakra-ui/react";

interface MessageProps {
  text: string;
}

const replaceLinks = (text: string): React.ReactNode[] => {
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const outputNodes: React.ReactNode[] = [];
  let lastEndIndex = 0;

  text.replace(linkRegex, (match, linkUrl, linkIndex) => {
    // Add the text between the last link and this one
    if (linkIndex > lastEndIndex) {
      outputNodes.push(text.substring(lastEndIndex, linkIndex));
    }
  
    // Add the anchor tag for this link
    outputNodes.push(
      <Link fontSize={14} href={linkUrl} title={`Visit: ${linkUrl}`} key={linkIndex} isExternal>
        {linkUrl}
      </Link>
    );

    lastEndIndex = linkIndex + match.length;
    return match;
  });

  // Add the remaining text after the last link
  if (lastEndIndex < text.length) {
    outputNodes.push(text.substring(lastEndIndex));
  }

  return outputNodes;
};

const  MessageBody : React.FC<MessageProps> = ({ text })=> {
  const outputNodes = replaceLinks(text);

  return <Text>{outputNodes}</Text>;
}

export default MessageBody;
