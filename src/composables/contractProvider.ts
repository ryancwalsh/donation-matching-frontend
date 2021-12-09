// Inspired by https://github.com/Learn-NEAR/NCD.L2.sample--lottery/blob/c7eef0497fa50bfdb30e8880ed6c7843d423e869/src/composables/contractProvider.js

import { useRef } from 'react';

const defaultContractId = process.env.GATSBY_CONTRACT_ID;
export const storageKeyContractId = 'CONTRACT_ID';

export function useContractProvider() {
  const { localStorage, location } = window;
  const defaultContractIdRef = useRef(defaultContractId);
  const contractId = useRef(localStorage.getItem(storageKeyContractId));
  const isChangeContractIdFormOpened = useRef(false);
  !contractId.current && localStorage.setItem(storageKeyContractId, defaultContractIdRef.current);
  contractId.current = contractId.current ?? defaultContractIdRef.current;
  const inputContractId = useRef(localStorage.getItem(storageKeyContractId));

  function handleSetContractId(id: string) {
    localStorage.setItem(storageKeyContractId, id);
    contractId.current = localStorage.getItem(storageKeyContractId);
    location.reload();
  }

  function handleSetDefaultContractId() {
    localStorage.setItem(storageKeyContractId, defaultContractIdRef.current);
    contractId.current = localStorage.getItem(storageKeyContractId);
    inputContractId.current = localStorage.getItem(storageKeyContractId);
    location.reload();
  }

  return {
    defaultContractId: defaultContractIdRef,
    contractId,
    inputContractId,
    isChangeContractIdFormOpened,
    setContractId: handleSetContractId,
    setDefaultContractId: handleSetDefaultContractId,
  };
}
