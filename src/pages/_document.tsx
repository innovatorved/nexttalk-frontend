import { Html, Head, Main, NextScript } from 'next/document';
import { Partytown } from '@builder.io/partytown/react';

export default function Document() {
  const meta = {
    title: 'NextTalk',
    description: 'Your Next Chat App',
    url: 'https://nexttalk.vedgupta.in/',
    twitter: '@innovatorved'
  };
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon-dark.ico" />
        <meta name="robots" content="follow, index" />

        <meta property="og:title" content={meta.title} />
        <meta content={meta.description} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/og-image.png" />
        <meta property="og:url" content={meta.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={meta.twitter} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content="/images/og-image.png" />

        <link
          rel="icon"
          href="/favicon.ico"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon-dark.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32-dark.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16-dark.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="manifest" href="/manifest.json"></link>
        <Partytown debug={true} forward={['dataLayer.push']} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
