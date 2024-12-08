
/**
 * Internal dependencies.
 */
import { getAnswer } from "@/utilities";

export const POST = async (req, res) => {
  const { prompt } = await req.json();

  const answer = await getAnswer(prompt);

  return new Response(answer, { status: 200 });
};