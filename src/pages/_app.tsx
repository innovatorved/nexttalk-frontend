import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';

import { SessionProvider } from 'next-auth/react';

import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';

import { ApolloProvider } from '@apollo/client';
import { client } from '../graphql/apollo-client';

import { Toaster } from 'react-hot-toast';

export default function App({
  Component,
  pageProps: { session, ...pageProps }
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
          <Script
            id="GoogleTagManager-1"
            type="text/partytown"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=G-QJ0CPLE317`}
          />
          <Script
            strategy="lazyOnload"
            id="GoogleTagManager-2"
            type="text/partytown"
          >
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QJ0CPLE317', {
          page_path: window.location.pathname,
          });
        `}
          </Script>
          <Script id="GoogleTagManager-3" type="text/partytown">
            {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PSKPFRQ')
        `}
          </Script>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}
