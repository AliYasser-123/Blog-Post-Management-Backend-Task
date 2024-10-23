import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";
import eslintTSPlugin from "./customEslintRules/eslint-plugin-for-custom-js-rules.js";

export default [
  {

    files: ["**/*.js"],
    plugins: {
      jest: pluginJest,
      custom: eslintTSPlugin
    },
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
      "no-console": ["error", { allow: ["error"] }],
      "prefer-arrow-callback": "off", // Disallow arrow functions for callbacks
      "custom/disallow-then-use-async-await": "error",
      "custom/enforce-error-handling": "error",
      "custom/enforce-http-methods": "error"
    }
  },
  pluginJs.configs.recommended
];