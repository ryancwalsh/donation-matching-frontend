// Inspired by https://github.com/Learn-NEAR/NCD.L2.sample--lottery/blob/c7eef0497fa50bfdb30e8880ed6c7843d423e869/src/composables/near.js

import { useRef } from 'react';
import { walletConnection, contractId } from '../services/near';

export function useWallet() {
  const accountId = useRef('');
  accountId.current = walletConnection.getAccountId();

  function handleSignIn() {
    walletConnection.requestSignIn({
      contractId,
      methodNames: [], // add methods names to restrict access
    });
  }

  function handleSignOut() {
    walletConnection.signOut();
    accountId.current = walletConnection.getAccountId();
  }

  return {
    accountId,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
