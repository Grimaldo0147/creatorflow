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
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-6 sm:py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
              On-chain proof
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
              {isLockFlow ? "Lock route created" : "Treasury route created"}
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              CreatorFlow submitted a real FlowVault transaction on Stacks
              testnet with explorer-verifiable proof.
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 px-5 py-4 text-green-400">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              Status
            </p>
            <p className="mt-1 text-2xl font-black">Submitted</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-green-500/30 bg-zinc-950 p-5 sm:p-7 shadow-2xl">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-4xl">
                ✅
              </div>

              <h2 className="text-3xl font-black">
                Flow executed successfully
              </h2>

              <p className="mt-3 text-gray-400">
                {isLockFlow
                  ? "Split Vault Flow and Lock Vault Flow were combined into one programmable treasury route."
                  : "Split Vault Flow was used to create a programmable treasury route."}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Flow amount
                  </p>
                  <p className="mt-2 text-3xl font-black">{amount}</p>
                  <p className="text-sm text-gray-400">USDCx</p>
                </div>

                <div className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                    Treasury route
                  </p>
                  <p className="mt-2 text-3xl font-black">1</p>
                  <p className="text-sm text-gray-400">USDCx routed</p>
                </div>

                <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-300">
                    Lock vault
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {isLockFlow ? "2" : "—"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isLockFlow ? "USDCx locked" : "Not used"}
                  </p>
                </div>
              </div>
            </div>

            {isLockFlow && (
              <div className="rounded-3xl border border-purple-500/30 bg-zinc-950 p-5 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  Lock flow summary
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Dynamic unlock schedule
                </h2>

                <p className="mt-2 text-gray-400">
                  CreatorFlow fetched the latest Stacks testnet block and
                  generated a future unlock block automatically.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                    <p className="text-gray-500">Current Block</p>
                    <p className="mt-2 break-all text-2xl font-black">
                      {currentBlock || "Fetched from Hiro API"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                    <p className="text-gray-500">Unlock Block</p>
                    <p className="mt-2 break-all text-2xl font-black">
                      {futureBlock || "Current block + 100"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                FlowVault primitives used
              </p>

              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4">
                  <p className="font-black">Split Vault Flow</p>
                  <p className="mt-1 text-sm text-gray-300">
                    Routes a fixed USDCx amount to the selected treasury or
                    contributor wallet.
                  </p>
                </div>

                {isLockFlow && (
                  <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
                    <p className="font-black">Lock Vault Flow</p>
                    <p className="mt-1 text-sm text-gray-300">
                      Locks part of the flow until a future Stacks block height.
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="font-black">Treasury routing layer</p>
                  <p className="mt-1 text-sm text-gray-400">
                    CreatorFlow combines FlowVault primitives into a creator/team
                    treasury experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                Transaction proof
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Verified on Stacks Testnet
              </h2>

              <p className="mt-3 text-sm text-gray-400">
                This transaction can be audited directly on Hiro Explorer.
              </p>

              <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Transaction ID
                </p>

                <p className="mt-3 break-all text-sm text-white">
                  {txId || "Transaction ID unavailable"}
                </p>
              </div>

              <a
                href={explorerLink}
                target="_blank"
                className="mt-5 block w-full rounded-2xl bg-orange-500 px-5 py-4 text-center font-black text-black transition hover:bg-orange-400"
              >
                View on Hiro Explorer
              </a>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Route type
              </p>

              <p className="mt-3 text-3xl font-black">
                {isLockFlow ? "Split + Lock" : "Treasury Split"}
              </p>

              <p className="mt-3 text-sm text-gray-400">
                {isLockFlow
                  ? "Best demo flow: shows composability across split routing and lock behavior."
                  : "Fast treasury route using FlowVault Split Vault Flow."}
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Network
              </p>

              <p className="mt-3 text-3xl font-black text-green-400">
                Testnet
              </p>

              <p className="mt-3 text-sm text-gray-400">
                Built for FlowVault bounty using real Stacks testnet
                transactions.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="bg-black p-10 text-white">Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}