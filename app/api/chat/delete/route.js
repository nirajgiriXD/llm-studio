/**
 * Internal dependencies.
 */
import { deleteChatData } from "@/utilities";

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  try {
    const { timestamp, selectedDate } = await req.json();

    if (!timestamp) {
      return Response.json({ error: "A message timestamp is required." }, { status: 400 });
    }

    const { removed } = deleteChatData(selectedDate, timestamp);

    return Response.json({ removed });
  } catch (error) {
    console.error("Failed to delete chat message:", error);

    return Response.json(
      { error: error.message || "Failed to delete the message." },
      { status: 500 }
    );
  }
};
