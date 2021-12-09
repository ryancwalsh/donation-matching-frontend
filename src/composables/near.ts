// Inspired by https://github.com/Learn-NEAR/NCD.L2.sample--lottery/blob/c7eef0497fa50bfdb30e8880ed6c7843d423e869/src/composables/near.js

import { useRef } from 'react';
import { wallet, CONTRACT_ID } from '../services/near';

export function useWallet() {
  const accountId = useRef('');
  accountId.current = wallet.getAccountId();

  function handleSignIn() {
    wallet.requestSignIn({
      contractId: CONTRACT_ID,
      methodNames: [], // add methods names to restrict access
    });
  }

  function handleSignOut() {
    wallet.signOut();
    accountId.current = wallet.getAccountId();
  }

  return {
    accountId,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
