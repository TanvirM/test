require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const data = fs.readFileSync(filePath, "utf-8").split("\n");
        
        const validAddresses = [];
        const invalidAddresses = [];
        
        for (const address of data) {
            const trimmedAddress = address.trim();
            if (ethers.utils.isAddress(trimmedAddress)) {
                validAddresses.push(trimmedAddress);
            } else {
                invalidAddresses.push(trimmedAddress);
            }
        }

        fs.unlinkSync(filePath); // Remove file after processing

        res.json({ validAddresses, invalidAddresses });
    } catch (error) {
        res.status(500).json({ error: "Error processing file." });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
