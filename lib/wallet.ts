import { request } from "@stacks/connect";

export async function connectWallet() {
  try {
    const response = await request("stx_getAddresses");

    console.log("Wallet connected:", response);

    alert("Wallet connected successfully!");

    return response;
  } catch (error) {
    console.error("Wallet connection failed:", error);
    alert("Wallet connection failed. Make sure Leather/Xverse is installed and on Stacks Testnet.");
  }
}