/**
 * Internal dependencies.
 */
import { getHistory } from "@/utilities";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const { data, date } = await getHistory();

    return Response.json({ data, date });
  } catch (error) {
    console.error("Failed to load history:", error);

    return Response.json({ error: "Failed to load chat history." }, { status: 500 });
  }
};
