import { BrowserProvider } from "ethers";
import { ethers } from "ethers";

const connectWallet = async () => {
  const accountChangedHandler = async (newAccount) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    return signer;
  };
  const chainChangedHandler = () => {
    window.location.reload();
  };
  try {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.on("accountsChanged", accountChangedHandler);
      window.ethereum.on("chainChanged", chainChangedHandler);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      return signer;
    } else {
      console.log("MetaMask not detected");
    }
  } catch (e) {
    console.error("Error in Connecting MetaMask", e);
  }
};

export default connectWallet;
