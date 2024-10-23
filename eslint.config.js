// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const eslintTSPlugin = require("./customEslintRules/eslint-plugin-for-custom-ts-rules");
const eslintHTMLPlugin = require("./customEslintRules/eslint-plugin-for-custom-html-rules");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: { "custom": eslintTSPlugin },
    rules: {

      "custom/enforce-angular-stand-alone-components": "error",
      "custom/enforce-usage-of-env-variables": "error",
      "custom/enforce-usage-of-http-client-to-be-in-a-service": "error",
      "custom/disallow-then-use-async-await": "error",
      "custom/enforce-error-handling": "error",
      "custom/enforece-interfaces-in-interface-file": "error",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error", // No 'any' type
      "@typescript-eslint/no-unused-vars": "error", // No unused imports
      "@typescript-eslint/no-unused-expressions": "error", // Disallow unused expressions
      "@typescript-eslint/no-use-before-define": "error", // Disallow the use of variables before they are defined
      "@typescript-eslint/no-useless-constructor": "error", // Disallow unnecessary constructors
      "@typescript-eslint/no-useless-empty-export": "error", // Disallow empty exports that don't change anything in a module file
      "max-len": ["error", { code: 120 }], // Enforce max line length
      "no-console": "error", // Warn on console.log usage
      "prefer-arrow-callback": "off", // Disallow arrow functions for callbacks
      "func-style": ["error", "declaration"], // Enforce function declarations only
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    plugins: { "custom": eslintHTMLPlugin },
    rules: {
      "custom/enforce-reactive-forms": "error",
      "custom/enforce-loaders-on-submit-buttons": "error",
      "custom/enforce-disabled-form-invalid-on-submit-buttons": "error",
      "@angular-eslint/template/no-inline-styles": "error", // No inline styles
      "@angular-eslint/template/no-duplicate-attributes": "error", // Ensures that there are no duplicate input properties or output event listeners
      "@angular-eslint/template/button-has-type": "error", // Ensures that a button has a valid type specified
    },
  }
);