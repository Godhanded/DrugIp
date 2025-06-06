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
  callAWSModel,
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
    params: GetSmilesParams
  ): Promise<{ text: string; content?: any | null }> {
    console.log(params.smiles);

    try {
      // Extract SMILES from message
      const smiles = params.smiles;

      // Calculate basic molecular properties
      const molecularWeight = calculateMolecularWeight(smiles);
      const logP = calculateLogP(smiles);
      const drugLikeness = assessDrugLikeness(molecularWeight, logP);

      // Call AWS ML model for advanced scoring
      const mlScores = await callAWSModel(smiles);

      const analysis = {
        smiles,
        molecularWeight,
        logP,
        drugLikeness,
        mlScores: mlScores || {
          bioactivity: 0.5,
          toxicity: 0.3,
          novelty: 0.7,
        },
        timestamp: new Date().toISOString(),
      };

      // Determine if molecule passes threshold
      const overallScore =
        drugLikeness.score * 0.3 +
        (mlScores?.bioactivity || 0.5) * 0.4 +
        (1 - (mlScores?.toxicity || 0.3)) * 0.3;

      analysis["overallScore"] = overallScore;
      analysis["passesThreshold"] = overallScore > 0.7;

      // If promising, trigger blockchain tokenization
      if (analysis["passesThreshold"] && params.shouldMint) {
        console.log("tokenizing candidate...");
        await tokenizeMolecule(smiles, analysis);
      }
      console.log(analysis);
      // Respond with analysis
      const response = `Molecular Analysis Complete:
      
🧬 Compound: ${smiles}
⚖️ Molecular Weight: ${molecularWeight.toFixed(2)} g/mol
🌊 LogP: ${logP.toFixed(2)}
📊 Drug-likeness Score: ${(drugLikeness.score * 100).toFixed(1)}%
🎯 Overall Score: ${(overallScore * 100).toFixed(1)}%

${
  analysis["passesThreshold"]
    ? "✅ PASSES threshold - Queuing for tokenization!"
    : "❌ Does not meet threshold for tokenization"
}

ML Predictions:
• Bioactivity: ${((mlScores?.bioactivity || 0.5) * 100).toFixed(1)}%
• Toxicity Risk: ${((mlScores?.toxicity || 0.3) * 100).toFixed(1)}%
• Novelty: ${((mlScores?.novelty || 0.7) * 100).toFixed(1)}%`;

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
    const giftParams: GetSmilesParams = await buildFunctionCallDetails(
      state,
      runtime,
      walletProvider
    );

    try {
      const callFunctionResp = await action.getSmile(giftParams);
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
        user: "assistant",
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
      {
        user: "user",
        content: {
          text: "What do you think of this compound: CCO for treating headaches?",
          action: "ANALYZE_MOLECULE",
        },
      },
      {
        user: "DrugDiscoveryAgent",
        content: {
          text: "🧬 DRUG DISCOVERY EVALUATION REPORT\n\nMOLECULE: CCO\n\n📊 EVALUATION SCORES:\n• Activity Score: 0.245\n• Novelty Score: 0.123\n• Toxicity Score: 0.789\n• Drug-likeness: 0.167\n• Synthesizability: 0.934\n\n🎯 DECISION: REJECT\n📈 CONFIDENCE: 23%\n\n💡 REASONING: Molecule fails to meet multiple criteria: low activity (0.25), low novelty (0.12), high toxicity risk (0.79). Not suitable for current development pipeline thus i will not mint a token for it.",
        },
      },
    ]
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
