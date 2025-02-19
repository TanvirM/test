import "./App.css";
import Nav from "./Nav/Nav";
import Transfer from "./Transfer/Transfer";
//import TokenPart from "./Token/Token";
// import SenderTable from "./Table";
// import ConnectWallet from "./ConnectWallet";
// import Fee from "./Fee";
// import Airdrop from "./Airdrop";
// import { RPC_URL, SECRET_KEY } from "./config";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import { isAddress, formatUnits, parseUnits } from "ethers";
import Web3 from "web3";
import React from "react";

// Load the sender's wallet from the private key
// const provider = new ethers.JsonRpcProvider(RPC_URL);
// const senderWallet = new ethers.Wallet(SECRET_KEY, provider);

function App() {
  // State variables
  // const [isConnected, setIsConnected] = useState(false); // Connection state
  // const [tokenAddress, setTokenAddress] = useState("0xdAC17F958D2ee523a2206206994597C13D831ec7"); // ERC-20 token contract address
  // const [wallets, setWallets] = useState([]); // List of recipient addresses
  // const [walletAddress, setWalletAddress] = useState("");
  // const [quantity, setQuantity] = useState(0); // Tokens to send per wallet
  // const [fee, setFee] = useState(0); // Gas fee per transaction (not actively used for Ethereum)
  // const [loading, setLoading] = useState(false);
  // const [balanceAmount, setBalanceAmount] = useState(0); // Sender's token balance
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [message, setMessage] = useState("Initializing...");
  const [activeTab, setActiveTab] = useState("wallet");

  // CSV validation state
  const [addresses, setAddresses] = useState([]);
  const [invalidAddresses, setInvalidAddresses] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [csvMessage, setCsvMessage] = useState("");

  // Fetch token balance of the sender's wallet
  // useEffect(() => {
  //   if (tokenAddress) {
  //     getTokenBalance();
  //   }
  // }, [tokenAddress]);

  useEffect(() => {
    async function connectMetaMask() {
        if (window.ethereum) {
            try {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);
                console.log("MetaMask detected!");

                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
                setMessage(`Connected to MetaMask: ${accounts[0]}`);
            } catch (error) {
                console.error("MetaMask connection error:", error);
                setMessage("Failed to connect MetaMask. Check the console for details.");
            }
        } else {
            setMessage("MetaMask not detected. Please install it.");
            console.warn("MetaMask is not installed!");
        }
    }

    connectMetaMask();
}, []);

  // const getTokenBalance = async () => {
  //   try {
  //     const erc20ABI = [
  //       "function balanceOf(address account) external view returns (uint256)",
  //       "function decimals() view returns (uint8)",
  //     ];
  //     const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, provider);
  //     const decimals = await tokenContract.decimals();
  //     const balance = await tokenContract.balanceOf(senderWallet.address);
  //     setBalanceAmount(Number(ethers.formatUnits(balance, decimals)));
  //   } catch (error) {
  //     console.error("Error fetching token balance:", error);
  //     alert("Failed to fetch token balance. Check the token address and try again.");
  //   }
  // };

  // const handleConnect = async () => {
  //   if (isConnected) {
  //     const confirmDisconnect = window.confirm("Do you want to disconnect?");
  //     if (confirmDisconnect) {
  //       setIsConnected(false);
  //     }
  //   } else {
  //     // Placeholder for future MetaMask logic
  //     alert("Simulating wallet connection. MetaMask support coming soon.");
  //     setIsConnected(true);
  //   }
  // };

  // // Airdrop logic
  // const handleAirdrop = async () => {
  //   if (!tokenAddress || wallets.length === 0 || quantity <= 0) {
  //     alert("Please fill in all parameters correctly!");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const erc20ABI = [
  //       "function transfer(address to, uint256 value) public returns (bool)",
  //       "function decimals() view returns (uint8)",
  //     ];
  //     const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, senderWallet);
  //     const decimals = await tokenContract.decimals();
  //     const amount = ethers.parseUnits(quantity.toString(), decimals);

  //     for (let i = 0; i < wallets.length; i++) {
  //       const recipient = wallets[i];
  //       console.log(`Transferring ${quantity} tokens to ${recipient}...`);
  //       const tx = await tokenContract.transfer(recipient, amount);
  //       await tx.wait(); // Wait for the transaction to confirm
  //       console.log(`Successfully sent to ${recipient}`);
  //     }
  //     alert("Airdrop completed successfully!");
  //   } catch (error) {
  //     console.error("Airdrop failed:", error);
  //     alert("Airdrop failed! Check the console for more details.");
  //   }
  //   setLoading(false);
  // };

  // return (
  //   <div className="App">
  //     <Nav />
  //     <div style={{ opacity: loading ? 0.5 : 1 }}>
  //       {loading && (
  //         <div className="d-flex justify-content-center align-items-center custom-loading">
  //           <Spinner animation="border" variant="primary" role="status" />
  //         </div>
  //       )}
  //       <div className="connectWallet">
  //         {/* Future MetaMask Connection: Placeholder */}
  //         <div className="connectWallet">
  //         <ConnectWallet
  //           handleConnect={handleConnect}
  //           isConnected={isConnected}
  //         />
  //       </div>
  //         {/* <button className="btn btn-danger" disabled>
  //           <h3>MetaMask (Coming Soon)</h3>
  //         </button> */}
  //       </div>
  //       <div className="event">
  //         <SenderTable wallets={wallets} setWallets={setWallets} isConnected = {isConnected}/>
  //       </div>
  //       <div className="main">
  //         <TokenPart
  //           tokenaddress={tokenAddress}
  //           setTokenAddress={setTokenAddress}
  //           balanceAmount={balanceAmount}
  //         />
  //         <Transfer
  //           quantity={quantity}
  //           setQuantity={setQuantity}
  //           totalQuantity={wallets?.length ? wallets.length * quantity : 0}
  //           balanceAmount={balanceAmount}
  //         />
  //         <Fee
  //           fee={fee}
  //           setFee={setFee}
  //           totalFee={wallets?.length ? wallets.length * fee : 0}
  //         />
  //       </div>
  //       <div className="airdrop">
  //         <Airdrop
  //           isConnected={
  //             isConnected && wallets?.length
  //               ? wallets.length * quantity < balanceAmount
  //               : 0
  //           }
  //           handleAirdrop={handleAirdrop}
  //         />
  //         {/* <Airdrop handleAirdrop={handleAirdrop} isConnected={true} /> */}
  //       </div>
  //     </div>
  //   </div>
  // );
  
  // Function to handle CSV upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        complete: (results) => {
            validateAddresses(results.data.flat());
        },
        header: false,
        skipEmptyLines: true,
    });
};

