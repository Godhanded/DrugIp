require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { ethers } = require('ethers');

const DRUGIP_UPKEEP_ADDRESS = "0x850B8D455b5228E86F8160746aa2d904d937d941";
const AVALANCHE_RPC_URL = "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const UPKEEP_ABI = require("./DrugIPUpkeepABI.json");

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

async function runElizaInference(smiles) {
  try {
    const response = await axios.post("https://api.elizaos.com/v1/infer", { smiles });
    return response.data; // expected to contain scores and passed flag
  } catch (err) {
    console.error("ELiZA inference error", err);
    return null;
  }
}

async function uploadMetadataToS3(metadata) {
  const key = `drugip/${Date.now()}.json`;
  const body = JSON.stringify(metadata);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: 'application/json'
  });

  await s3.send(command);
  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

async function queueCandidate(smiles, metadataUrl) {
  const provider = new ethers.JsonRpcProvider(AVALANCHE_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const upkeep = new ethers.Contract(DRUGIP_UPKEEP_ADDRESS, UPKEEP_ABI, wallet);

  const tx = await upkeep.queueMolecule(smiles, metadataUrl);
  console.log("Candidate queued: ", tx.hash);
  await tx.wait();
}

async function elizaAgent(input) {
  const { smiles } = input;
  const scores = await runElizaInference(smiles);
  if (!scores || !scores.passed) {
    console.log("Molecule did not pass inference threshold. Skipping queue.");
    return;
  }

  const metadata = {
    smiles,
    scores,
    timestamp: new Date().toISOString()
  };

  const metadataUrl = await uploadMetadataToS3(metadata);
  await queueCandidate(smiles, metadataUrl);
}

// Example
elizaAgent({ smiles: "CC(=O)OC1=CC=CC=C1C(=O)O" });