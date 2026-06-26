# CreatorFlow

Programmable treasury routing and lock flows built on Bitcoin using FlowVault primitives on Stacks.

---

# CreatorFlow

CreatorFlow enables creators, teams, and DAOs to define how funds behave after deposit using programmable treasury routing and lock flows powered by FlowVault on Stacks.

The project combines:

* Split Vault Flow
* Lock Vault Flow
* Treasury Routing
* Dynamic Unlock Logic
* Real On-Chain Transactions
* Explorer-Verifiable Proof

Built for the FlowVault Builder Bounty on Stacks.

---

# Live Demo

```bash
https://your-vercel-url.vercel.app
```

---

# GitHub Repository

```bash
https://github.com/Grimaldo0147/creatorflow
```

---

# Problem

Most creator teams, contributor groups, and DAOs still manage treasury allocation manually.

Funds are often:

* manually distributed
* poorly tracked
* difficult to lock or reserve
* not programmable after deposit

CreatorFlow solves this by enabling programmable treasury behavior directly on Bitcoin using FlowVault primitives on Stacks.

---

# Core Features

## Treasury Routing

Automatically route part of a flow to a treasury or contributor wallet.

Example:

* 1 USDCx → Treasury
* Remaining funds → Creator flow

---

## Lock Vault Flow

Lock part of the treasury flow until a future Stacks block height.

CreatorFlow automatically:

* fetches the current Stacks testnet block
* generates a future unlock block
* configures the lock behavior

---

## Route Preview UI

Visual flow preview showing:

* treasury allocation
* lock allocation
* remaining flow
* programmable behavior

---

## Wallet Connection

Real-time Stacks wallet connection using Leather Wallet.

Displays:

* wallet connected state
* active testnet address badge

---

## Transaction Status Experience

CreatorFlow provides real transaction states:

* waiting for approval
* transaction pending
* submitted successfully
* explorer verification

---

## On-Chain Proof Dashboard

Every successful route includes:

* transaction hash
* Hiro Explorer verification
* route summary
* primitive summary
* unlock schedule
* network status

---

# FlowVault Primitives Used

## Split Vault Flow

Used as the base primitive for:

* treasury routing
* contributor allocation
* programmable payout behavior

---

## Lock Vault Flow

Used for:

* future unlock scheduling
* reserve treasury behavior
* delayed access to funds

---

## Combined Primitive Behavior

CreatorFlow combines:

* Split Vault Flow
* Lock Vault Flow

into one programmable treasury workflow.

This demonstrates composability across FlowVault primitives.

---

# How It Works

## Treasury Route Flow

1. User connects wallet
2. User enters treasury/contributor wallet
3. CreatorFlow configures routing behavior
4. User signs transaction
5. Transaction submits on-chain
6. Result page displays explorer-verifiable proof

---

## Lock + Treasury Flow

1. CreatorFlow fetches current Stacks block
2. Future unlock block is generated automatically
3. Split + Lock behavior is configured
4. User signs transaction
5. FlowVault executes programmable behavior
6. Result dashboard displays unlock schedule and proof

---

# Screenshots

Add screenshots before final submission.

Recommended screenshots:

* Homepage
* Create Flow page
* Route Preview section
* Lock Flow section
* Wallet Connected badge
* Result Dashboard
* Hiro Explorer successful tx

---

# Demo Video

Add Loom or YouTube demo link here.

Recommended demo:

* connect wallet
* create treasury route
* create lock flow
* show tx states
* show successful Hiro tx proof

---

# Tech Stack

* Next.js 16
* TypeScript
* TailwindCSS
* Stacks.js
* FlowVault
* Leather Wallet
* Hiro APIs
* Vercel

---

# Local Development

Clone repository:

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

# Production Build

```bash
npm run build
```

---

# Real Transaction Proof

CreatorFlow executes real transactions on Stacks testnet using FlowVault primitives.

Transactions are:

* explorer-verifiable
* auditable
* on-chain

via Hiro Explorer.

---

# Future Roadmap

Future improvements include:

* recurring automated payouts
* advanced treasury automation
* AI-triggered routing behavior
* contributor payroll systems
* multi-wallet treasury logic
* DAO treasury integrations
* analytics dashboards
* unlock countdown systems
* stablecoin streaming

---

# Why CreatorFlow Matters

CreatorFlow demonstrates how programmable financial behavior can be built on Bitcoin using FlowVault primitives.

Instead of simple transfers, funds can now:

* split automatically
* lock automatically
* route automatically
* behave dynamically after deposit

This unlocks programmable treasury infrastructure for creators, teams, and DAOs on Stacks.

---

# Built For

FlowVault Builder Bounty
Stacks Ecosystem
Programmable Bitcoin Finance

---

# Author

Grimaldo.btc

X:

```bash
https://x.com/GrimaldoRemade
```
