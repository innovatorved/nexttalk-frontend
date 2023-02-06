import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../chakra/theme";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
