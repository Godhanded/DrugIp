import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

 async function run(){
 // Queue for blockchain minting
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.AVALANCHE_RPC_URL
    );
    // console.log(process.env.PRIVATE_KEY)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const upkeepABI = [
      "function queueMolecule(string memory smiles, string memory metadataURI) public",
    ];

    const upkeep = new ethers.Contract(
      process.env.DRUGIP_UPKEEP_ADDRESS,
      upkeepABI,
      wallet
    );

    const tx = await upkeep.queueMolecule("COc1cccc(CCNC(=O)CNC(=O)c2ccc3cc(Oc4ccc(C)cc4)ccc3n2)c1", "https://chromiumpublic.s3.us-east-1.amazonaws.com/drugip/1749843140872-COc1ccccCCNCOCNCOc2ccc3ccOc4cccCcc4ccc3n2c1.json");
    console.log(`Molecule queued for tokenization: ${tx.hash}`);}

    run().then(() => process.exit(0)).catch((error) => {console.log(error); process.exit(1);});