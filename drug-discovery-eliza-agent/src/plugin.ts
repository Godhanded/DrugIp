import type { Plugin } from '@elizaos/core';
import {
  type Action,
  type Content,
  type GenerateTextParams,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelType,
  type Provider,
  type ProviderResult,
  Service,
  type State,
  logger,
} from '@elizaos/core';
import { z } from 'zod';
import { assessDrugLikeness, calculateLogP, calculateMolecularWeight, callAWSModel, tokenizeMolecule } from './analyzeMolecule';

/**
 * Define the configuration schema for the plugin with the following properties:
 *
 * @param {string} EXAMPLE_PLUGIN_VARIABLE - The name of the plugin (min length of 1, optional)
 * @returns {object} - The configured schema object
 */
const configSchema = z.object({
  EXAMPLE_PLUGIN_VARIABLE: z
    .string()
    .min(1, 'Example plugin variable is not provided')
    .optional()
    .transform((val) => {
      if (!val) {
        console.warn('Warning: Example plugin variable is not provided');
      }
      return val;
    }),
});

/**
 * Example HelloWorld action
 * This demonstrates the simplest possible action structure
 */
/**
 * Represents an action that responds with a simple hello world message.
 *
 * @typedef {Object} Action
 * @property {string} name - The name of the action
 * @property {string[]} similes - The related similes of the action
 * @property {string} description - Description of the action
 * @property {Function} validate - Validation function for the action
 * @property {Function} handler - The function that handles the action
 * @property {Object[]} examples - Array of examples for the action
 */
const analyzeMoleculeAction: Action = {
  name: "ANALYZE_MOLECULE",
  similes: ["analyze", "evaluate", "score", "assess"],
  description: "Analyze a molecular compound for drug discovery potential",

  validate: async (_runtime: IAgentRuntime, _message: Memory, _state: State): Promise<boolean> => {
    const smilesPattern = /[A-Za-z0-9@+\-\[\]()=#]/;
    return smilesPattern.test(_message.content.text);
  },

  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State,
    _options: any,
    callback: HandlerCallback,
    _responses: Memory[]
  ) => {
    try {
      // Extract SMILES from message
      const smiles = message.content.text.trim();
      
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
          novelty: 0.7
        },
        timestamp: new Date().toISOString()
      };
      
      // Determine if molecule passes threshold
      const overallScore = (
        drugLikeness.score * 0.3 +
        (mlScores?.bioactivity || 0.5) * 0.4 +
        (1 - (mlScores?.toxicity || 0.3)) * 0.3
      );
      
      analysis["overallScore"] = overallScore;
      analysis["passesThreshold"] = overallScore > 0.7;
      
      // If promising, trigger blockchain tokenization
      if (analysis["passesThreshold"]) {
        await tokenizeMolecule(smiles, analysis);
      }
      
      // Respond with analysis
      const response = `Molecular Analysis Complete:
      
🧬 Compound: ${smiles}
⚖️ Molecular Weight: ${molecularWeight.toFixed(2)} g/mol
🌊 LogP: ${logP.toFixed(2)}
📊 Drug-likeness Score: ${(drugLikeness.score * 100).toFixed(1)}%
🎯 Overall Score: ${(overallScore * 100).toFixed(1)}%

${analysis["passesThreshold"] ? '✅ PASSES threshold - Queuing for tokenization!' : '❌ Does not meet threshold for tokenization'}

ML Predictions:
• Bioactivity: ${((mlScores?.bioactivity || 0.5) * 100).toFixed(1)}%
• Toxicity Risk: ${((mlScores?.toxicity || 0.3) * 100).toFixed(1)}%
• Novelty: ${((mlScores?.novelty || 0.7) * 100).toFixed(1)}%`;

      callback({
        text: response,
        content: { analysis }
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      callback({
        text: `Analysis failed: ${error.message}`
      });
    }
  },
};

/**
 * Example Hello World Provider
 * This demonstrates the simplest possible provider implementation
 */
const helloWorldProvider: Provider = {
  name: 'HELLO_WORLD_PROVIDER',
  description: 'A simple example provider',

  get: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State
  ): Promise<ProviderResult> => {
    return {
      text: 'I am a provider',
      values: {},
      data: {},
    };
  },
};

export class StarterService extends Service {
  static serviceType = 'starter';
  capabilityDescription =
    'This is a starter service which is attached to the agent through the starter plugin.';

  constructor(runtime: IAgentRuntime) {
    super(runtime);
  }

  static async start(runtime: IAgentRuntime) {
    logger.info('*** Starting starter service ***');
    const service = new StarterService(runtime);
    return service;
  }

  static async stop(runtime: IAgentRuntime) {
    logger.info('*** Stopping starter service ***');
    // get the service from the runtime
    const service = runtime.getService(StarterService.serviceType);
    if (!service) {
      throw new Error('Starter service not found');
    }
    service.stop();
  }

  async stop() {
    logger.info('*** Stopping starter service instance ***');
  }
}

const plugin: Plugin = {
  name: 'starter',
  description: 'A starter plugin for Eliza',
  // Set lowest priority so real models take precedence
  priority: -1000,
  config: {
    EXAMPLE_PLUGIN_VARIABLE: process.env.EXAMPLE_PLUGIN_VARIABLE,
  },
  async init(config: Record<string, string>) {
    logger.info('*** Initializing starter plugin ***');
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Invalid plugin configuration: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw error;
    }
  },
  models: {
    [ModelType.TEXT_SMALL]: async (
      _runtime,
      { prompt, stopSequences = [] }: GenerateTextParams
    ) => {
      return 'Never gonna give you up, never gonna let you down, never gonna run around and desert you...';
    },
    [ModelType.TEXT_LARGE]: async (
      _runtime,
      {
        prompt,
        stopSequences = [],
        maxTokens = 8192,
        temperature = 0.7,
        frequencyPenalty = 0.7,
        presencePenalty = 0.7,
      }: GenerateTextParams
    ) => {
      return 'Never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you...';
    },
  },
  routes: [
    {
      name: 'helloworld',
      path: '/helloworld',
      type: 'GET',
      handler: async (_req: any, res: any) => {
        // send a response
        res.json({
          message: 'Hello World!',
        });
      },
    },
  ],
  events: {
    MESSAGE_RECEIVED: [
      async (params) => {
        logger.info('MESSAGE_RECEIVED event received');
        // print the keys
        logger.info(Object.keys(params));
      },
    ],
    VOICE_MESSAGE_RECEIVED: [
      async (params) => {
        logger.info('VOICE_MESSAGE_RECEIVED event received');
        // print the keys
        logger.info(Object.keys(params));
      },
    ],
    WORLD_CONNECTED: [
      async (params) => {
        logger.info('WORLD_CONNECTED event received');
        // print the keys
        logger.info(Object.keys(params));
      },
    ],
    WORLD_JOINED: [
      async (params) => {
        logger.info('WORLD_JOINED event received');
        // print the keys
        logger.info(Object.keys(params));
      },
    ],
  },
  services: [StarterService],
  actions: [analyzeMoleculeAction],
  providers: [helloWorldProvider],
};

export default plugin;
