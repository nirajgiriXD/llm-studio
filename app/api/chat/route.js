/**
 * Internal dependencies.
 */
import { getAnswer, saveChatData } from "@/utilities";

export const POST = async (req, res) => {
  const {
    prompt,
    selectedModel,
    isIncognito,
    contextSize,
    gpuLayers,
    temperature,
    selectedDate,
  } = await req.json();

  // Save the user message
  if (!isIncognito) {
    saveChatData(prompt, "user", selectedDate);
  }

  // Get the bot message
  const answer = await getAnswer({
    prompt,
    selectedModel,
    contextSize: Number(contextSize),
    gpuLayers: Number(gpuLayers),
    temperature: Number(temperature),
  });

  // Save the bot message
  if (!isIncognito) {
    saveChatData(answer, selectedModel.replace(".gguf", ""), selectedDate);
  }

  return new Response(JSON.stringify({ message: answer }), { status: 200 });
};
