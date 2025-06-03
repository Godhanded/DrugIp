// actions/analyzeMolecule.js - ELiZA Action for Molecule Analysis

import { ethers } from 'ethers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';

// Molecular property calculation functions
export function calculateMolecularWeight(smiles) {
  // Simplified MW calculation - in production use RDKit or similar
  const atoms = {
    'C': 12.01, 'H': 1.008, 'O': 15.999, 'N': 14.007,
    'S': 32.065, 'P': 30.974, 'F': 18.998, 'Cl': 35.453,
    'Br': 79.904, 'I': 126.90
  };
  
  let weight = 0;
  const atomCounts = {};
  
  // Basic SMILES parsing (simplified)
  for (let char of smiles) {
    if (atoms[char]) {
      atomCounts[char] = (atomCounts[char] || 0) + 1;
    }
  }
  
  for (let [atom, count] of Object.entries(atomCounts)) {
    weight += atoms[atom] * (count as number);
  }
  
  return weight;
}

export function calculateLogP(smiles) {
  // Simplified LogP estimation using fragment-based approach
  // In production, use proper cheminformatics libraries
  const aromatic = (smiles.match(/c|C1=CC=CC=C1/g) || []).length;
  const oxygen = (smiles.match(/O/g) || []).length;
  const nitrogen = (smiles.match(/N/g) || []).length;
  
  return 0.5 * aromatic - 0.2 * oxygen - 0.1 * nitrogen;
}

export function assessDrugLikeness(mw, logP) {
  // Lipinski's Rule of Five
  const rules = {
    molecularWeight: mw <= 500,
    logP: logP <= 5,
    hbd: true, // Simplified for demo
    hba: true  // Simplified for demo
  };
  
  const passedRules = Object.values(rules).filter(Boolean).length;
  return {
    score: passedRules / 4,
    passed: passedRules >= 3,
    rules
  };
}

export async function callAWSModel(smiles) {
  try {
    // Call your AWS SageMaker endpoint
    const response = await axios.post(process.env.AWS_SAGEMAKER_ENDPOINT, {
      instances: [{ smiles: smiles }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.AWS_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.predictions[0];
  } catch (error) {
    console.error('AWS model call failed:', error);
    return null;
  }
}


// Blockchain integration function
export async function tokenizeMolecule(smiles, analysis) {
  try {
    // Upload metadata to S3
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
    
    const metadata = {
      ...analysis,
      description: `Drug IP for molecule ${smiles}`,
      image: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/PNG`,
      attributes: [
        { trait_type: "Molecular Weight", value: analysis.molecularWeight },
        { trait_type: "LogP", value: analysis.logP },
        { trait_type: "Overall Score", value: analysis.overallScore },
        { trait_type: "Bioactivity", value: analysis.mlScores.bioactivity },
        { trait_type: "Toxicity Risk", value: analysis.mlScores.toxicity }
      ]
    };
    
    const key = `drugip/${Date.now()}-${smiles.replace(/[^A-Za-z0-9]/g, '')}.json`;
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(metadata),
      ContentType: 'application/json'
    }));
    
    const metadataUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    
    // Queue for blockchain minting
    const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    const upkeepABI = [
      "function queueMolecule(string memory smiles, string memory metadataURI) public"
    ];
    
    const upkeep = new ethers.Contract(
      process.env.DRUGIP_UPKEEP_ADDRESS,
      upkeepABI,
      wallet
    );
    
    const tx = await upkeep.queueMolecule(smiles, metadataUrl);
    console.log(`Molecule queued for tokenization: ${tx.hash}`);
    
  } catch (error) {
    console.error('Tokenization failed:', error);
  }
}