// Inspired by https://github.com/Learn-NEAR/NCD.L2.sample--lottery/blob/c7eef0497fa50bfdb30e8880ed6c7843d423e869/src/services/near.js

import { keyStores, Near, WalletConnection } from 'near-api-js';
import BN from 'bn.js';
import { storageKeyContractId } from '../composables/contractProvider';

// TODO
export const CONTRACT_ID = process.env.GATSBY_CONTRACT_ID;
const networkId = process.env.GATSBY_NETWORK_ID;
const nodeUrl = process.env.GATSBY_NODE_URL;
const walletUrl = process.env.GATSBY_WALLET_URL;
const gasOfferMatchingFunds = new BN(process.env.GATSBY_GAS_OFFER_MATCHING_FUNDS);
// const gas = new BN(process.env.GATSBY_GAS);

const appKeyPrefix = 'donationMatcher';

const { localStorage } = window;

export const near = new Near({
  networkId,
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl,
  walletUrl,
  headers: null,
});

export const wallet = new WalletConnection(near, appKeyPrefix);

function getContractId(): string {
  return localStorage.getItem(storageKeyContractId);
}

// --------------------------------------------------------------------------
// functions to call contract Public VIEW methods
// --------------------------------------------------------------------------

export function getCommitments(recipient: string) {
  return wallet.account().viewFunction(getContractId(), 'getCommitments', { recipient });
}

// --------------------------------------------------------------------------
// functions to call contract Public CHANGE methods
// --------------------------------------------------------------------------

export function offerMatchingFunds({ recipient, attachedDeposit }) {
  const contractId = getContractId();
  return wallet.account().functionCall({
    contractId,
    methodName: 'offerMatchingFunds',
    args: { recipient },
    attachedDeposit,
    gas: gasOfferMatchingFunds,
  });
}
