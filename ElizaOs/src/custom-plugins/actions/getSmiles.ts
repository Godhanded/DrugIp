/**
 * @fileoverview This file contains the implementation of the GetGiftAction class and the getGiftAction handler.
 * It interacts with a smart contract on the Avalanche Fuji testnet to send a gift request.
 */

import { formatEther, parseEther, getContract } from "viem";
import {
  Action,
  composeContext,
  generateObjectDeprecated,
  HandlerCallback,
  ModelClass,
  type IAgentRuntime,
  type Memory,
  type State,
} from "@elizaos/core";

import { initWalletProvider, WalletProvider } from "../providers/wallet.ts";
import type { GetSmilesParams, Transaction } from "../types/index.ts";
import { getSmilesTemplate } from "../templates/index.ts";
import {
  assessDrugLikeness,
  calculateLogP,
  calculateMolecularWeight,
  tokenizeMolecule,
  callScoringModel,
  generateMetaData,
} from "./analyzeMolecule.ts";

/**
 * Class representing the GetGiftAction.
 */
export class GetSmilesAction {
  /**
   * Creates an instance of GetGiftAction.
   * @param {WalletProvider} walletProvider - The wallet provider instance.
   */
  constructor(private walletProvider: WalletProvider) {}

  /**
   * Sends a gift request to the smart contract.
   * @param {GetSmilesParams} params - The parameters for the gift request.
   * @returns {Promise<Transaction>} The transaction details.
   * @throws Will throw an error if contract address, slot ID, version, or subscription ID is not set.
   */
  async getSmile(
    params: GetSmilesParams,pretext:string | null
  ): Promise<{ text: string; content?: any | null }> {
    console.log(params.smiles);

    try {
      // Extract SMILES from message
      const smiles = params.smiles;

      // Calculate basic molecular properties
      // const molecularWeight = calculateMolecularWeight(smiles);
      // const logP = calculateLogP(smiles);
      // const drugLikeness = assessDrugLikeness(molecularWeight, logP);

      // Call AWS ML model for advanced scoring
      const mlScores = await callScoringModel(smiles);

      const analysis = {
        ...mlScores,
        timestamp: new Date().toISOString(),
      };

      // Determine if molecule passes threshold
      const metadata= generateMetaData(smiles,smiles,analysis,pretext)

      analysis["passesThreshold"] = mlScores["eligible"];
      let hash=null;
      // If promising, trigger blockchain tokenization
      if ( params.shouldMint) {
        console.log("tokenizing candidate...");
      hash=  await tokenizeMolecule(smiles, metadata);
      }
      // Respond with analysis
      const response = `Molecular Analysis Complete:
      
🧬 Compound: ${smiles}
⚖️ Molecular Weight: ${analysis["mw"]} g/mol
🌊 LogP: ${analysis["logp"]}
📊 sa Score: ${(analysis["sa_score"])}
🎯 qed Score: ${(analysis["qed"] )}
 ${hash? "📊 TxHash: " + hash: "Not Minted!"}

${
  analysis["passesThreshold"]
    ? "✅ PASSES threshold - Queuing for tokenization!"
    : "❌ Does not meet threshold for tokenization"
}

ML Predictions:
• Toxicity Prediction: ${((JSON.stringify(analysis["tox_pred"])) )}%
• Toxicity Risk: ${((analysis["tox_score"]) )}
• Qed: ${analysis["qed"]}`;

      return {
        text: response,
        content: { analysis },
      };
    } catch (error: any) {
      console.error("Analysis failed:", error);
      return {
        text: `Analysis failed: ${error.message}`,
      };
    }
  }
}

/**
 * Builds the function call details required for the getGift action.
 * @param {State} state - The current state.
 * @param {IAgentRuntime} runtime - The agent runtime.
 * @param {WalletProvider} wp - The wallet provider.
 * @returns {Promise<GetSmilesParams>} The parameters for the gift request.
 */
const buildFunctionCallDetails = async (
  state: State,
  runtime: IAgentRuntime,
  wp: WalletProvider
): Promise<GetSmilesParams> => {
  // const chains = Object.keys(wp.chains);
  // state.supportedChains = chains.map((item) => `"${item}"`).join("|");

  const context = composeContext({
    state,
    template: getSmilesTemplate,
  });

  const functionCallDetails = (await generateObjectDeprecated({
    runtime,
    context,
    modelClass: ModelClass.SMALL,
  })) as GetSmilesParams;
  console.log("funccalldets", functionCallDetails);

  return functionCallDetails;
};

/**
 * The getGiftAction handler.
 * @type {Action}
 */
export const getSmilesAction: Action = {
  name: "ANALYZE_MOLECULE",

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options?: any,
    callback?: HandlerCallback
  ) => {
    if (!state) {
      state = (await runtime.composeState(message)) as State;
    } else {
      state = await runtime.updateRecentMessageState(state);
    }

    const walletProvider = await initWalletProvider(runtime);
    const action = new GetSmilesAction(walletProvider);

    // Compose functionCall context
    const smilesParams: GetSmilesParams = await buildFunctionCallDetails(
      state,
      runtime,
      walletProvider
    );
    try {
      const callFunctionResp = await action.getSmile(smilesParams,smilesParams.description);
      if (callback) {
        callback({
          text: callFunctionResp.text,
          content: callFunctionResp.content,
        });
      }
      return true;
    } catch (error) {
      console.error("Error during get smiles call:", error);
      if (error instanceof Error) {
        if (callback) {
          callback({
            text: `Error get smiles calling: ${error.message}`,
            content: { error: error.message },
          });
        }
      } else {
        console.error("unknow error");
      }
      return false;
    }
  },
  validate: async (runtime: IAgentRuntime) => {
    // const privateKey = runtime.getSetting("EVM_PRIVATE_KEY");
    // return typeof privateKey === "string" && privateKey.startsWith("0x");
    return true;
  },
  examples: [
    [
      {
        user: "DrugDiscoveryAgent",
        content: {
          text: "I'll help you analyze a drug molecule and call the mint function on contract if its novel",
          action: "ANALYZE_MOLECULE",
        },
      },
      {
        user: "user",
        content: {
          text: "Analyze this molecule: ",
          action: "ANALYZE_MOLECULE",
        },
      },
      {
        user: "user",
        content: {
          text: "Please assess this drug candidate and let me know if its novel or promising CCN1C(=O)C2CC(C1=O)N2S(=O)(=O)c1ccccc1",
          action: "ANALYZE_MOLECULE",
        },
      },
      
    ],
  ],
  similes: [
    "analyze",
    "evaluate",
    "score",
    "assess",
    "mint",
    "mint_drug",
    "analyze_candidate",
    "Evaluate this molecule: CCO",
    "Can you analyze SMILES: CC(=O)OC1=CC=CC=C1C(=O)O",
    "Check this compound: CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    "Assess drug potential of CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
    "mint or tokenize this molecule or candidate CC(C)CC1=CC=C(C=C1)C(C)C(=O)O",
  ],
  description:
    "Analyze a molecular compound for drug discovery potential or novelty then mint a new ip nft token on the smart contract for the molecule ",
};
