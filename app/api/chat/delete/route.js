/**
 * Internal dependencies.
 */
import { deleteChatData } from "@/utilities";

export const POST = async (req, res) => {
  const { timestamp, selectedDate } = await req.json();

  try {
    // Delete the chat data
    const result = deleteChatData(selectedDate, timestamp);

    if (!result) {
      throw new Error("Failed to delete chat.");
    }

    return new Response("Chat deleted successfully.", { status: 200 });
  } catch (error) {
    // Return an error response
    return new Response(error.message, { status: 500 });
  }
};