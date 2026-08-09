/**
 * Formatting helpers shared across the UI.
 *
 * Chat history is keyed by a local `YYYY-MM-DD` string, so every helper here
 * works in the viewer's timezone. Anything derived from "now" is only rendered
 * once the client has hydrated, which keeps the server and client markup in
 * agreement.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Today's history key in `YYYY-MM-DD` format.
 * @returns {string} Formatted date key.
 */
export const getTodayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Turn a `YYYY-MM-DD` key into a local Date at midnight.
 * @param {string} key History date key.
 * @returns {Date} Local date.
 */
export const parseDateKey = (key) => {
  const [year, month, day] = String(key).split("-").map(Number);

  return new Date(year, (month || 1) - 1, day || 1);
};

/**
 * Whole days between a history key and today.
 * @param {string} key History date key.
 * @returns {number} Day offset (0 = today).
 */
const daysAgo = (key) => {
  const startOfToday = parseDateKey(getTodayKey());

  return Math.round((startOfToday - parseDateKey(key)) / MS_PER_DAY);
};

/**
 * Short, human label for a history key, e.g. `Today` or `12 Mar`.
 * @param {string} key History date key.
 * @returns {string} Display label.
 */
export const formatDateLabel = (key) => {
  const offset = daysAgo(key);

  if (offset === 0) {
    return "Today";
  }

  if (offset === 1) {
    return "Yesterday";
  }

  const date = parseDateKey(key);
  const sameYear = date.getFullYear() === new Date().getFullYear();

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
};

/**
 * Full, unambiguous date for tooltips and screen readers.
 * @param {string} key History date key.
 * @returns {string} Display label.
 */
export const formatFullDate = (key) =>
  parseDateKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const DATE_GROUPS = [
  // Today and yesterday share a group so their rows, which are already labelled
  // "Today" and "Yesterday", do not sit under a heading repeating the same word.
  { label: "Recent", matches: (offset) => offset <= 1 },
  { label: "Previous 7 days", matches: (offset) => offset <= 7 },
  { label: "Previous 30 days", matches: (offset) => offset <= 30 },
  { label: "Older", matches: () => true },
];

/**
 * Bucket history keys into recency groups for the sidebar.
 * @param {string[]} dates History date keys, newest first.
 * @returns {{label: string, dates: string[]}[]} Non-empty groups in order.
 */
export const groupHistoryDates = (dates) => {
  const buckets = new Map(DATE_GROUPS.map(({ label }) => [label, []]));

  dates.forEach((date) => {
    const offset = daysAgo(date);
    const group = DATE_GROUPS.find(({ matches }) => matches(offset));

    buckets.get(group.label).push(date);
  });

  return DATE_GROUPS.map(({ label }) => ({
    label,
    dates: buckets.get(label),
  })).filter(({ dates: grouped }) => grouped.length > 0);
};

/**
 * Clock time for a message timestamp.
 * @param {string} timestamp ISO timestamp.
 * @returns {string} e.g. `14:32`.
 */
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Full date and time for a message timestamp.
 * @param {string} timestamp ISO timestamp.
 * @returns {string} Display label.
 */
export const formatMessageDateTime = (timestamp) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

/**
 * Human readable file size.
 * @param {number} bytes Size in bytes.
 * @returns {string} e.g. `4.1 GB`.
 */
export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

/**
 * Drop the `.gguf` extension from a model filename.
 * @param {string} model Model filename.
 * @returns {string} Display name.
 */
export const formatModelName = (model = "") => model.replace(/\.gguf$/i, "");

/**
 * Collapse a message down to a single line for search results and previews.
 * @param {string} message Raw message text.
 * @param {number} maxLength Maximum length before truncating.
 * @returns {string} Single line preview.
 */
export const toPreview = (message = "", maxLength = 160) => {
  const flattened = message.replace(/\s+/g, " ").trim();

  return flattened.length > maxLength
    ? `${flattened.slice(0, maxLength).trimEnd()}…`
    : flattened;
};
