"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  isValidStacksAddress,
  setRoutingRules,
  setSplitAndLockRules,
} from "@/lib/flowvault";

export default function CreateFlow() {
  const router = useRouter();

  const [creator, setCreator] = useState("");
  const [treasury, setTreasury] = useState("");
  const [designer, setDesigner] = useState("");
  const [amount, setAmount] = useState("10");

  const [treasuryLoading, setTreasuryLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);

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

      const txId = await setRoutingRules(treasury);

      if (!txId) {
        alert("Transaction submitted, but no transaction ID was returned.");
        return;
      }

      router.push(`/result?amount=${amount}&txId=${txId}&primitive=treasury`);
    } catch (error) {
      console.error(error);
      alert("Treasury route failed. Make sure your wallet is on Stacks Testnet.");
    } finally {
      setTreasuryLoading(false);
    }
  };

  const createLockRoute = async () => {
    if (!validateTreasuryAddress()) return;

    try {
      setLockLoading(true);

      const result = await setSplitAndLockRules(treasury);

      if (!result.txId) {
        alert("Transaction submitted, but no transaction ID was returned.");
        return;
      }

      router.push(
        `/result?amount=${amount}&txId=${result.txId}&currentBlock=${result.currentBlock}&futureBlock=${result.futureBlock}&primitive=split-lock`
      );
    } catch (error) {
      console.error(error);
      alert("Lock route failed. Use the Treasury Route if this fails.");
    } finally {
      setLockLoading(false);
    }
  };

  const isBusy = treasuryLoading || lockLoading;

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-8 sm:py-12">
      <section className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Create Treasury Route
        </h1>

        <p className="text-gray-400 mb-6">
          Route creator or team funds to a treasury/contributor wallet using
          FlowVault Split Vault Flow on Stacks testnet.
        </p>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          Wallet Connected • Stacks Testnet
        </div>

        <div className="space-y-5">
          <input
            placeholder="Creator / Team wallet address"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-orange-500"
          />

          <input
            placeholder="Treasury / Contributor wallet address"
            value={treasury}
            onChange={(e) => setTreasury(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-orange-500"
          />

          <input
            placeholder="Optional designer / team wallet address"
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-orange-500"
          />

          <input
            placeholder="Flow amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-orange-500"
          />

          <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-xl">
            <h2 className="font-semibold mb-3">Treasury Routing Rule</h2>

            <p>1 USDCx routes to the selected Treasury / Contributor wallet.</p>

            <p className="mt-2">
              Remaining funds stay with the creator/team flow.
            </p>

            <p className="text-gray-400 text-sm mt-3">
              CreatorFlow uses FlowVault Split Vault Flow as the base primitive
              for treasury and contributor payout routing.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-xl">
            <h2 className="font-semibold mb-3">Lock Flow Upgrade</h2>

            <p>2 USDCx will be locked using FlowVault Lock Vault Flow.</p>

            <p className="mt-2">
              CreatorFlow automatically fetches the current Stacks testnet block
              and sets the unlock block to current block + 100.
            </p>

            <p className="text-gray-400 text-sm mt-3">
              This demonstrates both Split Vault Flow and Lock Vault Flow.
            </p>
          </div>

          <button
            onClick={createTreasuryRoute}
            disabled={isBusy}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-black py-4 rounded-xl font-bold transition"
          >
            {treasuryLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                Creating Treasury Route...
              </span>
            ) : (
              "Create Treasury Route"
            )}
          </button>

          <button
            onClick={createLockRoute}
            disabled={isBusy}
            className="w-full border border-orange-500 hover:bg-orange-500 hover:text-black disabled:opacity-60 disabled:cursor-not-allowed text-orange-400 py-4 rounded-xl font-bold transition"
          >
            {lockLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></span>
                Creating Lock Flow...
              </span>
            ) : (
              "Create Lock + Treasury Route"
            )}
          </button>
        </div>
      </section>
    </main>
  );
}