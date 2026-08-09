/**
 * Internal dependencies.
 */
import { getAnswer, saveChatData } from "@/utilities";
import { resolveExistingModelFile } from "@/utilities/paths";
import { clampSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  let selectedDate;

  try {
    const {
      prompt,
      selectedModel,
      isIncognito,
      contextSize,
      gpuLayers,
      temperature,
      selectedDate: date,
      timestamp,
    } = await req.json();

    selectedDate = date;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return Response.json({ error: "A message is required." }, { status: 400 });
    }

    if (!selectedModel) {
      return Response.json(
        { error: "No model selected. Add a .gguf model to the models folder." },
        { status: 400 }
      );
    }

    // Reject an unusable model before anything is written, so a failed request
    // never leaves a user message stranded without a reply.
    try {
      resolveExistingModelFile(selectedModel);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // Save the user message.
    if (!isIncognito) {
      saveChatData(prompt, "user", selectedDate, timestamp);
    }

    // Get the bot message.
    const answer = await getAnswer({
      prompt,
      selectedModel,
      contextSize: clampSetting("contextSize", contextSize),
      gpuLayers: clampSetting("gpuLayers", gpuLayers),
      temperature: clampSetting("temperature", temperature),
    });

    const answeredAt = new Date().toISOString();

    // Save the bot message.
    if (!isIncognito) {
      saveChatData(answer, selectedModel, selectedDate, answeredAt);
    }

    return Response.json({ message: answer, timestamp: answeredAt });
  } catch (error) {
    console.error("Failed to generate a response:", error);

    return Response.json(
      { error: error.message || "Failed to generate a response." },
      { status: 500 }
    );
  }
};
