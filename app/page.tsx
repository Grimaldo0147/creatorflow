import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-8 sm:py-12">
      <section className="max-w-4xl mx-auto min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Image
            src="/flowvault-logo.png"
            alt="FlowVault Logo"
            width={44}
            height={44}
            className="rounded-xl"
          />

          <div className="text-left">
            <p className="text-orange-400 text-sm font-semibold">
              Powered by FlowVault
            </p>
            <p className="text-gray-400 text-sm">Stacks Testnet</p>
          </div>
        </div>

        <p className="text-orange-400 font-semibold mb-4">CreatorFlow</p>

        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Programmable treasury routing for creators.
        </h1>

        <p className="text-gray-400 max-w-2xl mb-8">
          Create treasury routes, contributor splits, and lock flows using
          FlowVault primitives on Stacks testnet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/create-flow"
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-black px-6 py-4 rounded-xl font-bold transition"
          >
            Create Flow
          </Link>

          <a
            href="https://docs.flow-vault.dev"
            target="_blank"
            className="w-full sm:w-auto border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black px-6 py-4 rounded-xl font-bold transition"
          >
            FlowVault Docs
          </a>
        </div>
      </section>
    </main>
  );
}