/**
 * External dependencies.
 */
import { join, extname, basename } from "path";
import { readdirSync, statSync } from "fs";

/**
 * Internal dependencies.
 */
import { getModelsFolder } from "./paths";

/**
 * Get the `.gguf` models available in the models folder.
 * @returns {{name: string, sizeInBytes: number}[]} Models sorted by name.
 */
const getModels = () => {
  const modelsFolderPath = getModelsFolder();

  try {
    const files = readdirSync(modelsFolderPath);

    return files
      .filter((file) => extname(file).toLowerCase() === ".gguf")
      .map((file) => ({
        name: basename(file),
        sizeInBytes: statSync(join(modelsFolderPath, file)).size,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    // A missing models folder is a normal first-run state, not a failure.
    if (error.code !== "ENOENT") {
      console.error("Error reading the models folder:", error.message);
    }

    return [];
  }
};

export default getModels;
