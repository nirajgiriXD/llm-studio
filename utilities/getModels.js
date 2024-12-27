/**
 * External dependencies
 */
import { join, extname, basename } from "path";
import { readdirSync, statSync } from "fs";

/**
 * Get the list of .gguf files in the models folder.
 * @returns {string[]} Array of .gguf filenames.
 */
const getModels = () => {
  // Path to the models folder
  const modelsFolderPath = join(process.cwd(), "models");

  try {
    // Read the directory
    const files = readdirSync(modelsFolderPath);

    // Filter and map files with the .gguf extension to the desired structure
    const ggufFiles = files
      .filter((file) => extname(file) === ".gguf")
      .map((file) => {
        const filePath = join(modelsFolderPath, file);
        const stats = statSync(filePath);

        return {
          name: basename(file, ".gguf"),
          sizeInBytes: stats.size,
        };
      });

    return ggufFiles;
  } catch (error) {
    console.error("Error reading the models folder:", error.message);
    return [];
  }
};

export default getModels;
