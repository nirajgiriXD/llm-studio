
/**
 * Internal dependencies.
 */
import { getModels } from "@/utilities";

export const GET = async (req, res) => {
  try {
    const models = getModels() ?? [];
    const defaultModel = models.length > 0 ? models[0] : '';
  
    // Return the formatted JSON data with keys
    return new Response(JSON.stringify({ models, defaultModel }), { status: 200 });
  } catch (error) {
    // Return an error response
    return new Response('Failed to load Models', { status: 500 });
  }
};