// Function to validate Ethereum addresses
const validateAddresses = (csvAddresses) => {
  const valid = [];
  const invalid = [];
  const seen = new Set();
  const duplicateSet = new Set();

  csvAddresses.forEach((address) => {
      const trimmedAddress = address.trim();
      if (isAddress(trimmedAddress)) {  // Fix: Use isAddress() directly
          if (seen.has(trimmedAddress)) {
              duplicateSet.add(trimmedAddress);
          } else {
              valid.push(trimmedAddress);
              seen.add(trimmedAddress);
          }
      } else {
          invalid.push(trimmedAddress);
      }
  });

  setAddresses(valid);
  setInvalidAddresses(invalid);
  setDuplicates([...duplicateSet]);

  setCsvMessage(`✅ Valid: ${valid.length}, ❌ Invalid: ${invalid.length}, 🔁 Duplicates: ${duplicateSet.size}`);
};



return (
    <div style={{ textAlign: "center", padding: "20px" }}>
        {/* Navigation Tabs */}
        <nav>
            <button onClick={() => setActiveTab("wallet")}>Wallet Connect</button>
            <button onClick={() => setActiveTab("fileUpload")}>File Upload</button>
            <button onClick={() => setActiveTab("transfer")}>Transfer</button>
        </nav>

        <hr />

        {/* Tabs Content */}
        {activeTab === "wallet" && (
            <div>
                <h1>Wallet Connection</h1>
                <p>{message}</p>
                {account && <p>Wallet Address: <strong>{account}</strong></p>}
                {!account && <button onClick={() => window.location.reload()}>Retry Connection</button>}
            </div>
        )}

        {activeTab === "fileUpload" && (
            <div>
                <h2>Ethereum Address Validator</h2>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
                <p>{csvMessage}</p>

                {addresses.length > 0 && (
                    <div>
                        <h3>✅ Valid Addresses:</h3>
                        <ul>{addresses.map((addr, index) => <li key={index}>{addr}</li>)}</ul>
                    </div>
                )}

                {invalidAddresses.length > 0 && (
                    <div>
                        <h3>❌ Invalid Addresses:</h3>
                        <ul style={{ color: "red" }}>{invalidAddresses.map((addr, index) => <li key={index}>{addr}</li>)}</ul>
                    </div>
                )}

                {duplicates.length > 0 && (
                    <div>
                        <h3>🔁 Duplicate Addresses:</h3>
                        <ul style={{ color: "orange" }}>{duplicates.map((addr, index) => <li key={index}>{addr}</li>)}</ul>
                    </div>
                )}
            </div>
        )}

        {activeTab === "transfer" && <Transfer account={account} web3={web3} />}
    </div>
);
}

export default App;