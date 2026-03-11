import Head from 'next/head';
import { JSX } from 'react';

/**
 * Rendered in case if we have 404 error
 */
// BEGIN CUSTOMIZATION - _XYZ convention error pages
const NotFound = (): JSX.Element => (
  <>
    <Head>
      <title>Page Not Found</title>
    </Head>
    <div style={{ padding: 10 }}>
      <h1>Page Not Found</h1>
      <p>The page you are looking for could not be found.</p>
      <a href="/">Back to Home</a>
    </div>
  </>
);
// END CUSTOMIZATION

export default NotFound;
