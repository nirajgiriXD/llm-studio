/**
 * Internal dependencies.
 */
import { getModels } from "@/utilities";

export const GET = async (req, res) => {
    try {
        const models = getModels() ?? [];

        // Extract the model names and determine the smallest model by size
        const modelNames = models.map((model) => `${model.name}.gguf`);
        const defaultModelName = models.reduce((smallest, current) =>
            smallest.sizeInBytes < current.sizeInBytes ? smallest : current, models[0]
        )?.name + '.gguf' || '';

        // Return the formatted JSON data with keys
        return new Response(
            JSON.stringify({ models: modelNames, defaultModel: defaultModelName }),
            { status: 200 }
        );
    } catch (error) {
        // Return an error response
        return new Response("Failed to load Models", { status: 500 });
    }
};
