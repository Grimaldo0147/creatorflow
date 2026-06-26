"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidStacksAddress, setRoutingRules } from "@/lib/flowvault";

export default function CreateFlow() {
  const router = useRouter();

  const [creator, setCreator] = useState("");
  const [editor, setEditor] = useState("");
  const [designer, setDesigner] = useState("");
  const [amount, setAmount] = useState("10");
  const [loading, setLoading] = useState(false);

  const createFlow = async () => {
    if (!editor.trim()) {
      alert("Please enter the editor wallet address.");
      return;
    }

    if (!isValidStacksAddress(editor)) {
      alert("Invalid editor wallet address. Use a real Stacks testnet address.");
      return;
    }

    try {
      setLoading(true);

      const txId = await setRoutingRules(editor);

      if (!txId) {
        alert("Transaction submitted, but no transaction ID was returned.");
        return;
      }

      router.push(`/result?amount=${amount}&txId=${txId}`);
    } catch (error) {
      console.error(error);
      alert("Flow creation failed. Make sure your wallet is on Stacks Testnet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-8 sm:py-12">
      <section className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Create Split Flow
        </h1>

        <p className="text-gray-400 mb-6">
          Set contributor wallets and create a FlowVault split routing rule on
          Stacks testnet.
        </p>

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          Wallet Connected • Stacks Testnet
        </div>

        <div className="space-y-5">
          <input
            placeholder="Creator wallet address"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-orange-500"
          />

          <input
            placeholder="Editor wallet address"
            value={editor}
            onChange={(e) => setEditor(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-orange-500"
          />

          <input
            placeholder="Designer wallet address"
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-orange-500"
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-xl outline-none focus:border-orange-500"
          />

          <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-xl">
            <h2 className="font-semibold mb-3">FlowVault Split Rule</h2>
            <p>Split Recipient: Editor wallet</p>
            <p>Split Amount: 1 USDCx</p>
            <p className="text-gray-400 text-sm mt-2">
              Lock Vault is disabled for this testnet transaction to avoid
              invalid lock block errors.
            </p>
          </div>

          <button
            onClick={createFlow}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-black py-4 rounded-xl font-bold transition"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
                Creating Flow...
              </span>
            ) : (
              "Create Split Flow"
            )}
          </button>
        </div>
      </section>
    </main>
  );
}