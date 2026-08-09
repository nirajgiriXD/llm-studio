/**
 * External dependencies.
 */
import { getLlama, LlamaChatSession } from "node-llama-cpp";

/**
 * Internal dependencies.
 */
import { resolveExistingModelFile } from "./paths";

/**
 * Get the answer from the model.
 *
 * The model is resolved relative to `process.cwd()` rather than the module URL
 * so it keeps working once the route handler is bundled, and the context and
 * model are always released again — otherwise every prompt would leak the whole
 * model's memory.
 *
 * @param {Object} options Prompt options.
 * @param {string} options.prompt The prompt to be answered.
 * @param {string} options.selectedModel The selected model filename.
 * @param {number} options.contextSize Context window size in tokens.
 * @param {number} options.gpuLayers Layers to offload to the GPU.
 * @param {number} options.temperature Sampling temperature.
 * @returns {Promise<string>} The answer from the model.
 * @throws {Error} When the model cannot be loaded or the prompt fails.
 */
const getAnswer = async ({
  prompt,
  selectedModel,
  contextSize,
  gpuLayers,
  temperature,
}) => {
  const modelPath = resolveExistingModelFile(selectedModel);

  let model;
  let context;

  try {
    const llama = await getLlama();

    model = await llama.loadModel({ modelPath, gpuLayers });
    context = await model.createContext({ contextSize });

    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    });

    return await session.prompt(prompt, { temperature });
  } catch (error) {
    console.error("Error running the model:", error);

    throw new Error(
      `The model could not generate a response. ${error.message || ""}`.trim()
    );
  } finally {
    await context?.dispose().catch(() => {});
    await model?.dispose().catch(() => {});
  }
};

export default getAnswer;
