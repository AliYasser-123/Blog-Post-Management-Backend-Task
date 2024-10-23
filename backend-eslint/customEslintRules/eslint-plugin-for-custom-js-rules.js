const disallowThen = require("./js-rules/disallow-then-use-async-await");
const enforceErrorHandling = require("./js-rules/enforce-error-handling");
const enforceHTTPMethods = require("./js-rules/enforce-http-methods")
module.exports = {
  rules: {
    "disallow-then-use-async-await": disallowThen,
    "enforce-error-handling": enforceErrorHandling,
    "enforce-http-methods": enforceHTTPMethods
  }
};