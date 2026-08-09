/**
 * Model settings shared by the settings dialog and the chat API route, so the
 * limits shown in the UI are the same ones enforced on the server.
 */

export const SETTINGS_FIELDS = {
  contextSize: {
    label: "Context size",
    unit: "tokens",
    min: 64,
    max: 4096,
    step: 64,
    defaultValue: 1024,
    description:
      "How many tokens the model can hold in a single session. Higher values remember more but use far more memory — lower it to 512–1024 if generation crashes.",
  },
  gpuLayers: {
    label: "GPU layers",
    unit: "layers",
    min: 0,
    max: 64,
    step: 1,
    defaultValue: 32,
    description:
      "How many model layers are offloaded to the GPU. More layers means faster generation, until the model no longer fits in VRAM. Try 10–20 if the model crashes.",
  },
  temperature: {
    label: "Temperature",
    unit: "",
    min: 0,
    max: 2,
    step: 0.1,
    defaultValue: 0.7,
    description:
      "Controls how adventurous the responses are. Lower values (0.2–0.5) stay focused and repeatable, higher values (0.8–1.2) are more creative.",
  },
};

export const DEFAULT_SETTINGS = {
  isIncognito: false,
  contextSize: SETTINGS_FIELDS.contextSize.defaultValue,
  gpuLayers: SETTINGS_FIELDS.gpuLayers.defaultValue,
  temperature: SETTINGS_FIELDS.temperature.defaultValue,
};

/**
 * Coerce a value into a valid number for the given field.
 * @param {keyof typeof SETTINGS_FIELDS} field Field name.
 * @param {unknown} value Raw value.
 * @returns {number} A number inside the field's range.
 */
export const clampSetting = (field, value) => {
  const { min, max, defaultValue } = SETTINGS_FIELDS[field];
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  return Math.min(Math.max(parsed, min), max);
};

/**
 * Whether a raw input value is a usable number inside the field's range.
 * @param {keyof typeof SETTINGS_FIELDS} field Field name.
 * @param {unknown} value Raw value.
 * @returns {boolean} True when the value can be saved as-is.
 */
export const isSettingValid = (field, value) => {
  const { min, max } = SETTINGS_FIELDS[field];
  const parsed = Number(value);

  return value !== "" && Number.isFinite(parsed) && parsed >= min && parsed <= max;
};
