"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  isValidStacksAddress,
  setRoutingRules,
  setSplitAndLockRules,
  getWalletAddress,
} from "@/lib/flowvault";

export default function CreateFlow() {
  const router = useRouter();

  const [creator, setCreator] = useState("");
  const [treasury, setTreasury] = useState("");
  const [designer, setDesigner] = useState("");
  const [amount, setAmount] = useState("10");
  const [walletAddress, setWalletAddress] = useState("");
  const [txStatus, setTxStatus] = useState("");

  const [treasuryLoading, setTreasuryLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);

  const isBusy = treasuryLoading || lockLoading;

  const connectWallet = async () => {
    try {
      const address = await getWalletAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error(error);
      alert("Wallet connection failed.");
    }
  };

  const validateTreasuryAddress = () => {
    if (!treasury.trim()) {
      alert("Please enter the Treasury / Contributor wallet address.");
      return false;
    }

    if (!isValidStacksAddress(treasury)) {
      alert("Invalid wallet address. Use a real Stacks testnet address.");
      return false;
    }

    return true;
  };

  const createTreasuryRoute = async () => {
    if (!validateTreasuryAddress()) return;

    try {
      setTreasuryLoading(true);
      setTxStatus("Waiting for wallet approval...");

      const txId = await setRoutingRules(treasury);

      if (!txId) {
        setTxStatus("Transaction submitted, but no transaction ID was returned.");
        alert("Transaction submitted, but no transaction ID was returned.");
        return;
      }

      setTxStatus("Treasury route submitted successfully.");

      router.push(`/result?amount=${amount}&txId=${txId}&primitive=treasury`);
    } catch (error) {
      console.error(error);
      setTxStatus("Treasury route failed. Please try again.");
      alert("Treasury route failed. Make sure your wallet is on Stacks Testnet.");
    } finally {
      setTreasuryLoading(false);
    }
  };

  const createLockRoute = async () => {
    if (!validateTreasuryAddress()) return;

    try {
      setLockLoading(true);
      setTxStatus("Fetching current Stacks testnet block...");

      setTxStatus("Waiting for wallet approval...");

      const result = await setSplitAndLockRules(treasury);

      if (!result.txId) {
        setTxStatus("Transaction submitted, but no transaction ID was returned.");
        alert("Transaction submitted, but no transaction ID was returned.");
        return;
      }

      setTxStatus("Lock + Treasury route submitted successfully.");

      router.push(
        `/result?amount=${amount}&txId=${result.txId}&currentBlock=${result.currentBlock}&futureBlock=${result.futureBlock}&primitive=split-lock`
      );
    } catch (error) {
      console.error(error);
      setTxStatus("Lock route failed. Please try again.");
      alert("Lock route failed. Use the Treasury Route if this fails.");
    } finally {
      setLockLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-6 sm:py-10">
      <section className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              CreatorFlow
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
              Treasury route
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Configure how funds behave after deposit using FlowVault Split
              Vault Flow and Lock Vault Flow on Stacks testnet.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <button
              onClick={connectWallet}
              className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-black transition hover:bg-orange-400"
            >
              {walletAddress ? "Wallet Connected" : "+ Connect Wallet"}
            </button>

            {walletAddress && (
              <div className="rounded-full border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm text-green-400">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)} •
                Stacks Testnet
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-black">Configure route</h2>
              <p className="mt-2 text-sm text-gray-400">
                Enter the treasury/contributor wallet that receives the routed
                USDCx flow.
              </p>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Creator / Team wallet address"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm outline-none transition focus:border-orange-500"
              />

              <input
                placeholder="Treasury / Contributor wallet address"
                value={treasury}
                onChange={(e) => setTreasury(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm outline-none transition focus:border-orange-500"
              />

              <input
                placeholder="Optional designer / team wallet address"
                value={designer}
                onChange={(e) => setDesigner(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm outline-none transition focus:border-orange-500"
              />

              <input
                placeholder="Flow amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm outline-none transition focus:border-orange-500"
              />
            </div>

            {txStatus && (
              <div className="mt-5 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-200">
                {txStatus}
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={createTreasuryRoute}
                disabled={isBusy}
                className="rounded-2xl bg-orange-500 px-5 py-4 font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {treasuryLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                    Running route...
                  </span>
                ) : (
                  "Create Treasury Route"
                )}
              </button>

              <button
                onClick={createLockRoute}
                disabled={isBusy}
                className="rounded-2xl border border-orange-500 px-5 py-4 font-black text-orange-400 transition hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {lockLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></span>
                    Locking flow...
                  </span>
                ) : (
                  "Create Lock + Treasury Route"
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-orange-500/30 bg-zinc-950 p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                    Route preview
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {amount || "0"} USDCx flow
                  </h2>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 text-right">
                  <p className="text-xs text-gray-500">Network</p>
                  <p className="font-bold text-green-400">Testnet</p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Incoming deposit
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-5xl font-black">{amount || "0"}</p>
                  <p className="font-bold text-gray-400">USDCx</p>
                </div>
              </div>

              <div className="my-5 flex justify-center">
                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-orange-500 to-green-500"></div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black">Treasury route</p>
                    <p className="text-2xl font-black">1 USDCx</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    Routed to the selected treasury/contributor wallet.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black">Lock vault flow</p>
                    <p className="text-2xl font-black">2 USDCx</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    Locked until current Stacks testnet block + 100.
                  </p>
                </div>

                <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-black">Remaining flow</p>
                    <p className="text-2xl font-black">Available</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    Remaining funds stay with the creator/team flow.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                FlowVault primitives
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="font-black">Split Vault Flow</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Routes a fixed USDCx amount to a treasury/contributor wallet.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="font-black">Lock Vault Flow</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Locks funds until a future Stacks block height.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="font-black">Programmable treasury layer</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Combines routing + lock behavior into a creator/team treasury
                    workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}