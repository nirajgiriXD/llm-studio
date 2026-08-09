/**
 * External dependencies.
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", "history/**", "models/**", "public/**"],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
