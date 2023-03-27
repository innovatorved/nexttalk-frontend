import type { AppProps } from "next/app";
import Head from "next/head";

import { SessionProvider } from "next-auth/react";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

import { ApolloProvider } from "@apollo/client";
import { client } from "../graphql/apollo-client";

import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <title>NextTalk - Your Next Chat App</title>
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
            <Toaster position="bottom-right" reverseOrder={false} />
          </ChakraProvider>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}
