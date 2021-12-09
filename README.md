This site is automatically deployed to https://ryancwalsh.github.io/donation-matching-frontend/

See https://github.com/ryancwalsh/donation-matching/ for how to deploy the contract (whose ID will then be used in an env value below).

Create a `.env.development` file with:

```
GATSBY_CONTRACT_ID=
GATSBY_NETWORK_ID=testnet
GATSBY_NODE_URL="https://rpc.testnet.near.org"
GATSBY_WALLET_URL="https://wallet.testnet.near.org"
GATSBY_GAS_OFFER_MATCHING_FUNDS=15000000000000
GATSBY_GAS=
GATSBY_SAMPLE_RECIPIENT=ryancwalsh.testnet
```

```
yarn develop
```
