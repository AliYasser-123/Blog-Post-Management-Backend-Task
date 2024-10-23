module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "Ensure buttons with type submit have [disabled]=\"isLoading\"",
            category: "Best Practices",
            recommended: false,
        },
        schema: [],
    },
    create(context) {
        return {
            // This function checks all button elements in Angular templates
            "Element$1[name='button']"(node) {
                // Check if the button has type="submit"
                const hasSubmitType = node.attributes.some(
                    (attr) => attr.name === 'type' && attr.value === 'submit'
                );

                // Check if the button has [disabled]="isLoading"
                const hasDisabledIsLoading = node.attributes.some(
                    (attr) => attr.name === 'disabled' && attr.value === 'isLoading'
                );

                // If the button is a submit button and doesn't have [disabled]="isLoading", report an error
                if (hasSubmitType && !hasDisabledIsLoading) {
                    context.report({
                        node,
                        message: `<button type="submit"> is missing [disabled]="isLoading". Ensure the button is disabled during loading.`,
                    });
                }
            },
        };
    },
};