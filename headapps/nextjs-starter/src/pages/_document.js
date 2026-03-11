// CUSTOMIZATION (whole file) - For the different header/footer per industry vertical hack
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="/api/domainStylesheet" />
      </Head>
      <body className="no-js">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
