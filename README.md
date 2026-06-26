
# CreatorFlow

Programmable treasury routing and lock flows built on Bitcoin using FlowVault primitives on Stacks.

---

## Overview

CreatorFlow is a FlowVault-powered application that enables creators, teams, DAOs, and contributors to create programmable money flows on Bitcoin.

The app demonstrates how FlowVault primitives can be combined to build real-world treasury and contributor payout systems on Stacks.

CreatorFlow currently supports:

* Treasury Routing
* Split Vault Flow
* Lock Vault Flow
* Automatic future unlock block generation
* Real on-chain transactions on Stacks Testnet
* Hiro Explorer transaction verification

---

## Problem

Managing contributor payouts, treasury routing, and locked team allocations manually is inefficient and difficult for creators and small teams.

CreatorFlow simplifies this by enabling programmable routing and lock flows directly on-chain using FlowVault primitives.

---

## Features

### Treasury Routing

Route part of incoming funds to a treasury or contributor wallet.

### Lock Flow

Automatically lock part of the flow until a future Stacks block height.

### Dynamic Block Height Fetching

The app fetches the latest Stacks testnet block automatically using Hiro APIs and generates a future unlock block.

### Real On-Chain Transactions

Transactions are submitted directly to Stacks Testnet through Leather Wallet.

### Hiro Explorer Verification

Every transaction includes a real Hiro Explorer verification link.

### Mobile Responsive UI

Optimized for both desktop and mobile experiences.

---

# FlowVault Primitives Used

## Split Vault Flow

Used as the base routing primitive for treasury and contributor payouts.

## Lock Vault Flow

Used to lock funds until a future Stacks block height.

---

## Tech Stack

* Next.js 16
* TypeScript
* TailwindCSS
* Stacks.js
* FlowVault
* Hiro APIs
* Leather Wallet
* Vercel

---

## How It Works

### Treasury Route Flow

1. User enters treasury/contributor wallet
2. App creates FlowVault routing rules
3. Transaction is signed with Leather Wallet
4. Transaction is broadcast to Stacks Testnet
5. Result page displays transaction proof and Hiro Explorer link

### Lock + Treasury Flow

1. App fetches latest Stacks testnet block height
2. Future unlock block is automatically generated
3. Lock Vault Flow is combined with Split Vault Flow
4. Transaction is signed and submitted on-chain
5. Unlock block and transaction proof are displayed

---

## Screenshots

Add screenshots here before submission.

Suggested screenshots:

* Create Flow page
* Treasury Route success page
* Lock Flow success page
* Hiro Explorer successful transaction

---

## Live Demo

Add your deployed Vercel link here.

Example:

```bash
https://creatorflow.vercel.app
```

---

## GitHub Repository

```bash
https://github.com/Grimaldo0147/creatorflow
```

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/Grimaldo0147/creatorflow.git
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Build Production Version

```bash
npm run build
```

---

## Future Improvements

* Multi-contributor payout routing
* Adjustable treasury percentages
* Recurring payout automation
* Unlock countdown timers
* Mainnet deployment
* DAO treasury integrations
* Stablecoin streaming
* Advanced vault analytics

---

## Demo Transaction Proof

CreatorFlow successfully submits real transactions on Stacks Testnet using FlowVault primitives.

Transactions are verifiable through Hiro Explorer.

---

## Built For

FlowVault Builder Bounty
Built on Stacks
Programmable Money Flows on Bitcoin

---

## Author

Grimaldo.btc

X:

```bash
https://x.com/GrimaldoRemade
```
