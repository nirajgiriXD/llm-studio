/**
 * Internal dependencies.
 */
import { getAnswer, saveChatData } from "@/utilities";

export const POST = async (req, res) => {
  const { prompt, selectedModel, isIncognito } = await req.json();

  // Save the user message
  if (!isIncognito) {
    saveChatData(prompt, 'user');
  }

  // Get the bot message
  const answer = await getAnswer(prompt, selectedModel);

  // Save the bot message
  if (!isIncognito) {
    saveChatData(answer, selectedModel.replace(".gguf", ""));
  }

  return new Response(JSON.stringify({ message: answer }), { status: 200 });
};