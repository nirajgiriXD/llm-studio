
/**
 * Internal dependencies.
 */
import { getAnswer, saveChatData } from "@/utilities";

export const POST = async (req, res) => {
  const { prompt, selectedModel } = await req.json();

  // Save the user message
  saveChatData(prompt, 'user');

  // Get the bot message
  const answer = await getAnswer(prompt, selectedModel);

  // Save the bot message
  saveChatData(answer, 'bot');

  return new Response(JSON.stringify({ message: answer }), { status: 200 });
};