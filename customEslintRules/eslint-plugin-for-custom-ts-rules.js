const angularStandAloneRule = require("./ts-rules/enforce-angular-stand-alone-components")
const envVariablesUsage = require("./ts-rules/enforce-usage-of-env-variables")
const enforceBackendCallingServices = require("./ts-rules/enforce-usage-of-http-client-to-be-in-a-service")
const disallowThen = require("./ts-rules/disallow-then-use-async-await")
const enforceErrorHandling = require("./ts-rules/enforce-error-handling")
const enforeceInterfacesInInterfaceFile = require("./ts-rules/enforece-interfaces-in-interface-file")
const plugin = {
    rules: {
        "enforce-angular-stand-alone-components": angularStandAloneRule,
        "enforce-usage-of-env-variables": envVariablesUsage,
        "enforce-usage-of-http-client-to-be-in-a-service": enforceBackendCallingServices,
        "disallow-then-use-async-await": disallowThen,
        "enforce-error-handling": enforceErrorHandling,
        "enforece-interfaces-in-interface-file": enforeceInterfacesInInterfaceFile
    }
};
module.exports = plugin;