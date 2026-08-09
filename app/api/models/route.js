/**
 * Internal dependencies.
 */
import { getModels } from "@/utilities";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const models = getModels();

    // The smallest model is the safest default: it is the most likely to fit in
    // the available memory on first run.
    const defaultModel =
      models.reduce(
        (smallest, current) =>
          smallest.sizeInBytes <= current.sizeInBytes ? smallest : current,
        models[0]
      )?.name ?? "";

    return Response.json({ models, defaultModel });
  } catch (error) {
    console.error("Failed to load models:", error);

    return Response.json({ error: "Failed to load models." }, { status: 500 });
  }
};
