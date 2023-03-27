import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>NextTalk - Your Next Chat App</title>
        <link rel="icon" href="/favicon-dark.ico" />
        <meta name="robots" content="follow, index" />

        <meta property="og:title" content="NextTalk" />
        <meta content="Your Next Chat App" name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/og-image.png" />
        <meta property="og:url" content="https://nexttalk.nextinnovate.tech/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@innovatorved" />
        <meta name="twitter:title" content="NextTalk" />
        <meta name="twitter:description" content="Your Next Chat App" />
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
