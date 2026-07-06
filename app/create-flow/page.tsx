"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  isValidStacksAddress,
  setRoutingRules,
  setSplitAndLockRules,
  getWalletAddress,
  depositUSDCx,
} from "@/lib/flowvault";

const USDCX_ASSET_KEY =
  "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx::usdcx-token";

const FLOWVAULT_CONTRACT =
  "STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD.flowvault-v2";

export default function CreateFlow() {
  const router = useRouter();

  const [creator, setCreator] = useState("");
  const [treasury, setTreasury] = useState("");
  const [designer, setDesigner] = useState("");

  const [amount, setAmount] = useState("5");
  const [treasuryAmount, setTreasuryAmount] = useState("1");
  const [lockAmount, setLockAmount] = useState("1");

  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("Not fetched yet");
  const [flowVaultBalance, setFlowVaultBalance] = useState("Not fetched yet");

  const [txStatus, setTxStatus] = useState("");
  const [txStage, setTxStage] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

  const isWrongNetwork =
    walletAddress.length > 0 && !walletAddress.startsWith("ST");

  const lifecycleStages = [
    { id: "preparing", label: "Preparing" },
    { id: "wallet", label: "Waiting for wallet" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
  ];

  const formatUSDCx = (rawBalance: string) => {
    const balance = Number(rawBalance || "0") / 1_000_000;
    return `${balance} USDCx`;
  };

  const fetchUSDCxBalance = async (address: string) => {
    try {
      setWalletBalance("Fetching...");

      const response = await fetch(
        `https://api.testnet.hiro.so/extended/v1/address/${address}/balances`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance");
      }

      const data = await response.json();

      const rawBalance =
        data?.fungible_tokens?.[USDCX_ASSET_KEY]?.balance || "0";

      setWalletBalance(formatUSDCx(rawBalance));
    } catch (error) {
      console.error(error);
      setWalletBalance("Failed to fetch");
    }
  };

  const fetchFlowVaultBalance = async () => {
    try {
      setFlowVaultBalance("Fetching...");

      const response = await fetch(
        `https://api.testnet.hiro.so/extended/v1/address/${FLOWVAULT_CONTRACT}/balances`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch FlowVault balance");
      }

      const data = await response.json();

      const rawBalance =
        data?.fungible_tokens?.[USDCX_ASSET_KEY]?.balance || "0";

      setFlowVaultBalance(formatUSDCx(rawBalance));
    } catch (error) {
      console.error(error);
      setFlowVaultBalance("Failed to fetch");
    }
  };

  const refreshBalances = async (address?: string) => {
    const activeAddress = address || walletAddress;

    if (activeAddress && activeAddress.startsWith("ST")) {
      await fetchUSDCxBalance(activeAddress);
    }

    await fetchFlowVaultBalance();
  };

  useEffect(() => {
    const savedWallet = localStorage.getItem("createflow_wallet");

    fetchFlowVaultBalance();

    if (savedWallet) {
      setWalletAddress(savedWallet);

      if (savedWallet.startsWith("ST")) {
        setTxStatus("Wallet session restored.");
        setTxStage("confirmed");
        fetchUSDCxBalance(savedWallet);
      } else {
        setTxStatus("Wrong network detected. Switch to Stacks Testnet.");
        setTxStage("failed");
        setErrorMessage("Wrong network detected. Switch to Stacks Testnet.");
      }
    }
  }, []);

  const disconnectWallet = () => {
    localStorage.removeItem("createflow_wallet");

    setWalletAddress("");
    setWalletBalance("Not fetched yet");
    setTxStatus("");
    setTxStage("idle");
    setErrorMessage("");
  };

  const getFriendlyError = (error: any) => {
    const message = String(error?.message || error || "").toLowerCase();

    if (message.includes("user rejected") || message.includes("cancel")) {
      return "Transaction rejected. Please approve it in your wallet.";
    }

    if (message.includes("network")) {
      return "Wrong network. Switch wallet to Stacks Testnet.";
    }

    if (message.includes("balance") || message.includes("insufficient")) {
      return "Insufficient balance. Add testnet STX/USDCx.";
    }

    if (message.includes("invalid") || message.includes("principal")) {
      return "Invalid address or contract argument.";
    }

    return "Contract error. Please try again.";
  };

  const blockWrongNetwork = () => {
    if (isWrongNetwork) {
      const message = "Wrong network. Please switch to Stacks Testnet.";

      setErrorMessage(message);
      setTxStage("failed");
      setTxStatus(message);
      alert(message);

      return true;
    }

    return false;
  };

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

  const connectWallet = async () => {
    try {
      setErrorMessage("");
      setTxStage("preparing");
      setTxStatus("Connecting wallet...");

      const address = await getWalletAddress();

      setWalletAddress(address);
      localStorage.setItem("createflow_wallet", address);

      if (!address.startsWith("ST")) {
        const message = "Wrong network detected. Switch to Stacks Testnet.";

        setErrorMessage(message);
        setTxStage("failed");
        setTxStatus(message);

        return;
      }

      await refreshBalances(address);

      setTxStage("confirmed");
      setTxStatus("Wallet connected successfully.");
    } catch (error) {
      console.error(error);

      const friendlyError = getFriendlyError(error);

      setErrorMessage(friendlyError);
      setTxStage("failed");
      setTxStatus(friendlyError);

      alert(friendlyError);
    }
  };

  const checkWalletBalance = async () => {
    await refreshBalances(walletAddress);
  };

  const validateTreasuryAddress = () => {
    if (!treasury.trim()) {
      alert("Please enter Treasury / Contributor address.");
      return false;
    }

    if (!isValidStacksAddress(treasury)) {
      alert("Invalid wallet address. Use Stacks testnet address.");
      return false;
    }

    if (depositAmount <= 0) {
      alert("Enter valid deposit amount.");
      return false;
    }

    if (treasuryFlow <= 0) {
      alert("Enter valid treasury amount.");
      return false;
    }

    if (lockFlow < 0) {
      alert("Lock amount cannot be negative.");
      return false;
    }

    if (isInvalidAllocation) {
      alert("Treasury + Lock cannot exceed deposit.");
      return false;
    }

    return true;
  };

  const createTreasuryRoute = async () => {
    if (blockWrongNetwork()) return;
    if (!validateTreasuryAddress()) return;

    try {
      setErrorMessage("");
      setTreasuryLoading(true);

      setTxStage("preparing");
      setTxStatus("Preparing treasury transaction...");

      setTxStage("wallet");
      setTxStatus("Waiting for wallet approval...");

      const txId = await setRoutingRules(treasury, treasuryFlow);

      setTxStage("pending");
      setTxStatus("Transaction submitted...");

      setTxStage("confirmed");

      router.push(
        `/result?amount=${depositAmount}&treasuryAmount=${treasuryFlow}&lockAmount=0&remainingAmount=${
          depositAmount - treasuryFlow
        }&txId=${txId}&primitive=treasury`
      );
    } catch (error) {
      console.error(error);

      const friendlyError = getFriendlyError(error);

      setErrorMessage(friendlyError);
      setTxStage("failed");
      setTxStatus(friendlyError);

      alert(friendlyError);
    } finally {
      setTreasuryLoading(false);
    }
  };

  const createLockRoute = async () => {
    if (blockWrongNetwork()) return;
    if (!validateTreasuryAddress()) return;

    try {
      setErrorMessage("");
      setLockLoading(true);

      setTxStage("preparing");
      setTxStatus("Preparing lock transaction...");

      setTxStage("wallet");
      setTxStatus("Waiting for wallet approval...");

      const result = await setSplitAndLockRules(
        treasury,
        lockFlow,
        treasuryFlow
      );

      setTxStage("pending");
      setTxStatus("Transaction submitted...");

      setTxStage("confirmed");

      router.push(
        `/result?amount=${depositAmount}&treasuryAmount=${treasuryFlow}&lockAmount=${lockFlow}&remainingAmount=${remainingFlow}&txId=${result.txId}&currentBlock=${result.currentBlock}&futureBlock=${result.futureBlock}&primitive=split-lock`
      );
    } catch (error) {
      console.error(error);

      const friendlyError = getFriendlyError(error);

      setErrorMessage(friendlyError);
      setTxStage("failed");
      setTxStatus(friendlyError);

      alert(friendlyError);
    } finally {
      setLockLoading(false);
    }
  };

  const executeDeposit = async () => {
    if (blockWrongNetwork()) return;

    if (depositAmount <= 0) {
      alert("Enter valid deposit amount.");
      return;
    }

    try {
      setErrorMessage("");
      setDepositLoading(true);

      setTxStage("preparing");
      setTxStatus("Preparing USDCx deposit...");

      setTxStage("wallet");
      setTxStatus("Waiting for wallet approval...");

      const txId = await depositUSDCx(depositAmount, walletAddress);

      setTxStage("pending");
      setTxStatus("Deposit transaction submitted...");

      await refreshBalances(walletAddress);

      setTxStage("confirmed");

      router.push(
        `/result?amount=${depositAmount}&treasuryAmount=${treasuryFlow}&lockAmount=${lockFlow}&remainingAmount=${remainingFlow}&txId=${txId}&primitive=deposit`
      );
    } catch (error) {
      console.error(error);

      const friendlyError = getFriendlyError(error);

      setErrorMessage(friendlyError);
      setTxStage("failed");
      setTxStatus(friendlyError);

      alert(friendlyError);
    } finally {
      setDepositLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <section className="max-w-6xl mx-auto">
        <div className="mb-6 flex gap-3">
          <a
            href="/"
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm"
          >
            Home
          </a>

          <a
            href="/create-flow"
            className="rounded-xl border border-orange-500 px-4 py-2 text-sm text-orange-400"
          >
            Create Flow
          </a>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              CreateFlow
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
              Treasury Route
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Programmable treasury routing using FlowVault primitives on
              Stacks.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {walletAddress ? (
              <button
                onClick={disconnectWallet}
                className="rounded-2xl bg-red-500 px-5 py-3 font-black text-black"
              >
                Disconnect Wallet
              </button>
            ) : (
              <button
                onClick={connectWallet}
                className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-black"
              >
                + Connect Wallet
              </button>
            )}

            {walletAddress && (
              <div
                className={`rounded-full border px-4 py-2 text-sm ${
                  isWrongNetwork
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-green-500/40 bg-green-500/10 text-green-400"
                }`}
              >
                {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-6)} •{" "}
                {isWrongNetwork ? "Wrong Network" : "Stacks Testnet"}
              </div>
            )}

            {isWrongNetwork && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400">
                Wrong network detected. Switch to Stacks Testnet.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="space-y-4">
              <input
                placeholder="Creator wallet"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4"
              />

              <input
                placeholder="Treasury wallet"
                value={treasury}
                onChange={(e) => setTreasury(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4"
              />

              <input
                placeholder="Designer wallet"
                value={designer}
                onChange={(e) => setDesigner(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4"
              />

              <input
                type="number"
                placeholder="Deposit amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4"
              />

              <input
                type="number"
                placeholder="Treasury routed"
                value={treasuryAmount}
                onChange={(e) => setTreasuryAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4"
              />

              <input
                type="number"
                placeholder="Locked amount"
                value={lockAmount}
                onChange={(e) => setLockAmount(e.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-black p-4"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">Balance Overview</p>

                <button
                  onClick={checkWalletBalance}
                  className="rounded-xl border border-zinc-700 px-3 py-2 text-xs"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span>Wallet Balance</span>
                  <span>{walletBalance}</span>
                </div>

                <div className="flex justify-between">
                  <span>Deposited in FlowVault</span>
                  <span className="text-orange-400">{flowVaultBalance}</span>
                </div>

                <div className="flex justify-between">
                  <span>Deposit</span>
                  <span>{depositAmount} USDCx</span>
                </div>

                <div className="flex justify-between">
                  <span>Treasury</span>
                  <span>{treasuryFlow} USDCx</span>
                </div>

                <div className="flex justify-between">
                  <span>Locked</span>
                  <span>{lockFlow} USDCx</span>
                </div>

                <div className="flex justify-between">
                  <span>Remaining</span>
                  <span
                    className={
                      isInvalidAllocation ? "text-red-400" : "text-green-400"
                    }
                  >
                    {isInvalidAllocation
                      ? "Invalid"
                      : `${remainingFlow} USDCx`}
                  </span>
                </div>
              </div>
            </div>

            {(txStatus || txStage !== "idle") && (
              <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                  Transaction Lifecycle
                </p>

                <p className="mt-3 text-sm font-bold text-orange-300">
                  {txStatus}
                </p>

                <div className="mt-4 grid gap-3">
                  {lifecycleStages.map((stage) => (
                    <div
                      key={stage.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-400">{stage.label}</span>

                      <span
                        className={`text-sm font-bold ${getStageColor(
                          stage.id
                        )}`}
                      >
                        {getStageStatus(stage.id)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-5 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm font-bold text-red-400">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={createTreasuryRoute}
                disabled={isBusy || isInvalidAllocation || isWrongNetwork}
                className="rounded-2xl bg-orange-500 px-5 py-4 font-black text-black disabled:opacity-40"
              >
                {treasuryLoading ? "Waiting..." : "Create Treasury Route"}
              </button>

              <button
                onClick={createLockRoute}
                disabled={isBusy || isInvalidAllocation || isWrongNetwork}
                className="rounded-2xl border border-orange-500 px-5 py-4 font-black text-orange-400 disabled:opacity-40"
              >
                {lockLoading ? "Waiting..." : "Create Lock Route"}
              </button>
            </div>

            <button
              onClick={executeDeposit}
              disabled={isBusy || isInvalidAllocation || isWrongNetwork}
              className="mt-4 w-full rounded-2xl bg-green-500 px-5 py-4 font-black text-black disabled:opacity-40"
            >
              {depositLoading ? "Waiting..." : "Deposit USDCx to Execute Flow"}
            </button>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-400">
              Route Preview
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="text-gray-400">Incoming Deposit</p>
                <p className="mt-2 text-5xl font-black">{depositAmount}</p>
                <p className="text-gray-400">USDCx</p>
              </div>

              <div className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4">
                <div className="flex justify-between">
                  <span>Treasury Route</span>
                  <span>{treasuryFlow} USDCx</span>
                </div>
              </div>

              <div className="rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4">
                <div className="flex justify-between">
                  <span>Lock Vault</span>
                  <span>{lockFlow} USDCx</span>
                </div>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  isInvalidAllocation
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-green-500/40 bg-green-500/10"
                }`}
              >
                <div className="flex justify-between">
                  <span>Remaining</span>
                  <span>
                    {isInvalidAllocation ? "Invalid" : `${remainingFlow} USDCx`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}