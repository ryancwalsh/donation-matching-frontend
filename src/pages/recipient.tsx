import * as React from 'react';

import Layout from '../components/layout';
import Seo from '../components/seo';
import { contractId, donate, getCommitments, offerMatchingFunds, rescindMatchingFunds, walletConnection } from '../services/near';

const queryString = typeof window !== `undefined` ? window.location.search : '';
const urlParams = new URLSearchParams(queryString);
const recipient = urlParams.get('recipient');

function commitFunds(inputRef) {
  console.log('commitFunds inputRef.current.value', inputRef.current.value);
  offerMatchingFunds(recipient, inputRef.current.value).then((result) => {
    console.log('offerMatchingFunds result', result); // TODO: Show toast feedback to visitor. Re-enable the submit button.
  });
}

function rescindFunds(amountToRescindRef) {
  console.log('rescindFunds amountToRescindRef.current.value', amountToRescindRef.current.value);
  rescindMatchingFunds(recipient, amountToRescindRef.current.value).then((result) => {
    console.log('rescindMatchingFunds result', result); // TODO: Show toast feedback to visitor. Re-enable the submit button.
  });
}

function donateFunds(inputRef) {
  console.log('donateFunds inputRef.current.value', inputRef.current.value);
  donate(recipient, inputRef.current.value).then((result) => {
    console.log('donate result', result); // TODO: Show toast feedback to visitor. Re-enable the submit button.
  });
}

function SignedActions({ matcherAmounts, signOut }) {
  const amountToCommitRef = React.useRef(null);
  const amountToRescindRef = React.useRef(null);
  const amountToDonateRef = React.useRef(null);
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          // TODO: Disable the submit button.
          commitFunds(amountToCommitRef);
        }}
      >
        <input type="number" name="amountToCommit" ref={amountToCommitRef} />
        <button type="submit">Commit Funds</button>
      </form>
      {matcherAmounts && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            // TODO: Disable the submit button.
            rescindFunds(amountToRescindRef);
          }}
        >
          <input type="number" name="amountToRescind" ref={amountToRescindRef} />
          <button type="submit">Rescind Committed Funds</button>
        </form>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          // TODO: Disable the submit button.
          donateFunds(amountToDonateRef);
        }}
      >
        <input type="number" name="amountToDonate" ref={amountToDonateRef} />
        <button type="submit">Donate</button>
      </form>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
}

function signIn() {
  return walletConnection.requestSignIn({
    contractId,
    methodNames: [], // add methods names to restrict access
  });
}

function signOut() {
  console.log('signOut');
  walletConnection.signOut();
  if (typeof window !== `undefined`) {
    window.location.reload();
  }
}

function parseCommitments(commitments, recipient: string) {
  // TODO Remove this temporary function once the contract is updated to return JSON
  const lines = commitments ? commitments.split('. ') : [];
  const result = {};
  lines.forEach((line) => {
    const separator = ` is committed to match donations to ${recipient} up to a maximum of `;
    const pieces = line.split(separator);
    const matcher = pieces[0];
    const amount = pieces[1];
    result[matcher] = amount;
  });
  return result;
}

function RecipientPage() {
  const [matcherAmounts, setMatcherAmounts] = React.useState(null);
  const hasWallet = walletConnection.isSignedIn();
  const walletAccountId = walletConnection.getAccountId();

  React.useEffect(() => {
    (async function () {
      // https://stackoverflow.com/a/53572588/470749 warns about race condition
      console.log({ hasWallet, walletAccountId, recipient });
      // if (!hasWallet) {
      //   console.log('prompting signIn');
      //   signIn();
      // }
      const commitments = await getCommitments(recipient);
      const parsedCommitments = parseCommitments(commitments, recipient);
      console.log({ commitments, parsedCommitments });
      setMatcherAmounts(parsedCommitments);
    })();
  }, []);

  const matcherAmountsLabel = matcherAmounts
    ? 'These Matchers have committed to match donations up to these amounts (in yoctoNEAR):'
    : 'There are no donation matchers yet for this recipient.';

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
              <div key={matcher}>
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
