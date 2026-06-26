export function isValidStacksAddress(address: string) {
  return address.trim().startsWith("ST") && address.trim().length > 20;
}

const FLOWVAULT_ADDRESS = "STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD";
const FLOWVAULT_NAME = "flowvault-v2";

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

export async function getWalletAddress() {
  const { connect } = await import("@stacks/connect");

  const response: any = await connect();

  console.log("Wallet connect response:", response);

  const address =
    response?.addresses?.find((item: any) => item.symbol === "STX")
      ?.address ||
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

export async function getCurrentTestnetBlockHeight() {
  const response = await fetch(
    "https://api.testnet.hiro.so/extended/v1/block?limit=1"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch current testnet block height");
  }

  const data = await response.json();

  return data.results[0].height;
}

export async function setRoutingRules(splitAddress: string) {
  const { request } = await import("@stacks/connect");
  const { principalCV, someCV, uintCV } = await import("@stacks/transactions");

  const response: any = await request("stx_callContract", {
    contract: `${FLOWVAULT_ADDRESS}.${FLOWVAULT_NAME}`,
    functionName: "set-routing-rules",
    functionArgs: [
      uintCV(0),
      uintCV(0),
      someCV(principalCV(splitAddress.trim())),
      uintCV(1),
    ],
    network: "testnet",
  });

  console.log("Treasury route tx response:", response);

  return extractTxId(response);
}

export async function setSplitAndLockRules(splitAddress: string) {
  const { request } = await import("@stacks/connect");
  const { principalCV, someCV, uintCV } = await import("@stacks/transactions");

  const currentBlock = await getCurrentTestnetBlockHeight();
  const futureBlock = currentBlock + 100;

  console.log("Current testnet block:", currentBlock);
  console.log("Future lock block:", futureBlock);

  const response: any = await request("stx_callContract", {
    contract: `${FLOWVAULT_ADDRESS}.${FLOWVAULT_NAME}`,
    functionName: "set-routing-rules",
    functionArgs: [
      uintCV(2),
      uintCV(futureBlock),
      someCV(principalCV(splitAddress.trim())),
      uintCV(1),
    ],
    network: "testnet",
  });

  console.log("Split + lock tx response:", response);

  return {
    txId: extractTxId(response),
    currentBlock,
    futureBlock,
  };
}