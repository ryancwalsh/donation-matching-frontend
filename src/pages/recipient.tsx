import * as React from 'react';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { useWallet } from '../composables/near';
import { getCommitments } from '../services/near';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function SignedActions({ matcherAmounts, signOut }) {
  return (
    <div>
      <div>
        <input type="number" name="amountToCommit" />
        <button type="submit">Commit Funds</button>
      </div>
      {matcherAmounts && (
        <div>
          <input type="number" name="amountToRescind" />
          <button type="submit">Rescind Committed Funds</button>
        </div>
      )}
      <div>
        <input type="number" name="amountToDonate" />
        <button type="submit">Donate</button>
      </div>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
}

function RecipientPage() {
  const [matcherAmounts, setMatcherAmounts] = React.useState(null);
  const { accountId, signIn, signOut } = useWallet();

  React.useEffect(() => {
    (async function () {
      // https://stackoverflow.com/a/53572588/470749 warns about race condition
      console.log({ accountId, recipient });
      const commitments = await getCommitments(recipient);
      console.log({ commitments });
      setMatcherAmounts(commitments);
    })();
  }, []);

  const recipient = urlParams.get('recipient');

  const matcherAmountsLabel = matcherAmounts
    ? 'These Matchers have committed to match donations up to these amounts (in yoctoNEAR):'
    : 'There are no donation matchers yet for this recipient.';
  const hasWallet = Boolean(accountId.current);
  return (
    <Layout>
      <Seo title="Recipient" />
      <div style={{ fontSize: '2em' }}>
        <strong>Recipient:</strong> {recipient}
      </div>
      <div style={{ border: '1px dashed #ccc', padding: '10px', margin: '20px 0' }}>
        <h3>{matcherAmountsLabel}</h3>
        {matcherAmounts &&
          Object.keys(matcherAmounts).map((matcher) => {
            return (
              <div>
                <label>{matcher}:</label> {matcherAmounts[matcher]}
              </div>
            );
          })}
      </div>
      {hasWallet ? (
        <SignedActions matcherAmounts={matcherAmounts} signOut={signOut} />
      ) : (
        <div>
          Please connect your wallet. <button onClick={signIn}>Sign In</button>
        </div>
      )}
    </Layout>
  );
}

export default RecipientPage;
