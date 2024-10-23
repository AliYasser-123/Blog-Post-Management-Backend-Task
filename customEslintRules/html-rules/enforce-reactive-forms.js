module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure input elements use formControlName for Reactive Forms.",
            category: "Best Practices",
            recommended: false,
        },
        schema: [],
    },
    create(context) {
        return {
            // This function will check all JSX-like elements in the HTML templates
            "Element$1[name='input']"(node) {
                // Check if the input element has the formControlName attribute
                const hasFormControlName = node.attributes.some(
                    (attr) => attr.name === 'formControlName'
                );

                if (!hasFormControlName) {
                    // Report an error if formControlName is missing
                    context.report({
                        node,
                        message: `<input> tag is missing formControlName. Use Reactive Forms.`,
                    });
                }
            },
        };
    },
};