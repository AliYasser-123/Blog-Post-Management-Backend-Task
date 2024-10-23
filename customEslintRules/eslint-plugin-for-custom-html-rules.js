const enforceReactiveFormsUsage = require("./html-rules/enforce-reactive-forms");
const enforceLoadersOnSubmitButtons = require("./html-rules/enforce-loaders-on-submit-buttons")
const enforceDisabledFormInvalidSubmitButtons = require("./html-rules/enforce-disabled-form-invalid-on-submit-buttons")
const plugin = {
    rules: {
        "enforce-reactive-forms": enforceReactiveFormsUsage,
        "enforce-loaders-on-submit-buttons": enforceLoadersOnSubmitButtons,
        "enforce-disabled-form-invalid-on-submit-buttons": enforceDisabledFormInvalidSubmitButtons
    }
};
module.exports = plugin;