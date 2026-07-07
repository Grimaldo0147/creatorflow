"use client";

import { useEffect, useState } from "react";

type Flow = {
  id: string;
  type: "treasury" | "split-lock" | "deposit";
  amount: number;
  treasury: number;
  lock: number;
  remaining: number;
  txId: string;
  wallet: string;
  currentBlock?: number | null;
  futureBlock?: number | null;
  createdAt: string;
};

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);

  useEffect(() => {
    const savedFlows = JSON.parse(
      localStorage.getItem("createflow_flows") || "[]"
    );

    setFlows(savedFlows);
  }, []);

  const clearFlows = () => {
    localStorage.removeItem("createflow_flows");
    setFlows([]);
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex gap-3">
          <a href="/" className="rounded-xl border border-zinc-700 px-4 py-2 text-sm">
            Home
          </a>

          <a
            href="/create-flow"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm"
          >
            Create Flow
          </a>

          <a
            href="/flows"
            className="rounded-xl border border-orange-500 px-4 py-2 text-sm text-orange-400"
          >
            My Flows
          </a>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              Flow History
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              My Created Flows
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              View saved CreateFlow routes, deposits, transaction IDs, and
              explorer-verifiable proof.
            </p>
          </div>

          {flows.length > 0 && (
            <button
              onClick={clearFlows}
              className="rounded-2xl border border-red-500 px-5 py-3 font-black text-red-400"
            >
              Clear Local History
            </button>
          )}
        </div>

        {flows.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="text-2xl font-black">No flows saved yet</h2>

            <p className="mt-3 text-gray-400">
              Create a treasury route, lock flow, or USDCx deposit first. Your
              saved flows will appear here.
            </p>

            <a
              href="/create-flow"
              className="mt-6 inline-block rounded-2xl bg-orange-500 px-5 py-4 font-black text-black"
            >
              Create your first flow
            </a>
          </div>
        ) : (
          <div className="grid gap-5">
            {flows.map((flow) => {
              const explorerLink = `https://explorer.hiro.so/txid/${flow.txId}?chain=testnet`;

              return (
                <div
                  key={flow.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                        {flow.type === "deposit"
                          ? "USDCx Deposit"
                          : flow.type === "split-lock"
                          ? "Split + Lock Flow"
                          : "Treasury Route"}
                      </p>

                      <h2 className="mt-2 text-2xl font-black">{flow.id}</h2>

                      <p className="mt-2 text-sm text-gray-400">
                        Created: {flow.createdAt}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-green-400">
                      <p className="text-xs font-bold uppercase tracking-[0.18em]">
                        Network
                      </p>
                      <p className="font-black">Stacks Testnet</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="mt-1 text-2xl font-black">
                        {flow.amount} USDCx
                      </p>
                    </div>

                    <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4">
                      <p className="text-xs text-orange-400">Treasury</p>
                      <p className="mt-1 text-2xl font-black">
                        {flow.treasury} USDCx
                      </p>
                    </div>

                    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
                      <p className="text-xs text-purple-300">Locked</p>
                      <p className="mt-1 text-2xl font-black">
                        {flow.lock} USDCx
                      </p>
                    </div>

                    <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
                      <p className="text-xs text-green-400">Remaining</p>
                      <p className="mt-1 text-2xl font-black">
                        {flow.remaining} USDCx
                      </p>
                    </div>
                  </div>

                  {(flow.currentBlock || flow.futureBlock) && (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                        <p className="text-xs text-gray-500">Current Block</p>
                        <p className="mt-1 text-xl font-black">
                          {flow.currentBlock || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                        <p className="text-xs text-gray-500">Unlock Block</p>
                        <p className="mt-1 text-xl font-black">
                          {flow.futureBlock || "—"}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                      Transaction ID
                    </p>

                    <p className="mt-3 break-all text-sm text-white">
                      {flow.txId}
                    </p>

                    <a
                      href={explorerLink}
                      target="_blank"
                      className="mt-4 inline-block rounded-xl bg-orange-500 px-4 py-3 font-black text-black"
                    >
                      View on Hiro Explorer
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}