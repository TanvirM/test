import React, { useState } from "react";
import { ethers } from "ethers";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
// import { toast } from "react-toastify";
import { Alert } from "../Toast/Toast";
import "./Transfer.css";
// import axios from "axios";
// import { API_URL } from "../config";

// const Transfer = (props) => {
//   const { quantity, setQuantity, totalQuantity, balanceAmount } = props;
//   return (
//     <div className="eth_transfer">
//       <div className="_ethamount">
//         <InputGroup size="lg" className="eth_amount">
//           <InputGroup.Text id="inputGroup-sizing-lg">
//             Quantity per wallet
//           </InputGroup.Text>
//           <Form.Control
//             aria-label="Large"
//             aria-describedby="inputGroup-sizing-sm"
//             type="number"
//             placeholder="input per quatity"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//           />
//         </InputGroup>
//       </div>
//       <div className="totalToken">
//         <h4
//           style={
//             balanceAmount <= totalQuantity
//               ? { color: "red" }
//               : { color: "green" }
//           }
//         >
//           Total :{" "}
//           {balanceAmount <= totalQuantity
//             ? `${totalQuantity} - insufficient!`
//             : totalQuantity}
//         </h4>
//       </div>
//       <Alert />
//     </div>
//   );
// };


function Transfer({ account }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // ERC-20 Token Contract Address (Replace with a working token)
  const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // Example: USDT Contract on Mainnet

  // ERC-20 Token ABI (Minimal ABI for transfers)
  const tokenAbi = [
      "function transfer(address to, uint256 value) public returns (bool)",
      "function decimals() view returns (uint8)"
  ];

  const transferTokens = async () => {
      if (!recipient || !amount) {
          setStatus("❌ Please enter a recipient address and amount.");
          return;
      }

      try {
          setIsTransferring(true);
          setStatus("⏳ Processing transaction...");

          if (!window.ethereum) {
              throw new Error("MetaMask not detected");
          }

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();

          if (!ethers.isAddress(recipient)) {
              throw new Error("Invalid Ethereum address");
          }

          // Connect to the Token Contract
          const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

          // Get Token Decimals (Handling Errors)
          let decimals;
          try {
              decimals = await tokenContract.decimals();
          } catch (error) {
              throw new Error("⚠️ Failed to fetch token decimals. Ensure the contract address is correct.");
          }

          const formattedAmount = ethers.parseUnits(amount, decimals);

          // Send Transaction
          const tx = await tokenContract.transfer(recipient, formattedAmount);
          await tx.wait();

          setStatus(`✅ Transaction Successful! Tx Hash: ${tx.hash}`);
      } catch (error) {
          setStatus(`❌ Error: ${error.message}`);
      } finally {
          setIsTransferring(false);``
      }
  };

  return (
      <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>Transfer Tokens</h2>
          <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{ margin: "10px", padding: "5px", width: "300px" }}
          />
          <br />
          <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ margin: "10px", padding: "5px", width: "150px" }}
          />
          <br />
          <button onClick={transferTokens} disabled={isTransferring} style={{ padding: "10px", marginTop: "10px" }}>
              {isTransferring ? "Processing..." : "Send Tokens"}
          </button>
          <p style={{ color: status.includes("Error") ? "red" : "green" }}>{status}</p>
      </div>
  );
}

export default Transfer;
