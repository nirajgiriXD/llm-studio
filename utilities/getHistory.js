/**
 * External dependencies.
 */
import fs from "fs";
import path from "path";

/**
 * Internal dependencies.
 */
import { getHistoryFolder } from "./paths";

const DATE_FILE_PATTERN = /^\d{4}-\d{2}-\d{2}\.json$/;

/**
 * Read every stored conversation, keyed by its `YYYY-MM-DD` date.
 *
 * A missing folder or a single unreadable file degrades to an empty/skipped
 * conversation rather than failing the whole request.
 *
 * @returns {Promise<{data: Object<string, Array>, date: string[]}>} History keyed by date, newest first.
 */
const getHistory = async () => {
  const folderPath = getHistoryFolder();

  let fileNames = [];

  try {
    fileNames = await fs.promises.readdir(folderPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    return { data: {}, date: [] };
  }

  const jsonFiles = fileNames.filter((file) => DATE_FILE_PATTERN.test(file));

  const entries = await Promise.all(
    jsonFiles.map(async (fileName) => {
      const dateKey = path.basename(fileName, ".json");

      try {
        const fileContent = await fs.promises.readFile(
          path.join(folderPath, fileName),
          "utf8"
        );
        const parsed = JSON.parse(fileContent);

        return [dateKey, Array.isArray(parsed?.data) ? parsed.data : []];
      } catch (error) {
        console.error(`Skipping unreadable history file ${fileName}:`, error.message);

        return null;
      }
    })
  );

  const data = Object.fromEntries(entries.filter(Boolean));

  return {
    data,
    date: Object.keys(data).sort((a, b) => b.localeCompare(a)),
  };
};

export default getHistory;
