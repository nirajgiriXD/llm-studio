/**
 * External dependencies.
 */
import fs from "fs";

/**
 * Internal dependencies.
 */
import { getHistoryFolder, resolveHistoryFile } from "./paths";

/**
 * Save chat data to a JSON file.
 *
 * The timestamp is supplied by the caller so the entry written to disk shares
 * its identity with the message already rendered in the browser — that shared
 * timestamp is what deletes match on later.
 *
 * @param {string} message User message or LLM response.
 * @param {string} agent `user` or the selected model.
 * @param {string} selectedDate History date key used as the file name.
 * @param {string} timestamp ISO timestamp identifying the entry.
 */
const saveChatData = (message, agent, selectedDate, timestamp) => {
  const filePath = resolveHistoryFile(selectedDate);

  fs.mkdirSync(getHistoryFolder(), { recursive: true });

  const chatEntry = {
    agent,
    message,
    timestamp: timestamp || new Date().toISOString(),
  };

  let jsonData = { data: [] };

  if (fs.existsSync(filePath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));

      if (Array.isArray(parsed?.data)) {
        jsonData = parsed;
      }
    } catch {
      // A corrupt history file should not block the current conversation; it is
      // replaced with a fresh, valid one instead.
      console.error(`Could not parse ${filePath}; starting a new history file.`);
    }
  }

  jsonData.data.push(chatEntry);

  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
};

export default saveChatData;
