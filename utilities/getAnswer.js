/**
 * External dependencies.
 */
import { getLlama, LlamaChatSession } from "node-llama-cpp";
import { fileURLToPath } from "url";
import path from "path";

/**
 * Get the answer from the model.
 *
 * @param {string} prompt The prompt to be answered.
 * @param {string} selectedModel The selected model.
 * @returns {string} The answer from the model.
 */
const getAnswer = async (prompt, selectedModel) => {
  let answer = "";

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const llama = await getLlama();
    const modelPath = path.join(__dirname, "../models", selectedModel);
    const model = await llama.loadModel({ modelPath });

    const context = await model.createContext();
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    });

    answer = await session.prompt(prompt);
  } catch (error) {
    console.error("Error running the model:", error);
  }

  return answer;
};

export default getAnswer;
