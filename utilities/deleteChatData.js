/**
 * External dependencies.
 */
import fs from "fs";

/**
 * Internal dependencies.
 */
import { resolveHistoryFile } from "./paths";

/**
 * Delete a chat entry from its JSON file.
 *
 * Messages sent in incognito mode never reach disk, so "nothing to remove" is a
 * success rather than an error — the caller still drops it from the UI.
 *
 * @param {string} date History date key.
 * @param {string} timestamp Timestamp of the chat entry.
 * @returns {{removed: boolean}} Whether a stored entry was removed.
 * @throws {Error} When the history file exists but cannot be rewritten.
 */
const deleteChatData = (date, timestamp) => {
  const filePath = resolveHistoryFile(date);

  if (!fs.existsSync(filePath)) {
    return { removed: false };
  }

  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const entries = Array.isArray(jsonData?.data) ? jsonData.data : [];
  const updatedData = entries.filter((entry) => entry.timestamp !== timestamp);

  if (updatedData.length === entries.length) {
    return { removed: false };
  }

  fs.writeFileSync(
    filePath,
    JSON.stringify({ ...jsonData, data: updatedData }, null, 2)
  );

  return { removed: true };
};

export default deleteChatData;
