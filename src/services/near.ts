// Inspired by https://github.com/Learn-NEAR/NCD.L2.sample--lottery/blob/c7eef0497fa50bfdb30e8880ed6c7843d423e869/src/services/near.js

import { keyStores, Near, WalletConnection, Contract } from 'near-api-js';
import BN from 'bn.js';
import { storageKeyContractId } from '../composables/contractProvider';

// TODO
export const contractId = process.env.GATSBY_CONTRACT_ID;
const networkId = process.env.GATSBY_NETWORK_ID;
const nodeUrl = process.env.GATSBY_NODE_URL;
const walletUrl = process.env.GATSBY_WALLET_URL;
const gasOfferMatchingFunds = new BN(process.env.GATSBY_GAS_OFFER_MATCHING_FUNDS);
// const gas = new BN(process.env.GATSBY_GAS);

const appKeyPrefix = 'donationMatcher';

console.log({ contractId, appKeyPrefix });

const { localStorage } = window;

export const near = new Near({
  networkId,
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl,
  walletUrl,
  headers: null,
});

export const walletConnection = new WalletConnection(near, appKeyPrefix);

interface DonationMatcherContract extends Contract {
  getCommitments?: ({ recipient }) => {};
}

const contract: DonationMatcherContract = new Contract(walletConnection.account(), contractId, {
  // https://docs.near.org/docs/tutorials/contracts/guest-book#front-end-develop
  // View methods are read-only – they don't modify the state, but usually return some value
  viewMethods: ['getCommitments'],
  // Change methods can modify the state, but you don't receive the returned value when called
  changeMethods: ['offerMatchingFunds'], // TODO
  // Sender is the account ID to initialize transactions.
});

function getContractId(): string {
  return localStorage.getItem(storageKeyContractId);
}

// --------------------------------------------------------------------------
// functions to call contract Public VIEW methods
// --------------------------------------------------------------------------

export async function getCommitments(recipient: string) {
  // return walletConnection.account().viewFunction(getContractId(), 'getCommitments', { recipient });
  console.log('getCommitments', recipient);
  try {
    return contract.getCommitments({ recipient });
  } catch (e) {
    console.error('error during getCommitments', e);
  }
}

// --------------------------------------------------------------------------
// functions to call contract Public CHANGE methods
// --------------------------------------------------------------------------

export function offerMatchingFunds({ recipient, attachedDeposit }) {
  const contractId = getContractId();
  return walletConnection.account().functionCall({
    contractId,
    methodName: 'offerMatchingFunds',
    args: { recipient },
    attachedDeposit,
    gas: gasOfferMatchingFunds,
  });
}
