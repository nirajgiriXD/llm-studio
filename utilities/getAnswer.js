/**
 * External dependencies.
 */
import { getLlama, LlamaChatSession } from "node-llama-cpp";
import { fileURLToPath } from "url";
import path from "path";

/**
 * Get the answer from the model.
 *
 * @returns string
 */
const getAnswer = async (prompt) => {
    const LLAMA_MODEL_NAME = process.env.LLAMA_MODEL_NAME;
    let answer = "";

    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const llama = await getLlama();
        const modelPath = path.join(__dirname, "../models", LLAMA_MODEL_NAME);
        const model = await llama.loadModel({ modelPath });

        const context = await model.createContext();
        const session = new LlamaChatSession({
            contextSequence: context.getSequence()
        });

        answer = await session.prompt(prompt);
    } catch (error) {
        console.error("Error running the model:", error);
    }

    return answer;
};

export default getAnswer;