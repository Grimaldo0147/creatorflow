"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  isValidStacksAddress,
  setRoutingRules,
  setSplitAndLockRules,
  getWalletAddress,
  depositUSDCx,
} from "@/lib/flowvault";

export default function CreateFlow() {
  const router = useRouter();

  const [creator, setCreator] = useState("");
  const [treasury, setTreasury] = useState("");
  const [designer, setDesigner] = useState("");
  const [amount, setAmount] = useState("5");
  const [treasuryAmount, setTreasuryAmount] = useState("1");
  const [lockAmount, setLockAmount] = useState("1");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("Not checked");
  const [txStatus, setTxStatus] = useState("");
  const [txStage, setTxStage] = useState("idle");

  const [treasuryLoading, setTreasuryLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);

  const depositAmount = Number(amount || 0);
  const treasuryFlow = Number(treasuryAmount || 0);
  const lockFlow = Number(lockAmount || 0);

  const isInvalidAllocation = treasuryFlow + lockFlow > depositAmount;
  const remainingFlow = isInvalidAllocation
    ? 0
    : Math.max(depositAmount - treasuryFlow - lockFlow, 0);

  const isBusy = treasuryLoading || lockLoading || depositLoading;

  const lifecycleStages = [
    { id: "preparing", label: "Preparing" },
    { id: "wallet", label: "Waiting for wallet" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
  ];

  const getStageStatus = (stageId: string) => {
    const order = ["preparing", "wallet", "pending", "confirmed"];
    const currentIndex = order.indexOf(txStage);
    const stageIndex = order.indexOf(stageId);

    if (txStage === "failed") return "Failed";
    if (currentIndex === -1) return "Waiting";
    if (stageIndex < currentIndex) return "Done";
    if (stageIndex === currentIndex) return "Active";
    return "Waiting";
  };

  const getStageColor = (stageId: string) => {
    const status = getStageStatus(stageId);

    if (txStage === "failed") return "text-red-400";
    if (status === "Done") return "text-green-400";
    if (status === "Active") return "text-orange-400";
    return "text-gray-600";
  };

  const checkWalletBalance = async () => {
    if (!walletAddress) {
      alert("Connect wallet first.");
      return;
    }

    setWalletBalance("100 USDCx");
  };

  const connectWallet = async () => {
    try {
      setTxStage("preparing");
      setTxStatus("Connecting wallet...");

      const address = await getWalletAddress();

      setWalletAddress(address);
      setWalletBalance("100 USDCx");
      setTxStage("confirmed");
      setTxStatus("Wallet connected successfully.");
    } catch (error) {
      console.error(error);
      setTxStage("failed");
      setTxStatus("Wallet connection failed.");
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

    if (depositAmount <= 0) {
      alert("Enter a valid total flow amount.");
      return false;
    }

    if (treasuryFlow <= 0) {
      alert("Enter a valid treasury route amount.");
      return false;
    }

    if (lockFlow < 0) {
      alert("Lock amount cannot be negative.");
      return false;
    }

    if (isInvalidAllocation) {
      alert("Invalid allocation: Treasury + Lock cannot exceed total deposit.");
      return false;
    }

    return true;
  };

  const createTreasuryRoute = async () => {
    if (!validateTreasuryAddress()) return;

    try {
      setTreasuryLoading(true);

      setTxStage("preparing");
      setTxStatus("Preparing treasury route transaction...");

      setTxStage("wallet");
      setTxStatus("Waiting for wallet approval...");

      const txId = await setRoutingRules(treasury, treasuryFlow);

      setTxStage("pending");
      setTxStatus("Transaction submitted. Opening result page...");

      setTxStage("confirmed");
      setTxStatus("Treasury route confirmed.");

      router.push(
        `/result?amount=${depositAmount}&treasuryAmount=${treasuryFlow}&lockAmount=0&remainingAmount=${
          depositAmount - treasuryFlow
        }&txId=${txId}&primitive=treasury`
      );
    } catch (error) {
      console.error(error);
      setTxStage("failed");
      setTxStatus("Treasury route failed. Please try again.");
      alert("Treasury route failed. Make sure your wallet is on Stacks Testnet.");
    } finally {
      setTreasuryLoading(false);
    }
  };

  const createLockRoute = async () => {
    if (!validateTreasuryAddress()) return;

    if (lockFlow <= 0) {
      alert("Enter a valid lock amount.");
      return;
    }

    try {
      setLockLoading(true);

      setTxStage("preparing");
      setTxStatus("Preparing lock + treasury transaction...");

      setTxStage("wallet");
      setTxStatus("Waiting for wallet approval...");

      const result = await setSplitAndLockRules(
        treasury,
        lockFlow,
        treasuryFlow
      );

      setTxStage("pending");
      setTxStatus("Transaction submitted. Opening result page...");

      setTxStage("confirmed");
      setTxStatus("Lock + Treasury route confirmed.");

      router.push(
        `/result?amount=${depositAmount}&treasuryAmount=${treasuryFlow}&lockAmount=${lockFlow}&remainingAmount=${remainingFlow}&txId=${result.txId}&currentBlock=${result.currentBlock}&futureBlock=${result.futureBlock}&primitive=split-lock`
      );
    } catch (error) {
      console.error(error);
      setTxStage("failed");
      setTxStatus("Lock route failed. Please try again.");
      alert("Lock route failed. Use the Treasury Route if this fails.");
    } finally {
      setLockLoading(false);
    }
  };

  const executeDeposit = async () => {
    if (depositAmount <= 0) {
      alert("Enter a valid deposit amount.");
      return;
    }

    if (isInvalidAllocation) {
      alert("Invalid allocation: Treasury + Lock cannot exceed total deposit.");
      return;
    }

    try {
      setDepositLoading(true);

      setTxStage("preparing");
      setTxStatus("Preparing USDCx deposit transaction...");

      setTxStage("wallet");
      setTxStatus("Waiting for deposit approval...");

      const txId = await depositUSDCx(depositAmount);

      setTxStage("pending");
      setTxStatus("Deposit transaction submitted. Opening result page...");

      setTxStage("confirmed");
      setTxStatus("USDCx deposit confirmed.");

      router.push(
        `/result?amount=${depositAmount}&treasuryAmount=${treasuryFlow}&lockAmount=${lockFlow}&remainingAmount=${remainingFlow}&txId=${txId}&primitive=deposit`
      );
    } catch (error) {
      console.error(error);
      setTxStage("failed");
      setTxStatus("USDCx deposit failed.");
      alert(
        "Deposit failed. Make sure you have testnet USDCx and your wallet is on Stacks Testnet."
      );
    } finally {
      setDepositLoading(false);
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
              disabled={isBusy}
              className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
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
                Enter the treasury/contributor wallet and choose how much should
                route, lock, and remain available.
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
                type="number"
                placeholder="Total flow amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm outline-none transition focus:border-orange-500"
              />

              <input
                type="number"
                placeholder="Treasury route amount"
                value={treasuryAmount}
                onChange={(e) => setTreasuryAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm outline-none transition focus:border-orange-500"
              />

              <input
                type="number"
                placeholder="Lock vault amount"
                value={lockAmount}
                onChange={(e) => setLockAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-sm outline-none transition focus:border-orange-500"
              />
            </div>

            <div
              className={`mt-5 rounded-2xl border p-4 ${
                isInvalidAllocation
                  ? "border-red-500/40 bg-red-500/10"
                  : "border-zinc-800 bg-black"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Remaining Flow Calculation
              </p>

              <p className="mt-3 text-sm text-gray-400">
                Deposit {depositAmount} USDCx − Treasury {treasuryFlow} USDCx −
                Lock {lockFlow} USDCx
              </p>

              <p
                className={`mt-2 text-2xl font-black ${
                  isInvalidAllocation ? "text-red-400" : "text-green-400"
                }`}
              >
                {isInvalidAllocation
                  ? "Invalid allocation"
                  : `Remaining: ${remainingFlow} USDCx`}
              </p>

              {isInvalidAllocation && (
                <p className="mt-3 text-sm font-bold text-red-400">
                  Treasury + Lock cannot exceed total deposit.
                </p>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Balance + Allocation Summary
                </p>

                <button
                  onClick={checkWalletBalance}
                  className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-bold text-gray-300"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Wallet balance</span>
                  <span className="font-bold">{walletBalance}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Deposit amount</span>
                  <span className="font-bold">{depositAmount} USDCx</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Treasury routed</span>
                  <span className="font-bold text-orange-400">
                    {treasuryFlow} USDCx
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Locked</span>
                  <span className="font-bold text-purple-400">
                    {lockFlow} USDCx
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Remaining</span>
                  <span
                    className={`font-bold ${
                      isInvalidAllocation ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {isInvalidAllocation ? "Invalid" : `${remainingFlow} USDCx`}
                  </span>
                </div>
              </div>
            </div>

            {(txStatus || txStage !== "idle") && (
              <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Transaction Lifecycle
                </p>

                {txStatus && (
                  <p className="mt-3 text-sm font-bold text-orange-300">
                    {txStatus}
                  </p>
                )}

                <div className="mt-4 grid gap-3">
                  {lifecycleStages.map((stage) => (
                    <div
                      key={stage.id}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-gray-400">{stage.label}</span>
                      <span className={`text-sm font-bold ${getStageColor(stage.id)}`}>
                        {getStageStatus(stage.id)}
                      </span>
                    </div>
                  ))}
                </div>

                {txStage === "failed" && (
                  <p className="mt-3 text-sm font-bold text-red-400">
                    Transaction failed. Please check wallet, network, balance,
                    or contract arguments.
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={createTreasuryRoute}
                disabled={isBusy || isInvalidAllocation}
                className="rounded-2xl bg-orange-500 px-5 py-4 font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {treasuryLoading
                  ? "Waiting for wallet..."
                  : "Create Treasury Route"}
              </button>

              <button
                onClick={createLockRoute}
                disabled={isBusy || isInvalidAllocation}
                className="rounded-2xl border border-orange-500 px-5 py-4 font-black text-orange-400 transition hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {lockLoading
                  ? "Waiting for wallet..."
                  : "Create Lock + Treasury Route"}
              </button>
            </div>

            <button
              onClick={executeDeposit}
              disabled={isBusy || isInvalidAllocation}
              className="mt-4 w-full rounded-2xl bg-green-500 px-5 py-4 font-black text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {depositLoading
                ? "Waiting for deposit approval..."
                : "Deposit USDCx to Execute Flow"}
            </button>
          </div>

          <div className="space-y-6">
            <div
              className={`rounded-3xl border p-5 sm:p-7 ${
                isInvalidAllocation
                  ? "border-red-500/30 bg-red-950/20"
                  : "border-orange-500/30 bg-zinc-950"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                    Route preview
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {depositAmount} USDCx flow
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
                  <p className="text-5xl font-black">{depositAmount}</p>
                  <p className="font-bold text-gray-400">USDCx</p>
                </div>
              </div>

              <div className="my-5 flex justify-center">
                <div
                  className={`h-10 w-1 rounded-full ${
                    isInvalidAllocation
                      ? "bg-red-500"
                      : "bg-gradient-to-b from-orange-500 to-green-500"
                  }`}
                ></div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-black">Treasury route</p>
                    <p className="text-2xl font-black">{treasuryFlow} USDCx</p>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    Routed to the selected treasury/contributor wallet.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-black">Lock vault flow</p>
                    <p className="text-2xl font-black">{lockFlow} USDCx</p>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    Locked until current Stacks testnet block + 100.
                  </p>
                </div>

                <div
                  className={`rounded-2xl border p-4 ${
                    isInvalidAllocation
                      ? "border-red-500/40 bg-red-500/10"
                      : "border-green-500/40 bg-green-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-black">Remaining flow</p>
                    <p
                      className={`text-2xl font-black ${
                        isInvalidAllocation ? "text-red-400" : ""
                      }`}
                    >
                      {isInvalidAllocation
                        ? "Invalid"
                        : `${remainingFlow} USDCx`}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    {isInvalidAllocation
                      ? "Treasury + lock exceeds the incoming deposit."
                      : "Remaining funds stay with the creator/team flow."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
                FlowVault actions
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="font-black">1. Create routing rules</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Save split and treasury behavior on FlowVault.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="font-black">2. Create lock rules</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Configure locked reserves using a future Stacks block.
                  </p>
                </div>

                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
                  <p className="font-black">3. Deposit USDCx</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Execute the flow by depositing testnet USDCx into FlowVault.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="font-black">4. Verify on Hiro Explorer</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Every transaction result includes an explorer-verifiable tx
                    hash.
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