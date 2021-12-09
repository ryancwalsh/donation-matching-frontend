import * as React from 'react';

import Layout from '../components/layout';
import Seo from '../components/seo';

const sampleRecipient = process.env.GATSBY_SAMPLE_RECIPIENT;

function IndexPage() {
  return (
    <Layout>
      <Seo title="Home" />
      <h1>Choose a recipient:</h1>
      <form action="recipient">
        <input type="text" name="recipient" placeholder={`AccountId, such as ${sampleRecipient}`} style={{ width: '100%' }} />
        <button type="submit">Go</button>
      </form>
    </Layout>
  );
}

export default IndexPage;
