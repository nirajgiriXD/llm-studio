/**
 * External dependencies.
 */
import fs from "fs";
import path from "path";

/**
 * Folder holding the `.gguf` models.
 * @returns {string} Absolute path.
 */
export const getModelsFolder = () => path.join(process.cwd(), "models");

/**
 * Folder holding the per-day chat history JSON files.
 * @returns {string} Absolute path.
 */
export const getHistoryFolder = () => path.join(process.cwd(), "history");

/**
 * Both the model name and the history date arrive from the browser and are used
 * to build file paths, so they are validated rather than trusted.
 */
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Resolve a history date key to its JSON file, rejecting anything that is not a
 * plain `YYYY-MM-DD` key.
 * @param {string} dateKey History date key.
 * @returns {string} Absolute path to the history file.
 * @throws {Error} When the key is malformed.
 */
export const resolveHistoryFile = (dateKey) => {
  if (!DATE_KEY_PATTERN.test(String(dateKey ?? ""))) {
    throw new Error("Invalid history date.");
  }

  return path.join(getHistoryFolder(), `${dateKey}.json`);
};

/**
 * Resolve a model filename to its path inside the models folder, rejecting any
 * attempt to escape it.
 * @param {string} model Model filename.
 * @returns {string} Absolute path to the model file.
 * @throws {Error} When the filename is malformed.
 */
export const resolveModelFile = (model) => {
  const fileName = path.basename(String(model ?? ""));

  if (!fileName || !fileName.toLowerCase().endsWith(".gguf")) {
    throw new Error("Invalid model selection.");
  }

  return path.join(getModelsFolder(), fileName);
};

/**
 * Resolve a model filename and confirm the file is actually there.
 *
 * Callers check this before writing anything, so a request naming a model that
 * cannot be loaded never leaves a half-finished exchange in the history.
 *
 * @param {string} model Model filename.
 * @returns {string} Absolute path to the model file.
 * @throws {Error} When the filename is malformed or the model is missing.
 */
export const resolveExistingModelFile = (model) => {
  const filePath = resolveModelFile(model);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `"${path.basename(filePath)}" is no longer in the models folder.`
    );
  }

  return filePath;
};
