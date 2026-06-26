export function isValidStacksAddress(address: string) {
  return address.trim().startsWith("ST") && address.trim().length > 20;
}

const FLOWVAULT_ADDRESS = "STD7QG84VQQ0C35SZM2EYTHZV4M8FQ0R7YNSQWPD";
const FLOWVAULT_NAME = "flowvault-v2";

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

  return response?.txid || response?.txId || response?.transactionHash;
}