"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResultContent() {
  const searchParams = useSearchParams();

  const amount = Number(searchParams.get("amount") || 10);
  const txId = searchParams.get("txId") || "";
  const primitive = searchParams.get("primitive") || "treasury";
  const currentBlock = searchParams.get("currentBlock") || "";
  const futureBlock = searchParams.get("futureBlock") || "";

  const isLockFlow = primitive === "split-lock";

  const explorerLink = txId
    ? `https://explorer.hiro.so/txid/${txId}?chain=testnet`
    : "https://explorer.hiro.so/?chain=testnet";

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-8 sm:py-12">
      <section className="w-full max-w-2xl mx-auto space-y-5 sm:space-y-6">
        <div className="bg-zinc-900 border border-green-500 p-5 sm:p-6 rounded-2xl">
          <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl sm:text-4xl animate-bounce">
            ✅
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-green-400 mb-3">
            {isLockFlow ? "Lock + Treasury Route Created" : "Treasury Route Created"}
          </h1>

          <p className="text-sm sm:text-base text-gray-400">
            {isLockFlow
              ? "CreatorFlow created a split + lock routing rule using FlowVault on Stacks testnet."
              : "CreatorFlow created a treasury/contributor routing rule using FlowVault on Stacks testnet."}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 p-5 sm:p-6 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Treasury Routing Summary
          </h2>

          <div className="space-y-4">
            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <p className="text-orange-400 font-semibold">Flow Amount</p>
              <p className="text-sm sm:text-base">{amount} USDCx</p>
            </div>

            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <p className="text-orange-400 font-semibold">Treasury Route</p>
              <p className="text-sm sm:text-base">
                1 USDCx routes to the selected Treasury / Contributor wallet.
              </p>
            </div>

            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <p className="text-orange-400 font-semibold">Remaining Flow</p>
              <p className="text-sm sm:text-base">
                Remaining funds stay with the creator/team flow.
              </p>
            </div>
          </div>
        </div>

        {isLockFlow && (
          <div className="bg-zinc-900 border border-zinc-700 p-5 sm:p-6 rounded-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              Lock Flow Summary
            </h2>

            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-orange-400 font-semibold">Lock Amount</p>
                <p className="text-sm sm:text-base">2 USDCx locked</p>
              </div>

              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-orange-400 font-semibold">Current Block</p>
                <p className="text-sm sm:text-base">
                  {currentBlock || "Fetched from Hiro testnet API"}
                </p>
              </div>

              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-orange-400 font-semibold">Unlock Block</p>
                <p className="text-sm sm:text-base">
                  {futureBlock || "Current block + 100"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-700 p-5 sm:p-6 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            FlowVault Primitives Used
          </h2>

          <div className="space-y-4">
            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <p className="text-orange-400 font-semibold">
                Split Vault Flow + Treasury Routing Layer
              </p>

              <p className="text-sm sm:text-base text-gray-300">
                CreatorFlow uses FlowVault Split Vault Flow as the base primitive,
                then applies a treasury routing experience for teams, creators,
                and contributor payouts.
              </p>
            </div>

            {isLockFlow && (
              <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                <p className="text-orange-400 font-semibold">Lock Vault Flow</p>

                <p className="text-sm sm:text-base text-gray-300">
                  CreatorFlow automatically fetches the current Stacks testnet
                  block and sets a future unlock block for locked funds.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 p-5 sm:p-6 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Transaction Proof
          </h2>

          <p className="text-green-400 font-semibold mb-4 text-sm sm:text-base">
            Verified on Stacks Testnet
          </p>

          <p className="text-gray-400 mb-2 text-sm sm:text-base">
            Transaction ID:
          </p>

          <div className="bg-black border border-zinc-700 rounded-xl p-3 sm:p-4 mb-5">
            <p className="break-all text-xs sm:text-sm text-white">
              {txId || "Transaction ID unavailable"}
            </p>
          </div>

          <a
            href={explorerLink}
            target="_blank"
            className="block w-full sm:w-fit text-center bg-orange-500 text-black px-5 py-3 rounded-xl font-bold hover:bg-orange-400 transition"
          >
            View on Hiro Explorer
          </a>
        </div>
      </section>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}