import * as React from 'react';

import Layout from '../components/layout';
import Seo from '../components/seo';

const sampleRecipient = process.env.GATSBY_SAMPLE_RECIPIENT;

function IndexPage() {
  return (
    <Layout>
      <Seo title="Home" />
      <p>This page is just a barebones demo to prove that the underlying smart contract described at <a href="https://github.com/ryancwalsh/donation-matching">https://github.com/ryancwalsh/donation-matching</a> works.</p>
      <p>Please read the overview there and forgive the lack of guidance here.</p>
      <h1>Choose a recipient:</h1>
      <form action="recipient">
        <input type="text" name="recipient" placeholder={`AccountId, such as ${sampleRecipient}`} style={{ width: '100%' }} />
        <button type="submit">Go</button>
      </form>
    </Layout>
  );
}

export default IndexPage;
