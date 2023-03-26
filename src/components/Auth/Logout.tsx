import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { RiLogoutCircleLine } from "react-icons/ri";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <Box position="fixed" bottom="10px" zIndex={2} title="Logout from Chat">
      <Button
        title="Logout from Chat"
        bg="#45444a"
        onClick={() => signOut()}
        width="45px"
        textAlign="center"
        mt={8}
        color="whiteAlpha.800"
        fontWeight={100}
        borderRadius="10%"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <RiLogoutCircleLine />
      </Button>
    </Box>
  );
}
