"use client";

import Link from "next/link";
import { connectWallet } from "@/lib/wallet";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="max-w-3xl text-center">

        <p className="text-orange-400 font-semibold mb-4">
          CreatorFlow
        </p>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Automate contributor payouts on Bitcoin.
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          Split creator revenue, reward contributors, and route USDCx payments using FlowVault.
        </p>

        <div className="flex items-center justify-center gap-4">

          <button
            onClick={connectWallet}
            className="bg-orange-500 hover:bg-orange-400 text-black px-8 py-4 rounded-2xl font-bold transition"
          >
            Connect Wallet
          </button>

          <Link
            href="/create-flow"
            className="border border-orange-500 hover:bg-orange-500 hover:text-black px-8 py-4 rounded-2xl font-bold transition"
          >
            Create Flow
          </Link>

        </div>

      </section>
    </main>
  );
}