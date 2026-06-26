"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResultContent() {
  const searchParams = useSearchParams();

  const amount = Number(searchParams.get("amount") || 10);
  const txId = searchParams.get("txId") || "";

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
            Flow Created Successfully
          </h1>

          <p className="text-sm sm:text-base text-gray-400">
            CreatorFlow split routing rule was created using FlowVault on
            Stacks testnet.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 p-5 sm:p-6 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Flow Summary
          </h2>

          <div className="space-y-4">
            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <p className="text-orange-400 font-semibold">Flow Amount</p>
              <p className="text-sm sm:text-base">{amount} USDCx</p>
            </div>

            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
              <p className="text-orange-400 font-semibold">Routing Action</p>
              <p className="text-sm sm:text-base">
                1 USDCx routed to the selected contributor wallet.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 p-5 sm:p-6 rounded-2xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            FlowVault Primitive Used
          </h2>

          <div className="bg-black border border-zinc-800 p-4 rounded-xl">
            <p className="text-orange-400 font-semibold">
              Split Vault Flow
            </p>

            <p className="text-sm sm:text-base text-gray-300">
              CreatorFlow uses FlowVault routing rules to automatically route
              contributor payouts on Bitcoin.
            </p>
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