export function isValidStacksAddress(address: string) {
  return address.trim().startsWith("ST") && address.trim().length > 20;
}

const FLOWVAULT_ADDRESS = "STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD";
const FLOWVAULT_NAME = "flowvault-v2";

/* TESTNET USDCx CONTRACT */
const USDCX_CONTRACT =
  "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdc";

/* -------------------- HELPERS -------------------- */

function normalizeTxId(rawTxId: string | undefined) {
  if (!rawTxId) return "";
  return rawTxId.startsWith("0x") ? rawTxId : `0x${rawTxId}`;
}

function extractTxId(response: any) {
  const rawTxId =
    response?.txid ||
    response?.txId ||
    response?.transactionHash ||
    response?.tx_id ||
    response?.result?.txid ||
    response?.result?.txId ||
    response?.result?.transactionHash;

  return normalizeTxId(rawTxId);
}

/* -------------------- WALLET -------------------- */

export async function getWalletAddress() {
  const { connect } = await import("@stacks/connect");

  const response: any = await connect();

  const address =
    response?.addresses?.find((item: any) => item.symbol === "STX")?.address ||
    response?.addresses?.[0]?.address ||
    response?.result?.addresses?.find((item: any) => item.symbol === "STX")
      ?.address ||
    response?.result?.addresses?.[0]?.address ||
    "";

  if (!address) {
    throw new Error("No wallet address returned");
  }

  return address;
}

/* -------------------- BLOCK HEIGHT -------------------- */

export async function getCurrentTestnetBlockHeight() {
  const response = await fetch(
    "https://api.testnet.hiro.so/extended/v1/block?limit=1"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch block height");
  }

  const data = await response.json();

  return data.results[0].height;
}

/* -------------------- ROUTING RULES -------------------- */

export async function setRoutingRules(
  splitAddress: string,
  splitAmount: number
) {
  const { request } = await import("@stacks/connect");

  const { principalCV, someCV, uintCV } = await import(
    "@stacks/transactions"
  );

  const response: any = await request("stx_callContract", {
    contract: `${FLOWVAULT_ADDRESS}.${FLOWVAULT_NAME}`,
    functionName: "set-routing-rules",
    functionArgs: [
      uintCV(0),
      uintCV(0),
      someCV(principalCV(splitAddress.trim())),
      uintCV(splitAmount),
    ],
    network: "testnet",
  });

  const txId = extractTxId(response);

  if (!txId) {
    throw new Error("No txId returned");
  }

  return txId;
}

/* -------------------- LOCK + SPLIT -------------------- */

export async function setSplitAndLockRules(
  splitAddress: string,
  lockAmount: number,
  splitAmount: number
) {
  const { request } = await import("@stacks/connect");

  const { principalCV, someCV, uintCV } = await import(
    "@stacks/transactions"
  );

  const currentBlock = await getCurrentTestnetBlockHeight();

  const futureBlock = currentBlock + 100;

  const response: any = await request("stx_callContract", {
    contract: `${FLOWVAULT_ADDRESS}.${FLOWVAULT_NAME}`,
    functionName: "set-routing-rules",
    functionArgs: [
      uintCV(lockAmount),
      uintCV(futureBlock),
      someCV(principalCV(splitAddress.trim())),
      uintCV(splitAmount),
    ],
    network: "testnet",
  });

  const txId = extractTxId(response);

  if (!txId) {
    throw new Error("No txId returned");
  }

  return {
    txId,
    currentBlock,
    futureBlock,
  };
}

/* -------------------- DEPOSIT USDCx -------------------- */

export async function depositUSDCx(amount: number) {
  const { request } = await import("@stacks/connect");

  const {
    contractPrincipalCV,
    uintCV,
  } = await import("@stacks/transactions");

  const response: any = await request("stx_callContract", {
    contract: `${FLOWVAULT_ADDRESS}.${FLOWVAULT_NAME}`,
    functionName: "deposit",
    functionArgs: [
      contractPrincipalCV(
        USDCX_CONTRACT.split(".")[0],
        USDCX_CONTRACT.split(".")[1]
      ),
      uintCV(amount),
    ],
    network: "testnet",
  });

  const txId = extractTxId(response);

  if (!txId) {
    throw new Error("Deposit failed");
  }

  return txId;
}